using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

using function.Encapsulation;
using function.Extensions;

using HandStack.Core.Extensions;
using HandStack.Web;
using HandStack.Web.MessageContract.Enumeration;
using HandStack.Web.MessageContract.Message;

using MediatR;

using Microsoft.Extensions.Logging;

using Newtonsoft.Json;

namespace function.Events
{
    public class FunctionRequestHandler : IRequestHandler<FunctionRequest, object?>
    {
        private FunctionLoggerClient functionLoggerClient { get; }
        private LoggerFactory loggerFactory { get; }
        private Serilog.ILogger logger { get; }
        private IFunctionClient functionClient { get; }

        public FunctionRequestHandler(LoggerFactory loggerFactory, Serilog.ILogger logger, IFunctionClient nodeFunctionClient, FunctionLoggerClient functionLoggerClient)
        {
            this.loggerFactory = loggerFactory;
            this.logger = logger;
            this.functionLoggerClient = functionLoggerClient;
            this.functionClient = nodeFunctionClient;
        }

        public async Task<object?> Handle(FunctionRequest requestQueryData, CancellationToken cancellationToken)
        {
            DynamicRequest? request = requestQueryData.Request as DynamicRequest;
            DynamicResponse? response = new DynamicResponse();
            response.Acknowledge = AcknowledgeType.Failure;

            await Task.Run(() =>
            {
                if (request == null)
                {
                    response.ExceptionText = "빈 요청. 요청 정보 확인 필요";
                }
            });

            if (request == null)
            {
                return response;
            }

            response.CorrelationID = request.GlobalID;
            if (string.IsNullOrEmpty(request.RequestID) == true)
            {
                request.RequestID = $"SELF_{GlobalConfiguration.SystemID}{GlobalConfiguration.HostName}{GlobalConfiguration.RunningEnvironment}{DateTime.Now.ToString("yyyyMMddhhmmssfff")}";
            }

            if (string.IsNullOrEmpty(request.GlobalID) == true)
            {
                request.GlobalID = request.RequestID;
            }

            try
            {
                if (ModuleConfiguration.IsTransactionLogging == true)
                {
                    functionLoggerClient.DynamicRequestLogging(request, "Y", GlobalConfiguration.SystemID, (string error) =>
                    {
                        var transactionLogger = loggerFactory.CreateLogger("Query/Execute");
                        transactionLogger.LogWarning($"Request GlobalID: {request.GlobalID}, JSON: {JsonConvert.SerializeObject(request)}");
                    });
                }

                if (request.LoadOptions != null)
                {
                    Dictionary<string, object> loadOptions = request.LoadOptions;
                    if (loadOptions.Count > 0)
                    {
                    }
                }

                switch (request.ReturnType)
                {
                    case ExecuteDynamicTypeObject.Json:
                    case ExecuteDynamicTypeObject.DynamicJson:
                        await functionClient.ExecuteScriptMap(request, response);
                        break;
                    case ExecuteDynamicTypeObject.Scalar:
                    case ExecuteDynamicTypeObject.NonQuery:
                    case ExecuteDynamicTypeObject.SQLText:
                    case ExecuteDynamicTypeObject.SchemeOnly:
                    case ExecuteDynamicTypeObject.CodeHelp:
                    case ExecuteDynamicTypeObject.Xml:
                        response.ExceptionText = "지원하지 않는 결과 타입. 요청 정보 확인 필요";
                        break;
                }

                if (string.IsNullOrEmpty(response.ExceptionText) == false)
                {
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        functionLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, response.ExceptionText, "Query/Execute", (string error) =>
                        {
                            logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + response.ExceptionText, "Query/Execute");
                        });
                    }
                    else
                    {
                        logger.Error("[{LogCategory}] [{GlobalID}] " + response.ExceptionText, "Query/Execute", request.GlobalID);
                    }
                }
            }
            catch (Exception exception)
            {
                response.ExceptionText = exception.ToMessage();
                if (ModuleConfiguration.IsLogServer == true)
                {
                    functionLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, response.ExceptionText, "Query/QueryDataClient Execute", (string error) =>
                    {
                        logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + response.ExceptionText, "Query/QueryDataClient Execute");
                    });
                }
                else
                {
                    logger.Error("[{LogCategory}] [{GlobalID}] " + response.ExceptionText, "Query/QueryDataClient Execute", request.GlobalID);
                }
            }

            try
            {
                string acknowledge = response.Acknowledge == AcknowledgeType.Success ? "Y" : "N";
                if (request.ReturnType == ExecuteDynamicTypeObject.Xml)
                {
                    var responseData = response.ResultObject as string;
                    if (string.IsNullOrEmpty(responseData) == true)
                    {
                        responseData = "<?xml version=\"1.0\" standalone=\"yes\"?><NewDataSet></NewDataSet>";
                    }

                    if (ModuleConfiguration.IsTransactionLogging == true)
                    {
                        functionLoggerClient.DynamicResponseLogging(request.GlobalID, acknowledge, GlobalConfiguration.SystemID, responseData, "Query/Execute ReturnType: " + request.ReturnType.ToString(), (string error) =>
                        {
                            var transactionLogger = loggerFactory.CreateLogger("Query/Execute");
                            transactionLogger.LogWarning($"Response GlobalID: {response.CorrelationID}, {responseData}");
                        });
                    }
                }
                else
                {
                    string responseData = JsonConvert.SerializeObject(response);
                    if (ModuleConfiguration.IsTransactionLogging == true)
                    {
                        functionLoggerClient.DynamicResponseLogging(request.GlobalID, acknowledge, GlobalConfiguration.SystemID, responseData, "Query/Execute ReturnType: " + request.ReturnType.ToString(), (string error) =>
                        {
                            var transactionLogger = loggerFactory.CreateLogger("Query/Execute");
                            transactionLogger.LogWarning($"Response GlobalID: {response.CorrelationID}, {responseData}");
                        });
                    }
                }
            }
            catch (Exception exception)
            {
                response.ExceptionText = exception.ToMessage();
                if (ModuleConfiguration.IsLogServer == true)
                {
                    functionLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, response.ExceptionText, "Query/DynamicResponse Execute", (string error) =>
                    {
                        logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + response.ExceptionText, "Query/DynamicResponse Execute");
                    });
                }
                else
                {
                    logger.Error("[{LogCategory}] [{GlobalID}] " + response.ExceptionText, "Query/DynamicResponse Execute", request.GlobalID);
                }

                try
                {
                    if (request.ReturnType == ExecuteDynamicTypeObject.Json)
                    {
                        string responseData = JsonConvert.SerializeObject(response);

                        if (ModuleConfiguration.IsTransactionLogging == true)
                        {
                            functionLoggerClient.DynamicResponseLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, responseData, "Query/Execute ReturnType: " + request.ReturnType.ToString(), (string error) =>
                            {
                                var transactionLogger = loggerFactory.CreateLogger("Query/Execute");
                                transactionLogger.LogWarning($"Response GlobalID: {request.GlobalID}, {responseData}");
                            });
                        }
                    }
                    else if (request.ReturnType == ExecuteDynamicTypeObject.Xml)
                    {
                        var responseData = response.ExceptionText;

                        if (ModuleConfiguration.IsTransactionLogging == true)
                        {
                            functionLoggerClient.DynamicResponseLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, responseData, "Query/Execute ReturnType: " + request.ReturnType.ToString(), (string error) =>
                            {
                                var transactionLogger = loggerFactory.CreateLogger("Query/Execute");
                                transactionLogger.LogWarning($"Response GlobalID: {request.GlobalID}, {responseData}");
                            });
                        }
                    }
                }
                catch (Exception fatalException)
                {
                    var responseData = fatalException.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        functionLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, responseData, "Query/QueryDataClient Execute", (string error) =>
                        {
                            logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + responseData, "Query/QueryDataClient Execute");
                        });
                    }
                    else
                    {
                        logger.Error("[{LogCategory}] [{GlobalID}] " + responseData, "Query/QueryDataClient Execute", request.GlobalID);
                    }

                    if (ModuleConfiguration.IsTransactionLogging == true)
                    {
                        functionLoggerClient.DynamicResponseLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, responseData, "Query/Execute ReturnType: " + request.ReturnType.ToString(), (string error) =>
                        {
                            var transactionLogger = loggerFactory.CreateLogger("Query/Execute");
                            transactionLogger.LogWarning($"Fatal Response GlobalID: {request.GlobalID}, {responseData}");
                        });
                    }

                    response.ExceptionText = responseData;
                }
            }

            return response;
        }
    }
}
