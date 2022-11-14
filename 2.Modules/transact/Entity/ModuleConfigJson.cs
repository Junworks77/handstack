using System.Collections.Generic;

namespace transact.Entity
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

    public class ModuleConfig
    {
        public string SystemID { get; set; }

        public string BusinessServerUrl { get; set; }

        public int CircuitBreakResetSecond { get; set; }

        public int DefaultCommandTimeout { get; set; }

        public bool IsExceptionDetailText { get; set; }

        public bool IsLogServer { get; set; }

        public bool IsContractFileWatchingUpdate { get; set; }

        public string ContractBasePath { get; set; }

        public bool UseApiAuthorize { get; set; }

        public List<string> BypassAuthorizeIP { get; set; }

        public List<string> WithOrigins { get; set; }

        public string AvailableEnvironment { get; set; }

        public string LogServerUrl { get; set; }

        public bool IsCodeDataCache { get; set; }

        public int CodeDataCacheTimeout { get; set; }

        public bool IsTransactionLogging { get; set; }

        public string TransactionLogFilePath { get; set; }

        public int TransactionLogFileSizeLimitBytes { get; set; }

        public int TransactionLogMaxRollingFiles { get; set; }

        public List<PublicTransaction> PublicTransactions { get; set; }

        public Dictionary<string, string> RouteCommandUrl { get; set; }

        public ModuleConfig()
        {
            SystemID = "";
            BusinessServerUrl = "";
            CircuitBreakResetSecond = 60;
            DefaultCommandTimeout = 180000;
            IsExceptionDetailText = true;
            IsLogServer = false;
            IsContractFileWatchingUpdate = true;
            ContractBasePath = "";
            UseApiAuthorize = false;
            BypassAuthorizeIP = new List<string>();
            WithOrigins = new List<string>();
            AvailableEnvironment = "";
            LogServerUrl = "";
            IsCodeDataCache = true;
            CodeDataCacheTimeout = 20;
            IsTransactionLogging = true;
            TransactionLogFilePath = "";
            TransactionLogFileSizeLimitBytes = 104857600;
            TransactionLogMaxRollingFiles = 30;
            PublicTransactions = new List<PublicTransaction>();
            RouteCommandUrl = new Dictionary<string, string>();
        }
    }
}
