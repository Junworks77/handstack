namespace HandStack.Logger.Logging.Formatters
{
    public interface ILoggerFormatter
    {
        string ApplyFormat(LogData logMessage);
    }
}