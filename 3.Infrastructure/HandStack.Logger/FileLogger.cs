using System;
using System.Text;

using Microsoft.Extensions.Logging;

namespace HandStack.Logger
{
    public class FileLogger : ILogger
    {

        private readonly string logName;
        private readonly FileLoggerProvider LoggerPrv;

        public FileLogger(string logName, FileLoggerProvider loggerPrv)
        {
            this.logName = logName;
            this.LoggerPrv = loggerPrv;
        }
        public IDisposable BeginScope<TState>(TState state)
        {
#pragma warning disable CS8603
            return null;
#pragma warning restore CS8603
        }

        public bool IsEnabled(LogLevel logLevel)
        {
            return logLevel >= LoggerPrv.MinLevel;
        }

        string GetShortLogLevel(LogLevel logLevel)
        {
            switch (logLevel)
            {
                case LogLevel.Trace:
                    return "[VRB]";
                case LogLevel.Debug:
                    return "[DBG]";
                case LogLevel.Information:
                    return "[INF]";
                case LogLevel.Warning:
                    return "[WRN]";
                case LogLevel.Error:
                    return "[ERR]";
                case LogLevel.Critical:
                    return "[FTL]";
            }
            return logLevel.ToString().ToUpper();
        }

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
        {
            if (IsEnabled(logLevel) == false)
            {
                return;
            }

            if (formatter == null)
            {
                throw new ArgumentNullException(nameof(formatter));
            }

            string message = string.Empty;
            if (null != formatter)
            {
                message = formatter(state, exception);
            }

            if (LoggerPrv.FormatLogEntry != null)
            {
                if (exception != null)
                {
                    LoggerPrv.WriteEntry(LoggerPrv.FormatLogEntry(new LogMessage(logName, logLevel, eventId, message, exception)));
                }
                else
                {
                    LoggerPrv.WriteEntry(LoggerPrv.FormatLogEntry(new LogMessage(logName, logLevel, eventId, message, new Exception())));
                }
            }
            else
            {
                var logBuilder = new StringBuilder();
                if (string.IsNullOrEmpty(message) == false)
                {
                    logBuilder.Append($"{DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff")} {GetShortLogLevel(logLevel)} [{logName}] [{eventId}] {message}");
                }

                if (exception != null)
                {
                    logBuilder.AppendLine(exception.ToString());
                }

                LoggerPrv.WriteEntry(logBuilder.ToString());
            }
        }
    }
}
