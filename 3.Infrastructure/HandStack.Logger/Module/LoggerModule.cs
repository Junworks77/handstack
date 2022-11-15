using System;

namespace HandStack.Logger.Logging.Module
{
    public abstract class LoggerModule
    {
        public abstract string Name { get; }

        public virtual void BeforeLog() { }

        public virtual void Execute(LogData logMessage) { }

        public virtual void ExceptionLog(Exception exception) { }

        public virtual void Initialize() { }
    }
}
