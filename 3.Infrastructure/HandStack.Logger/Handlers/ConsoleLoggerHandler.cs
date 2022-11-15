using System;

using HandStack.Logger.Logging.Formatters;

namespace HandStack.Logger.Logging.Handlers
{
    public class ConsoleLoggerHandler : ILoggerHandler
    {
        private readonly ILoggerFormatter _loggerFormatter;

        public ConsoleLoggerHandler() : this(new DefaultLoggerFormatter()) { }

        public ConsoleLoggerHandler(ILoggerFormatter loggerFormatter)
        {
            _loggerFormatter = loggerFormatter;
        }

        public void Publish(LogData logMessage)
        {
            Console.WriteLine(_loggerFormatter.ApplyFormat(logMessage));
        }
    }
}
