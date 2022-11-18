using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;

using function.Entity;

using HandStack.Core.ExtensionMethod;
using HandStack.Core.Extensions;
using HandStack.Core.Helpers;
using HandStack.Data;
using HandStack.Web;
using HandStack.Web.MessageContract.DataObject;

using Microsoft.Extensions.Configuration;

using Serilog;

namespace function.Extensions
{
    public static class FunctionMapper
    {
        public static Dictionary<string, ModuleSourceMap> FunctionSourceMappings = new Dictionary<string, ModuleSourceMap>();
        public static Dictionary<string, ModuleScriptMap> ScriptMappings = new Dictionary<string, ModuleScriptMap>();

        static FunctionMapper()
        {
        }

        public static ModuleSourceMap GetDataSourceMap(string dataSourceID)
        {
            ModuleSourceMap result = new ModuleSourceMap();
            if (FunctionSourceMappings != null)
            {
                result = FunctionSourceMappings.FirstOrDefault(item => item.Key == dataSourceID).Value;
            }

            return result;
        }

        public static ModuleScriptMap GetScriptMap(string queryID)
        {
            ModuleScriptMap result = new ModuleScriptMap();
            if (ScriptMappings != null)
            {
                result = ScriptMappings.FirstOrDefault(item => item.Key == queryID).Value;
            }

            return result;
        }

        public static bool Remove(string projectID, string businessID, string transactionID, string scriptID)
        {
            bool result = false;
            lock (ScriptMappings)
            {
                string queryID = string.Concat(
                    projectID, "|",
                    businessID, "|",
                    transactionID, "|",
                    scriptID
                );

                if (ScriptMappings.ContainsKey(queryID) == true)
                {
                    result = ScriptMappings.Remove(queryID);
                }
            }

            return result;
        }

        public static bool HasScript(string projectID, string businessID, string transactionID, string scriptID)
        {
            bool result = false;
            string queryID = string.Concat(
                projectID, "|",
                businessID, "|",
                transactionID, "|",
                scriptID
            );

            result = ScriptMappings.ContainsKey(queryID);

            return result;
        }

        public static bool AddScriptMap(string scriptMapFile, bool forceUpdate, ILogger logger)
        {
            bool result = false;
            scriptMapFile = Path.Combine(ModuleConfiguration.ContractBasePath, scriptMapFile);

            if (File.Exists(scriptMapFile) == true)
            {
                try
                {
                    string functionScriptFile = scriptMapFile.Replace("featureMeta.json", "featureMain.js");
                    if (File.Exists(functionScriptFile) == true)
                    {
                        FunctionScriptContract? functionScriptContract = FunctionScriptContract.FromJson(File.ReadAllText(scriptMapFile));
                        if (functionScriptContract != null)
                        {
                            FunctionHeader header = functionScriptContract.Header;
                            var items = functionScriptContract.Commands;
                            foreach (var item in items)
                            {
                                if (header.Use == true)
                                {
                                    ModuleScriptMap moduleScriptMap = new ModuleScriptMap();
                                    moduleScriptMap.ApplicationID = header.ApplicationID;
                                    moduleScriptMap.ProjectID = header.ProjectID;
                                    moduleScriptMap.TransactionID = header.TransactionID;
                                    moduleScriptMap.ScriptID = item.ID + item.Seq.ToString().PadLeft(2, '0');
                                    moduleScriptMap.ExportName = item.ID;
                                    moduleScriptMap.Seq = item.Seq;
                                    moduleScriptMap.DataSourceID = header.DataSourceID;
                                    moduleScriptMap.LanguageType = header.LanguageType;
                                    moduleScriptMap.ProgramPath = functionScriptFile;
                                    moduleScriptMap.Timeout = item.Timeout;
                                    moduleScriptMap.BeforeTransactionCommand = item.BeforeTransaction;
                                    moduleScriptMap.AfterTransactionCommand = item.AfterTransaction;
                                    moduleScriptMap.FallbackTransactionCommand = item.FallbackTransaction;
                                    moduleScriptMap.Description = item.Description;

                                    moduleScriptMap.ModuleParameters = new List<ModuleParameterMap>();
                                    List<FunctionParam> functionParams = item.Params;
                                    if (functionParams != null && functionParams.Count > 0)
                                    {
                                        foreach (FunctionParam functionParam in functionParams)
                                        {
                                            moduleScriptMap.ModuleParameters.Add(new ModuleParameterMap()
                                            {
                                                Name = functionParam.ID,
                                                DbType = functionParam.Type,
                                                Length = functionParam.Length,
                                                DefaultValue = functionParam.Value,
                                            });
                                        }
                                    }

                                    string queryID = string.Concat(
                                        moduleScriptMap.ApplicationID, "|",
                                        moduleScriptMap.ProjectID, "|",
                                        moduleScriptMap.TransactionID, "|",
                                        moduleScriptMap.ScriptID
                                    );

                                    lock (ScriptMappings)
                                    {
                                        if (ScriptMappings.ContainsKey(queryID) == false)
                                        {
                                            ScriptMappings.Add(queryID, moduleScriptMap);
                                        }
                                        else
                                        {
                                            if (forceUpdate == true)
                                            {
                                                ScriptMappings.Remove(queryID);
                                                ScriptMappings.Add(queryID, moduleScriptMap);
                                            }
                                            else
                                            {
                                                logger.Warning("[{LogCategory}] " + $"ScriptMap 정보 중복 오류 - {scriptMapFile}, ApplicationID - {moduleScriptMap.ApplicationID}, ProjectID - {moduleScriptMap.ProjectID}, TransactionID - {moduleScriptMap.TransactionID}, ScriptID - {moduleScriptMap.ScriptID}", "FunctionMapper/AddScriptMap");
                                            }

                                        }
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        logger.Error("[{LogCategory}] " + $"functionFilePath 파일 없음 - " + functionScriptFile, "FunctionMapper/AddScriptMap");
                    }
                }
                catch (Exception exception)
                {
                    logger.Error("[{LogCategory}] " + $"{scriptMapFile} 업무 계약 파일 오류 - {exception.ToMessage()}", "FunctionMapper/AddScriptMap");
                }
                result = true;
            }

            return result;
        }

        public static void LoadContract(string environmentName, ILogger logger, IConfiguration configuration)
        {
            try
            {
                if (string.IsNullOrEmpty(ModuleConfiguration.ContractBasePath) == true || Directory.Exists(ModuleConfiguration.ContractBasePath) == false)
                {
                    if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows) == true)
                    {
                        ModuleConfiguration.ContractBasePath = Path.Combine(GlobalConfiguration.ContentRootPath, @"BusinessContract\Contracts");
                    }
                    else
                    {
                        ModuleConfiguration.ContractBasePath = Path.Combine(GlobalConfiguration.ContentRootPath, @"BusinessContract/Contracts");
                    }
                }

                logger.Information("[{LogCategory}] NodeScriptMapBasePath: " + ModuleConfiguration.ContractBasePath, "FunctionMapper/LoadContract");

                foreach (var item in ModuleConfiguration.FunctionSource)
                {
                    string projectIDText = item.ProjectID;
                    string[] projectIDList = projectIDText.Split(",");

                    for (int i = 0; i < projectIDList.Length; i++)
                    {
                        string projectID = projectIDList[i].Trim();
                        if (string.IsNullOrEmpty(projectID) == true)
                        {
                            continue;
                        }

                        string dataSourceID = $"{item.ApplicationID}|{projectID}|{item.DataSourceID}";

                        if (FunctionSourceMappings.ContainsKey(dataSourceID) == false)
                        {
                            var dataProvider = (DataProviders)Enum.Parse(typeof(DataProviders), item.DataProvider);
                            var connectionString = item.ConnectionString;

                            if (item.IsEncryption.ParseBool() == true)
                            {
                                connectionString = SynCryptoHelper.Decrypt(connectionString);
                            }

                            if (dataProvider == DataProviders.SQLite)
                            {
                                if (connectionString.IndexOf("#{ContentRootPath}") > -1)
                                {
                                    connectionString = connectionString.Replace("#{ContentRootPath}", GlobalConfiguration.ContentRootPath);
                                }
                            }

                            FunctionSourceMappings.Add(dataSourceID, new ModuleSourceMap()
                            {
                                DataSourceID = item.DataSourceID,
                                DataProvider = dataProvider,
                                ConnectionString = connectionString,
                                WorkingDirectoryPath = item.WorkingDirectoryPath
                            });
                        }
                    }
                }

                string[] scriptMapFiles = Directory.GetFiles(ModuleConfiguration.ContractBasePath, "featureMeta.json", SearchOption.AllDirectories);

                foreach (string scriptMapFile in scriptMapFiles)
                {
                    string functionScriptFile;
                    try
                    {
                        if (File.Exists(scriptMapFile) == false)
                        {
                            logger.Error("[{LogCategory}] " + $"{scriptMapFile} 대응 functionFilePath 파일 없음", "FunctionMapper/LoadContract");
                            continue;
                        }

                        FunctionScriptContract? functionScriptContract = FunctionScriptContract.FromJson(File.ReadAllText(scriptMapFile));

                        if (functionScriptContract == null)
                        {
                            logger.Error("[{LogCategory}] " + $"{scriptMapFile} 대응 functionFilePath 파일 없음", "FunctionMapper/LoadContract");
                            continue;
                        }

                        string? fileExtension = null;
                        switch (functionScriptContract.Header.LanguageType)
                        {
                            case "Javascript":
                                fileExtension = "js";
                                break;
                            case "CSharp":
                                fileExtension = "cs";
                                break;
                        }

                        if (string.IsNullOrEmpty(fileExtension) == true)
                        {
                            logger.Error("[{LogCategory}] " + $"{functionScriptContract.Header.LanguageType} 언어 타입 확인 필요", "FunctionMapper/LoadContract");
                            continue;
                        }

                        functionScriptFile = scriptMapFile.Replace("featureMeta.json", $"featureMain.{fileExtension}");
                        if (File.Exists(functionScriptFile) == true)
                        {
                            FunctionHeader header = functionScriptContract.Header;
                            var items = functionScriptContract.Commands;
                            foreach (var item in items)
                            {
                                if (header.Use == true)
                                {
                                    ModuleScriptMap moduleScriptMap = new ModuleScriptMap();
                                    moduleScriptMap.ApplicationID = header.ApplicationID;
                                    moduleScriptMap.ProjectID = header.ProjectID;
                                    moduleScriptMap.TransactionID = header.TransactionID;
                                    moduleScriptMap.ScriptID = item.ID + item.Seq.ToString().PadLeft(2, '0');
                                    moduleScriptMap.ExportName = item.ID;
                                    moduleScriptMap.Seq = item.Seq;
                                    moduleScriptMap.DataSourceID = header.DataSourceID;
                                    moduleScriptMap.LanguageType = header.LanguageType;
                                    moduleScriptMap.ProgramPath = functionScriptFile;
                                    moduleScriptMap.Timeout = item.Timeout;
                                    moduleScriptMap.BeforeTransactionCommand = item.BeforeTransaction;
                                    moduleScriptMap.AfterTransactionCommand = item.AfterTransaction;
                                    moduleScriptMap.FallbackTransactionCommand = item.FallbackTransaction;
                                    moduleScriptMap.Description = item.Description;

                                    moduleScriptMap.ModuleParameters = new List<ModuleParameterMap>();
                                    List<FunctionParam> functionParams = item.Params;
                                    if (functionParams != null && functionParams.Count > 0)
                                    {
                                        foreach (FunctionParam functionParam in functionParams)
                                        {
                                            moduleScriptMap.ModuleParameters.Add(new ModuleParameterMap()
                                            {
                                                Name = functionParam.ID,
                                                DbType = functionParam.Type,
                                                Length = functionParam.Length,
                                                DefaultValue = functionParam.Value,
                                            });
                                        }
                                    }

                                    string queryID = string.Concat(
                                        moduleScriptMap.ApplicationID, "|",
                                        moduleScriptMap.ProjectID, "|",
                                        moduleScriptMap.TransactionID, "|",
                                        moduleScriptMap.ScriptID
                                    );

                                    lock (ScriptMappings)
                                    {
                                        if (ScriptMappings.ContainsKey(queryID) == false)
                                        {
                                            ScriptMappings.Add(queryID, moduleScriptMap);
                                        }
                                        else
                                        {
                                            logger.Warning("[{LogCategory}] " + $"ScriptMap 정보 중복 오류 - {scriptMapFile}, ApplicationID - {moduleScriptMap.ApplicationID}, ProjectID - {moduleScriptMap.ProjectID}, TransactionID - {moduleScriptMap.TransactionID}, ScriptID - {moduleScriptMap.ScriptID}", "FunctionMapper/LoadContract");
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            logger.Error("[{LogCategory}] " + $"{scriptMapFile} 대응 functionFilePath 파일 없음", "FunctionMapper/LoadContract");
                        }
                    }
                    catch (Exception exception)
                    {
                        logger.Error("[{LogCategory}] " + $"{scriptMapFile} 업무 계약 파일 오류 - {exception.ToMessage()}", "FunctionMapper/LoadContract");
                    }
                }
            }
            catch (Exception exception)
            {
                logger.Error("[{LogCategory}] " + $"LoadContract 오류 - {exception.ToMessage()}", "FunctionMapper/LoadContract");
            }
        }
    }
}
