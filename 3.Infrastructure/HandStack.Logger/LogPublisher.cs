using System;
using System.Collections.Generic;

namespace HandStack.Logger.Logging
{
    internal class FilteredHandler : ILoggerHandler
    {
        public Predicate<LogData>? Filter { get; set; }

        public ILoggerHandler? Handler { get; set; }

        public void Publish(LogData logMessage)
        {
            if (Filter != null && Handler != null)
            {
                if (Filter(logMessage) == true)
                {
                    Handler.Publish(logMessage);
                }
            }
        }
    }

    public class LogPublisher : ILoggerHandlerManager
    {
        public bool StoreLogMessages { get; set; }
        private readonly IList<ILoggerHandler> loggerHandlers;
        private readonly IList<LogData> logMessages;

        public LogPublisher()
        {
            loggerHandlers = new List<ILoggerHandler>();
            logMessages = new List<LogData>();
            StoreLogMessages = false;
        }

        public LogPublisher(bool storeLogMessages)
        {
            loggerHandlers = new List<ILoggerHandler>();
            logMessages = new List<LogData>();
            StoreLogMessages = storeLogMessages;
        }

        public void Publish(LogData logMessage)
        {
            if (StoreLogMessages == true)
            {
                logMessages.Add(logMessage);
            }

            foreach (var loggerHandler in loggerHandlers)
            {
                loggerHandler.Publish(logMessage);
            }
        }

        public ILoggerHandlerManager AddHandler(ILoggerHandler loggerHandler)
        {
            if (loggerHandler != null)
            {
                loggerHandlers.Add(loggerHandler);
            }
            return this;
        }

        public ILoggerHandlerManager AddHandler(ILoggerHandler loggerHandler, Predicate<LogData> filter)
        {
            if ((filter == null) || loggerHandler == null)
            {
                return this;
            }

            return AddHandler(new FilteredHandler()
            {
                Filter = filter,
                Handler = loggerHandler
            });
        }

        public bool RemoveHandler(ILoggerHandler loggerHandler)
        {
            return loggerHandlers.Remove(loggerHandler);
        }

        public IEnumerable<LogData> Messages
        {
            get { return logMessages; }
        }
    }
}
