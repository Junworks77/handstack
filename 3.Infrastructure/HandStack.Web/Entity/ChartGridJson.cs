using System.Data;

namespace HandStack.Web.Entity
{
    public sealed class ChartGridJson
    {
        public static ChartJsonData ToJsonObject(string fieldID, DataTable source)
        {
            var result = new ChartJsonData();
            result.FieldID = fieldID;

            foreach (DataRow dataRow in source.Rows)
            {
                var row = new Dictionary<string, object>();
                object? name = dataRow[0].ToString();
                row["name"] = name == null ? "" : name;
                row["data"] = new List<object>();

                var count = dataRow.ItemArray.Length;
                for (var i = 1; i < count; i++)
                {
                    ((List<object>)row["data"]).Add(dataRow[i]);
                }

                result.Value.Add(row);
            }

            return result;
        }
    }

    public class ChartJsonData
    {
        public string FieldID { get; set; }

        public List<object> Value { get; set; }

        public ChartJsonData()
        {
            FieldID = "";
            Value = new List<object>();
        }
    }
}
