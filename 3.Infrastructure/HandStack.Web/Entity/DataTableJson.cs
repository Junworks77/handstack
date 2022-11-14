using System.Data;

namespace HandStack.Web.Entity
{
    public sealed class DataTableJson
    {
        public static DataTableJsonData ToJsonObject(string fieldID, DataTable source)
        {
            var result = new DataTableJsonData();
            result.FieldID = fieldID;
            result.Value = source;

            return result;
        }
    }

    public class DataTableJsonData
    {
        public DataTableJsonData()
        {
            FieldID = "";
            Value = new DataTable();
        }

        public string FieldID { get; set; }

        public DataTable Value { get; set; }
    }
}
