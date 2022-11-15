using System;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace HandStack.Logger
{
    public static class FileLoggerExtensions
    {
        public static ILoggerFactory AddFile(this ILoggerFactory factory, string fileName, bool append = true)
        {
            factory.AddProvider(new FileLoggerProvider(fileName, append));
            return factory;
        }

        public static ILoggerFactory AddFile(this ILoggerFactory factory, IConfiguration configuration, Action<FileLoggerOptions>? configure = null)
        {
            var prvFactory = factory;
            var fileLoggerPrv = CreateFromConfiguration(configuration, configure);
            if (fileLoggerPrv == null)
                return factory;

            prvFactory.AddProvider(fileLoggerPrv);
            return factory;
        }

        private static FileLoggerProvider? CreateFromConfiguration(IConfiguration configuration, Action<FileLoggerOptions>? configure)
        {
            var fileSection = configuration.GetSection("File");
            if (fileSection == null)
            {
                return null;
            }

            var fileName = fileSection["Path"];
            if (string.IsNullOrWhiteSpace(fileName))
            {
                return null;
            }

            var fileLoggerOptions = new FileLoggerOptions();
            var appendVal = fileSection["Append"];
            if (string.IsNullOrEmpty(appendVal) == false && bool.TryParse(appendVal, out var append))
            {
                fileLoggerOptions.Append = append;
            }

            var fileLimitVal = fileSection["FileSizeLimitBytes"];
            if (string.IsNullOrEmpty(fileLimitVal) == false && long.TryParse(fileLimitVal, out var fileLimit))
            {
                fileLoggerOptions.FileSizeLimitBytes = fileLimit;
            }

            var maxFilesVal = fileSection["MaxRollingFiles"];
            if (string.IsNullOrEmpty(maxFilesVal) == false && int.TryParse(maxFilesVal, out var maxFiles))
            {
                fileLoggerOptions.MaxRollingFiles = maxFiles;
            }

            if (configure != null)
            {
                configure(fileLoggerOptions);
            }

            return new FileLoggerProvider(fileName, fileLoggerOptions);
        }
    }
}
