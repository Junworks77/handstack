using System;

using HandStack.Logger.Logging.Formatters;

namespace HandStack.Logger.Logging
{
    public class LogData
    {
        public DateTime DateTime { get; set; }

        public Level Level { get; set; }

        public string Text { get; set; }

        public string CallingClass { get; set; }

        public string CallingMethod { get; set; }

        public int LineNumber { get; set; }

        public LogData()
        {
            Level = Level.Info;
            Text = "";
            DateTime = DateTime.MinValue;
            CallingClass = "";
            CallingMethod = "";
            LineNumber = 0;
        }

        public LogData(Level level, string text, DateTime dateTime, string callingClass, string callingMethod, int lineNumber)
        {
            Level = level;
            Text = text;
            DateTime = dateTime;
            CallingClass = callingClass;
            CallingMethod = callingMethod;
            LineNumber = lineNumber;
        }

        public override string ToString()
        {
            return new DefaultLoggerFormatter().ApplyFormat(this);
        }
    }
}
