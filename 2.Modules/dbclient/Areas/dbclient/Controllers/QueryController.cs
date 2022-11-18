using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

using dbclient.Encapsulation;
using dbclient.Extensions;

using HandStack.Core.ExtensionMethod;
using HandStack.Core.Extensions;
using HandStack.Web;
using HandStack.Web.MessageContract.Enumeration;
using HandStack.Web.MessageContract.Message;

using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using Newtonsoft.Json;

namespace dbclient.Areas.dbclient.Controllers
{
    [Area("dbclient")]
    [Route("[area]/api/[controller]")]
    [ApiController]
    [EnableCors("dbclient")]
    public class QueryController : ControllerBase
    {
        private DbClientLoggerClient dbClientLoggerClient { get; }
        private LoggerFactory loggerFactory { get; }
        private Serilog.ILogger logger { get; }
        private IQueryDataClient dataClient { get; }

        public QueryController(LoggerFactory loggerFactory, Serilog.ILogger logger, IQueryDataClient dataClient, DbClientLoggerClient dbClientLoggerClient)
        {
            this.loggerFactory = loggerFactory;
            this.logger = logger;
            this.dbClientLoggerClient = dbClientLoggerClient;
            this.dataClient = dataClient;
        }

        // http://localhost:5000/dbclient/api/base64/encode?value={"ApplicationID":"SYN","ProjectID":"ZZD","TransactionID":"TST010","FunctionID":"G0100"}
        // http://localhost:5000/dbclient/api/query/has?base64Json=eyJQcm9qZWN0SUQiOiJRQUYiLCJCdXNpbmVzc0lEIjoiRFNPIiwiVHJhbnNhY3Rpb25JRCI6IjAwMDEiLCJGdW5jdGlvbklEIjoiUjAxMDAifQ==
        [HttpGet("[action]")]
        public ActionResult Has(string base64Json)
        {
            var definition = new
            {
                ApplicationID = "",
                ProjectID = "",
                TransactionID = "",
                FunctionID = ""
            };

            ActionResult result = BadRequest();
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
                        var value = DatabaseMapper.HasStatement(model.ApplicationID, model.ProjectID, model.TransactionID, model.FunctionID);
                        result = Content(JsonConvert.SerializeObject(value), "application/json");
                    }
                }
                catch (Exception exception)
                {
                    string exceptionText = exception.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        dbClientLoggerClient.ProgramMessageLogging("N", GlobalConfiguration.SystemID, exceptionText, "Query/Has", (string error) =>
                        {
                            logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + exceptionText, "Query/Has");
                        });
                    }
                    else
                    {
                        logger.Error("[{LogCategory}] " + exceptionText, "Query/Has");
                    }

                    result = StatusCode(500, exception.ToMessage());
                }
            }

            return result;
        }

        // http://localhost:5000/dbclient/api/base64/encode?value={"SqlFilePath":"SYN\DSO\SYNDSO0001.xml","ForceUpdate":true}
        // http://localhost:5000/dbclient/api/query/upsert?base64Json=eyJTcWxGaWxlUGF0aCI6IlFBRlxEU09cUUFGRFNPMDAwMS54bWwiLCJGb3JjZVVwZGF0ZSI6dHJ1ZX0=
        [HttpGet("[action]")]
        public ActionResult Upsert(string base64Json)
        {
            var definition = new
            {
                SqlFilePath = "",
                ForceUpdate = false
            };

            ActionResult result = BadRequest();
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
                        var value = DatabaseMapper.AddStatementMap(model.SqlFilePath, model.ForceUpdate, logger);
                        result = Content(JsonConvert.SerializeObject(value), "application/json");
                    }
                }
                catch (Exception exception)
                {
                    string exceptionText = exception.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        dbClientLoggerClient.ProgramMessageLogging("N", GlobalConfiguration.SystemID, exceptionText, "Query/Upsert", (string error) =>
                        {
                            logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + exceptionText, "Query/Upsert");
                        });
                    }
                    else
                    {
                        logger.Error("[{LogCategory}] " + exceptionText, "Query/Upsert");
                    }

                    result = StatusCode(500, exception.ToMessage());
                }
            }

            return result;
        }

        // http://localhost:5000/dbclient/api/query/refresh?SqlFilePath=SYN\MDA\CA020.xml
        [HttpGet("[action]")]
        public ActionResult Refresh(string sqlFilePath)
        {
            ActionResult result = BadRequest();
            string authorizationKey = Request.Headers["AuthorizationKey"];
            if (string.IsNullOrEmpty(authorizationKey) == true || ModuleConfiguration.AuthorizationKey != authorizationKey)
            {
                result = BadRequest();
            }
            else
            {
                try
                {
                    var value = DatabaseMapper.AddStatementMap(sqlFilePath, true, logger);
                    result = Content(JsonConvert.SerializeObject(value), "application/json");
                }
                catch (Exception exception)
                {
                    string exceptionText = exception.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        dbClientLoggerClient.ProgramMessageLogging("N", GlobalConfiguration.SystemID, exceptionText, "Query/Refresh", (string error) =>
                        {
                            logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + exceptionText, "Query/Refresh");
                        });
                    }
                    else
                    {
                        logger.Error("[{LogCategory}] " + exceptionText, "Query/Refresh");
                    }

                    result = StatusCode(500, exception.ToMessage());
                }
            }

            return result;
        }

        // http://localhost:5000/dbclient/api/base64/encode?value={"ApplicationID":"SYN","ProjectID":"ZZD","TransactionID":"TST010","FunctionID":"G0100"}
        // http://localhost:5000/dbclient/api/query/delete?base64Json=eyJQcm9qZWN0SUQiOiJRQUYiLCJCdXNpbmVzc0lEIjoiRFNPIiwiVHJhbnNhY3Rpb25JRCI6IjAwMDEiLCJGdW5jdGlvbklEIjoiUjAxMDAifQ==
        [HttpGet("Delete")]
        public ActionResult Delete(string base64Json)
        {
            var definition = new
            {
                ApplicationID = "",
                ProjectID = "",
                TransactionID = "",
                FunctionID = ""
            };

            ActionResult result = BadRequest();
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
                        var value = DatabaseMapper.Remove(model.ApplicationID, model.ProjectID, model.TransactionID, model.FunctionID);
                        result = Content(JsonConvert.SerializeObject(value), "application/json");
                    }
                }
                catch (Exception exception)
                {
                    string exceptionText = exception.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        dbClientLoggerClient.ProgramMessageLogging("N", GlobalConfiguration.SystemID, exceptionText, "Query/Delete", (string error) =>
                        {
                            logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + exceptionText, "Query/Delete");
                        });
                    }
                    else
                    {
                        logger.Error("[{LogCategory}] " + exceptionText, "Query/Delete");
                    }

                    result = StatusCode(500, exception.ToMessage());
                }
            }

            return result;
        }

        // http://localhost:5000/dbclient/api/base64/encode?value={"ApplicationID":"SYN","ProjectID":"ZZD","TransactionID":"TST010","FunctionID":"G0100"}
        // http://localhost:5000/dbclient/api/query/get?base64Json=eyJQcm9qZWN0SUQiOiJRQUYiLCJCdXNpbmVzc0lEIjoiRFNPIiwiVHJhbnNhY3Rpb25JRCI6IjAwMDEiLCJGdW5jdGlvbklEIjoiUjAxMDAifQ==
        [HttpGet("[action]")]
        public ActionResult Get(string base64Json)
        {
            ActionResult result = BadRequest();
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

                    var model = JsonConvert.DeserializeAnonymousType(json, new
                    {
                        ApplicationID = "",
                        ProjectID = "",
                        TransactionID = "",
                        FunctionID = ""
                    });

                    if (model != null)
                    {
                        StatementMap? statementMap = DatabaseMapper.StatementMappings.Select(p => p.Value).Where(p =>
                            p.ApplicationID == model.ApplicationID &&
                            p.ProjectID == model.ProjectID &&
                            p.TransactionID == model.TransactionID &&
                            p.StatementID == model.FunctionID).FirstOrDefault();

                        if (statementMap != null)
                        {
                            var value = JsonConvert.SerializeObject(statementMap);
                            result = Content(JsonConvert.SerializeObject(value), "application/json");
                        }
                    }
                }
                catch (Exception exception)
                {
                    string exceptionText = exception.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        dbClientLoggerClient.ProgramMessageLogging("N", GlobalConfiguration.SystemID, exceptionText, "Query/Get", (string error) =>
                        {
                            logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + exceptionText, "Query/Get");
                        });
                    }
                    else
                    {
                        logger.Error("[{LogCategory}] " + exceptionText, "Query/Get");
                    }

                    result = StatusCode(500, exception.ToMessage());
                }
            }

            return result;
        }

        // http://localhost:5000/dbclient/api/base64/encode?value={"ApplicationID":"SYN","ProjectID":"ZZD","TransactionID":"TST010","FunctionID":"G0100"}
        // http://localhost:5000/dbclient/api/query/retrieve?base64Json=eyJQcm9qZWN0SUQiOiJRQUYiLCJCdXNpbmVzc0lEIjoiIiwiVHJhbnNhY3Rpb25JRCI6IiIsIkZ1bmN0aW9uSUQiOiIifQ==
        [HttpGet("[action]")]
        public ActionResult Retrieve(string base64Json)
        {
            ActionResult result = BadRequest();
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
                    var model = JsonConvert.DeserializeAnonymousType(json, new
                    {
                        ApplicationID = "",
                        ProjectID = "",
                        TransactionID = "",
                        FunctionID = ""
                    });

                    if (model == null || string.IsNullOrEmpty(model.ApplicationID) == true || string.IsNullOrEmpty(model.ProjectID) == true)
                    {
                        return Content("필수 항목 확인", "text/html");
                    }

                    var queryResults = DatabaseMapper.StatementMappings.Select(p => p.Value).Where(p =>
                            p.ApplicationID == model.ApplicationID);

                    if (string.IsNullOrEmpty(model.ProjectID) == false)
                    {
                        queryResults = queryResults.Where(p =>
                            p.ProjectID == model.ProjectID);
                    }

                    if (string.IsNullOrEmpty(model.TransactionID) == false)
                    {
                        queryResults = queryResults.Where(p =>
                            p.TransactionID == model.TransactionID);
                    }

                    if (string.IsNullOrEmpty(model.FunctionID) == false)
                    {
                        string functionID = model.FunctionID.Substring(0, model.FunctionID.Length - 2);
                        queryResults = queryResults.Where(p => p.StatementID.Substring(0, p.StatementID.Length - 2) == functionID);
                    }

                    List<StatementMap> statementMaps = queryResults.ToList();
                    result = Content(JsonConvert.SerializeObject(statementMaps), "application/json");
                }
                catch (Exception exception)
                {
                    string exceptionText = exception.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        dbClientLoggerClient.ProgramMessageLogging("N", GlobalConfiguration.SystemID, exceptionText, "Query/Retrieve", (string error) =>
                        {
                            logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + exceptionText, "Query/Retrieve");
                        });
                    }
                    else
                    {
                        logger.Error("[{LogCategory}] " + exceptionText, "Query/Retrieve");
                    }

                    result = StatusCode(500, exception.ToMessage());
                }
            }

            return result;
        }

        // http://localhost:5000/dbclient/api/base64/encode?value={"ApplicationID":"SYN","ProjectID":"ZZD","TransactionID":"TST010","FunctionID":"G0100","TransactionLog":true}
        // http://localhost:5000/dbclient/api/query/log?base64Json=eyJQcm9qZWN0SUQiOiJTVlUiLCJCdXNpbmVzc0lEIjoiWlpEIiwiVHJhbnNhY3Rpb25JRCI6IlRTVDAxMCIsIkZ1bmN0aW9uSUQiOiJHMDEwMCIsIlRyYW5zYWN0aW9uTG9nIjp0cnVlfQ==
        [HttpGet("[action]")]
        public ActionResult Log(string base64Json)
        {
            var definition = new
            {
                ApplicationID = "",
                ProjectID = "",
                TransactionID = "",
                FunctionID = "",
                TransactionLog = false
            };

            ActionResult result = BadRequest();
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
                        StatementMap? statementMap = DatabaseMapper.StatementMappings.Select(p => p.Value).Where(p =>
                            p.ApplicationID == model.ApplicationID &&
                            p.ProjectID == model.ProjectID &&
                            p.TransactionID == model.TransactionID &&
                            p.StatementID == model.FunctionID).FirstOrDefault();

                        if (statementMap != null)
                        {
                            statementMap.TransactionLog = model.TransactionLog;
                            result = Content(JsonConvert.SerializeObject(model.TransactionLog), "application/json");
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
                        dbClientLoggerClient.ProgramMessageLogging("N", GlobalConfiguration.SystemID, exceptionText, "Query/Log", (string error) =>
                        {
                            logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + exceptionText, "Query/Log");
                        });
                    }
                    else
                    {
                        logger.Error("[{LogCategory}] " + exceptionText, "Query/Log");
                    }

                    result = StatusCode(500, exception.ToMessage());
                }
            }

            return result;
        }

        // http://localhost:5000/dbclient/api/query/meta
        [HttpGet("[action]")]
        public ActionResult Meta()
        {
            ActionResult result = BadRequest();
            string authorizationKey = Request.Headers["AuthorizationKey"];
            if (string.IsNullOrEmpty(authorizationKey) == true || ModuleConfiguration.AuthorizationKey != authorizationKey)
            {
                result = BadRequest();
            }
            else
            {
                try
                {
                    var queryResults = DatabaseMapper.StatementMappings.Select(p => p.Value);
                    List<StatementMap> statementMaps = queryResults.ToList();
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
                        dbClientLoggerClient.ProgramMessageLogging("N", GlobalConfiguration.SystemID, exceptionText, "Query/Meta", (string error) =>
                        {
                            logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + exceptionText, "Query/Meta");
                        });
                    }
                    else
                    {
                        logger.Error("[{LogCategory}] " + exceptionText, "Query/Meta");
                    }

                    result = StatusCode(500, exception.ToMessage());
                }
            }

            return result;
        }

        // http://localhost:5000/dbclient/api/query/reports
        [HttpGet("[action]")]
        public ActionResult Reports()
        {
            ActionResult result = BadRequest();
            string authorizationKey = Request.Headers["AuthorizationKey"];
            if (string.IsNullOrEmpty(authorizationKey) == true || ModuleConfiguration.AuthorizationKey != authorizationKey)
            {
                result = BadRequest();
            }
            else
            {
                try
                {
                    var queryResults = DatabaseMapper.StatementMappings.Select(p => p.Value);
                    List<StatementMap> statementMaps = queryResults.ToList();
                    if (statementMaps != null)
                    {
                        var reports = statementMaps.Select(p => new
                        {
                            ApplicationID = p.ApplicationID,
                            ProjectID = p.ProjectID,
                            TransactionID = p.TransactionID,
                            DataSourceID = p.DataSourceID,
                            StatementID = p.StatementID,
                            Seq = p.Seq,
                            NativeDataClient = p.NativeDataClient,
                            Timeout = p.Timeout,
                            Description = p.Description,
                            ModifiedDateTime = p.ModifiedDateTime
                        });

                        var value = JsonConvert.SerializeObject(reports);
                        result = Content(JsonConvert.SerializeObject(value), "application/json");
                    }
                }
                catch (Exception exception)
                {
                    string exceptionText = exception.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        dbClientLoggerClient.ProgramMessageLogging("N", GlobalConfiguration.SystemID, exceptionText, "Query/Reports", (string error) =>
                        {
                            logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + exceptionText, "Query/Reports");
                        });
                    }
                    else
                    {
                        logger.Error("[{LogCategory}] " + exceptionText, "Query/Reports");
                    }

                    result = StatusCode(500, exception.ToMessage());
                }
            }

            return result;
        }

        // http://localhost:5000/dbclient/api/query/execute
        [HttpPost()]
        public ActionResult Execute(DynamicRequest request)
        {
            ActionResult result = BadRequest();
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

            try
            {
                if (ModuleConfiguration.IsTransactionLogging == true)
                {
                    dbClientLoggerClient.DynamicRequestLogging(request, "Y", GlobalConfiguration.SystemID, (string error) =>
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
                        dataClient.ExecuteDynamicSQLMap(request, response);
                        break;
                    case ExecuteDynamicTypeObject.Scalar:
                        dataClient.ExecuteDynamicSQLMapToScalar(request, response);
                        break;
                    case ExecuteDynamicTypeObject.NonQuery:
                        dataClient.ExecuteDynamicSQLMapToNonQuery(request, response);
                        break;
                    case ExecuteDynamicTypeObject.SQLText:
                        dataClient.ExecuteDynamicSQLText(request, response);
                        break;
                    case ExecuteDynamicTypeObject.SchemeOnly:
                        dataClient.ExecuteSchemeOnlySQLMap(request, response);
                        break;
                    case ExecuteDynamicTypeObject.CodeHelp:
                        dataClient.ExecuteCodeHelpSQLMap(request, response);
                        break;
                    case ExecuteDynamicTypeObject.Xml:
                        dataClient.ExecuteDynamicSQLMapToXml(request, response);
                        break;
                    case ExecuteDynamicTypeObject.DynamicJson:
                        response.ExceptionText = "지원하지 않는 결과 타입. 요청 정보 확인 필요";
                        break;
                }

                if (string.IsNullOrEmpty(response.ExceptionText) == false)
                {
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, response.ExceptionText, "Query/Execute", (string error) =>
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
                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, response.ExceptionText, "Query/QueryDataClient Execute", (string error) =>
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
                        dbClientLoggerClient.DynamicResponseLogging(request.GlobalID, acknowledge, GlobalConfiguration.SystemID, responseData, "Query/Execute ReturnType: " + request.ReturnType.ToString(), (string error) =>
                        {
                            var transactionLogger = loggerFactory.CreateLogger("Query/Execute");
                            transactionLogger.LogWarning($"Response GlobalID: {response.CorrelationID}, {responseData}");
                        });
                    }

                    result = Content(responseData, "text/xml");
                }
                else
                {
                    string responseData = JsonConvert.SerializeObject(response);
                    if (ModuleConfiguration.IsTransactionLogging == true)
                    {
                        dbClientLoggerClient.DynamicResponseLogging(request.GlobalID, acknowledge, GlobalConfiguration.SystemID, responseData, "Query/Execute ReturnType: " + request.ReturnType.ToString(), (string error) =>
                        {
                            var transactionLogger = loggerFactory.CreateLogger("Query/Execute");
                            transactionLogger.LogWarning($"Response GlobalID: {response.CorrelationID}, {responseData}");
                        });
                    }

                    result = Content(responseData, "application/json");
                }
            }
            catch (Exception exception)
            {
                response.ExceptionText = exception.ToMessage();
                if (ModuleConfiguration.IsLogServer == true)
                {
                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, response.ExceptionText, "Query/DynamicResponse Execute", (string error) =>
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
                            dbClientLoggerClient.DynamicResponseLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, responseData, "Query/Execute ReturnType: " + request.ReturnType.ToString(), (string error) =>
                            {
                                var transactionLogger = loggerFactory.CreateLogger("Query/Execute");
                                transactionLogger.LogWarning($"Response GlobalID: {request.GlobalID}, {responseData}");
                            });
                        }

                        result = Content(responseData, "application/json");
                    }
                    else if (request.ReturnType == ExecuteDynamicTypeObject.Xml)
                    {
                        var responseData = response.ExceptionText;

                        if (ModuleConfiguration.IsTransactionLogging == true)
                        {
                            dbClientLoggerClient.DynamicResponseLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, responseData, "Query/Execute ReturnType: " + request.ReturnType.ToString(), (string error) =>
                            {
                                var transactionLogger = loggerFactory.CreateLogger("Query/Execute");
                                transactionLogger.LogWarning($"Response GlobalID: {request.GlobalID}, {responseData}");
                            });
                        }

                        result = Content(responseData, "text/xml");
                    }
                    else
                    {
                        result = NoContent();
                    }
                }
                catch (Exception fatalException)
                {
                    var responseData = fatalException.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, responseData, "Query/QueryDataClient Execute", (string error) =>
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
                        dbClientLoggerClient.DynamicResponseLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, responseData, "Query/Execute ReturnType: " + request.ReturnType.ToString(), (string error) =>
                        {
                            var transactionLogger = loggerFactory.CreateLogger("Query/Execute");
                            transactionLogger.LogWarning($"Fatal Response GlobalID: {request.GlobalID}, {responseData}");
                        });
                    }

                    result = Content(responseData, "text/xml");
                }
            }

            return result;
        }

    }
}
