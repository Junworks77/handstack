﻿using System;
using System.Data.Common;
using System.Diagnostics;
using System.IO;

using dbclient.Profiler;

using HandStack.Core.Extensions;
using HandStack.Data.ExtensionMethod;
using HandStack.Logger;

namespace dbclient.Extensions
{
    public class ConsoleProfiler : IAdoNetProfiler
    {
        private string globalID = "";
        private string queryID;

        private string? executeSQL;

        public string? ExecuteSQL
        {
            get
            {
                return executeSQL;
            }
            set
            {
                executeSQL = value == null ? null : value.Trim();
                if (ModuleConfiguration.IsTransactionLogging == true && IsLogger == true)
                {
                    Logger.Log(Level.Info, $"ExecuteSQL Request GlobalID: {globalID}, SQL: {executeSQL}");
                }
            }
        }

        private Stopwatch? stopwatch;

        public bool IsEnabled { get; }

        private Stopwatch? connectionStopwatch;

        private Stopwatch? transactionStopwatch;

        private DbCommand? command;

        private bool IsLogger = false;

        public ConsoleProfiler(string globalID, string queryID = "", string? logFilePath = null)
        {
            IsEnabled = true;
            this.globalID = globalID;
            this.queryID = queryID;

            if (string.IsNullOrEmpty(logFilePath) != true)
            {
                FileInfo fileInfo = new FileInfo(logFilePath);
                IsLogger = true;
            }
        }

        public void OnOpening(DbConnection connection)
        {
            stopwatch = Stopwatch.StartNew();
            connectionStopwatch = Stopwatch.StartNew();
        }

        public void OnOpened(DbConnection connection)
        {
            if (stopwatch != null)
            {
                stopwatch.Stop();
                Logger.Log($"Connection Open Duration - {stopwatch.Elapsed.TotalMilliseconds} ms");
            }
        }

        public void OnClosing(DbConnection connection)
        {
            stopwatch = Stopwatch.StartNew();
        }

        public void OnClosed(DbConnection connection)
        {
            if (stopwatch != null)
            {
                stopwatch.Stop();
                Logger.Log($"Connection Close Duration - {stopwatch.Elapsed.TotalMilliseconds} ms");
            }

            if (connectionStopwatch != null)
            {
                connectionStopwatch.Stop();
                Logger.Log($"Connection Lifetime - {connectionStopwatch.Elapsed.TotalMilliseconds} ms");
            }
        }

        public void OnStartingTransaction(DbConnection connection)
        {
            stopwatch = Stopwatch.StartNew();
            transactionStopwatch = Stopwatch.StartNew();
        }

        public void OnStartedTransaction(DbTransaction transaction)
        {
            if (stopwatch != null)
            {
                stopwatch.Stop();
                Logger.Log($"Transaction Start Duration - {stopwatch.Elapsed.TotalMilliseconds} ms");
            }
        }

        public void OnCommitting(DbTransaction transaction)
        {
            stopwatch = Stopwatch.StartNew();
        }

        public void OnCommitted(DbConnection connection)
        {
            if (stopwatch != null)
            {
                stopwatch.Stop();
                Logger.Log($"Transaction Commit Duration - {stopwatch.Elapsed.TotalMilliseconds} ms");
            }

            if (transactionStopwatch != null)
            {
                transactionStopwatch.Stop();
                Logger.Log($"Transaction Lifetime - {transactionStopwatch.Elapsed.TotalMilliseconds} ms");
            }
        }

        public void OnRollbacking(DbTransaction transaction)
        {
            stopwatch = Stopwatch.StartNew();
        }

        public void OnRollbacked(DbConnection connection)
        {
            if (stopwatch != null)
            {
                stopwatch.Stop();
                Logger.Log($"Transaction Rollback Duration - {stopwatch.Elapsed.TotalMilliseconds} ms");
            }

            if (transactionStopwatch != null)
            {
                transactionStopwatch.Stop();
                Logger.Log($"Transaction Lifetime - {transactionStopwatch.Elapsed.TotalMilliseconds} ms");
            }
        }

        public void OnExecuteReaderStart(DbCommand command)
        {
            string providerName = "";
            ProfilerDbConnection? connection = command.Connection as ProfilerDbConnection;
            if (connection != null)
            {
                providerName = connection.WrappedConnection.ToString();
            }

            ExecuteSQL = command.CommandAsSql(providerName);

            this.command = command;
            stopwatch = Stopwatch.StartNew();
        }

        public void OnReaderFinish(DbDataReader reader, int records)
        {
            if (stopwatch != null && command != null)
            {
                stopwatch.Stop();
                Logger.Log($"Command Info - Command : {command.CommandText}, Records : {records}, Duration {stopwatch.Elapsed.TotalMilliseconds} ms");
            }
        }

        public void OnExecuteNonQueryStart(DbCommand command)
        {
            this.command = command;
            stopwatch = Stopwatch.StartNew();
        }

        public void OnExecuteNonQueryFinish(DbCommand command, int executionRestlt)
        {

            if (stopwatch != null && command != null)
            {
                stopwatch.Stop();
                Logger.Log($"Command Info - Command : {command.CommandText}, Result : {executionRestlt}, Duration {stopwatch.Elapsed.TotalMilliseconds} ms");
            }
        }

        public void OnExecuteScalarStart(DbCommand command)
        {
            this.command = command;
            stopwatch = Stopwatch.StartNew();
        }

        public void OnExecuteScalarFinish(DbCommand command, object? executionRestlt)
        {
            if (stopwatch != null && command != null)
            {
                stopwatch.Stop();
                Logger.Log($"Command Info - Command : {command.CommandText}, Result : {executionRestlt}, Duration {stopwatch.Elapsed.TotalMilliseconds} ms");
            }
        }

        public void OnCommandError(DbCommand command, Exception exception)
        {
            if (ModuleConfiguration.IsTransactionLogging == true && IsLogger == true)
            {
                Logger.Log(Level.Error, $"OnCommandError Request GlobalID: {globalID}, SQL: {exception.ToMessage()}");
            }
        }
    }
}
