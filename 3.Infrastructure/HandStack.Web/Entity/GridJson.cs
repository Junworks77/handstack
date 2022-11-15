using System.Collections.Generic;
using System.Data;

namespace HandStack.Web.Entity
{
    public sealed class GridJson
    {
        public static GridJsonData ToJsonObject(string fieldID, DataTable source)
        {
            var result = new GridJsonData();
            result.FieldID = fieldID;

            Dictionary<string, object> childRow;
            foreach (DataRow dataRow in source.Rows)
            {
                childRow = new Dictionary<string, object>();
                foreach (DataColumn col in source.Columns)
                {
                    childRow.Add(col.ColumnName, dataRow[col]);
                }
                result.Value.Add(childRow);
            }

            return result;
        }
    }

    public class GridJsonData
    {
        public GridJsonData()
        {
            FieldID = "";
            Value = new List<Dictionary<string, object>>();
        }

        public string FieldID { get; set; }

        public List<Dictionary<string, object>> Value { get; set; }
    }
}
