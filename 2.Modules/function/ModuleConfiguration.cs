using System.Collections.Generic;

using function.Entity;

namespace function
{
    public static class ModuleConfiguration
    {
        public static bool IsConfigure = false;
        public static string ModuleID = "function";
        public static string Version = "";
        public static string AuthorizationKey = "";
        public static bool IsBundledWithHost = false;
        public static bool IsContractFileWatchingUpdate = false;
        public static string ContractBasePath = "";
        public static string LogMinimumLevel = "";
        public static string FileLogBasePath = "";
        public static string LocalStoragePath = "";
        public static int TimeoutMS = -1;
        public static bool IsSingleThread = false;
        public static bool EnableFileWatching = false;
        public static bool WatchGracefulShutdown = true;
        public static List<string> WatchFileNamePatterns = new List<string>();
        public static string NodeAndV8Options = "";
        public static string EnvironmentVariables = "";
        public static string BusinessServerUrl = "";
        public static bool IsTransactionLogging = false;
        public static string TransactionLogFilePath = "";
        public static bool IsProfileLogging = false;
        public static string ProfileLogFilePath = "";
        public static int CircuitBreakResetSecond = 60;
        public static bool IsLogServer = false;
        public static string LogServerUrl = "";
        public static bool IsExceptionDetailText = false;
        public static int DefaultCommandTimeout = 30;
        public static bool IsApiFindServer = false;
        public static List<FunctionSource> FunctionSource = new List<FunctionSource>();
    }
}
