namespace HandStack.Logger.Logging
{
    public interface ILoggerHandlerManager
    {
        ILoggerHandlerManager AddHandler(ILoggerHandler loggerHandler);

        ILoggerHandlerManager AddHandler(ILoggerHandler loggerHandler, Predicate<LogData> filter);

        bool RemoveHandler(ILoggerHandler loggerHandler);
    }
}
