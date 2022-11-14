using HandStack.Logger.Logging.Formatters;

namespace HandStack.Logger.Logging.Handlers
{
    public class FileLoggerHandler : ILoggerHandler
    {
        private readonly string fileName;
        private string? directory;
        private readonly ILoggerFormatter loggerFormatter;

        public FileLoggerHandler() : this(CreateFileName()) { }

        public FileLoggerHandler(string fileName) : this(fileName, string.Empty) { }

        public FileLoggerHandler(string fileName, string? directory) : this(new DefaultLoggerFormatter(), fileName, directory) { }

        public FileLoggerHandler(ILoggerFormatter loggerFormatter) : this(loggerFormatter, CreateFileName()) { }

        public FileLoggerHandler(ILoggerFormatter loggerFormatter, string fileName) : this(loggerFormatter, fileName, string.Empty) { }

        public FileLoggerHandler(ILoggerFormatter loggerFormatter, string fileName, string? directory)
        {
            this.loggerFormatter = loggerFormatter;
            this.fileName = fileName;
            this.directory = directory;
        }

        public void Publish(LogData logMessage)
        {
            if (string.IsNullOrEmpty(directory) == true)
            {
                FileInfo fileInfo = new FileInfo(fileName);
                directory = fileInfo.DirectoryName;
            }

            if (string.IsNullOrEmpty(directory) == false)
            {
                var directoryInfo = new DirectoryInfo(Path.Combine(directory));
                if (directoryInfo.Exists == false)
                {
                    directoryInfo.Create();
                }
            }

            if (directory != null)
            {
                using (var writer = new StreamWriter(File.Open(Path.Combine(directory, fileName), FileMode.Append)))
                {
                    writer.AutoFlush = true;
                    writer.WriteLine(loggerFormatter.ApplyFormat(logMessage));
                }
            }
        }

        private static string CreateFileName()
        {
            var currentDate = DateTime.Now;
            return string.Format("Log_{0:0000}{1:00}{2:00}.log", currentDate.Year, currentDate.Month, currentDate.Day);
        }
    }
}
