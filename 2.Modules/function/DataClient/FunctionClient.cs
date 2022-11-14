using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using function.Builder;
using function.Encapsulation;
using function.Entity;
using function.Extensions;

using Jering.Javascript.NodeJS;

using Microsoft.Extensions.Logging;

using Newtonsoft.Json;

using HandStack.Core.Extensions;
using HandStack.Web;
using HandStack.Web.Entity;
using HandStack.Web.Extensions;
using HandStack.Web.MessageContract.DataObject;
using HandStack.Web.MessageContract.Enumeration;
using HandStack.Web.MessageContract.Message;

namespace function.DataClient
{
    public class FunctionClient : IFunctionClient
    {
        // using (NodeScriptClient dynamicDataClient = new NodeScriptClient())
        // {
        //   DynamicRequest dynamicRequest = new DynamicRequest();
        //   DynamicResponse dynamicResponse = new DynamicResponse();
        //   List<DynamicObject> dynamicObjects = new List<DynamicObject>();
        // 
        //   DynamicObject dynamicObject = new DynamicObject();
        //   dynamicObject.QueryID = "DZAAA001L00"; // HELLOWORLDR01
        // 
        //   List<DynamicParameter> parameters = new List<DynamicParameter>();
        //   parameters.Add("#ApplicationID", 0);
        //   parameters.Add("@ApplicationID", 0);
        //   parameters.Add("@BusinessID", 0);
        //   parameters.Add("@CodeGroupID", "hello world");
        // 
        //   // dynamicObject.Parameters = parameters;
        //   dynamicObjects.Add(dynamicObject);
        // 
        //   dynamicRequest.DynamicObjects = dynamicObjects;
        // 
        //   var dynamicConnection = dynamicDataClient.ExecuteConsoleMap(dynamicRequest, dynamicResponse);
        //   if (string.IsNullOrEmpty(dynamicResponse.ExceptionText) == true)
        //   {
        //     string sql = dynamicConnection.Item1;
        //     var sqlParameters = dynamicConnection.Item2;
        //     List<Client> clients = dynamicDataClient.DbConnection.Query<Client>(sql, sqlParameters).AsList();
        // 
        //     return clients;
        //   }
        //	 var dynamicResult = dynamicDataClient.ExecuteConsoleMap("DZAAA001L00", parameters);
        //	 if (string.IsNullOrEmpty(dynamicResult.ExceptionText) == true)
        //	 {
        //	 	List<DomainClient> clients = dynamicDataClient.DbConnection.Query<DomainClient>(dynamicResult.ParseSQL, dynamicResult.DynamicParameters).AsList();
        //	 }
        // }

        private INodeJSService nodeJSService { get; }

        private FunctionLoggerClient functionLoggerClient { get; }

        private LoggerFactory loggerFactory { get; }

        private Serilog.ILogger logger { get; }

        public FunctionClient(INodeJSService nodeJSService, LoggerFactory loggerFactory, Serilog.ILogger logger, FunctionLoggerClient functionLoggerClient)
        {
            this.nodeJSService = nodeJSService;
            this.loggerFactory = loggerFactory;
            this.logger = logger;
            this.functionLoggerClient = functionLoggerClient;
        }

        public async Task ExecuteScriptMap(DynamicRequest request, DynamicResponse response)
        {
            Dictionary<string, TransactionScriptObjects> transactionDynamicObjects = new Dictionary<string, TransactionScriptObjects>();
            try
            {
                List<string> logQuerys = new List<string>();
                int i = 0;
                foreach (DynamicObject dynamicObject in request.DynamicObjects)
                {
                    ModuleScriptMap moduleScriptMap = FunctionMapper.GetScriptMap(dynamicObject.QueryID);
                    if (moduleScriptMap == null)
                    {
                        response.ExceptionText = $"QueryID - {dynamicObject.QueryID}에 대한 매핑 정보 필요";
                        return;
                    }

                    ModuleSourceMap dataSourceMap = FunctionMapper.GetDataSourceMap($"{moduleScriptMap.ApplicationID}|{moduleScriptMap.ProjectID}|{moduleScriptMap.DataSourceID}");

                    if (dataSourceMap == null)
                    {
                        response.ExceptionText = $"DataSourceID - {moduleScriptMap.DataSourceID}에 대한 데이터 원본 정보 필요";
                        return;
                    }

                    if (ModuleConfiguration.IsTransactionLogging == true || moduleScriptMap.TransactionLog == true)
                    {
                        if (logQuerys.Contains(dynamicObject.QueryID) == false)
                        {
                            logQuerys.Add(dynamicObject.QueryID);
                        }
                    }

                    transactionDynamicObjects.Add(string.Concat(dynamicObject.QueryID, "_", i.ToString()), new TransactionScriptObjects()
                    {
                        DynamicObject = dynamicObject,
                        ModuleScriptMap = moduleScriptMap,
                        DataSourceMap = dataSourceMap
                    });

                    i = i + 1;
                }

                if (logQuerys.Count > 0)
                {
                    if (ModuleConfiguration.IsTransactionLogging == true)
                    {
                        string responseData = $"QueryID: {string.Join(", ", logQuerys.ToArray())}";
                        functionLoggerClient.DynamicResponseLogging(request.GlobalID, "Y", GlobalConfiguration.SystemID, responseData, "NodeScriptClient/LogQuerys ReturnType: " + request.ReturnType.ToString(), (string error) =>
                        {
                            var transactionLogger = loggerFactory.CreateLogger("NodeScriptClient/LogQuerys");
                            transactionLogger.LogWarning($"Execute GlobalID: {request.GlobalID}, {responseData}");
                        });
                    }
                }

                // TCC (Try-Confirm/Cancel) 패턴 구현 처리
                if (request.IsTransaction == true)
                {
                }

                i = 0;
                DataRow? dataRow = null;
                DataTable additionalData = new DataTable();
                additionalData.Columns.Add("MSG_CD", typeof(string));
                additionalData.Columns.Add("MSG_TXT", typeof(string));
                List<string> mergeMetaDatas = new List<string>();
                List<object> mergeDatas = new List<object>();
                foreach (var transactionDynamicObject in transactionDynamicObjects)
                {
                    DynamicObject dynamicObject = transactionDynamicObject.Value.DynamicObject;
                    ModuleScriptMap moduleScriptMap = transactionDynamicObject.Value.ModuleScriptMap;
                    ModuleSourceMap dataSourceMap = transactionDynamicObject.Value.DataSourceMap;

                    List<DynamicParameter> dynamicParameters = new List<DynamicParameter>();
                    if (dynamicObject.Parameters.Count() > 0)
                    {
                        // 이전 실행 결과값으로 현재 요청 매개변수로 적용
                        if (dynamicObject.BaseFieldMappings != null && dynamicObject.BaseFieldMappings.Count() > 0)
                        {
                            if (dataRow == null)
                            {
                                response.ExceptionText = $"BaseFieldMappings - {dynamicObject.QueryID}에 대한 매핑 정보 필요";
                                return;
                            }

                            for (int baseFieldIndex = 0; baseFieldIndex < dynamicObject.BaseFieldMappings.Count; baseFieldIndex++)
                            {
                                BaseFieldMapping baseFieldMapping = dynamicObject.BaseFieldMappings[baseFieldIndex];

                                if (dataRow[baseFieldMapping.SourceFieldID] == null)
                                {
                                    response.ExceptionText = $"BaseFieldMappings - {dynamicObject.QueryID}에 대한 SourceFieldID {baseFieldMapping.SourceFieldID} 컬럼 정보 필요";
                                    return;
                                }

                                DynamicParameter? dynamicParameter = dynamicObject.Parameters.Where(p => p.ParameterName == baseFieldMapping.TargetFieldID).FirstOrDefault();
                                if (dynamicParameter == null)
                                {
                                    response.ExceptionText = $"BaseFieldMappings - {dynamicObject.QueryID}에 대한 TargetFieldID {baseFieldMapping.SourceFieldID} 컬럼 정보 필요";
                                    return;
                                }

                                dynamicParameter.Value = dataRow[baseFieldMapping.SourceFieldID];
                            }
                        }

                        List<ModuleParameterMap> moduleParameterMaps = moduleScriptMap.ModuleParameters;
                        foreach (ModuleParameterMap moduleParameterMap in moduleParameterMaps)
                        {
                            DynamicParameter? dynamicParameter = GetDbParameterMap(moduleParameterMap.Name, dynamicObject.Parameters);

                            if (dynamicParameter == null)
                            {
                                response.ExceptionText = $"ParameterMap - {moduleParameterMap.Name}에 대한 매핑 정보 필요";
                                return;
                            }

                            dynamicParameter.Value = dynamicParameter.Value == null && moduleParameterMap.DefaultValue != "NULL" ? moduleParameterMap.DefaultValue : dynamicParameter.Value;
                            dynamicParameter.DbType = string.IsNullOrEmpty(moduleParameterMap.DbType) == true ? dynamicParameter.DbType : moduleParameterMap.DbType;
                            dynamicParameter.Length = moduleParameterMap.Length <= 0 ? -1 : moduleParameterMap.Length;
                            dynamicParameters.Add(dynamicParameter);
                        }

                        DynamicParameter lastParameter = new DynamicParameter();
                        lastParameter.ParameterName = "GlobalID";
                        lastParameter.Value = request.GlobalID;
                        lastParameter.DbType = "String";
                        lastParameter.Length = -1;
                        dynamicParameters.Add(lastParameter);
                    }

                    string programPath = moduleScriptMap.ProgramPath;
                    if (File.Exists(programPath) == false)
                    {
                        response.ExceptionText = $"'{moduleScriptMap.DataSourceID}'에 대한 프로그램 경로 확인 필요";
                        return;
                    }

                    if (string.IsNullOrEmpty(moduleScriptMap.BeforeTransactionCommand) == false)
                    {
                        string logData = "";
                        if (ModuleConfiguration.IsTransactionLogging == true)
                        {
                            logData = $"programPath={programPath}, queryID={dynamicObject.QueryID}, BeforeTransactionCommand: {moduleScriptMap.BeforeTransactionCommand}, dynamicParameters={JsonConvert.SerializeObject(dynamicParameters)}";
                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                functionLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", GlobalConfiguration.SystemID, logData, $"NodeScriptClient/BeforeTransactionCommand", (string error) =>
                                {
                                    logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "NodeScriptClient/BeforeTransactionCommand");
                                });
                            }
                            else
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "NodeScriptClient/BeforeTransactionCommand", request.GlobalID);
                            }
                        }

                        var transactionCommands = moduleScriptMap.BeforeTransactionCommand.Split("|");
                        BusinessApiClient businessApiClient = new BusinessApiClient(logger);

                        List<ServiceParameter> serviceParameters = new List<ServiceParameter>();
                        serviceParameters.Add(new ServiceParameter() { prop = "ProgramPath", val = programPath });
                        string? beforeCommandResult = businessApiClient.OnewayTransactionCommand(transactionCommands, request.GlobalID, dynamicObject.QueryID, dynamicParameters, serviceParameters);
                        if (string.IsNullOrEmpty(beforeCommandResult) == false)
                        {
                            response.ExceptionText = $"ExecuteScriptMap.BeforeTransactionCommand Error: {beforeCommandResult}";

                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                functionLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, response.ExceptionText, $"NodeScriptClient/BeforeTransactionCommand: {logData}", (string error) =>
                                {
                                    logger.Error("[{LogCategory}] " + $"fallback error: {error}, {response.ExceptionText}, {logData}", "NodeScriptClient/BeforeTransactionCommand");
                                });
                            }
                            else
                            {
                                logger.Error("[{LogCategory}] [{GlobalID}] " + $"{response.ExceptionText}, {logData}", "NodeScriptClient/BeforeTransactionCommand", request.GlobalID);
                            }

                            return;
                        }
                    }

                    var dataContext = new DataContext()
                    {
                        accessToken = request.AccessToken,
                        loadOptions = request.LoadOptions,
                        globalID = request.GlobalID,
                        environment = request.Environment,
                        dataProvider = dataSourceMap.DataProvider.ToString(),
                        connectionString = dataSourceMap.ConnectionString,
                        workingDirectoryPath = dataSourceMap.WorkingDirectoryPath,
                        featureMeta = moduleScriptMap
                    };

                    string jsonArguments = JsonConvert.SerializeObject(dynamicParameters);

                    List<object> listParams = new List<object>();
                    listParams.Add(dynamicParameters);
                    listParams.Add(dataContext);
                    object[] arguments = listParams.ToArray();

                    string? executeResult = null;
                    if (moduleScriptMap.LanguageType == "Javascript")
                    {
                        try
                        {
                            if (ModuleConfiguration.IsTransactionLogging == true || moduleScriptMap.TransactionLog == true)
                            {
                                string responseData = $"ProgramPath: {programPath}, Arguments: {jsonArguments}";
                                functionLoggerClient.DynamicResponseLogging(request.GlobalID, "Y", GlobalConfiguration.SystemID, responseData, "NodeScriptClient/InvokeFromFileAsync ReturnType: " + request.ReturnType.ToString(), (string error) =>
                                {
                                    var transactionLogger = loggerFactory.CreateLogger("NodeScriptClient/InvokeFromFileAsync");
                                    transactionLogger.LogWarning($"Execute GlobalID: {request.GlobalID}, {responseData}");
                                });
                            }

                            if (moduleScriptMap.Timeout <= 0)
                            {
                                executeResult = await nodeJSService.InvokeFromFileAsync<string>(programPath, moduleScriptMap.ExportName, arguments);
                            }
                            else
                            {
                                var task = nodeJSService.InvokeFromFileAsync<string>(programPath, moduleScriptMap.ExportName, arguments);
                                int timeout = moduleScriptMap.Timeout * 1000;
                                if (task.Wait(timeout) == true)
                                {
                                    executeResult = task.Result;
                                }
                                else
                                {
                                    response.ExceptionText = $"TimeoutException - '{timeout.ToString()}' 실행 시간 초과";

                                    if (ModuleConfiguration.IsLogServer == true)
                                    {
                                        functionLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, response.ExceptionText, $"NodeScriptClient/InvokeFromFileAsync: dynamicParameters={JsonConvert.SerializeObject(arguments)}", (string error) =>
                                        {
                                            logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + response.ExceptionText, "NodeScriptClient/InvokeFromFileAsync");
                                        });
                                    }
                                    else
                                    {
                                        logger.Error("[{LogCategory}] [{GlobalID}] " + response.ExceptionText, "NodeScriptClient/InvokeFromFileAsync", request.GlobalID);
                                    }

                                    return;
                                }
                            }
                        }
                        catch (ConnectionException exception)
                        {
                            response.ExceptionText = $"GlobalID: {request.GlobalID}, QueryID: {dynamicObject.QueryID}, ConnectionException: '{exception.ToMessage()}'";
                        }
                        catch (InvocationException exception)
                        {
                            response.ExceptionText = $"GlobalID: {request.GlobalID}, QueryID: {dynamicObject.QueryID}, InvocationException: '{exception.ToMessage()}'";
                        }
                        catch (ObjectDisposedException exception)
                        {
                            response.ExceptionText = $"GlobalID: {request.GlobalID}, QueryID: {dynamicObject.QueryID}, ObjectDisposedException: '{exception.ToMessage()}'";
                        }
                        catch (OperationCanceledException exception)
                        {
                            response.ExceptionText = $"GlobalID: {request.GlobalID}, QueryID: {dynamicObject.QueryID}, OperationCanceledException: '{exception.ToMessage()}'";
                        }
                        catch (Exception exception)
                        {
                            response.ExceptionText = $"GlobalID: {request.GlobalID}, QueryID: {dynamicObject.QueryID}, Exception: '{exception.ToMessage()}'";
                        }
                    }
                    else if (moduleScriptMap.LanguageType == "CSharp")
                    {
                        try
                        {
                            var runner = Runner.Instance;
                            var result = runner.ExecuteDynamicFile(programPath, dynamicObject.QueryID, "DynamicRun.Sources.Simple", "Method2", arguments);
                            executeResult = JsonConvert.SerializeObject(result);
                        }
                        catch (Exception exception)
                        {
                            response.ExceptionText = $"GlobalID: {request.GlobalID}, QueryID: {dynamicObject.QueryID}, Exception: '{exception.ToMessage()}'";
                        }
                    }
                    else
                    {
                        response.ExceptionText = $"GlobalID: {request.GlobalID}, QueryID: {dynamicObject.QueryID}, LanguageType 확인 필요: {moduleScriptMap.LanguageType}";
                    }

                    if (string.IsNullOrEmpty(response.ExceptionText) == false)
                    {
                        if (string.IsNullOrEmpty(moduleScriptMap.FallbackTransactionCommand) == false)
                        {
                            string logData = $"GlobalID={request.GlobalID}, QueryID={dynamicObject.QueryID}, FallbackTransactionCommand: {moduleScriptMap.FallbackTransactionCommand}, dynamicParameters={JsonConvert.SerializeObject(dynamicParameters)}";
                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                functionLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", GlobalConfiguration.SystemID, logData, "NodeScriptClient/FallbackTransactionCommand", (string error) =>
                                {
                                    logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "NodeScriptClient/FallbackTransactionCommand");
                                });
                            }
                            else
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "NodeScriptClient/FallbackTransactionCommand", request.GlobalID);
                            }

                            var transactionCommands = moduleScriptMap.FallbackTransactionCommand.Split("|");
                            BusinessApiClient businessApiClient = new BusinessApiClient(logger);
                            string? fallbackCommandResult = businessApiClient.OnewayTransactionCommandAsync(transactionCommands, request.GlobalID, dynamicObject.QueryID, dynamicParameters);
                            if (string.IsNullOrEmpty(fallbackCommandResult) == false)
                            {
                                response.ExceptionText = response.ExceptionText + $", ExecuteScriptMap.FallbackTransactionCommand Error: GlobalID={request.GlobalID}, QueryID={dynamicObject.QueryID}, CommandID={moduleScriptMap.FallbackTransactionCommand}, CommandResult={fallbackCommandResult}";

                                if (ModuleConfiguration.IsLogServer == true)
                                {
                                    functionLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, $"{response.ExceptionText}, {logData}", $"NodeScriptClient/FallbackTransactionCommand", (string error) =>
                                    {
                                        logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + $"{response.ExceptionText}, {logData}", "NodeScriptClient/FallbackTransactionCommand");
                                    });
                                }
                                else
                                {
                                    logger.Error("[{LogCategory}] [{GlobalID}] " + $"{response.ExceptionText}, {logData}", "NodeScriptClient/FallbackTransactionCommand", request.GlobalID);
                                }
                            }
                        }

                        return;
                    }

                    if (string.IsNullOrEmpty(moduleScriptMap.AfterTransactionCommand) == false)
                    {
                        string logData = $"executeResult: {executeResult}, AfterTransactionCommand: {moduleScriptMap.AfterTransactionCommand}, dynamicParameters={JsonConvert.SerializeObject(dynamicParameters)}";
                        if (ModuleConfiguration.IsLogServer == true)
                        {
                            functionLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", GlobalConfiguration.SystemID, logData, $"NodeScriptClient/AfterTransactionCommand", (string error) =>
                            {
                                logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "NodeScriptClient/AfterTransactionCommand");
                            });
                        }
                        else
                        {
                            logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "NodeScriptClient/AfterTransactionCommand", request.GlobalID);
                        }

                        var transactionCommands = moduleScriptMap.AfterTransactionCommand.Split("|");
                        BusinessApiClient businessApiClient = new BusinessApiClient(logger);
                        List<ServiceParameter> serviceParameters = new List<ServiceParameter>();
                        serviceParameters.Add(new ServiceParameter() { prop = "CommandResult", val = executeResult });
                        string? afterCommandResult = businessApiClient.OnewayTransactionCommandAsync(transactionCommands, request.GlobalID, dynamicObject.QueryID, dynamicParameters, serviceParameters);
                        if (string.IsNullOrEmpty(afterCommandResult) == false)
                        {
                            response.ExceptionText = $"ExecuteScriptMap.AfterTransactionCommand Error: {afterCommandResult}";

                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                functionLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, $"{response.ExceptionText}, {logData}", $"NodeScriptClient/AfterTransactionCommand", (string error) =>
                                {
                                    logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + $"{response.ExceptionText}, {logData}", "NodeScriptClient/AfterTransactionCommand");
                                });
                            }
                            else
                            {
                                logger.Error("[{LogCategory}] [{GlobalID}] " + $"{response.ExceptionText}, {logData}", "NodeScriptClient/AfterTransactionCommand", request.GlobalID);
                            }

                            return;
                        }
                    }

                    if (dynamicObject.IgnoreResult == true)
                    {
                        if (executeResult != null && executeResult.Length > 0)
                        {
                            using (DataSet? ds = JsonConvert.DeserializeObject<DataSet>(executeResult))
                            {
                                if (ds != null && ds.Tables.Count > 0)
                                {
                                    using (DataTable dataTable = ds.Tables[0])
                                    {
                                        if (dataTable.Rows.Count > 0)
                                        {
                                            dataRow = dataTable.Rows[0];
                                        }
                                        else
                                        {
                                            dataRow = null;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        if (executeResult != null && executeResult.Length > 0)
                        {
                            if (request.ReturnType == ExecuteDynamicTypeObject.DynamicJson)
                            {
                                response.ResultJson = executeResult;
                            }
                            else
                            {
                                using (DataSet? ds = JsonConvert.DeserializeObject<DataSet>(executeResult))
                                {
                                    if (ds != null)
                                    {
                                        JsonObjectType jsonObjectType = JsonObjectType.FormJson;

                                        for (int j = 0; j < ds.Tables.Count; j++)
                                        {
                                            DataTable table = ds.Tables[j];

                                            if (dynamicObject.JsonObjects == null || dynamicObject.JsonObjects.Count == 0)
                                            {
                                                jsonObjectType = dynamicObject.JsonObject;
                                            }
                                            else
                                            {
                                                try
                                                {
                                                    jsonObjectType = dynamicObject.JsonObjects[i];
                                                }
                                                catch
                                                {
                                                    jsonObjectType = dynamicObject.JsonObject;
                                                }
                                            }

                                            StringBuilder sb = new StringBuilder(256);
                                            for (int k = 0; k < table.Columns.Count; k++)
                                            {
                                                var column = table.Columns[k];
                                                sb.Append($"{column.ColumnName}:{JsonExtensions.toMetaDataType(column.DataType.Name)};");
                                            }

                                            switch (jsonObjectType)
                                            {
                                                case JsonObjectType.FormJson:
                                                    mergeMetaDatas.Add(sb.ToString());
                                                    mergeDatas.Add(FormJson.ToJsonObject("FormData" + i.ToString(), table));
                                                    break;
                                                case JsonObjectType.jqGridJson:
                                                    mergeMetaDatas.Add(sb.ToString());
                                                    mergeDatas.Add(jqGridJson.ToJsonObject("jqGridData" + i.ToString(), table));
                                                    break;
                                                case JsonObjectType.GridJson:
                                                    mergeMetaDatas.Add(sb.ToString());
                                                    mergeDatas.Add(GridJson.ToJsonObject("GridData" + i.ToString(), table));
                                                    break;
                                                case JsonObjectType.ChartJson:
                                                    mergeMetaDatas.Add(sb.ToString());
                                                    mergeDatas.Add(ChartGridJson.ToJsonObject("ChartData" + i.ToString(), table));
                                                    break;
                                                case JsonObjectType.DataSetJson:
                                                    mergeMetaDatas.Add(sb.ToString());
                                                    mergeDatas.Add(DataTableJson.ToJsonObject("DataSetData" + i.ToString(), table));
                                                    break;
                                                case JsonObjectType.AdditionJson:
                                                    additionalData.Merge(table);
                                                    break;
                                            }

                                            if (table.Rows.Count > 0)
                                            {
                                                dataRow = table.Rows[0];
                                            }
                                            else
                                            {
                                                dataRow = null;
                                            }

                                            i++;
                                        }
                                    }
                                }

                                if (additionalData.Rows.Count > 0)
                                {
                                    mergeDatas.Add(GridJson.ToJsonObject("AdditionalData", additionalData));
                                }

                                response.ResultMeta = mergeMetaDatas;
                                response.ResultJson = mergeDatas;
                            }
                        }
                    }

                    // TCC (Try-Confirm/Cancel) 패턴 구현 처리
                    if (request.IsTransaction == true)
                    {
                    }

                    response.Acknowledge = AcknowledgeType.Success;
                }
            }
            catch (Exception exception)
            {
                // TCC (Try-Confirm/Cancel) 패턴 구현 처리
                if (request.IsTransaction == true)
                {
                    foreach (var transactionDynamicObject in transactionDynamicObjects)
                    {
                    }
                }

                response.ExceptionText = exception.ToMessage();

                if (ModuleConfiguration.IsLogServer == true)
                {
                    functionLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, response.ExceptionText, "NodeScriptClient/ExecuteScriptMap", (string error) =>
                    {
                        logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + response.ExceptionText, "NodeScriptClient/ExecuteScriptMap");
                    });
                }
                else
                {
                    logger.Error("[{LogCategory}] [{GlobalID}] " + response.ExceptionText, "NodeScriptClient/ExecuteScriptMap", request.GlobalID);
                }
            }
            finally
            {
                foreach (var transactionDynamicObject in transactionDynamicObjects)
                {
                }
            }
        }

        private DynamicParameter? GetDbParameterMap(string parameterName, List<DynamicParameter> dynamicParameters)
        {
            DynamicParameter? result = null;

            var maps = from p in dynamicParameters
                       where p.ParameterName == parameterName.Replace("@", "").Replace(":", "")
                       select p;

            if (maps.Count() > 0)
            {
                foreach (var item in maps)
                {
                    result = item;
                    break;
                }
            }

            return result;
        }

        public void Dispose()
        {
        }
    }
}
