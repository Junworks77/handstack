using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

using json2sql.Entity;

using Newtonsoft.Json.Linq;

using HandStack.Core.Extensions;

namespace json2sql.Services
{
    public class JsonToSQL
    {
        public JsonToSQL()
        {
            string id = "";
            Crc32 crc32 = new Crc32();
            byte[] computeHash = crc32.ComputeHash(Encoding.Default.GetBytes(Guid.NewGuid().ToString()));
            foreach (byte b in computeHash)
            {
                id += b.ToString("x2").ToLower();
            }

            DataSetName = id.ToUpper();
        }

        public string DataSetName { get; set; }

        private static int index = 0;
        private static DataSet ds = new DataSet();
        private static List<TableRelation> relations = new List<TableRelation>();

        public string GenerateTableSQL(string json)
        {
            return ToSQL(json, true);
        }

        public string GenerateInsertSQL(string json)
        {
            return ToSQL(json, false);
        }

        private string ToSQL(string json, bool tableSQLYN = false)
        {
            index = 0;
            ds = new DataSet();
            relations = new List<TableRelation>();

            if (string.IsNullOrWhiteSpace(this.DataSetName))
            {
                this.DataSetName = "JsonToSQL";
            }

            ds.DataSetName = this.DataSetName;

            var jToken = JToken.Parse(json);

            if (jToken.Type == JTokenType.Object)
            {
                ParseJObject(jToken.ToObject<JObject>(), this.DataSetName, "", 1, 1);
            }
            else
            {
                var counter = 1;

                foreach (var jObject in jToken.Children<JObject>())
                {
                    ParseJObject(jObject, this.DataSetName, "", counter, counter);
                    counter++;
                }
            }

            foreach (TableRelation rel in relations.OrderByDescending(i => i.Order))
            {
                if (string.IsNullOrEmpty(rel.Source)) continue;

                DataTable? source = ds.Tables[rel.Source];
                DataTable? target = ds.Tables[rel.Target];

                if (source == null)
                {
                    if (target != null)
                    {
                        target.Columns.Remove(rel.Source + "_ID");
                    }
                    continue;
                }

                if (target != null)
                {
                    source.PrimaryKey = new DataColumn[] { source.Columns[0] };

                    ForeignKeyConstraint fk = new ForeignKeyConstraint("ForeignKey", source.Columns[0], target.Columns[1]);
                    target.Constraints.Add(fk);
                }
            }

            string data = "";

            if (tableSQLYN == true)
            {
                data = SqlServerScript.GenerateDbSchema(ds, relations);
            }
            else
            {
                data = SqlServerScript.GenerateInsertSQL(ds, relations);
            }

            return data;
        }

        private void ParseJObject(JObject? jObject, string tableName, string parentTableName, int pkValue, int fkValue)
        {
            if (jObject != null && jObject.Count > 0)
            {
                DataTable dt = new DataTable(tableName);

                Dictionary<string, string> dic = new Dictionary<string, string>();
                List<SqlColumn> listColumns = new List<SqlColumn>();
                listColumns.Add(new SqlColumn { Name = tableName + "_ID", Value = pkValue.ToString(), Type = "System.Int32" });
                dic[tableName + "_ID"] = pkValue.ToString();

                if (!string.IsNullOrEmpty(parentTableName))
                {
                    listColumns.Add(new SqlColumn { Name = parentTableName + "_ID", Value = fkValue.ToString(), Type = "System.Int32" });
                    dic[parentTableName + "_ID"] = fkValue.ToString();
                }

                foreach (JProperty property in jObject.Properties())
                {
                    string key = property.Name;
                    JToken jToken = property.Value;

                    if (jToken.Type == JTokenType.Object)
                    {
                        var jO = jToken.ToObject<JObject>();
                        ParseJObject(jO, tableName + "_" + key, tableName, pkValue, pkValue);
                    }
                    else if (jToken.Type == JTokenType.Array)
                    {
                        JArray? arrs = jToken.ToObject<JArray>();
                        if (arrs != null)
                        {
                            var objects = arrs.Children<JObject>();
                            if (objects.Count() > 0)
                            {
                                foreach (var arr in objects)
                                {
                                    index = index + 1;
                                    var jo = arr.ToObject<JObject>();
                                    ParseJObject(jo, tableName + "_" + key, tableName, index, pkValue);
                                }
                            }
                            else
                            {
                                string[]? strings = arrs.ToObject<string[]>();
                                if (strings != null)
                                {
                                    listColumns.Add(new SqlColumn { Name = key, Value = string.Join(",", strings), Type = "System." + jToken.Type.ToString() });
                                    dic[key] = string.Join(",", strings);
                                }
                            }
                        }
                    }
                    else
                    {
                        listColumns.Add(new SqlColumn { Name = key, Value = jToken.ToString(), Type = "System." + jToken.Type.ToString() });
                        dic[key] = jToken.ToString();
                    }
                }

                pkValue = pkValue + 1;

                if (ds.Tables.Contains(dt.TableName))
                {
                    DataTable? dataTable = ds.Tables[dt.TableName];
                    if (dataTable != null)
                    {
                        foreach (string key in dic.Keys)
                        {
                            if (dataTable.Columns.Contains(key) == false)
                            {
                                dataTable.Columns.Add(AddColumn(key, "System.String", false));
                            }
                        }

                        DataRow dr = dataTable.NewRow();
                        foreach (string key in dic.Keys)
                        {
                            dr[key] = dic[key];
                        }

                        dataTable.Rows.Add(dr);
                    }
                }
                else if (dic.Keys.Count > 1)
                {
                    for (int i = 0; i < dic.Keys.Count; i++)
                    {
                        string type = i == 0 ? "System.Int32" : "System.String";

                        if (!string.IsNullOrEmpty(parentTableName) && i == 1)
                        {
                            type = "System.Int32";
                        }

                        dt.Columns.Add(AddColumn(dic.Keys.ToArray()[i], type, i == 0 ? true : false));
                    }

                    dt.Rows.Add(dic.Values.ToArray());
                    ds.Tables.Add(dt);

                    relations.Add(new TableRelation()
                    {
                        Source = parentTableName,
                        Target = tableName,
                        Order = ds.Tables.Count
                    });
                }
            }
        }

        DataColumn AddColumn(string name, string type, bool isPrimaryKey)
        {
            return new DataColumn()
            {
                ColumnName = name,
                DataType = Type.GetType(type),
                AutoIncrement = isPrimaryKey ? true : false,
                AutoIncrementSeed = 1,
                AutoIncrementStep = 1,
                AllowDBNull = true
            };
        }
    }
}
