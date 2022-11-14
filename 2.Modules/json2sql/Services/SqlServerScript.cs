using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;

using json2sql.Entity;

namespace json2sql.Services
{
    internal class SqlServerScript
    {
        public static string GenerateDbSchema(DataSet ds, List<TableRelation> relations)
        {
            StringBuilder sb = new StringBuilder();

            foreach (TableRelation rel in relations.OrderByDescending(i => i.Order))
            {
                DataTable? table = ds.Tables[rel.Target];
                if (table != null)
                {
                    sb.AppendLine(CreateTableScript(table));
                    sb.AppendLine("");
                }
            }

            return sb.ToString();
        }

        static string CreateTableScript(DataTable table)
        {
            string sqlsc;
            sqlsc = "CREATE TABLE [" + table.TableName + "](";
            for (int i = 0; i < table.Columns.Count; i++)
            {
                sqlsc += "\n [" + table.Columns[i].ColumnName + "]";
                string columnType = table.Columns[i].DataType.ToString();
                switch (columnType)
                {
                    case "System.Int32":
                        sqlsc += " INT";
                        break;
                    case "System.Int64":
                        sqlsc += " BIGINT";
                        break;
                    case "System.Int16":
                        sqlsc += " SMALLINT";
                        break;
                    case "System.Byte":
                        sqlsc += " TINYINT";
                        break;
                    case "System.Decimal":
                        sqlsc += " DECIMAL";
                        break;
                    case "System.DateTime":
                        sqlsc += " DATETIME";
                        break;
                    case "System.Boolean":
                        sqlsc += " BIT";
                        break;
                    case "System.String":
                    default:
                        sqlsc += string.Format(" NVARCHAR({0})", table.Columns[i].MaxLength == -1 ? "MAX" : table.Columns[i].MaxLength.ToString());
                        break;
                }
                if (table.Columns[i].AutoIncrement)
                    sqlsc += " IDENTITY(" + table.Columns[i].AutoIncrementSeed.ToString() + "," + table.Columns[i].AutoIncrementStep.ToString() + ")";
                if (!table.Columns[i].AllowDBNull)
                    sqlsc += " NOT NULL";
                sqlsc += ",";
            }

            if (table.PrimaryKey.Length > 0)
            {
                StringBuilder primaryKeySql = new StringBuilder();

                primaryKeySql.AppendFormat("\n\tCONSTRAINT [PK_{0}] PRIMARY KEY (", table.TableName);

                for (int j = 0; j < table.PrimaryKey.Length; j++)
                {
                    primaryKeySql.AppendFormat("[{0}],", table.PrimaryKey[j].ColumnName);
                }

                primaryKeySql.Remove(primaryKeySql.Length - 1, 1);
                primaryKeySql.Append(") ");

                sqlsc += " " + primaryKeySql;
            }

            sqlsc = sqlsc.Substring(0, sqlsc.Length - 1) + "\n)";

            if (table.Constraints.Count > 0)
            {
                string query = "";
                foreach (Constraint vv in table.Constraints)
                {
                    if (vv.ConstraintName == "ForeignKey")
                    {
                        ForeignKeyConstraint? constraint = vv as ForeignKeyConstraint;
                        if (constraint != null && constraint.Table != null)
                        {
                            query = string.Format("\nALTER TABLE [{0}] WITH CHECK ADD CONSTRAINT [FK_{0}_{1}] FOREIGN KEY([{2}]) REFERENCES [{1}] ([{3}])", constraint.Table.TableName, constraint.RelatedTable.TableName, constraint.Columns[0].ColumnName, constraint.RelatedColumns[0].ColumnName);
                            query += string.Format("\nALTER TABLE [{0}] CHECK CONSTRAINT [FK_{0}_{1}]", constraint.Table.TableName, constraint.RelatedTable.TableName);
                        }
                    }

                }

                sqlsc += query;
            }

            return sqlsc;
        }

        public static string GenerateInsertSQL(DataSet ds, List<TableRelation> relations)
        {
            StringBuilder sb = new StringBuilder();

            foreach (TableRelation rel in relations.OrderByDescending(i => i.Order))
            {
                DataTable? table = ds.Tables[rel.Target];
                if (table != null)
                {
                    foreach (DataRow dr in table.Rows)
                    {
                        var names = new List<string>();
                        var values = new List<string>();

                        foreach (DataColumn column in dr.Table.Columns)
                        {
                            names.Add(column.ColumnName);
                            values.Add(GetInsertColumnValue(dr, column));
                        }

                        names.RemoveAt(0);
                        values.RemoveAt(0);
                        sb.AppendLine($"INSERT INTO [{table.TableName}] ([{string.Join("], [", names.ToArray())}]) VALUES ({string.Join(", ", values.ToArray())})");
                    }
                }
            }

            return sb.ToString();
        }

        static string GetInsertColumnValue(DataRow row, DataColumn column)
        {
            string output = "";
            object item = row[column.ColumnName];
            if (item == DBNull.Value)
            {
                output = "NULL";
            }
            else
            {
                if (column.DataType == typeof(bool))
                {
                    output = (bool)item ? "1" : "0";
                }
                else if (column.DataType == typeof(string))
                {
                    output = ((string)item).Replace("'", "''");
                    output = "N'" + output + "'";
                }
                else if (column.DataType == typeof(DateTime))
                {
                    output = ((string)item).Replace("'", "''");
                    output = "'" + output + "'";
                }
                else
                {
                    output = ((string)item);
                }
            }

            return output;
        }

    }
}
