using System;

namespace HandStack.Logger
{
    public class FileLoggerOptions
    {
        public bool Append { get; set; } = true;

        public long FileSizeLimitBytes { get; set; } = 0;

        public int MaxRollingFiles { get; set; } = 0;

        public Func<LogMessage, string>? FormatLogEntry { get; set; }

        public Func<string, string>? FormatLogFileName { get; set; }
    }
}
