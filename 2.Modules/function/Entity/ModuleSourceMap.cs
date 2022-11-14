using HandStack.Data;

namespace function.Entity
{
    public class ModuleSourceMap
    {
        public string DataSourceID { get; set; } = "";
        public DataProviders DataProvider { get; set; }
        public string ConnectionString { get; set; } = "";
        public string WorkingDirectoryPath { get; set; } = "";
    }
}
