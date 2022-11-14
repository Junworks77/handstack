using HandStack.Logger.Logging.Formatters;

namespace HandStack.Logger.Logging.Handlers
{
    public class DebugConsoleLoggerHandler : ILoggerHandler
    {
        private readonly ILoggerFormatter _loggerFormatter;

        public DebugConsoleLoggerHandler() : this(new DefaultLoggerFormatter()) { }

        public DebugConsoleLoggerHandler(ILoggerFormatter loggerFormatter)
        {
            _loggerFormatter = loggerFormatter;
        }

        public void Publish(LogData logMessage)
        {
            System.Diagnostics.Debug.WriteLine(_loggerFormatter.ApplyFormat(logMessage));
        }
    }
}
