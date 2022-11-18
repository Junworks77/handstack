using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;

using HandStack.Core.Extensions;
using HandStack.Web;
using HandStack.Web.MessageContract.DataObject;

using Microsoft.Extensions.Configuration;

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

using Serilog;

namespace transact.Extensions
{
    public class TransactionMapper
    {
        private static Dictionary<string, BusinessContract> businessContracts = new Dictionary<string, BusinessContract>();

        public static Dictionary<string, BusinessContract> GetBusinessContracts()
        {
            return businessContracts;
        }

        public static BusinessContract? Get(string applicationID, string projectID, string transactionID)
        {
            BusinessContract? result = null;
            lock (businessContracts)
            {
                var findContracts = from item in businessContracts.Values
                                    where item.ApplicationID == applicationID && item.ProjectID == projectID && item.TransactionID == transactionID
                                    select item;

                if (findContracts.Count() == 1)
                {
                    result = findContracts.ToList()[0];
                }
            }

            return result;
        }

        public static bool Add(string filePath)
        {
            bool result = false;
            lock (businessContracts)
            {
                try
                {
                    filePath = Path.Combine(ModuleConfiguration.ContractBasePath, filePath);
                    if (File.Exists(filePath) == true)
                    {
                        BusinessContract? businessContract = BusinessContract.FromJson(File.ReadAllText(filePath));
                        if (businessContract != null && businessContracts.ContainsKey(filePath) == false)
                        {
                            businessContracts.Add(filePath, businessContract);
                            result = true;
                        }
                    }
                    else
                    {
                        result = false;
                    }
                }
                catch (Exception exception)
                {
                    Log.Logger.Error("[{LogCategory}] " + $"{filePath} 업무 계약 파일 오류 - {exception.ToMessage()}", "TransactionMapper/Add");
                    result = false;
                }
            }

            return result;
        }

        public static bool Add(string key, BusinessContract businessContract)
        {
            bool result = false;
            lock (businessContracts)
            {
                try
                {
                    if (businessContract != null && businessContracts.ContainsKey(key) == false)
                    {
                        businessContracts.Add(key, businessContract);
                        result = true;
                    }
                    else
                    {
                        result = false;
                    }
                }
                catch (Exception exception)
                {
                    Log.Logger.Error("[{LogCategory}] " + $"{key} 업무 계약 추가 오류 - {exception.ToMessage()}", "TransactionMapper/Add");
                    result = false;
                }
            }

            return result;
        }

        public static bool Remove(string filePath)
        {
            bool result = false;
            lock (businessContracts)
            {
                try
                {
                    filePath = Path.Combine(ModuleConfiguration.ContractBasePath, filePath);
                    if (File.Exists(filePath) == true)
                    {
                        if (businessContracts.ContainsKey(filePath) == true)
                        {
                            businessContracts.Remove(filePath);
                            result = true;
                        }
                    }
                    else
                    {
                        result = false;
                    }
                }
                catch (Exception exception)
                {
                    Log.Logger.Error("[{LogCategory}] " + $"{filePath} 업무 계약 파일 오류 - {exception.ToMessage()}", "TransactionMapper/Remove");
                    result = false;
                }
            }

            return result;
        }

        public static int HasCount(string applicationID, string projectID, string transactionID)
        {
            int result = 0;
            lock (businessContracts)
            {
                var findContracts = from item in businessContracts.Values
                                    where item.ApplicationID == applicationID && item.ProjectID == projectID && item.TransactionID == transactionID
                                    select item;

                result = findContracts.Count();
            }

            return result;
        }

        public static void LoadContract(string environmentName, ILogger logger, IConfiguration configuration)
        {
            try
            {
                if (string.IsNullOrEmpty(ModuleConfiguration.ContractBasePath) == true)
                {
                    ModuleConfiguration.ContractBasePath = Path.Combine(GlobalConfiguration.ContentRootPath, "Contracts");
                }

                if (Directory.Exists(ModuleConfiguration.ContractBasePath) == false)
                {
                    Directory.CreateDirectory(ModuleConfiguration.ContractBasePath);
                }

                string[] configFiles = Directory.GetFiles(ModuleConfiguration.ContractBasePath, "*.json", SearchOption.AllDirectories);
                lock (businessContracts)
                {
                    businessContracts.Clear();
                    foreach (string configFile in configFiles)
                    {
                        try
                        {
                            string configData = File.ReadAllText(configFile);
                            FileInfo fileInfo = new FileInfo(configFile);
                            BusinessContract? businessContract = BusinessContract.FromJson(configData);
                            if (businessContract == null)
                            {
                                logger.Error("[{LogCategory}] " + $"업무 계약 파일 역직렬화 오류 - {configFile}", "LoadContract");
                            }
                            else
                            {
                                if (businessContracts.ContainsKey(configFile) == false && HasCount(businessContract.ApplicationID, businessContract.ProjectID, businessContract.TransactionID) == 0)
                                {
                                    businessContracts.Add(configFile, businessContract);
                                }
                                else
                                {
                                    logger.Warning("[{LogCategory}] " + $"업무 계약 파일 또는 거래 정보 중복 오류 - {configFile}, ProjectID - {businessContract.ApplicationID}, BusinessID - {businessContract.ProjectID}, TransactionID - {businessContract.TransactionID}", "LoadContract");
                                }
                            }
                        }
                        catch (Exception exception)
                        {
                            logger.Error("[{LogCategory}] " + $"업무 계약 파일 역직렬화 오류 - {configFile}, {exception.ToMessage()}", "LoadContract");
                        }
                    }
                }
            }
            catch (Exception exception)
            {
                logger.Error("[{LogCategory}] " + $"LoadContract 오류 - {exception.ToMessage()}", "LoadContract");
            }
        }
    }

    public static class Serialize
    {
        public static string ToJson(this List<Entity.Transaction> self) => JsonConvert.SerializeObject(self, Converter.Settings);
    }

    internal static class Converter
    {
        public static readonly JsonSerializerSettings Settings = new JsonSerializerSettings
        {
            MetadataPropertyHandling = MetadataPropertyHandling.Ignore,
            DateParseHandling = DateParseHandling.None,
            Converters = {
                new IsoDateTimeConverter { DateTimeStyles = DateTimeStyles.AssumeUniversal }
            },
        };
    }
}
