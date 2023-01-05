using System;
using System.Collections.Concurrent;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

using HandStack.Logger;

namespace Microsoft.Extensions.Logging
{
    public class FileLoggerProvider : ILoggerProvider
    {
        private readonly string LogFileName;

        private readonly ConcurrentDictionary<string, FileLogger> loggers = new ConcurrentDictionary<string, FileLogger>();
        private readonly BlockingCollection<string> entryQueue = new BlockingCollection<string>(1024);
        private readonly Task processQueueTask;
        private readonly FileWriter fileWriter;

        private readonly bool Append = true;
        private readonly long FileSizeLimitBytes = 0;
        private readonly int MaxRollingFiles = 0;

        public LogLevel MinLevel { get; set; } = LogLevel.Debug;

        public Func<LogMessage, string>? FormatLogEntry { get; set; }

        public Func<string, string>? FormatLogFileName { get; set; }

        public FileLoggerProvider(string fileName) : this(fileName, true)
        {
        }

        public FileLoggerProvider(string fileName, bool append) : this(fileName, new FileLoggerOptions() { Append = append })
        {
        }

        public FileLoggerProvider(string fileName, FileLoggerOptions options)
        {
            LogFileName = Environment.ExpandEnvironmentVariables(fileName);
            Append = options.Append;
            FileSizeLimitBytes = options.FileSizeLimitBytes;
            MaxRollingFiles = options.MaxRollingFiles;
            FormatLogEntry = options.FormatLogEntry;
            FormatLogFileName = options.FormatLogFileName;

            fileWriter = new FileWriter(this);
            processQueueTask = Task.Factory.StartNew(ProcessQueue, this, TaskCreationOptions.LongRunning);
        }

        public ILogger CreateLogger(string categoryName)
        {
            return loggers.GetOrAdd(categoryName, CreateLoggerImplementation);
        }

        public void Dispose()
        {
            entryQueue.CompleteAdding();
            try
            {
                processQueueTask.Wait(1500);
            }
            catch (TaskCanceledException) { }
            catch (AggregateException ex) when (ex.InnerExceptions.Count == 1 && ex.InnerExceptions[0] is TaskCanceledException) { }

            loggers.Clear();
            fileWriter.Close();
        }

        private FileLogger CreateLoggerImplementation(string name)
        {
            return new FileLogger(name, this);
        }

        internal void WriteEntry(string message)
        {
            if (!entryQueue.IsAddingCompleted)
            {
                try
                {
                    entryQueue.Add(message);
                    return;
                }
                catch (InvalidOperationException) { }
            }
        }

        private void ProcessQueue()
        {
            foreach (var message in entryQueue.GetConsumingEnumerable())
            {
                fileWriter.WriteMessage(message, entryQueue.Count == 0);
            }
        }

        private static void ProcessQueue(object? state)
        {
            if (state != null)
            {
                var fileLogger = (FileLoggerProvider)state;
                fileLogger.ProcessQueue();
            }
        }

        internal class FileWriter
        {
            string lastBaseLogFileName = "";
            readonly FileLoggerProvider fileLogPrv;
            string logFileName = "";
            Stream? logFileStream = null;
            TextWriter? logFileWriter = null;

            internal FileWriter(FileLoggerProvider fileLogPrv)
            {
                this.fileLogPrv = fileLogPrv;

                DetermineLastFileLogName();
                OpenFile(this.fileLogPrv.Append);
            }

            string GetBaseLogFileName()
            {
                var fName = fileLogPrv.LogFileName;
                if (fileLogPrv.FormatLogFileName != null)
                {
                    fName = fileLogPrv.FormatLogFileName(fName);
                }

                return fName;
            }

            void DetermineLastFileLogName()
            {
                var baseLogFileName = GetBaseLogFileName();
                lastBaseLogFileName = baseLogFileName;
                if (fileLogPrv.FileSizeLimitBytes > 0)
                {
                    var logFileMask = Path.GetFileNameWithoutExtension(baseLogFileName) + "*" + Path.GetExtension(baseLogFileName);
                    var logDirName = Path.GetDirectoryName(baseLogFileName);
                    if (string.IsNullOrEmpty(logDirName) == true)
                    {
                        logDirName = Directory.GetCurrentDirectory();
                    }

                    var logFiles = Directory.Exists(logDirName) ? Directory.GetFiles(logDirName, logFileMask, SearchOption.TopDirectoryOnly) : Array.Empty<string>();
                    if (logFiles.Length > 0)
                    {
                        var lastFileInfo = logFiles
                            .Select(fName => new FileInfo(fName))
                            .OrderByDescending(fInfo => fInfo.Name)
                            .OrderByDescending(fInfo => fInfo.LastWriteTime).First();
                        logFileName = lastFileInfo.FullName;
                    }
                    else
                    {
                        logFileName = baseLogFileName;
                    }
                }
                else
                {
                    logFileName = baseLogFileName;
                }
            }

            void OpenFile(bool append)
            {
                var fileInfo = new FileInfo(logFileName);
                if (fileInfo.Directory != null && fileInfo.Directory.Exists == false)
                {
                    fileInfo.Directory.Create();
                }

                logFileStream = new FileStream(logFileName, FileMode.OpenOrCreate, FileAccess.Write, FileShare.ReadWrite);

                if (append)
                {
                    logFileStream.Seek(0, SeekOrigin.End);
                }
                else
                {
                    logFileStream.SetLength(0);
                }

                logFileWriter = new StreamWriter(logFileStream);
            }

            string GetNextFileLogName()
            {
                var baseLogFileName = GetBaseLogFileName();
                if (File.Exists(baseLogFileName) == false || fileLogPrv.FileSizeLimitBytes <= 0 || new FileInfo(baseLogFileName).Length < fileLogPrv.FileSizeLimitBytes)
                {
                    return baseLogFileName;
                }

                int currentFileIndex = 0;
                var baseFileNameOnly = Path.GetFileNameWithoutExtension(baseLogFileName);
                var currentFileNameOnly = Path.GetFileNameWithoutExtension(logFileName);

                var suffix = currentFileNameOnly.Substring(baseFileNameOnly.Length);
                if (suffix.Length > 0 && int.TryParse(suffix, out var parsedIndex))
                {
                    currentFileIndex = parsedIndex;
                }
                var nextFileIndex = currentFileIndex + 1;
                if (fileLogPrv.MaxRollingFiles > 0)
                {
                    nextFileIndex %= fileLogPrv.MaxRollingFiles;
                }

                var nextFileName = baseFileNameOnly + (nextFileIndex > 0 ? nextFileIndex.ToString() : "") + Path.GetExtension(baseLogFileName);

                string result = nextFileName;
                string? directory = Path.GetDirectoryName(baseLogFileName);
                if (directory != null)
                {
                    result = Path.Combine(directory, nextFileName);
                }
                return result;
            }

            void CheckForNewLogFile()
            {
                bool openNewFile = false;
                if (isMaxFileSizeThresholdReached() == true || isBaseFileNameChanged() == true)
                {
                    openNewFile = true;
                }

                if (openNewFile == true)
                {
                    Close();
                    logFileName = GetNextFileLogName();
                    OpenFile(false);
                }

                bool isMaxFileSizeThresholdReached()
                {
                    return fileLogPrv.FileSizeLimitBytes > 0 && (logFileStream == null ? 0 : logFileStream.Length) > fileLogPrv.FileSizeLimitBytes;
                }

                bool isBaseFileNameChanged()
                {
                    if (fileLogPrv.FormatLogFileName != null)
                    {
                        var baseLogFileName = GetBaseLogFileName();
                        if (baseLogFileName != lastBaseLogFileName)
                        {
                            lastBaseLogFileName = baseLogFileName;
                            return true;
                        }
                        return false;
                    }
                    return false;
                }
            }

            internal void WriteMessage(string message, bool flush)
            {
                if (logFileWriter != null)
                {
                    CheckForNewLogFile();
                    logFileWriter.WriteLine(message);
                    if (flush == true)
                    {
                        logFileWriter.Flush();
                    }
                }
            }

            internal void Close()
            {
                if (logFileWriter != null)
                {
                    var logWriter = logFileWriter;
                    logFileWriter = null;

                    logWriter.Dispose();

                    if (logFileStream != null)
                    {
                        logFileStream.Dispose();
                        logFileStream = null;
                    }
                }
            }
        }
    }
}
