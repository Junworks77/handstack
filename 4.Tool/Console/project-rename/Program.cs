using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;

using HandStack.Core.ExtensionMethod;
using HandStack.Core.Helpers;

using HandStack.Logger;
using HandStack.Logger.Logging.Handlers;

namespace project_rename
{
    internal class Program
    {
        private static string[] ignoredDirectoryNames = { ".vs", ".git", ".svn" };

        private static int replaceInFilesCount;
        private static int replaceInFileNamesCount;
        private static int replaceInDirectoryNamesCount;

        /// <param name="args">project_rename /source=C:\projects\handstack\2.Modules\template\ /target=C:\projects\handstack.modules\starter /find=template /replace=starter</param>
        static void Main(string[] args)
        {
            TraceLogger.LoggerHandlerManager
                .AddHandler(new ConsoleLoggerHandler())
                .AddHandler(new FileLoggerHandler())
                .AddHandler(new DebugConsoleLoggerHandler());

            TraceLogger.Log("project-rename start");

            ArgumentHelper arguments = new ArgumentHelper(args);
            string? source = arguments["source"];
            string? target = arguments["target"];
            string? find = arguments["find"];
            string? replace = arguments["replace"];
            string? ignored = arguments["ignored"];

            if (string.IsNullOrEmpty(ignored) == false)
            {
                ignoredDirectoryNames = ignored.Split(",");
            }

            if (string.IsNullOrEmpty(source) == false && string.IsNullOrEmpty(find) == false && string.IsNullOrEmpty(replace) == false)
            {
                try
                {
                    string sourceDirectoryPath = source;
                    string targetDirectoryPath = target == null ? "" : target;
                    string findText = find;
                    string replaceText = replace;

                    TraceLogger.Log(Level.Info, "변환 시작");

                    if (string.IsNullOrEmpty(targetDirectoryPath) == false)
                    {
                        if (Directory.Exists(targetDirectoryPath) == false)
                        {
                            Directory.CreateDirectory(targetDirectoryPath);
                        }

                        DirectoryInfo sourceDirectoryInfo = new DirectoryInfo(sourceDirectoryPath);
                        sourceDirectoryInfo.CopyTo(targetDirectoryPath, true);

                        sourceDirectoryPath = targetDirectoryPath;
                    }

                    ReplaceInFiles(sourceDirectoryPath, findText, replaceText, deleteVsUserSettingsDirectory: true);

                    ReplaceInFileNames(sourceDirectoryPath, findText, replaceText, deleteVsUserSettingsDirectory: true);

                    ReplaceInDirectoryNames(sourceDirectoryPath, findText, replaceText, deleteVsUserSettingsDirectory: true);

                    TraceLogger.Log(Level.Info, $"변환 완료 replaceInFilesCount: {replaceInFilesCount}, replaceInFileNamesCount: {replaceInFileNamesCount}, replaceInDirectoryNamesCount: {replaceInDirectoryNamesCount}");
                }
                catch (Exception exception)
                {
                    TraceLogger.Log(exception, Level.Error, "Failed with exception 오류");
                    Environment.Exit(-1);
                }
            }
            else
            {
                TraceLogger.Log(Level.Warning, "필수 매개변수 확인 필요");
                Environment.Exit(-1);
            }

            Environment.Exit(0);
        }

        public static void ReplaceInFiles(string directoryPath, string findText, string replaceText, bool deleteVsUserSettingsDirectory)
        {
            var directoryInfo = new DirectoryInfo(directoryPath);

            if (deleteVsUserSettingsDirectory && ignoredDirectoryNames.Contains(directoryInfo.Name))
            {
                return;
            }

            foreach (string file in Directory.GetFiles(directoryPath))
            {
                var fileInfo = new FileInfo(file);
                if (fileInfo.IsBinary() == false)
                {
                    string fileText = File.ReadAllText(file);

                    int count = Regex.Matches(fileText, findText, RegexOptions.None).Count;

                    if (count > 0)
                    {
                        string contents = fileText.Replace(findText, replaceText);

                        File.WriteAllText(file, contents);

                        replaceInFilesCount += count;
                    }
                }
            }

            foreach (string directory in Directory.GetDirectories(directoryPath))
            {
                ReplaceInFiles(directory, findText, replaceText, deleteVsUserSettingsDirectory);
            }
        }

        public static void ReplaceInFileNames(string directoryPath, string findText, string replaceText, bool deleteVsUserSettingsDirectory)
        {
            var directoryInfo = new DirectoryInfo(directoryPath);

            if (deleteVsUserSettingsDirectory && ignoredDirectoryNames.Contains(directoryInfo.Name))
            {
                return;
            }

            foreach (string file in Directory.GetFiles(directoryPath))
            {
                var fileInfo = new FileInfo(file);

                int count = Regex.Matches(fileInfo.Name, findText, RegexOptions.None).Count;

                if (count > 0)
                {
                    string newFileName = fileInfo.Name.Replace(findText, replaceText);

                    string originalFileName = fileInfo.Name;

                    if (newFileName.Equals(originalFileName, StringComparison.InvariantCultureIgnoreCase))
                    {
                        string tempFileName = $"temp_{originalFileName}_{Guid.NewGuid()}";

                        string tempFullFileName = fileInfo.FullName.ReplaceLastOccurrence(fileInfo.Name, tempFileName);

                        File.Move(fileInfo.FullName, tempFullFileName);

                        string newFullFileName = fileInfo.FullName.ReplaceLastOccurrence(fileInfo.Name, newFileName);

                        File.Move(tempFullFileName, newFullFileName);
                    }
                    else
                    {
                        string newFullFileName = fileInfo.FullName.ReplaceLastOccurrence(fileInfo.Name, newFileName);

                        File.Move(fileInfo.FullName, newFullFileName);
                    }

                    replaceInFileNamesCount += count;
                }
            }

            foreach (string directory in Directory.GetDirectories(directoryPath))
            {
                ReplaceInFileNames(directory, findText, replaceText, deleteVsUserSettingsDirectory);
            }
        }

        public static void ReplaceInDirectoryNames(string directoryPath, string findText, string replaceText, bool deleteVsUserSettingsDirectory)
        {
            var directoryInfo = new DirectoryInfo(directoryPath);

            if (deleteVsUserSettingsDirectory && ignoredDirectoryNames.Contains(directoryInfo.Name))
            {
                return;
            }

            int count = Regex.Matches(directoryInfo.Name, findText, RegexOptions.None).Count;

            string directoryInfoFullName = directoryInfo.FullName;

            if (count > 0)
            {
                string newDirectoryName = directoryInfo.Name.Replace(findText, replaceText);

                string orginalDirectoryName = directoryInfo.Name;

                if (newDirectoryName.Equals(orginalDirectoryName, StringComparison.InvariantCultureIgnoreCase))
                {
                    string tempDirectoryName = $"temp_{orginalDirectoryName}_{Guid.NewGuid()}";

                    string tempFullDirectoryName = directoryInfo.FullName.ReplaceLastOccurrence(directoryInfo.Name, tempDirectoryName);

                    Directory.Move(directoryInfo.FullName, tempFullDirectoryName);

                    string newFullDirectoryName = directoryInfo.FullName.ReplaceLastOccurrence(directoryInfo.Name, newDirectoryName);

                    Directory.Move(tempFullDirectoryName, newFullDirectoryName);
                }
                else
                {
                    directoryInfoFullName = directoryInfo.FullName.ReplaceLastOccurrence(directoryInfo.Name, newDirectoryName);

                    Directory.Move(directoryInfo.FullName, directoryInfoFullName);
                }

                replaceInDirectoryNamesCount += count;
            }

            foreach (string directory in Directory.GetDirectories(directoryInfoFullName))
            {
                ReplaceInDirectoryNames(directory, findText, replaceText, deleteVsUserSettingsDirectory);
            }
        }
    }

    public static class StringExtensions
    {
        public static string ReplaceLastOccurrence(this string source, string findText, string replaceText)
        {
            int startIndex = source.LastIndexOf(findText, StringComparison.Ordinal);

            return source.Remove(startIndex, findText.Length).Insert(startIndex, replaceText);
        }
    }
}
