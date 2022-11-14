using System.Collections.Generic;

namespace function.Entity
{
    public class DataContext
    {
        public string accessToken { get; set; }

        public Dictionary<string, object> loadOptions { get; set; }

        public string globalID { get; set; }

        public string environment { get; set; }

        public string dataProvider { get; set; }

        public string connectionString { get; set; }

        public string workingDirectoryPath { get; set; }

        public ModuleScriptMap featureMeta { get; set; }

        public DataContext()
        {
            accessToken = "";
            loadOptions = new Dictionary<string, object>();
            globalID = "";
            environment = "";
            dataProvider = "";
            connectionString = "";
            workingDirectoryPath = "";
            featureMeta = new ModuleScriptMap();
        }
    }
}
