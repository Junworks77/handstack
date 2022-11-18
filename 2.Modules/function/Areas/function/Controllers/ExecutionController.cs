using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

using function.Encapsulation;
using function.Entity;
using function.Extensions;

using HandStack.Core.ExtensionMethod;
using HandStack.Core.Extensions;
using HandStack.Web;
using HandStack.Web.MessageContract.Enumeration;
using HandStack.Web.MessageContract.Message;

using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using Newtonsoft.Json;

namespace function.Areas.function.Controllers
{
    [Area("function")]
    [Route("[area]/api/[controller]")]
    [ApiController]
    [EnableCors()]
    public class ExecutionController : ControllerBase
    {
        private FunctionLoggerClient functionLoggerClient { get; }
        private LoggerFactory loggerFactory { get; }
        private Serilog.ILogger logger { get; }
        private IFunctionClient dataClient { get; }

        public ExecutionController(Serilog.ILogger logger, LoggerFactory loggerFactory, FunctionLoggerClient functionLoggerClient, IFunctionClient dataClient)
        {
            this.loggerFactory = loggerFactory;
            this.logger = logger;
            this.functionLoggerClient = functionLoggerClient;
            this.dataClient = dataClient;
        }

        /// <example>
        /// http://localhost:5000/api/Base64/Encode?value={"ProjectID":"QAF","BusinessID":"DSO","TransactionID":"0001","FunctionID":"R0100"}
        /// http://localhost:5000/api/Function/Has?base64Json=eyJQcm9qZWN0SUQiOiJRQUYiLCJCdXNpbmVzc0lEIjoiRFNPIiwiVHJhbnNhY3Rpb25JRCI6IjAwMDEiLCJGdW5jdGlvbklEIjoiUjAxMDAifQ==
        /// </example>
        [HttpGet("Has")]
        public ActionResult Has(string base64Json)
        {
            var definition = new
            {
                ProjectID = "",
                BusinessID = "",
                TransactionID = "",
                FunctionID = ""
            };

            ActionResult result = NotFound();
            string authorizationKey = Request.Headers["AuthorizationKey"];
            if (string.IsNullOrEmpty(authorizationKey) == true || ModuleConfiguration.AuthorizationKey != authorizationKey)
            {
                result = BadRequest();
            }
            else
            {
                try
                {
                    string json = base64Json.DecodeBase64();
                    var model = JsonConvert.DeserializeAnonymousType(json, definition);
                    if (model != null)
                    {
                        var value = FunctionMapper.HasScript(model.ProjectID, model.BusinessID, model.TransactionID, model.FunctionID);
                        result = Content(JsonConvert.SerializeObject(value), "application/json");
                    }
                }
                catch (Exception exception)
                {
                    string exceptionText = exception.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        functionLoggerClient.ProgramMessageLogging("N", GlobalConfiguration.SystemID, exceptionText, "Function/Has", (string error) =>
                        {
                            logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + exceptionText, "Function/Has");
                        });
                    }
                    else
                    {
                        logger.Error("[{LogCategory}] " + exceptionText, "Function/Has");
                    }

                    result = StatusCode(500, exceptionText);
                }
            }

            return result;
        }

        /// <example>
        /// http://localhost:5000/api/Base64/Encode?value={"ScriptFilePath":"QAF\DSO\TST010","ForceUpdate":true}
        /// http://localhost:5000/api/Function/Upsert?base64Json=eyJTcWxGaWxlUGF0aCI6IlFBRlxEU09cUUFGRFNPMDAwMS54bWwiLCJGb3JjZVVwZGF0ZSI6dHJ1ZX0=
        /// </example>
        [HttpGet("Upsert")]
        public ActionResult Upsert(string base64Json)
        {
            var definition = new
            {
                ScriptFilePath = "",
                ForceUpdate = false
            };

            ActionResult result = NotFound();
            string authorizationKey = Request.Headers["AuthorizationKey"];
            if (string.IsNullOrEmpty(authorizationKey) == true || ModuleConfiguration.AuthorizationKey != authorizationKey)
            {
                result = BadRequest();
            }
            else
            {
                try
                {
                    string json = base64Json.DecodeBase64();
                    var model = JsonConvert.DeserializeAnonymousType(json, definition);
                    if (model != null)
                    {
                        if (Directory.Exists(Path.Combine(ModuleConfiguration.ContractBasePath, model.ScriptFilePath)) == true)
                        {
                            var value = FunctionMapper.AddScriptMap(Path.Combine(model.ScriptFilePath, "featureMeta.json"), model.ForceUpdate, logger);
                            result = Content(JsonConvert.SerializeObject(value), "application/json");
                        }
                        else
                        {
                            result = Content(JsonConvert.SerializeObject(false), "application/json");
                        }
                    }
                }
                catch (Exception exception)
                {
                    string exceptionText = exception.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        functionLoggerClient.ProgramMessageLogging("N", GlobalConfiguration.SystemID, exceptionText, "Function/Upsert", (string error) =>
                        {
                            logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + exceptionText, "Function/Upsert");
                        });
                    }
                    else
                    {
                        logger.Error("[{LogCategory}] " + exceptionText, "Function/Upsert");
                    }

                    result = StatusCode(500, exceptionText);
                }
            }

            return result;
        }

        /// <example>
        /// http://localhost:5000/api/Function/Refresh?ScriptFilePath=QAF\MDA\TST010
        /// </example>
        [HttpGet("Refresh")]
        public ActionResult Refresh(string scriptFilePath)
        {
            var definition = new
            {
                ScriptFilePath = "",
                ForceUpdate = false
            };

            ActionResult result = NotFound();
            string authorizationKey = Request.Headers["AuthorizationKey"];
            if (string.IsNullOrEmpty(authorizationKey) == true || ModuleConfiguration.AuthorizationKey != authorizationKey)
            {
                result = BadRequest();
            }
            else
            {
                try
                {
                    if (Directory.Exists(Path.Combine(ModuleConfiguration.ContractBasePath, scriptFilePath)) == true)
                    {
                        var value = FunctionMapper.AddScriptMap(Path.Combine(scriptFilePath, "featureMeta.json"), true, logger);
                        result = Content(JsonConvert.SerializeObject(value), "application/json");
                    }
                    else
                    {
                        result = Content(JsonConvert.SerializeObject(false), "application/json");
                    }
                }
                catch (Exception exception)
                {
                    string exceptionText = exception.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        functionLoggerClient.ProgramMessageLogging("N", GlobalConfiguration.SystemID, exceptionText, "Function/Refresh", (string error) =>
                        {
                            logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + exceptionText, "Function/Refresh");
                        });
                    }
                    else
                    {
                        logger.Error("[{LogCategory}] " + exceptionText, "Function/Refresh");
                    }

                    result = StatusCode(500, exceptionText);
                }
            }

            return result;
        }

        /// <example>
        /// http://localhost:5000/api/Base64/Encode?value={"ProjectID":"QAF","BusinessID":"DSO","TransactionID":"0001","FunctionID":"R0100"}
        /// http://localhost:5000/api/Function/Delete?base64Json=eyJQcm9qZWN0SUQiOiJRQUYiLCJCdXNpbmVzc0lEIjoiRFNPIiwiVHJhbnNhY3Rpb25JRCI6IjAwMDEiLCJGdW5jdGlvbklEIjoiUjAxMDAifQ==
        /// </example>
        [HttpGet("Delete")]
        public ActionResult Delete(string base64Json)
        {
            var definition = new
            {
                ProjectID = "",
                BusinessID = "",
                TransactionID = "",
                FunctionID = ""
            };

            ActionResult result = NotFound();
            string authorizationKey = Request.Headers["AuthorizationKey"];
            if (string.IsNullOrEmpty(authorizationKey) == true || ModuleConfiguration.AuthorizationKey != authorizationKey)
            {
                result = BadRequest();
            }
            else
            {
                try
                {
                    string json = base64Json.DecodeBase64();
                    var model = JsonConvert.DeserializeAnonymousType(json, definition);
                    if (model != null)
                    {
                        var value = FunctionMapper.Remove(model.ProjectID, model.BusinessID, model.TransactionID, model.FunctionID);
                        result = Content(JsonConvert.SerializeObject(value), "application/json");
                    }
                }
                catch (Exception exception)
                {
                    string exceptionText = exception.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        functionLoggerClient.ProgramMessageLogging("N", GlobalConfiguration.SystemID, exceptionText, "Function/Delete", (string error) =>
                        {
                            logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + exceptionText, "Function/Delete");
                        });
                    }
                    else
                    {
                        logger.Error("[{LogCategory}] " + exceptionText, "Function/Delete");
                    }

                    result = StatusCode(500, exceptionText);
                }
            }

            return result;
        }

        /// <example>
        /// http://localhost:5000/api/Base64/Encode?value={"ProjectID":"QAF","BusinessID":"DSO","TransactionID":"0001","FunctionID":"R0100"}
        /// http://localhost:5000/api/Function/Get?base64Json=eyJQcm9qZWN0SUQiOiJRQUYiLCJCdXNpbmVzc0lEIjoiRFNPIiwiVHJhbnNhY3Rpb25JRCI6IjAwMDEiLCJGdW5jdGlvbklEIjoiUjAxMDAifQ==
        /// </example>
        [HttpGet("Get")]
        public ActionResult Get(string base64Json)
        {
            var definition = new
            {
                ProjectID = "",
                BusinessID = "",
                TransactionID = "",
                FunctionID = ""
            };

            ActionResult result = NotFound();
            string authorizationKey = Request.Headers["AuthorizationKey"];
            if (string.IsNullOrEmpty(authorizationKey) == true || ModuleConfiguration.AuthorizationKey != authorizationKey)
            {
                result = BadRequest();
            }
            else
            {
                try
                {
                    string json = base64Json.DecodeBase64();
                    var model = JsonConvert.DeserializeAnonymousType(json, definition);
                    if (model != null)
                    {
                        ModuleScriptMap? NodeScriptMap = FunctionMapper.ScriptMappings.Select(p => p.Value).Where(p =>
                            p.ProjectID == model.ProjectID &&
                            p.ApplicationID == model.BusinessID &&
                            p.TransactionID == model.TransactionID &&
                            p.ScriptID == model.FunctionID).FirstOrDefault();

                        if (NodeScriptMap != null)
                        {
                            result = Content(JsonConvert.SerializeObject(NodeScriptMap), "application/json");
                        }
                    }
                }
                catch (Exception exception)
                {
                    string exceptionText = exception.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        functionLoggerClient.ProgramMessageLogging("N", GlobalConfiguration.SystemID, exceptionText, "Function/Get", (string error) =>
                        {
                            logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + exceptionText, "Function/Get");
                        });
                    }
                    else
                    {
                        logger.Error("[{LogCategory}] " + exceptionText, "Function/Get");
                    }

                    result = StatusCode(500, exceptionText);
                }
            }

            return result;
        }

        /// <example>
        /// http://localhost:5000/api/Base64/Encode?value={%22ProjectID%22:%22QAF%22,%22BusinessID%22:%22%22,%22TransactionID%22:%22%22,%22FunctionID%22:%22%22}
        /// http://localhost:5000/api/Function/Retrieve?base64Json=eyJQcm9qZWN0SUQiOiJRQUYiLCJCdXNpbmVzc0lEIjoiIiwiVHJhbnNhY3Rpb25JRCI6IiIsIkZ1bmN0aW9uSUQiOiIifQ==
        /// </example>
        [HttpGet("Retrieve")]
        public ActionResult Retrieve(string base64Json)
        {
            var definition = new
            {
                ProjectID = "",
                BusinessID = "",
                TransactionID = "",
                FunctionID = ""
            };

            ActionResult result = NotFound();
            string authorizationKey = Request.Headers["AuthorizationKey"];
            if (string.IsNullOrEmpty(authorizationKey) == true || ModuleConfiguration.AuthorizationKey != authorizationKey)
            {
                result = BadRequest();
            }
            else
            {
                try
                {
                    string json = base64Json.DecodeBase64();
                    var model = JsonConvert.DeserializeAnonymousType(json, definition);
                    if (model != null)
                    {
                        if (string.IsNullOrEmpty(model.ProjectID) == true)
                        {
                            return Content("ProjectID 항목 필수", "text/html");
                        }

                        List<ModuleScriptMap>? statementMaps = null;

                        var queryResults = FunctionMapper.ScriptMappings.Select(p => p.Value).Where(p =>
                                p.ProjectID == model.ProjectID);

                        if (string.IsNullOrEmpty(model.BusinessID) == false)
                        {
                            queryResults = queryResults.Where(p =>
                                p.ApplicationID == model.BusinessID);
                        }

                        if (string.IsNullOrEmpty(model.TransactionID) == false)
                        {
                            queryResults = queryResults.Where(p =>
                                p.TransactionID == model.TransactionID);
                        }

                        if (string.IsNullOrEmpty(model.FunctionID) == false)
                        {
                            string functionID = model.FunctionID.Substring(0, model.FunctionID.Length - 2);
                            queryResults = queryResults.Where(p => p.ScriptID.Substring(0, p.ScriptID.Length - 2) == functionID);
                        }

                        statementMaps = queryResults.ToList();
                        if (statementMaps != null)
                        {
                            result = Content(JsonConvert.SerializeObject(statementMaps), "application/json");
                        }
                    }
                }
                catch (Exception exception)
                {
                    string exceptionText = exception.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        functionLoggerClient.ProgramMessageLogging("N", GlobalConfiguration.SystemID, exceptionText, "Function/Retrieve", (string error) =>
                        {
                            logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + exceptionText, "Function/Retrieve");
                        });
                    }
                    else
                    {
                        logger.Error("[{LogCategory}] " + exceptionText, "Function/Retrieve");
                    }

                    result = StatusCode(500, exceptionText);
                }
            }

            return result;
        }

        /// <example>
        /// http://localhost:5000/api/Function/Meta
        /// </example>
        [HttpGet("Meta")]
        public ActionResult Meta()
        {
            ActionResult result = NotFound();
            string authorizationKey = Request.Headers["AuthorizationKey"];
            if (string.IsNullOrEmpty(authorizationKey) == true || ModuleConfiguration.AuthorizationKey != authorizationKey)
            {
                result = BadRequest();
            }
            else
            {
                try
                {
                    List<ModuleScriptMap>? statementMaps = null;

                    var queryResults = FunctionMapper.ScriptMappings.Select(p => p.Value);
                    statementMaps = queryResults.ToList();
                    if (statementMaps != null)
                    {
                        result = Content(JsonConvert.SerializeObject(statementMaps), "application/json");
                    }
                }
                catch (Exception exception)
                {
                    string exceptionText = exception.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        functionLoggerClient.ProgramMessageLogging("N", GlobalConfiguration.SystemID, exceptionText, "Function/Meta", (string error) =>
                        {
                            logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + exceptionText, "Function/Meta");
                        });
                    }
                    else
                    {
                        logger.Error("[{LogCategory}] " + exceptionText, "Function/Meta");
                    }

                    result = StatusCode(500, exceptionText);
                }
            }

            return result;
        }

        [HttpPost]
        public async Task<ActionResult> Execute(DynamicRequest request)
        {
            ActionResult result = NotFound();
            DynamicResponse response = new DynamicResponse();
            response.Acknowledge = AcknowledgeType.Failure;

            if (request == null)
            {
                response.ExceptionText = "빈 요청. 요청 정보 확인 필요";
                return result;
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

            string? responseData = null;
            string acknowledge = "N";
            try
            {
                if (ModuleConfiguration.IsTransactionLogging == true)
                {
                    functionLoggerClient.DynamicRequestLogging(request, "Y", GlobalConfiguration.SystemID, (string error) =>
                    {
                        var transactionLogger = loggerFactory.CreateLogger("Function/Execute");
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

                // string validClientTag = ""; // ConfigurationManager.AppSettings["validateClientTag"];
                // if (string.IsNullOrEmpty(validClientTag) == false)
                // {
                //     if (request.ClientTag != validClientTag)
                //     {
                //         response.Acknowledge = AcknowledgeType.Failure;
                //         response.ExceptionText = "알수 없는 요청입니다.";
                //     }
                // }
                // else
                // {
                //     dataClient.ExecuteNodeScriptMap(request, response);
                // }

                switch (request.ReturnType)
                {
                    case ExecuteDynamicTypeObject.Json:
                    case ExecuteDynamicTypeObject.DynamicJson:
                        await dataClient.ExecuteScriptMap(request, response);
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

                acknowledge = response.Acknowledge == AcknowledgeType.Success ? "Y" : "N";
                responseData = JsonConvert.SerializeObject(response);

                if (string.IsNullOrEmpty(response.ExceptionText) == false)
                {
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        functionLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, response.ExceptionText, "Function/Execute", (string error) =>
                        {
                            logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + response.ExceptionText, "Function/Execute");
                        });
                    }
                    else
                    {
                        logger.Error("[{LogCategory}] [{GlobalID}] " + response.ExceptionText, "Function/Execute", request.GlobalID);
                    }
                }

                if (ModuleConfiguration.IsTransactionLogging == true)
                {
                    functionLoggerClient.DynamicResponseLogging(request.GlobalID, acknowledge, GlobalConfiguration.SystemID, responseData, "Function/Execute ReturnType: " + request.ReturnType.ToString(), (string error) =>
                    {
                        var transactionLogger = loggerFactory.CreateLogger("Function/Execute");
                        transactionLogger.LogWarning($"Response GlobalID: {response.CorrelationID}, {responseData}");
                    });
                }
            }
            catch (Exception exception)
            {
                response.ExceptionText = exception.ToMessage();

                if (ModuleConfiguration.IsLogServer == true)
                {
                    functionLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, response.ExceptionText, "Function/Execute", (string error) =>
                    {
                        logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + response.ExceptionText, "Function/Execute");
                    });
                }
                else
                {
                    logger.Error("[{LogCategory}] [{GlobalID}] " + response.ExceptionText, "Function/Execute", request.GlobalID);
                }

                responseData = JsonConvert.SerializeObject(response);

                if (ModuleConfiguration.IsTransactionLogging == true)
                {
                    functionLoggerClient.DynamicResponseLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, responseData, "Function/Execute ReturnType: " + request.ReturnType.ToString(), (string error) =>
                    {
                        var transactionLogger = loggerFactory.CreateLogger("Function/Execute");
                        transactionLogger.LogWarning($"Response GlobalID: {request.GlobalID}, {responseData}");
                    });
                }
            }

            return Content(responseData, "application/json");
        }
    }
}
