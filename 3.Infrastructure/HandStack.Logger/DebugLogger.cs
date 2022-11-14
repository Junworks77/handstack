namespace HandStack.Logger.Logging
{
    public class DebugLogger
    {
        private const Level DebugLevel = Level.Debug;

        public void Log()
        {
            Log("");
        }

        public void Log(string message)
        {
            TraceLogger.Log(DebugLevel, message);
        }

        public void Log(Exception exception)
        {
            TraceLogger.Log(DebugLevel, exception.Message);
        }

        public void Log<T>(Exception exception) where T : class
        {
            var message = string.Format("Log exception Message: {0}\nStackTrace: {1}", exception.Message, exception.StackTrace);
            TraceLogger.Log<T>(DebugLevel, message);
        }

        public void Log<T>(string message) where T : class
        {
            TraceLogger.Log<T>(DebugLevel, message);
        }
    }
}
