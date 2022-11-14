using System;
using System.Collections.Generic;
using System.Data;
using System.IO;

using HandStack.Logger;
using HandStack.Logger.Logging.Handlers;

namespace file_delete
{
    internal class Program
    {
        static List<string> deleteFiles = new List<string>();

        static void Main(string[] args)
        {
            TraceLogger.LoggerHandlerManager
                .AddHandler(new ConsoleLoggerHandler())
                .AddHandler(new FileLoggerHandler())
                .AddHandler(new DebugConsoleLoggerHandler());

            TraceLogger.Log("file_delete start");

            using (DataSet targetFolders = new DataSet())
            {
                try
                {
                    string configFilePath = Path.Combine(AppContext.BaseDirectory, "target-directory.xml");
                    if (File.Exists(configFilePath) == true)
                    {
                        targetFolders.ReadXml(configFilePath);

                        foreach (DataRow item in targetFolders.Tables[0].Rows)
                        {
                            object dataDeletePath = item["DeletePath"];
                            object dataRemoveSeconds = item["RemoveSeconds"];
                            if (dataDeletePath != null)
                            {
                                int removeSeconds = 0;
                                int.TryParse(dataRemoveSeconds.ToString(), out removeSeconds);
                                GetDeleteFileList(dataDeletePath.ToString(), DateTime.Now.AddSeconds(removeSeconds));

                                for (int i = 0; i < deleteFiles.Count; i++)
                                {
                                    string deleteFile = deleteFiles[i];
                                    FileInfo fileInfo = new FileInfo(deleteFile);

                                    string message = $"deleteFile: {deleteFile}, CreationTime: {fileInfo.CreationTime}, LastWriteTime: {fileInfo.LastWriteTime}";
                                    try
                                    {
                                        TraceLogger.Log(Level.Info, message);
                                        fileInfo.Delete();
                                    }
                                    catch (Exception exception)
                                    {
                                        TraceLogger.Log(exception, Level.Error, message);
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        TraceLogger.Log(Level.Warning, $"configFilePath 경로 확인 필요: {configFilePath}");
                        Environment.Exit(-1);
                    }
                }
                catch (Exception exception)
                {
                    TraceLogger.Log(exception, Level.Error, "파일 삭제 오류");
                    Environment.Exit(-1);
                }
            }

            Environment.Exit(0);
        }

        static void GetDeleteFileList(string? deleteFilePath, DateTime removeSeconds)
        {
            try
            {
                deleteFiles.Clear();
                if (string.IsNullOrEmpty(deleteFilePath) == false)
                {
                    if (Directory.Exists(deleteFilePath) == true)
                    {
                        foreach (string file in Directory.GetFiles(deleteFilePath))
                        {
                            FileInfo fileInfo = new FileInfo(file);

                            if (fileInfo.CreationTime <= removeSeconds)
                            {
                                deleteFiles.Add(fileInfo.FullName);
                            }
                        }
                    }
                    else
                    {
                        TraceLogger.Log(Level.Warning, $"deleteFilePath 경로 확인 필요: {deleteFilePath}");
                    }
                }
            }
            catch (Exception exception)
            {
                TraceLogger.Log(exception, Level.Error, "GetDeleteFileList 오류");
                throw;
            }
        }
    }
}
