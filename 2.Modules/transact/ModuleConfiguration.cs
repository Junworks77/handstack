using System.Collections.Generic;

using transact.Entity;

namespace transact
{
    public static class ModuleConfiguration
    {
        public static bool IsConfigure = false;
        public static string ModuleID = "transact";
        public static string Version = "";
        public static string AuthorizationKey = "";
        public static bool IsBundledWithHost = false;
        public static string ContractBasePath = "";
        public static string BusinessServerUrl = "";
        public static bool IsTransactionLogging = false;
        public static string TransactionLogFilePath = "";
        public static int TransactionLogFileSizeLimitBytes = 104857600;
        public static int TransactionLogMaxRollingFiles = 30;
        public static int CircuitBreakResetSecond = 60;
        public static bool IsLogServer = false;
        public static string LogServerUrl = "";
        public static bool UseApiAuthorize = false;
        public static List<string> BypassAuthorizeIP = new List<string>();
        public static List<string> WithOrigins = new List<string>();
        public static bool IsExceptionDetailText = false;
        public static int DefaultCommandTimeout = 30;
        public static bool IsApiFindServer = false;
        public static string SystemID = "";
        public static bool IsContractFileWatchingUpdate = false;
        public static string AvailableEnvironment = "";
        public static bool IsCodeDataCache = true;
        public static int CodeDataCacheTimeout = 20;
        public static Dictionary<string, string> RouteCommandUrl = new Dictionary<string, string>();
        public static List<PublicTransaction>? PublicTransactions = new List<PublicTransaction>();
    }
}
