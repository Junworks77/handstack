using System.Collections.Generic;

namespace dbclient.Entity
{
    public class ModuleConfigJson
    {
        public string ModuleID { get; set; }

        public string Name { get; set; }

        public bool IsBundledWithHost { get; set; }

        public string Version { get; set; }

        public ModuleConfig ModuleConfig { get; set; }

        public ModuleConfigJson()
        {
            ModuleID = "";
            Name = "";
            IsBundledWithHost = false;
            Version = "";
            ModuleConfig = new ModuleConfig();
        }
    }

    public class DataSource
    {
        public string ApplicationID { get; set; }

        public string ProjectID { get; set; }

        public string DataSourceID { get; set; }

        public string DataProvider { get; set; }

        public string ConnectionString { get; set; }

        public string IsEncryption { get; set; }

        public string Description { get; set; }

        public DataSource()
        {
            ApplicationID = "";
            ProjectID = "";
            DataSourceID = "";
            DataProvider = "";
            ConnectionString = "";
            IsEncryption = "";
            Description = "";
        }
    }

    public class ModuleConfig
    {
        public string AuthorizationKey { get; set; }

        public string BusinessServerUrl { get; set; }

        public int CircuitBreakResetSecond { get; set; }

        public int DefaultCommandTimeout { get; set; }

        public bool IsExceptionDetailText { get; set; }

        public bool IsLogServer { get; set; }

        public bool IsContractFileWatchingUpdate { get; set; }

        public string LocalStoragePath { get; set; }

        public string LogServerUrl { get; set; }

        public string ContractBasePath { get; set; }

        public bool IsTransactionLogging { get; set; }

        public string TransactionLogFilePath { get; set; }

        public int TransactionLogFileSizeLimitBytes { get; set; }

        public int TransactionLogMaxRollingFiles { get; set; }

        public bool IsProfileLogging { get; set; }

        public string ProfileLogFilePath { get; set; }

        public List<DataSource> DataSource { get; set; }

        public ModuleConfig()
        {
            AuthorizationKey = "";
            BusinessServerUrl = "";
            CircuitBreakResetSecond = 60;
            DefaultCommandTimeout = 30;
            IsExceptionDetailText = false;
            IsLogServer = false;
            IsContractFileWatchingUpdate = false;
            LocalStoragePath = "";
            LogServerUrl = "";
            ContractBasePath = "";
            IsTransactionLogging = false;
            TransactionLogFilePath = "";
            TransactionLogFileSizeLimitBytes = 104857600;
            TransactionLogMaxRollingFiles = 30;
            IsProfileLogging = false;
            ProfileLogFilePath = "";
            DataSource = new List<DataSource>();
        }
    }
}
