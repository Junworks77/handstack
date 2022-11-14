namespace HandStack.Logger.Logging
{
    public interface ILoggerHandler
    {
        void Publish(LogData logMessage);
    }
}