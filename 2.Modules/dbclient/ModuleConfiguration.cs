﻿using System.Collections.Generic;

using dbclient.Entity;

namespace dbclient
{
    public static class ModuleConfiguration
    {
        public static bool IsConfigure = false;
        public static string ModuleID = "dbclient";
        public static string Version = "";
        public static string AuthorizationKey = "";
        public static bool IsBundledWithHost = false;
        public static bool IsContractFileWatchingUpdate = false;
        public static string ContractBasePath = "";
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
        public static List<DataSource> DataSource = new List<DataSource>();
    }
}
