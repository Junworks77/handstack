﻿using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

using ChoETL;

using HandStack.Core.ExtensionMethod;
using HandStack.Core.Extensions;
using HandStack.Core.Helpers;
using HandStack.Web;
using HandStack.Web.Entity;
using HandStack.Web.MessageContract.Contract;
using HandStack.Web.MessageContract.DataObject;
using HandStack.Web.MessageContract.Enumeration;
using HandStack.Web.MessageContract.Message;

using MediatR;

using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using RestSharp;

using transact.Entity;
using transact.Extensions;

namespace transact.Areas.transact.Controllers
{
    [Area("transact")]
    [Route("[area]/api/[controller]")]
    [ApiController]
    [EnableCors("transact")]
    public class TransactionController : ControllerBase
    {
        private readonly IMediator mediator;
        private TransactLoggerClient transactLoggerClient { get; }
        private IMemoryCache memoryCache;
        private Serilog.ILogger logger { get; }

        public TransactionController(IMediator mediator, IMemoryCache memoryCache, Serilog.ILogger logger, TransactLoggerClient transactLoggerClient)
        {
            this.mediator = mediator;
            this.memoryCache = memoryCache;
            // this.loggerFactory = loggerFactory; // LoggerFactory loggerFactory, 
            this.logger = logger;
            this.transactLoggerClient = transactLoggerClient;
        }

        // http://localhost:5000/transact/api/transaction/has?projectID=HDS&businessID=SYS&transactionID=SYS010
        [HttpGet("[action]")]
        public ActionResult Has(string projectID, string businessID, string transactionID)
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
                    var value = TransactionMapper.HasCount(projectID, businessID, transactionID);
                    result = Content(JsonConvert.SerializeObject(value), "application/json");
                }
                catch (Exception exception)
                {
                    string exceptionText = exception.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        transactLoggerClient.ProgramMessageLogging("N", "E", exceptionText, "Transaction/Has", (string error) =>
                        {
                            logger.Error("[{LogCategory}] fallback error: " + error + ", " + exceptionText, "Transaction/Has");
                        });
                    }
                    else
                    {
                        logger.Warning("[{LogCategory}] " + exceptionText, "Transaction/Has");
                    }
                    result = StatusCode(500, exceptionText);
                }
            }

            return result;
        }

        // http://localhost:5000/transact/api/transaction/add?businessContractFilePath=HAND Stack\DSO\SYNDSO0001.json
        [HttpGet("[action]")]
        public ActionResult Add(string businessContractFilePath)
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
                    var value = TransactionMapper.Add(businessContractFilePath);
                    result = Content(JsonConvert.SerializeObject(value), "application/json");
                }
                catch (Exception exception)
                {
                    string exceptionText = exception.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        transactLoggerClient.ProgramMessageLogging("N", "E", exceptionText, "Transaction/Add", (string error) =>
                        {
                            logger.Error("[{LogCategory}] fallback error: " + error + ", " + exceptionText, "Transaction/Add");
                        });
                    }
                    else
                    {
                        logger.Warning("[{LogCategory}] " + exceptionText, "Transaction/Add");
                    }
                    result = StatusCode(500, exceptionText);
                }
            }

            return result;
        }

        // http://localhost:5000/transact/api/transaction/remove?businessContractFilePath=HAND Stack\DSO\SYNDSO0001.json
        [HttpGet("[action]")]
        public ActionResult Remove(string businessContractFilePath)
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
                    var value = TransactionMapper.Remove(businessContractFilePath);
                    result = Content(JsonConvert.SerializeObject(value), "application/json");
                }
                catch (Exception exception)
                {
                    string exceptionText = exception.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        transactLoggerClient.ProgramMessageLogging("N", "E", exceptionText, "Transaction/Remove", (string error) =>
                        {
                            logger.Error("[{LogCategory}] fallback error: " + error + ", " + exceptionText, "Transaction/Remove");
                        });
                    }
                    else
                    {
                        logger.Warning("[{LogCategory}] " + exceptionText, "Transaction/Remove");
                    }
                    result = StatusCode(500, exceptionText);
                }
            }

            return result;
        }

        // http://localhost:5000/transact/api/transaction/refresh?businessContractFilePath=HAND Stack\MWA\CA020.json
        [HttpGet("[action]")]
        public ActionResult Refresh(string businessContractFilePath)
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
                    TransactionMapper.Remove(businessContractFilePath);
                    var value = TransactionMapper.Add(businessContractFilePath);
                    result = Content(JsonConvert.SerializeObject(value), "application/json");
                }
                catch (Exception exception)
                {
                    string exceptionText = exception.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        transactLoggerClient.ProgramMessageLogging("N", "E", exceptionText, "Transaction/Refresh", (string error) =>
                        {
                            logger.Error("[{LogCategory}] fallback error: " + error + ", " + exceptionText, "Transaction/Refresh");
                        });
                    }
                    else
                    {
                        logger.Warning("[{LogCategory}] " + exceptionText, "Transaction/Refresh");
                    }
                    result = StatusCode(500, exceptionText);
                }
            }

            return result;
        }

        // http://localhost:5000/transact/api/transaction/cache-clear?cacheKey=
        [HttpGet("[action]")]
        public ActionResult CacheClear(string cacheKey)
        {
            ActionResult result = BadRequest();
            try
            {
                result = Content(JsonConvert.SerializeObject(true), "application/json");
                if (string.IsNullOrEmpty(cacheKey) == true)
                {
                    List<string> items = GetMemoryCacheKeys();
                    foreach (string item in items)
                    {
                        memoryCache.Remove(item);
                    }
                }
                else if (memoryCache.Get(cacheKey) != null)
                {
                    memoryCache.Remove(cacheKey);
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
                    transactLoggerClient.ProgramMessageLogging("N", "E", exceptionText, "Transaction/CacheClear", (string error) =>
                    {
                        logger.Error("[{LogCategory}] fallback error: " + error + ", " + exceptionText, "Transaction/CacheClear");
                    });
                }
                else
                {
                    logger.Warning("[{LogCategory}] " + exceptionText, "Transaction/CacheClear");
                }
                result = StatusCode(500, exceptionText);
            }

            return result;
        }

        // http://localhost:5000/transact/api/transaction/cache-keys
        [HttpGet("[action]")]
        public ActionResult CacheKeys()
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
                    List<string> items = GetMemoryCacheKeys();
                    result = Content(JsonConvert.SerializeObject(items), "application/json");
                }
                catch (Exception exception)
                {
                    string exceptionText = exception.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        transactLoggerClient.ProgramMessageLogging("N", "E", exceptionText, "Transaction/CacheKeys", (string error) =>
                        {
                            logger.Error("[{LogCategory}] fallback error: " + error + ", " + exceptionText, "Transaction/CacheKeys");
                        });
                    }
                    else
                    {
                        logger.Warning("[{LogCategory}] " + exceptionText, "Transaction/CacheKeys");
                    }
                    result = StatusCode(500, exceptionText);
                }
            }

            return result;
        }

        private List<string> GetMemoryCacheKeys()
        {
            List<string> result = new List<string>();
            var field = typeof(MemoryCache).GetProperty("EntriesCollection", BindingFlags.NonPublic | BindingFlags.Instance);
            if (field == null)
            {
                return result;
            }
            var collection = field.GetValue(memoryCache) as ICollection;
            if (collection != null)
            {
                foreach (var item in collection)
                {
                    var methodInfo = item.GetType().GetProperty("Key");
                    if (methodInfo != null)
                    {
                        var value = methodInfo.GetValue(item);
                        if (value != null)
                        {
                            result.Add(value.ToStringSafe());
                        }
                    }
                }
            }

            return result;
        }

        // http://localhost:5000/transact/api/base64/encode?value={"ApplicationID":"SYN","ProjectID":"ZZD","TransactionID":"TST010"}
        // http://localhost:5000/transact/api/transaction/get?base64Json=eyJQcm9qZWN0SUQiOiJRQUYiLCJCdXNpbmVzc0lEIjoiRFNPIiwiVHJhbnNhY3Rpb25JRCI6IjAwMDEiLCJGdW5jdGlvbklEIjoiUjAxMDAifQ==
        [HttpGet("[action]")]
        public ActionResult Get(string base64Json)
        {
            var definition = new
            {
                ApplicationID = "",
                ProjectID = "",
                TransactionID = ""
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
                        BusinessContract? businessContract = TransactionMapper.GetBusinessContracts().Select(p => p.Value).Where(p =>
                            p.ApplicationID == model.ApplicationID &&
                            p.ProjectID == model.ProjectID &&
                            p.TransactionID == model.TransactionID).FirstOrDefault();

                        if (businessContract != null)
                        {
                            var value = JsonConvert.SerializeObject(businessContract);
                            result = Content(JsonConvert.SerializeObject(value), "application/json");
                        }
                    }
                }
                catch (Exception exception)
                {
                    string exceptionText = exception.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        transactLoggerClient.ProgramMessageLogging("N", "E", exceptionText, "Transaction/Get", (string error) =>
                        {
                            logger.Error("[{LogCategory}] fallback error: " + error + ", " + exceptionText, "Transaction/Get");
                        });
                    }
                    else
                    {
                        logger.Warning("[{LogCategory}] " + exceptionText, "Transaction/Get");
                    }
                    result = StatusCode(500, exceptionText);
                }
            }

            return result;
        }

        // http://localhost:5000/transact/api/base64/encode?value={"ApplicationID":"SYN","ProjectID":"ZZD","TransactionID":"TST010"}
        // http://localhost:5000/transact/api/transaction/retrieve?base64Json=eyJQcm9qZWN0SUQiOiJRQUYiLCJCdXNpbmVzc0lEIjoiIiwiVHJhbnNhY3Rpb25JRCI6IiIsIkZ1bmN0aW9uSUQiOiIifQ==
        [HttpGet("[action]")]
        public ActionResult Retrieve(string base64Json)
        {
            var definition = new
            {
                ApplicationID = "",
                ProjectID = "",
                TransactionID = ""
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
                    if (model == null || string.IsNullOrEmpty(model.ApplicationID) == true || string.IsNullOrEmpty(model.ProjectID) == true)
                    {
                        return Content("필수 항목 확인", "text/html");
                    }

                    var queryResults = TransactionMapper.GetBusinessContracts().Select(p => p.Value).Where(p =>
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

                    List<BusinessContract> businessContracts = queryResults.ToList();
                    var value = JsonConvert.SerializeObject(businessContracts);
                    result = Content(JsonConvert.SerializeObject(value), "application/json");
                }
                catch (Exception exception)
                {
                    string exceptionText = exception.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        transactLoggerClient.ProgramMessageLogging("N", "E", exceptionText, "Transaction/Retrieve", (string error) =>
                        {
                            logger.Error("[{LogCategory}] fallback error: " + error + ", " + exceptionText, "Transaction/Retrieve");
                        });
                    }
                    else
                    {
                        logger.Error("[{LogCategory}] " + exceptionText, "Transaction/Retrieve");
                    }
                    result = StatusCode(500, exceptionText);
                }
            }

            return result;
        }

        // http://localhost:5000/transact/api/base64/encode?value={"ApplicationID":"SYN","ProjectID":"ZZD","TransactionID":"TST010","ServiceID":"G01","TransactionLog":true}
        // http://localhost:5000/transact/api/transaction/Log?base64Json=eyJQcm9qZWN0SUQiOiJTVlUiLCJCdXNpbmVzc0lEIjoiWlpEIiwiVHJhbnNhY3Rpb25JRCI6IlRTVDAxMCIsIkZ1bmN0aW9uSUQiOiJHMDEwMCIsIlRyYW5zYWN0aW9uTG9nIjp0cnVlfQ==
        [HttpGet("[action]")]
        public ActionResult Log(string base64Json)
        {
            var definition = new
            {
                ApplicationID = "",
                ProjectID = "",
                TransactionID = "",
                ServiceID = "",
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
                        BusinessContract? businessContract = TransactionMapper.GetBusinessContracts().Select(p => p.Value).Where(p =>
                            p.ApplicationID == model.ApplicationID &&
                            p.ProjectID == model.ProjectID &&
                            p.TransactionID == model.TransactionID).FirstOrDefault();

                        if (businessContract != null)
                        {
                            TransactionInfo? transactionInfo = businessContract.Services.Select(p => p).Where(p =>
                                p.ServiceID == model.ServiceID).FirstOrDefault();

                            if (transactionInfo != null)
                            {
                                transactionInfo.TransactionLog = model.TransactionLog;
                                var value = model.TransactionLog;
                                result = Content(JsonConvert.SerializeObject(value), "application/json");
                            }
                            else
                            {
                                result = Content(JsonConvert.SerializeObject(false), "application/json");
                            }
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
                        transactLoggerClient.ProgramMessageLogging("N", "E", exceptionText, "Transaction/Log", (string error) =>
                        {
                            logger.Error("[{LogCategory}] fallback error: " + error + ", " + exceptionText, "Transaction/Log");
                        });
                    }
                    else
                    {
                        logger.Error("[{LogCategory}] " + exceptionText, "Transaction/Log");
                    }
                    result = StatusCode(500, exceptionText);
                }
            }

            return result;
        }

        // http://localhost:5000/transact/api/transaction/meta
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
                    var businessContracts = TransactionMapper.GetBusinessContracts();

                    if (businessContracts != null)
                    {
                        result = Content(JsonConvert.SerializeObject(businessContracts), "application/json");
                    }
                }
                catch (Exception exception)
                {
                    string exceptionText = exception.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        transactLoggerClient.ProgramMessageLogging("N", "E", exceptionText, "Transaction/Meta", (string error) =>
                        {
                            logger.Error("[{LogCategory}] fallback error: " + error + ", " + exceptionText, "Transaction/Meta");
                        });
                    }
                    else
                    {
                        logger.Error("[{LogCategory}] " + exceptionText, "Transaction/Meta");
                    }
                    result = StatusCode(500, exceptionText);
                }
            }

            return result;
        }

        // http://localhost:5000/transact/api/transaction/execute
        [HttpPost("[action]")]
        public async Task<ActionResult> Execute(TransactionRequest request)
        {
            // 주요 구간 거래 명령 입력 횟수 및 명령 시간 기록
            TransactionResponse response = new TransactionResponse();
            response.Acknowledge = AcknowledgeType.Failure;

            if (request == null)
            {
                response.ExceptionText = "빈 요청. 요청 정보 확인 필요";
                return Content(JsonConvert.SerializeObject(response), "application/json");
            }

            try
            {
                DefaultResponseHeaderConfiguration(request, response);

                if (ModuleConfiguration.IsTransactionLogging == true)
                {
                    transactLoggerClient.TransactionRequestLogging(request, "Y", (string error) =>
                    {
                        // var transactionLogger = loggerFactory.CreateLogger($"{request.TH.PGM_ID}|{request.TH.BIZ_ID}|{request.TH.TRN_CD}|{request.TH.FUNC_CD}");
                        // transactionLogger.LogWarning($"Request GlobalID: {request.SH.GLBL_ID}, JSON: {JsonConvert.SerializeObject(request)}");
                    });
                }

                #region 입력 확인

                if (string.IsNullOrEmpty(request.Action) == true ||
                    string.IsNullOrEmpty(request.Kind) == true ||
                    request.System == null ||
                    request.Transaction == null ||
                    request.PayLoad == null ||
                    request.Interface == null)
                {
                    response.ExceptionText = "잘못된 입력 전문";
                    return LoggingAndReturn(response, "Y", null);
                }

                #endregion

                #region 입력 기본값 구성

                if (string.IsNullOrEmpty(request.Transaction.DataFormat) == true)
                {
                    request.Transaction.DataFormat = "J";
                }

                #endregion

                #region 기본 응답 정보 구성

                response.Message = new MessageType();

                var contentType = HttpContext.Request.ContentType;
                if (string.IsNullOrEmpty(contentType) == false && contentType.IndexOf("application/json") == -1)
                {
                    response.ExceptionText = $"'{contentType}' 입력 타입 확인 필요";
                    return LoggingAndReturn(response, "Y", null);
                }

                if (request.Transaction.DataFormat == "T")
                {
                    if (request.PayLoad.DataMapSet == null)
                    {
                        request.PayLoad.DataMapSet = new List<List<DataMapItem>>();
                    }

                    request.PayLoad.DataMapSet.Clear();

                    foreach (string dataMapSetRaw in request.PayLoad.DataMapSetRaw)
                    {
                        var reqJArray = ToJson(DecryptInputData(dataMapSetRaw, request.Transaction.CompressionYN));
                        var reqInputs = JsonConvert.DeserializeObject<List<DataMapItem>>(reqJArray.ToString());
                        if (reqInputs != null)
                        {
                            foreach (var reqInput in reqInputs)
                            {
                                if (string.IsNullOrEmpty(reqInput.FieldID) == true)
                                {
                                    reqInput.FieldID = "DEFAULT";
                                    reqInput.Value = "";
                                }
                            }
                            request.PayLoad.DataMapSet.Add(reqInputs);
                        }
                    }
                }
                else if (request.Transaction.DataFormat == "J")
                {
                    if (request.Transaction.CompressionYN.ParseBool() == true)
                    {
                        if (request.PayLoad.DataMapSet == null)
                        {
                            request.PayLoad.DataMapSet = new List<List<DataMapItem>>();
                        }

                        request.PayLoad.DataMapSet.Clear();

                        foreach (string dataMapSetRaw in request.PayLoad.DataMapSetRaw)
                        {
                            var decryptInputData = DecryptInputData(dataMapSetRaw, request.Transaction.CompressionYN);
                            if (decryptInputData == null)
                            {
                                request.PayLoad.DataMapSet.Add(new List<DataMapItem>());
                            }
                            else
                            {
                                var reqInput = JsonConvert.DeserializeObject<List<DataMapItem>>(decryptInputData);
                                if (reqInput == null)
                                {
                                    request.PayLoad.DataMapSet.Add(new List<DataMapItem>());
                                }
                                else
                                {
                                    request.PayLoad.DataMapSet.Add(reqInput);
                                }
                            }
                        }
                    }
                }
                else
                {
                    response.ExceptionText = $"데이터 포맷 '{request.Transaction.DataFormat}' 확인 필요";
                    return LoggingAndReturn(response, "Y", null);
                }

                string cacheKey = string.Empty;
                if (ModuleConfiguration.IsCodeDataCache == true && request.LoadOptions.Get<string>("codeCacheYN").ToStringSafe().ParseBool() == true)
                {
                    if (request.PayLoad != null && request.PayLoad.DataMapSet != null && request.PayLoad.DataMapSet.Count > 0)
                    {
                        var inputs = request.PayLoad.DataMapSet[0];
                        List<string> cacheKeys = new List<string>();
                        for (int i = 0; i < inputs.Count; i++)
                        {
                            var input = inputs[i];
                            cacheKeys.Add(input.FieldID + ":" + (input.Value == null ? "null" : input.Value.ToString()));
                        }

                        cacheKey = cacheKeys.ToJoin(";");

                        TransactionResponse transactionResponse = new TransactionResponse();
                        if (memoryCache.TryGetValue(cacheKey, out transactionResponse) == true)
                        {
                            transactionResponse.ResponseID = string.Concat(ModuleConfiguration.SystemID, GlobalConfiguration.HostName, request.Environment, DateTime.Now.ToString("yyyyMMddhhmmddsss"));

                            DefaultResponseHeaderConfiguration(request, transactionResponse);

                            return LoggingAndReturn(transactionResponse, "Y", null);
                        }
                    }
                    else
                    {
                        response.ExceptionText = $"ProgramID: '{request.System.ProgramID}', BusinessID: '{request.Transaction.BusinessID}', TransactionID: '{request.Transaction.TransactionID}' 코드 데이터 거래 입력 전문 확인 필요";
                        return LoggingAndReturn(response, "Y", null);
                    }
                }

                #endregion

                #region 입력 정보 검증

                if (string.IsNullOrEmpty(request.Environment) == false)
                {
                    // 환경정보구분코드가 허용 범위인지 확인
                    if (string.IsNullOrEmpty(ModuleConfiguration.AvailableEnvironment) == true || (string.IsNullOrEmpty(ModuleConfiguration.AvailableEnvironment) == false && ModuleConfiguration.AvailableEnvironment.Split(",").Where(p => p == request.Environment).Count() == 0))
                    {
                        response.ExceptionText = $"'{request.Environment}' 환경정보 구분코드가 허용 안됨";
                        return LoggingAndReturn(response, "Y", null);
                    }
                }
                else
                {
                    response.ExceptionText = $"입력 전문 '{request.Environment}' 환경정보 구분코드 확인 필요";
                    return LoggingAndReturn(response, "Y", null);
                }

                #endregion

                #region 입력 정보 복호화

                // F:Full, H:Header, B:Body 구간복호화 처리
                var encryptionType = request.LoadOptions.Get<string>("encryptionType");
                var encryptionKey = request.LoadOptions.Get<string>("encryptionKey");

                if (string.IsNullOrEmpty(encryptionType) == false && string.IsNullOrEmpty(encryptionKey) == false)
                {
                    if (encryptionType == "F")
                    {

                    }
                    else if (encryptionType == "H")
                    {

                    }
                    else if (encryptionType == "B")
                    {

                    }
                }

                #endregion

                #region 거래 Transaction 입력 전문 확인

                bool dynamicContract = request.LoadOptions.Get<string>("dynamic").ToStringSafe().ParseBool();
                BusinessContract? businessContract = TransactionMapper.Get(request.System.ProgramID, request.Transaction.BusinessID, request.Transaction.TransactionID);
                if (businessContract == null && dynamicContract == true)
                {
                    if (ModuleConfiguration.PublicTransactions != null && ModuleConfiguration.PublicTransactions.Count > 0)
                    {
                        PublicTransaction? publicTransaction = ModuleConfiguration.PublicTransactions.FirstOrDefault(p => p.ApplicationID == request.System.ProgramID && (p.ProjectID == "*" || p.ProjectID == request.Transaction.BusinessID) && (p.TransactionID == "*" || p.TransactionID == request.Transaction.TransactionID));
                        if (publicTransaction != null)
                        {
                            businessContract = new BusinessContract();
                            businessContract.ApplicationID = request.System.ProgramID;
                            businessContract.ProjectID = request.Transaction.BusinessID;
                            businessContract.TransactionProjectID = request.Transaction.BusinessID;
                            businessContract.TransactionID = request.Transaction.TransactionID;
                            businessContract.Services = new List<TransactionInfo>();
                            businessContract.Models = new List<Model>();

                            TransactionMapper.Add($"DYNAMIC|{request.System.ProgramID}|{request.Transaction.BusinessID}|{request.Transaction.TransactionID}", businessContract);
                        }
                    }
                }

                if (businessContract == null)
                {
                    response.ExceptionText = $"PGM_ID '{request.System.ProgramID}', BIZ_ID '{request.Transaction.BusinessID}', TRN_CD '{request.Transaction.TransactionID}' 거래 Transaction 입력 전문 확인 필요";
                    return LoggingAndReturn(response, "Y", null);
                }

                #endregion

                #region 거래 매핑 정보 확인

                TransactionInfo? transactionInfo = null;

                if (dynamicContract == true)
                {
                    bool dynamicAuthorize = request.LoadOptions.Get<string>("authorize").ToStringSafe().ParseBool();
                    string dynamicCommandType = request.LoadOptions.Get<string>("commandType").ToStringSafe();
                    string dynamicReturnType = request.LoadOptions.Get<string>("returnType").ToStringSafe();
                    bool dynamicTransactionScope = request.LoadOptions.Get<string>("transactionScope").ToStringSafe().ParseBool();
                    bool dynamicTransactionLog = request.LoadOptions.Get<string>("transactionLog").ToStringSafe().ParseBool();

                    transactionInfo = new TransactionInfo();
                    transactionInfo.ServiceID = request.Transaction.FunctionID;
                    transactionInfo.Authorize = dynamicAuthorize;
                    transactionInfo.CommandType = dynamicCommandType;
                    transactionInfo.TransactionScope = dynamicTransactionScope;
                    transactionInfo.SequentialOptions = new List<SequentialOption>();
                    transactionInfo.ReturnType = string.IsNullOrEmpty(dynamicReturnType) == true ? "Json" : dynamicReturnType;
                    transactionInfo.AccessScreenID = new List<string>() { request.Transaction.TransactionID };
                    transactionInfo.TransactionLog = dynamicTransactionLog;
                    transactionInfo.Inputs = new List<ModelInputContract>();
                    transactionInfo.Outputs = new List<ModelOutputContract>();
                }
                else
                {
                    var services = from item in businessContract.Services
                                   where item.ServiceID == request.Transaction.FunctionID
                                   select item;

                    if (services != null && services.Count() == 1)
                    {
                        transactionInfo = services.ToList().FirstOrDefault<TransactionInfo>().DeepCopy();
                    }
                    else if (services != null && services.Count() > 1)
                    {
                        response.ExceptionText = $"FUNC_CD '{request.Transaction.FunctionID}' 거래 매핑 중복 정보 확인 필요";
                        return LoggingAndReturn(response, "Y", transactionInfo);
                    }
                }

                if (transactionInfo == null)
                {
                    response.ExceptionText = $"FUNC_CD '{request.Transaction.FunctionID}' 거래 매핑 정보 확인 필요";
                    return LoggingAndReturn(response, "Y", transactionInfo);
                }

                bool isAccessScreenID = false;
                if (transactionInfo.AccessScreenID == null)
                {
                    if (businessContract.TransactionID == request.Transaction.ScreenID)
                    {
                        isAccessScreenID = true;
                    }
                }
                else
                {
                    if (transactionInfo.AccessScreenID.IndexOf(request.Transaction.ScreenID) > -1)
                    {
                        isAccessScreenID = true;
                    }
                    else if (businessContract.TransactionID == request.Transaction.ScreenID)
                    {
                        isAccessScreenID = true;
                    }
                }

                if (isAccessScreenID == false)
                {
                    if (ModuleConfiguration.PublicTransactions != null && ModuleConfiguration.PublicTransactions.Count > 0)
                    {
                        PublicTransaction? publicTransaction = ModuleConfiguration.PublicTransactions.FirstOrDefault(p => p.ApplicationID == request.System.ProgramID && (p.ProjectID == "*" || p.ProjectID == request.Transaction.BusinessID) && (p.TransactionID == "*" || p.TransactionID == request.Transaction.TransactionID));
                        if (publicTransaction != null)
                        {
                            isAccessScreenID = true;
                        }
                    }

                    if (isAccessScreenID == false)
                    {
                        response.ExceptionText = $"TRN_SCRN_CD '{request.Transaction.ScreenID}' 요청 가능화면 거래 매핑 정보 확인 필요";
                        return LoggingAndReturn(response, "Y", transactionInfo);
                    }
                }

                #endregion

                #region 거래 입력 정보 생성

                string requestSystemID = "";
                BearerToken? bearerToken = null;
                string token = request.AccessToken;
                try
                {
                    bool isBypassAuthorizeIP = false;
                    if (string.IsNullOrEmpty(ModuleConfiguration.BypassAuthorizeIP.FirstOrDefault(p => p == "*")) == false)
                    {
                        isBypassAuthorizeIP = true;
                    }
                    else
                    {
                        foreach (var ip in ModuleConfiguration.BypassAuthorizeIP)
                        {
                            if (request.Interface.SourceIP.IndexOf(ip) > -1)
                            {
                                isBypassAuthorizeIP = true;
                                break;
                            }
                        }
                    }

                    if (request.System.Routes.Count > 0)
                    {
                        var route = request.System.Routes[request.System.Routes.Count - 1];
                        requestSystemID = route.SystemID;
                    }

                    if (ModuleConfiguration.SystemID == requestSystemID && isBypassAuthorizeIP == true)
                    {
                        if (string.IsNullOrEmpty(token) == false && token.IndexOf(".") > -1 && string.IsNullOrEmpty(request.Transaction.OperatorID) == false)
                        {
                            string[] tokenArray = token.Split(".");
                            string userID = tokenArray[0].DecodeBase64();

                            token = tokenArray[1];
                            bearerToken = JsonConvert.DeserializeObject<BearerToken>(token.DecryptAES(request.Transaction.OperatorID.PadRight(32, ' ')));
                        }
                    }
                    else
                    {
                        if (ModuleConfiguration.SystemID != requestSystemID)
                        {
                            response.ExceptionText = $"SystemID: {requestSystemID} 확인 필요";
                            return LoggingAndReturn(response, "Y", transactionInfo);
                        }
                        else if (string.IsNullOrEmpty(token) == true)
                        {
                            if (ModuleConfiguration.UseApiAuthorize == true && transactionInfo.Authorize == true)
                            {
                                response.ExceptionText = $"'{businessContract.ApplicationID}' 어플리케이션 또는 '{businessContract.ProjectID}' 프로젝트 권한 확인 필요";
                                return LoggingAndReturn(response, "Y", transactionInfo);
                            }
                        }
                        else if (ModuleConfiguration.UseApiAuthorize == true)
                        {
                            if (token.IndexOf(".") == -1)
                            {
                                response.ExceptionText = "Bearer-Token 기본 무결성 확인 필요";
                                return LoggingAndReturn(response, "Y", transactionInfo);
                            }

                            string[] tokenArray = token.Split(".");
                            string userID = tokenArray[0].DecodeBase64();

                            if (userID != request.Transaction.OperatorID)
                            {
                                response.ExceptionText = "Bearer-Token 사용자 무결성 확인 필요";
                                return LoggingAndReturn(response, "Y", transactionInfo);
                            }

                            token = tokenArray[1];
                            bearerToken = JsonConvert.DeserializeObject<BearerToken>(token.DecryptAES(request.Transaction.OperatorID.PadRight(32, ' ')));

                            if (bearerToken == null)
                            {
                                response.ExceptionText = "Bearer-Token 정보 무결성 확인 필요";
                                return LoggingAndReturn(response, "Y", transactionInfo);
                            }

                            if (transactionInfo.Authorize == true)
                            {
                                if (bearerToken.Claim.AllowApplications.IndexOf(businessContract.ApplicationID) == -1)
                                {
                                    response.ExceptionText = $"{businessContract.ApplicationID} 어플리케이션 권한 확인 필요";
                                    return LoggingAndReturn(response, "Y", transactionInfo);
                                }

                                if (bearerToken.Claim.AllowProjects.IndexOf(businessContract.ProjectID) == -1)
                                {
                                    response.ExceptionText = $"{businessContract.ProjectID} 프로젝트 권한 확인 필요";
                                    return LoggingAndReturn(response, "Y", transactionInfo);
                                }
                            }
                        }
                    }
                }
                catch (Exception exception)
                {
                    response.ExceptionText = $"인증 또는 권한 확인 오류 - {exception.ToMessage()}";
                    return LoggingAndReturn(response, "N", transactionInfo);
                }

                // 거래 프로그램 ID가 선언되었다면 요청 정보를 ByPass 한다
                if (string.IsNullOrEmpty(businessContract.TransactionApplicationID) == false)
                {
                    // request를 TransactionApplicationID에 요청하고 응답값을 반환
                }

                // 마스킹 개별 필드 복호화
                foreach (var items in request.Transaction.Maskings)
                {

                }

                // 거래 Inputs/Outpus 정보 확인
                if (string.IsNullOrEmpty(request.PayLoad.DataMapInterface) == false)
                {
                    if (transactionInfo.Inputs.Count == 0)
                    {
                        string[] dti = request.PayLoad.DataMapInterface.Split("|");
                        string[] inputs = dti[0].Split(",");
                        foreach (string item in inputs)
                        {
                            if (string.IsNullOrEmpty(item) == false)
                            {
                                transactionInfo.Inputs.Add(new ModelInputContract()
                                {
                                    ModelID = "Dynamic",
                                    Fields = new List<string>(),
                                    TestValues = new List<TestValue>(),
                                    DefaultValues = new List<DefaultValue>(),
                                    Type = item,
                                    BaseFieldMappings = new List<BaseFieldMapping>(),
                                    ParameterHandling = item == "Row" ? "Rejected" : "ByPassing"
                                });
                            }
                        }
                    }

                    if (transactionInfo.Outputs.Count == 0)
                    {
                        string[] dti = request.PayLoad.DataMapInterface.Split("|");
                        string[] outputs = dti[1].Split(",");
                        foreach (string item in outputs)
                        {
                            if (string.IsNullOrEmpty(item) == false)
                            {
                                transactionInfo.Outputs.Add(new ModelOutputContract()
                                {
                                    ModelID = "Dynamic",
                                    Fields = new List<string>(),
                                    Type = item
                                });
                            }
                        }
                    }
                }

                TransactionObject transactionObject = new TransactionObject();
                transactionObject.LoadOptions = request.LoadOptions;
                if (transactionObject.LoadOptions != null && transactionObject.LoadOptions.Count > 0)
                {
                }

                transactionObject.RequestID = string.Concat(ModuleConfiguration.SystemID, GlobalConfiguration.HostName, request.Environment, request.Transaction.ScreenID, DateTime.Now.ToString("yyyyMMddhhmmddsss"));
                transactionObject.GlobalID = request.Transaction.GlobalID;
                transactionObject.TransactionID = string.Concat(businessContract.ApplicationID, "|", businessContract.TransactionProjectID, "|", request.Transaction.TransactionID);
                transactionObject.ServiceID = request.Transaction.FunctionID;
                transactionObject.TransactionScope = transactionInfo.TransactionScope;
                transactionObject.ReturnType = transactionInfo.ReturnType;
                transactionObject.InputsItemCount = request.PayLoad.DataMapCount;

                List<Model> businessModels = businessContract.Models;
                List<ModelInputContract> inputContracts = transactionInfo.Inputs;
                List<ModelOutputContract> outputContracts = transactionInfo.Outputs;
                var requestInputs = request.PayLoad.DataMapSet;

                // 입력 항목이 계약과 동일한지 확인
                if (inputContracts.Count > 0 && inputContracts.Count != request.PayLoad.DataMapCount.Count)
                {
                    response.ExceptionText = $"'{transactionObject.TransactionID}|{request.Transaction.FunctionID}' 거래 입력 항목이 계약과 동일한지 확인 필요";
                    return LoggingAndReturn(response, "Y", transactionInfo);
                }

                // 입력 항목ID가 계약에 적합한지 확인
                int inputOffset = 0;
                Dictionary<string, List<List<DataMapItem>>> requestInputItems = new Dictionary<string, List<List<DataMapItem>>>();
                for (int i = 0; i < inputContracts.Count; i++)
                {
                    ModelInputContract inputContract = inputContracts[i];
                    Model? model = businessModels.GetBusinessModel(inputContract.ModelID);

                    if (model == null && inputContract.ModelID != "Unknown" && inputContract.ModelID != "Dynamic")
                    {
                        response.ExceptionText = $"'{transactionObject.TransactionID}|{request.Transaction.FunctionID}' 거래 입력에 '{inputContract.ModelID}' 입력 모델 ID가 계약에 있는지 확인";
                        return LoggingAndReturn(response, "Y", transactionInfo);
                    }

                    int inputCount = request.PayLoad.DataMapCount[i];
                    if (inputContract.Type == "Row" && inputCount != 1)
                    {
                        response.ExceptionText = $"'{transactionObject.TransactionID}|{request.Transaction.FunctionID}' 거래 입력 항목이 계약과 동일한지 확인 필요";
                        return LoggingAndReturn(response, "Y", transactionInfo);
                    }

                    if (inputContract.ParameterHandling == "Rejected" && inputCount == 0)
                    {
                        response.ExceptionText = $"'{transactionObject.TransactionID}|{request.Transaction.FunctionID}' 거래 입력에 필요한 입력 항목이 필요";
                        return LoggingAndReturn(response, "Y", transactionInfo);
                    }

                    if (inputContract.ParameterHandling == "ByPassing" && inputCount == 0)
                    {
                        continue;
                    }

                    List<DataMapItem> requestInput;
                    if (inputContract.ParameterHandling == "DefaultValue" && inputCount == 0)
                    {
                        if (inputContract.DefaultValues == null)
                        {
                            response.ExceptionText = $"'{transactionObject.TransactionID}|{request.Transaction.FunctionID}' 거래 입력에 필요한 기본값 입력 항목 확인 필요";
                            return LoggingAndReturn(response, "Y", transactionInfo);
                        }

                        request.PayLoad.DataMapCount[i] = 1;
                        transactionObject.InputsItemCount[i] = 1;
                        inputCount = 1;
                        requestInput = new List<DataMapItem>();

                        int fieldIndex = 0;
                        foreach (string REQ_FIELD_ID in inputContract.Fields)
                        {
                            DefaultValue defaultValue = inputContract.DefaultValues[fieldIndex];
                            DbColumn? column = null;

                            if (model == null)
                            {
                                column = new DbColumn()
                                {
                                    Name = REQ_FIELD_ID,
                                    Length = -1,
                                    DataType = "String",
                                    Default = "",
                                    Require = false
                                };
                            }
                            else
                            {
                                column = model.Columns.FirstOrDefault(p => p.Name == REQ_FIELD_ID);
                            }

                            DataMapItem tempReqInput = new DataMapItem();
                            tempReqInput.FieldID = REQ_FIELD_ID;

                            SetInputDefaultValue(defaultValue, column, tempReqInput);

                            requestInput.Add(tempReqInput);

                            fieldIndex = fieldIndex + 1;
                        }

                        requestInputs.Add(requestInput);
                    }
                    else
                    {
                        requestInput = requestInputs[inputOffset];
                    }

                    if (inputContract.ModelID != "Unknown" && inputContract.ModelID != "Dynamic")
                    {
                        foreach (var item in requestInput)
                        {
                            if (inputContract.Fields.Contains(item.FieldID) == false)
                            {
                                if (item.FieldID == "Flag")
                                {
                                }
                                else
                                {
                                    response.ExceptionText = $"'{transactionObject.TransactionID}|{request.Transaction.FunctionID}' 거래 입력에 '{item.FieldID}' 항목 ID가 계약에 있는지 확인";
                                    return LoggingAndReturn(response, "Y", transactionInfo);
                                }
                            }
                        }
                    }

                    requestInputItems.Add(inputContract.ModelID + i.ToString(), requestInputs.Skip(inputOffset).Take(inputCount).ToList());
                    inputOffset = inputOffset + inputCount;
                }

                List<List<TransactField>> transactInputs = new List<List<TransactField>>();

                int index = 0;
                foreach (var requestInputItem in requestInputItems)
                {
                    string modelID = requestInputItem.Key;
                    List<List<DataMapItem>> inputItems = requestInputItem.Value;

                    // 입력 정보 생성
                    ModelInputContract inputContract = inputContracts[index];
                    Model? model = businessModels.GetBusinessModel(inputContract.ModelID);

                    if (model == null && inputContract.ModelID != "Unknown" && inputContract.ModelID != "Dynamic")
                    {
                        response.ExceptionText = $"'{transactionObject.TransactionID}|{request.Transaction.FunctionID}' 거래 입력에 '{inputContract.ModelID}' 입력 모델 ID가 계약에 있는지 확인";
                        return LoggingAndReturn(response, "Y", transactionInfo);
                    }

                    for (int i = 0; i < inputItems.Count; i++)
                    {
                        List<TransactField> transactInput = new List<TransactField>();
                        List<DataMapItem> requestInput = inputItems[i];

                        foreach (var item in requestInput)
                        {
                            DbColumn? column = null;

                            if (model == null)
                            {
                                column = new DbColumn()
                                {
                                    Name = item.FieldID,
                                    Length = -1,
                                    DataType = "String",
                                    Default = "",
                                    Require = false
                                };
                            }
                            else
                            {
                                column = model.Columns.FirstOrDefault(p => p.Name == item.FieldID);
                            }

                            if (column == null)
                            {
                                response.ExceptionText = $"'{inputContract.ModelID}' 입력 모델 또는 '{item.FieldID}' 항목 확인 필요";
                                return LoggingAndReturn(response, "Y", transactionInfo);
                            }
                            else
                            {
                                TransactField transactField = new TransactField();
                                transactField.FieldID = item.FieldID;
                                transactField.Length = column.Length;
                                transactField.DataType = column.DataType.ToString();

                                if (item.Value == null)
                                {
                                    if (column.Require == true)
                                    {
                                        transactField.Value = column.Default;
                                    }
                                    else
                                    {
                                        transactField.Value = null;
                                    }
                                }
                                else
                                {
                                    if (item.Value.ToString() == "[DbNull]")
                                    {
                                        transactField.Value = null;
                                    }
                                    else
                                    {
                                        transactField.Value = item.Value;
                                    }
                                }
                                transactField.Value = item.Value == null ? (column.Require == true ? column.Default : null) : item.Value;

                                transactInput.Add(transactField);
                            }
                        }

                        JObject? bearerFields = bearerToken == null ? null : bearerToken.Addtional as JObject;
                        if (bearerFields != null)
                        {
                            foreach (var item in bearerFields)
                            {
                                string REQ_FIELD_ID = "$" + item.Key;
                                JToken? jToken = item.Value;
                                if (jToken == null)
                                {
                                    response.ExceptionText = $"{REQ_FIELD_ID} Bearer 필드 확인 필요";
                                    return LoggingAndReturn(response, "Y", transactionInfo);
                                }

                                DbColumn column = new DbColumn()
                                {
                                    Name = REQ_FIELD_ID,
                                    Length = -1,
                                    DataType = "String",
                                    Default = "",
                                    Require = false
                                };

                                TransactField transactField = new TransactField();
                                transactField.FieldID = REQ_FIELD_ID;
                                transactField.Length = column.Length;
                                transactField.DataType = column.DataType.ToString();

                                object? REQ_FIELD_DAT = null;
                                if (jToken is JValue)
                                {
                                    REQ_FIELD_DAT = jToken.ToObject<string>();
                                }
                                else if (jToken is JObject)
                                {
                                    REQ_FIELD_DAT = jToken.ToString();
                                }
                                else if (jToken is JArray)
                                {
                                    REQ_FIELD_DAT = jToken.ToArray();
                                }

                                if (REQ_FIELD_DAT == null)
                                {
                                    if (column.Require == true)
                                    {
                                        transactField.Value = column.Default;
                                    }
                                    else
                                    {
                                        transactField.Value = null;
                                    }
                                }
                                else
                                {
                                    if (REQ_FIELD_DAT.ToString() == "[DbNull]")
                                    {
                                        transactField.Value = null;
                                    }
                                    else
                                    {
                                        transactField.Value = REQ_FIELD_DAT;
                                    }
                                }
                                transactField.Value = REQ_FIELD_DAT == null ? (column.Require == true ? column.Default : null) : REQ_FIELD_DAT;

                                transactInput.Add(transactField);
                            }
                        }

                        transactInputs.Add(transactInput);
                    }

                    index = index + 1;
                }

                transactionObject.Inputs = transactInputs;

                #endregion

                #region 명령 구분 확인(Console, DataTransaction, ApiServer, FileServer)

                request.Transaction.CommandType = transactionInfo.CommandType;
                response.Transaction.CommandType = transactionInfo.CommandType;
                ApplicationResponse applicationResponse = new ApplicationResponse();

                if (request.Action == "PSH")
                {
                    _ = Task.Run(async () =>
                    {
                        applicationResponse = await applicationRequest(request, response, transactionInfo, transactionObject, businessModels, inputContracts, outputContracts, applicationResponse);
                    });
                    return LoggingAndReturn(response, "Y", transactionInfo);
                }

                applicationResponse = await applicationRequest(request, response, transactionInfo, transactionObject, businessModels, inputContracts, outputContracts, applicationResponse);

                if (string.IsNullOrEmpty(applicationResponse.ExceptionText) == false)
                {
                    response.ExceptionText = applicationResponse.ExceptionText;
                    return LoggingAndReturn(response, "Y", transactionInfo);
                }

                #endregion

                #region 거래 명령 실행 및 결과 반환

                string responseData = string.Empty;
                string properties = "Transaction/Response ReturnType: " + transactionInfo.ReturnType.ToString();

                switch (transactionInfo.ReturnType)
                {
                    case "DataSet":
                        var responseObject = applicationResponse.ResultObject as byte[];

                        if (responseObject != null)
                        {
                            if (ModuleConfiguration.IsTransactionLogging == true || transactionInfo == null || transactionInfo.TransactionLog == true)
                            {
                                if (ModuleConfiguration.IsLogServer == true)
                                {
                                    transactLoggerClient.ProgramMessageLogging("Y", "D", responseObject.Length.ToString(), properties, (string error) =>
                                    {
                                        logger.Error("[{LogCategory}] fallback error: " + error + ", " + responseObject.Length.ToString(), properties);
                                    });
                                }
                                else
                                {
                                    logger.Warning("[{LogCategory}] " + responseObject.Length.ToString(), properties);
                                }
                            }
                        }
                        else
                        {
                            responseObject = new byte[0];
                        }

                        return File(responseObject, "application/octet-stream");
                    case "Scalar":
                        responseData = applicationResponse.ResultObject.ToStringSafe();

                        if (ModuleConfiguration.IsTransactionLogging == true || transactionInfo == null || transactionInfo.TransactionLog == true)
                        {
                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                transactLoggerClient.ProgramMessageLogging("Y", "D", responseData, properties, (string error) =>
                                {
                                    logger.Error("[{LogCategory}] fallback error: " + error + ", " + responseData, properties);
                                });
                            }
                            else
                            {
                                logger.Warning("[{LogCategory}] " + responseData, properties);
                            }
                        }

                        return Content(responseData, "text/html");
                    case "NonQuery":
                        responseData = applicationResponse.ResultInteger.ToString();

                        if (ModuleConfiguration.IsTransactionLogging == true || transactionInfo == null || transactionInfo.TransactionLog == true)
                        {
                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                transactLoggerClient.ProgramMessageLogging("Y", "D", responseData, properties, (string error) =>
                                {
                                    logger.Error("[{LogCategory}] fallback error: " + error + ", " + responseData, properties);
                                });
                            }
                            else
                            {
                                logger.Warning("[{LogCategory}] " + responseData, properties);
                            }
                        }

                        return Content(responseData, "text/html");
                    case "Xml":
                        responseData = applicationResponse.ResultObject == null ? "" : applicationResponse.ResultObject.ToStringSafe();

                        if (ModuleConfiguration.IsTransactionLogging == true || transactionInfo == null || transactionInfo.TransactionLog == true)
                        {
                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                transactLoggerClient.ProgramMessageLogging("Y", "D", responseData, properties, (string error) =>
                                {
                                    logger.Error("[{LogCategory}] fallback error: " + error + ", " + responseData, properties);
                                });
                            }
                            else
                            {
                                logger.Warning("[{LogCategory}] " + responseData, properties);
                            }
                        }

                        return Content(responseData, "application/xml");
                    case "DynamicJson":
                        responseData = applicationResponse.ResultJson == null ? "" : applicationResponse.ResultJson.ToString();

                        if (ModuleConfiguration.IsTransactionLogging == true || transactionInfo == null || transactionInfo.TransactionLog == true)
                        {
                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                transactLoggerClient.ProgramMessageLogging("Y", "D", responseData, properties, (string error) =>
                                {
                                    logger.Error("[{LogCategory}] fallback error: " + error + ", " + responseData, properties);
                                });
                            }
                            else
                            {
                                logger.Warning("[{LogCategory}] " + responseData, properties);
                            }
                        }

                        return Content(responseData, "application/json");
                    default:
                        response.Message.ResponseStatus = "N"; // N: Normal, W: Warning, E: Error
                        response.Message.MainCode = nameof(MessageCode.T200);
                        response.Message.MainText = MessageCode.T200;

                        // 거래 명령 응답 시간 기록
                        // 거래 명령 결과 확인
                        // 거래 명령 성공/ 실패 응답 횟수 기록
                        // 거래 Transaction 응답 전문 생성
                        // 응답 반환

                        response.ResponseID = string.Concat(ModuleConfiguration.SystemID, GlobalConfiguration.HostName, request.Environment, DateTime.Now.ToString("yyyyMMddhhmmddsss"));
                        response.Acknowledge = AcknowledgeType.Success;
                        ExecuteDynamicTypeObject executeDynamicTypeObject = (ExecuteDynamicTypeObject)Enum.Parse(typeof(ExecuteDynamicTypeObject), transactionInfo.ReturnType);
                        response.Result.ResponseType = ((int)executeDynamicTypeObject).ToString();

                        if (response.Transaction.DataFormat == "T")
                        {
                            List<string> resultMeta = applicationResponse.ResultMeta;
                            int i = 0;
                            foreach (var dataMapItem in response.Result.DataSet)
                            {
                                JToken? Value = dataMapItem.Value as JToken;
                                if (Value != null)
                                {
                                    if (Value is JObject)
                                    {
                                        var names = Value.ToObject<JObject>()?.Properties().Select(p => p.Name).ToList();
                                        if (names != null)
                                        {
                                            foreach (var item in names)
                                            {
                                                string? data = Value[item]?.ToString();
                                                if (string.IsNullOrEmpty(data) == false)
                                                {
                                                    if (data.StartsWith('"') == true)
                                                    {
                                                        Value[item] = "\"" + data;
                                                    }

                                                    if (data.EndsWith('"') == true)
                                                    {
                                                        Value[item] = data + "\"";
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    else if (Value is JArray)
                                    {
                                        var jtokens = Value.ToObject<JArray>()?.ToList();
                                        if (jtokens != null)
                                        {
                                            foreach (var jtoken in jtokens)
                                            {
                                                var names = jtoken.ToObject<JObject>()?.Properties().Select(p => p.Name).ToList();
                                                if (names != null)
                                                {
                                                    foreach (var item in names)
                                                    {
                                                        string? data = jtoken[item]?.ToString();
                                                        if (string.IsNullOrEmpty(data) == false)
                                                        {
                                                            if (data.ToString().StartsWith('"') == true)
                                                            {
                                                                jtoken[item] = "\"" + data;
                                                            }

                                                            if (data.ToString().EndsWith('"') == true)
                                                            {
                                                                jtoken[item] = data + "\"";
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    string meta = resultMeta[i];
                                    if (Value.HasValues == true)
                                    {
                                        var jsonReader = new StringReader(Value.ToString());
                                        using (ChoJSONReader choJSONReader = new ChoJSONReader(jsonReader))
                                        {
                                            var stringBuilder = new StringBuilder();
                                            using (var choCSVWriter = new ChoCSVWriter(stringBuilder, new ChoCSVRecordConfiguration()
                                            {
                                                Delimiter = "｜",
                                                EOLDelimiter = "↵"
                                            }).WithFirstLineHeader().QuoteAllFields(false))
                                            {
                                                choCSVWriter.Write(choJSONReader);
                                            }

                                            if (request.Transaction.CompressionYN.ParseBool() == true)
                                            {
                                                dataMapItem.Value = LZStringHelper.CompressToBase64(meta + "＾" + stringBuilder.ToString().Replace("\"\"", "\""));
                                            }
                                            else
                                            {
                                                dataMapItem.Value = meta + "＾" + stringBuilder.ToString().Replace("\"\"", "\"");
                                            }
                                        }
                                    }
                                    else
                                    {
                                        dataMapItem.Value = meta + "＾";
                                    }
                                }

                                i = i + 1;
                            }
                        }
                        else
                        {
                            List<string> resultMeta = applicationResponse.ResultMeta;
                            int i = 0;
                            foreach (var dataMapItem in response.Result.DataSet)
                            {
                                JToken? value = dataMapItem.Value as JToken;
                                if (value != null)
                                {
                                    if (request.Transaction.CompressionYN.ParseBool() == true)
                                    {
                                        dataMapItem.Value = LZStringHelper.CompressToBase64(JsonConvert.SerializeObject(value));
                                    }
                                }

                                i = i + 1;
                            }
                        }

                        if (ModuleConfiguration.IsCodeDataCache == true && request.LoadOptions.Get<string>("codeCacheYN").ToStringSafe().ParseBool() == true && string.IsNullOrEmpty(cacheKey) == false)
                        {
                            if (memoryCache.Get(cacheKey) == null)
                            {
                                memoryCache.Set(cacheKey, response, TimeSpan.FromMinutes(ModuleConfiguration.CodeDataCacheTimeout));
                            }
                        }

                        return LoggingAndReturn(response, "Y", transactionInfo);
                }

                #endregion
            }
            catch (Exception exception)
            {
                response.ExceptionText = exception.ToMessage();
            }

            return LoggingAndReturn(response, "N", null);
        }

        private async Task<ApplicationResponse> applicationRequest(TransactionRequest request, TransactionResponse response, TransactionInfo? transactionInfo, TransactionObject transactionObject, List<Model> businessModels, List<ModelInputContract> inputContracts, List<ModelOutputContract> outputContracts, ApplicationResponse applicationResponse)
        {
            if (transactionInfo != null)
            {
                switch (transactionInfo.CommandType)
                {
                    case "C":
                    case "T":
                    case "D":
                    case "A":
                    case "F":
                        applicationResponse = await DataTransactionAsync(request, response, transactionInfo, transactionObject, businessModels, inputContracts, outputContracts);
                        break;
                    case "S":
                        applicationResponse = await SequentialDataTransactionAsync(request, response, transactionInfo, transactionObject, businessModels, inputContracts, outputContracts);
                        if (string.IsNullOrEmpty(applicationResponse.ExceptionText) == true)
                        {
                            applicationResponse = SequentialResultContractValidation(applicationResponse, request, response, transactionInfo, transactionObject, businessModels, outputContracts);
                        }
                        break;
                    case "R":
                        applicationResponse = new ApplicationResponse();
                        applicationResponse.ExceptionText = "CommandType 확인 필요";
                        break;
                    default:
                        applicationResponse = new ApplicationResponse();
                        applicationResponse.ExceptionText = "CommandType 확인 필요";
                        break;
                }
            }
            else
            {
                applicationResponse.ExceptionText = "transactionInfo 확인 필요";
            }

            return applicationResponse;
        }

        private static string? DecryptInputData(string inputData, string decrptCode)
        {
            string? result;
            if (decrptCode.ParseBool() == true)
            {
                result = LZStringHelper.DecompressFromBase64(inputData);
            }
            else
            {
                result = inputData;
            }

            return result;
        }

        private ApplicationResponse SequentialResultContractValidation(ApplicationResponse applicationResponse, TransactionRequest request, TransactionResponse response, TransactionInfo transactionInfo, TransactionObject transactionObject, List<Model> businessModels, List<ModelOutputContract> outputContracts)
        {
            List<DataMapItem>? outputs = JsonConvert.DeserializeObject<List<DataMapItem>>(applicationResponse.ResultJson, new JsonSerializerSettings { TypeNameHandling = TypeNameHandling.All });

            if (outputs != null && outputContracts.Count > 0)
            {
                if (outputContracts.Where(p => p.Type == "Dynamic").Count() > 0)
                {
                }
                else
                {
                    int additionCount = outputContracts.Where(p => p.Type == "Addition").Count();
                    if ((outputContracts.Count - additionCount + (additionCount > 0 ? 1 : 0)) != outputs.Count)
                    {
                        applicationResponse.ExceptionText = $"'{transactionObject.TransactionID}|{request.Transaction.FunctionID}' 거래 입력에 출력 모델 개수 확인 필요, 계약 건수 - '{outputContracts.Count}', 응답 건수 - '{outputs.Count}'";
                        return applicationResponse;
                    }

                    var lastIndex = outputs.Count - 1;
                    for (int i = 0; i < outputs.Count; i++)
                    {
                        DataMapItem output = outputs[i];
                        ModelOutputContract outputContract = outputContracts[i];
                        Model? model = businessModels.GetBusinessModel(outputContract.ModelID);

                        if (model == null && outputContract.ModelID != "Unknown" && outputContract.ModelID != "Dynamic")
                        {
                            applicationResponse.ExceptionText = $"'{transactionObject.TransactionID}|{request.Transaction.FunctionID}' 거래 입력에 '{outputContract.ModelID}' 출력 모델 ID가 계약에 있는지 확인";
                            return applicationResponse;
                        }

                        DataMapItem responseData = new DataMapItem();
                        responseData.FieldID = output.FieldID;

                        if (additionCount > 0 && i == lastIndex)
                        {
                            continue;
                        }

                        dynamic tempParseJson;
                        if (model == null)
                        {
                            if (outputContract.ModelID == "Unknown")
                            {
                                if (outputContract.Type == "Form")
                                {
                                    tempParseJson = JObject.Parse(output.Value.ToStringSafe());
                                    JObject jObject = (JObject)tempParseJson;
                                    foreach (JProperty property in jObject.Properties())
                                    {
                                        if (outputContract.Fields.Contains(property.Name) == false)
                                        {
                                            applicationResponse.ExceptionText = $"{outputContract.Type} 출력 모델에 '{property.Name}' 항목 확인 필요";
                                            return applicationResponse;
                                        }
                                    }
                                }
                                else if (outputContract.Type == "Grid" || outputContract.Type == "DataSet")
                                {
                                    tempParseJson = JArray.Parse(output.Value.ToStringSafe());
                                    if (tempParseJson.Count > 0)
                                    {
                                        JObject jObject = (JObject)tempParseJson.First;
                                        foreach (JProperty property in jObject.Properties())
                                        {
                                            if (outputContract.Fields.Contains(property.Name) == false)
                                            {
                                                applicationResponse.ExceptionText = $"{outputContract.Type} 출력 모델에 '{property.Name}' 항목 확인 필요";
                                                return applicationResponse;
                                            }
                                        }
                                    }
                                }
                                else if (outputContract.Type == "Chart")
                                {
                                    tempParseJson = JToken.Parse(output.Value.ToStringSafe());
                                }
                                else if (outputContract.Type == "Dynamic")
                                {
                                    tempParseJson = JToken.Parse(output.Value.ToStringSafe());
                                }
                            }
                            else if (outputContract.ModelID == "Dynamic")
                            {
                                if (outputContract.Type == "Form")
                                {
                                    tempParseJson = JObject.Parse(output.Value.ToStringSafe());
                                }
                                else if (outputContract.Type == "Grid")
                                {
                                    tempParseJson = JArray.Parse(output.Value.ToStringSafe());
                                }
                                else if (outputContract.Type == "Chart")
                                {
                                    tempParseJson = JToken.Parse(output.Value.ToStringSafe());
                                }
                                else if (outputContract.Type == "DataSet")
                                {
                                    tempParseJson = JToken.Parse(output.Value.ToStringSafe());
                                }
                                else if (outputContract.Type == "Dynamic")
                                {
                                    tempParseJson = JToken.Parse(output.Value.ToStringSafe());
                                }
                            }
                        }
                        else
                        {
                            if (outputContract.Type == "Form")
                            {
                                tempParseJson = JObject.Parse(output.Value.ToStringSafe());
                                JObject jObject = (JObject)tempParseJson;
                                foreach (JProperty property in jObject.Properties())
                                {
                                    if (model.Columns.IsContain(property.Name) == false)
                                    {
                                        applicationResponse.ExceptionText = $"'{model.Name}' {outputContract.Type} 출력 모델에 '{property.Name}' 항목 확인 필요";
                                        return applicationResponse;
                                    }
                                }
                            }
                            else if (outputContract.Type == "Grid" || outputContract.Type == "DataSet")
                            {
                                tempParseJson = JArray.Parse(output.Value.ToStringSafe());
                                if (tempParseJson.Count > 0)
                                {
                                    JObject jObject = (JObject)tempParseJson.First;
                                    foreach (JProperty property in jObject.Properties())
                                    {
                                        if (model.Columns.IsContain(property.Name) == false)
                                        {
                                            applicationResponse.ExceptionText = $"'{model.Name}' {outputContract.Type} 출력 모델에 '{property.Name}' 항목 확인 필요";
                                            return applicationResponse;
                                        }
                                    }
                                }
                            }
                            else if (outputContract.Type == "Chart")
                            {
                                tempParseJson = JToken.Parse(output.Value.ToStringSafe());
                            }
                            else if (outputContract.Type == "Dynamic")
                            {
                                tempParseJson = JToken.Parse(output.Value.ToStringSafe());
                            }
                        }
                    }
                }
            }

            return applicationResponse;
        }

        private async Task<ApplicationResponse> SequentialDataTransactionAsync(TransactionRequest request, TransactionResponse response, TransactionInfo transactionInfo, TransactionObject transactionObject, List<Model> businessModels, List<ModelInputContract> inputContracts, List<ModelOutputContract> outputContracts)
        {
            ApplicationResponse applicationResponse = new ApplicationResponse();
            foreach (SequentialOption sequentialOption in transactionInfo.SequentialOptions)
            {
                List<ModelInputContract> sequentialinputContracts = new List<ModelInputContract>();
                foreach (int inputIdex in sequentialOption.ServiceInputFields)
                {
                    sequentialinputContracts.Add(inputContracts[inputIdex]);
                }

                List<ModelOutputContract> sequentialOutputContracts = new List<ModelOutputContract>();
                foreach (ModelOutputContract modelOutputContract in sequentialOption.ServiceOutputs)
                {
                    sequentialOutputContracts.Add(modelOutputContract);
                }

                applicationResponse = await SequentialRequestDataTransactionAsync(request, transactionObject, sequentialOption, sequentialinputContracts, sequentialOutputContracts);

                if (string.IsNullOrEmpty(applicationResponse.ExceptionText) == false)
                {
                    return applicationResponse;
                }

                string transactionID = string.IsNullOrEmpty(sequentialOption.TransactionID) == true ? request.Transaction.TransactionID : sequentialOption.TransactionID;
                string serviceID = string.IsNullOrEmpty(sequentialOption.ServiceID) == true ? transactionObject.ServiceID : sequentialOption.ServiceID;

                response.Result = new ResultType();
                response.Result.DataSetID = request.PayLoad.MapID;
                response.Result.DataSet = new List<DataMapItem>();

                if (transactionInfo.ReturnType == "Json")
                {
                    var outputs = JsonConvert.DeserializeObject<List<DataMapItem>>(applicationResponse.ResultJson, new JsonSerializerSettings { TypeNameHandling = TypeNameHandling.All });
                    if (outputs != null)
                    {
                        if (sequentialOption.ResultHandling == "ResultSet")
                        {
                            #region ResultSet

                            if (sequentialOutputContracts.Count > 0)
                            {
                                if (sequentialOutputContracts.Where(p => p.Type == "Dynamic").Count() > 0)
                                {
                                    for (int i = 0; i < outputs.Count; i++)
                                    {
                                        DataMapItem output = outputs[i];
                                        dynamic outputJson = JToken.Parse(output.Value.ToStringSafe());
                                        DataMapItem responseData = new DataMapItem();
                                        responseData.FieldID = output.FieldID;
                                        responseData.Value = outputJson;
                                        response.Result.DataSet.Add(responseData);
                                    }
                                }
                                else
                                {
                                    int additionCount = sequentialOutputContracts.Where(p => p.Type == "Addition").Count();
                                    if ((sequentialOutputContracts.Count - additionCount + (additionCount > 0 ? 1 : 0)) != outputs.Count)
                                    {
                                        applicationResponse.ExceptionText = $"'{transactionID}|{serviceID}' 거래 입력에 출력 모델 개수 확인 필요, 계약 건수 - '{sequentialOutputContracts.Count}', 응답 건수 - '{outputs.Count}'";
                                        return applicationResponse;
                                    }

                                    var lastIndex = outputs.Count - 1;
                                    for (int i = 0; i < outputs.Count; i++)
                                    {
                                        DataMapItem output = outputs[i];
                                        ModelOutputContract outputContract = sequentialOutputContracts[i];
                                        Model? model = businessModels.GetBusinessModel(outputContract.ModelID);
                                        if (model == null && outputContract.ModelID != "Unknown" && outputContract.ModelID != "Dynamic")
                                        {
                                            applicationResponse.ExceptionText = $"'{transactionID}|{serviceID}' 거래 입력에 '{outputContract.ModelID}' 출력 모델 ID가 계약에 있는지 확인";
                                            return applicationResponse;
                                        }

                                        dynamic? outputJson = null;
                                        DataMapItem responseData = new DataMapItem();
                                        responseData.FieldID = output.FieldID;

                                        if (additionCount > 0 && i == lastIndex)
                                        {
                                            try
                                            {
                                                JArray messagesJson = JArray.Parse(output.Value.ToStringSafe());
                                                for (int j = 0; j < messagesJson.Count; j++)
                                                {
                                                    Addition adiMessage = new Addition();
                                                    adiMessage.Type = "F"; // S: System, P: Program, F: Feature
                                                    adiMessage.Code = messagesJson[j]["MSG_CD"].ToStringSafe();
                                                    adiMessage.Text = messagesJson[j]["MSG_TXT"].ToStringSafe();
                                                    response.Message.Additions.Add(adiMessage);
                                                }
                                            }
                                            catch (Exception exception)
                                            {
                                                Addition adiMessage = new Addition();
                                                adiMessage.Type = "P"; // S: System, P: Program, F: Feature
                                                adiMessage.Code = "E001";
                                                adiMessage.Text = exception.ToMessage();
                                                response.Message.Additions.Add(adiMessage);

                                                logger.Warning("[{LogCategory}] [{GlobalID}] " + adiMessage.Text, "Transaction/ADI_MSG", request.Transaction.GlobalID);
                                            }
                                            continue;
                                        }

                                        if (model == null)
                                        {
                                            if (outputContract.ModelID == "Unknown")
                                            {
                                                if (outputContract.Type == "Form")
                                                {
                                                    outputJson = JObject.Parse(output.Value.ToStringSafe());
                                                    JObject jObject = (JObject)outputJson;
                                                    foreach (JProperty property in jObject.Properties())
                                                    {
                                                        if (outputContract.Fields.Contains(property.Name) == false)
                                                        {
                                                            applicationResponse.ExceptionText = $"{outputContract.Type} 출력 모델에 '{property.Name}' 항목 확인 필요";
                                                            return applicationResponse;
                                                        }
                                                    }
                                                }
                                                else if (outputContract.Type == "Grid" || outputContract.Type == "DataSet")
                                                {
                                                    outputJson = JArray.Parse(output.Value.ToStringSafe());
                                                    if (outputJson.Count > 0)
                                                    {
                                                        JObject jObject = (JObject)outputJson.First;
                                                        foreach (JProperty property in jObject.Properties())
                                                        {
                                                            if (outputContract.Fields.Contains(property.Name) == false)
                                                            {
                                                                applicationResponse.ExceptionText = $"{outputContract.Type} 출력 모델에 '{property.Name}' 항목 확인 필요";
                                                                return applicationResponse;
                                                            }
                                                        }
                                                    }
                                                }
                                                else if (outputContract.Type == "Chart")
                                                {
                                                    outputJson = JToken.Parse(output.Value.ToStringSafe());
                                                }
                                                else if (outputContract.Type == "Dynamic")
                                                {
                                                    outputJson = JToken.Parse(output.Value.ToStringSafe());
                                                }
                                            }
                                            else if (outputContract.ModelID == "Dynamic")
                                            {
                                                if (outputContract.Type == "Form")
                                                {
                                                    outputJson = JObject.Parse(output.Value.ToStringSafe());
                                                }
                                                else if (outputContract.Type == "Grid")
                                                {
                                                    outputJson = JArray.Parse(output.Value.ToStringSafe());
                                                }
                                                else if (outputContract.Type == "Chart")
                                                {
                                                    outputJson = JToken.Parse(output.Value.ToStringSafe());
                                                }
                                                else if (outputContract.Type == "DataSet")
                                                {
                                                    outputJson = JToken.Parse(output.Value.ToStringSafe());
                                                }
                                                else if (outputContract.Type == "Dynamic")
                                                {
                                                    outputJson = JToken.Parse(output.Value.ToStringSafe());
                                                }
                                            }
                                        }
                                        else
                                        {
                                            if (outputContract.Type == "Form")
                                            {
                                                outputJson = JObject.Parse(output.Value.ToStringSafe());
                                                JObject jObject = (JObject)outputJson;
                                                foreach (JProperty property in jObject.Properties())
                                                {
                                                    if (model.Columns.IsContain(property.Name) == false)
                                                    {
                                                        applicationResponse.ExceptionText = $"'{model.Name}' {outputContract.Type} 출력 모델에 '{property.Name}' 항목 확인 필요";
                                                        return applicationResponse;
                                                    }
                                                }
                                            }
                                            else if (outputContract.Type == "Grid" || outputContract.Type == "DataSet")
                                            {
                                                outputJson = JArray.Parse(output.Value.ToStringSafe());
                                                if (outputJson.Count > 0)
                                                {
                                                    JObject jObject = (JObject)outputJson.First;
                                                    foreach (JProperty property in jObject.Properties())
                                                    {
                                                        if (model.Columns.IsContain(property.Name) == false)
                                                        {
                                                            applicationResponse.ExceptionText = $"'{model.Name}' {outputContract.Type} 출력 모델에 '{property.Name}' 항목 확인 필요";
                                                            return applicationResponse;
                                                        }
                                                    }
                                                }
                                            }
                                            else if (outputContract.Type == "Chart")
                                            {
                                                outputJson = JToken.Parse(output.Value.ToStringSafe());
                                            }
                                            else if (outputContract.Type == "Dynamic")
                                            {
                                                outputJson = JToken.Parse(output.Value.ToStringSafe());
                                            }
                                        }

                                        responseData.Value = outputJson;
                                        response.Result.DataSet.AddUnique(sequentialOption.ResultOutputFields[i], responseData);
                                    }
                                }
                            }

                            #endregion
                        }
                        else if (sequentialOption.ResultHandling == "FieldMapping")
                        {
                            #region FieldMapping

                            if (outputs.Count() > 0)
                            {
                                foreach (int inputIdex in sequentialOption.TargetInputFields)
                                {
                                    ModelInputContract modelInputContract = inputContracts[inputIdex];
                                    MappingTransactionInputsValue(transactionObject, inputIdex, modelInputContract, JObject.Parse(outputs[0].Value.ToStringSafe()));
                                }
                            }

                            #endregion
                        }
                    }
                    else
                    {
                        applicationResponse.ExceptionText = $"'{transactionID}|{serviceID}' 거래 응답 없음";
                        return applicationResponse;
                    }
                }
                else
                {
                    applicationResponse.ExceptionText = $"'{transactionID}|{serviceID}' 순차 처리 되는 거래 응답은 Json만 지원";
                    return applicationResponse;
                }
            }

            return applicationResponse;
        }

        private async Task<ApplicationResponse> DataTransactionAsync(TransactionRequest request, TransactionResponse response, TransactionInfo transactionInfo, TransactionObject transactionObject, List<Model> businessModels, List<ModelInputContract> inputContracts, List<ModelOutputContract> outputContracts)
        {
            ApplicationResponse applicationResponse = await RequestDataTransactionAsync(request, transactionInfo, transactionObject, inputContracts, outputContracts);

            if (string.IsNullOrEmpty(applicationResponse.ExceptionText) == false)
            {
                return applicationResponse;
            }

            response.Result = new ResultType();
            response.Result.DataSetID = request.PayLoad.MapID;
            response.Result.DataSet = new List<DataMapItem>();

            switch (transactionInfo.ReturnType)
            {
                case "CodeHelp":
                    ResponseCodeObject? responseCodeObject = JsonConvert.DeserializeObject<ResponseCodeObject>(applicationResponse.ResultJson);

                    DataMapItem? input = request.PayLoad?.DataMapSet?[0].Where(p => p.FieldID == "CodeHelpID").FirstOrDefault();

                    response.Result.DataSet.Add(new DataMapItem()
                    {
                        FieldID = input == null ? "CODEHELP" : input.Value.ToStringSafe(),
                        Value = responseCodeObject
                    });

                    break;
                case "SchemeOnly":
                    JObject resultJson = JObject.Parse(applicationResponse.ResultJson);
                    foreach (JProperty property in resultJson.Properties())
                    {
                        response.Result.DataSet.Add(new DataMapItem()
                        {
                            FieldID = property.Name,
                            Value = property.Value.ToString(Formatting.None)
                        });
                    }

                    break;
                case "SQLText":
                    JObject sqlJson = JObject.Parse(applicationResponse.ResultJson);
                    DataMapItem sqlData = new DataMapItem();
                    sqlData.FieldID = "SQLText";
                    sqlData.Value = sqlJson;
                    response.Result.DataSet.Add(sqlData);

                    break;
                case "Json":
                    List<DataMapItem>? outputs = JsonConvert.DeserializeObject<List<DataMapItem>>(applicationResponse.ResultJson, new JsonSerializerSettings { TypeNameHandling = TypeNameHandling.All });
                    if (outputs != null && outputContracts.Count > 0)
                    {
                        if (outputContracts.Where(p => p.Type == "Dynamic").Count() > 0)
                        {
                            for (int i = 0; i < outputs.Count; i++)
                            {
                                DataMapItem output = outputs[i];
                                dynamic outputJson = JToken.Parse(output.Value.ToStringSafe());
                                DataMapItem responseData = new DataMapItem();
                                responseData.FieldID = output.FieldID;
                                responseData.Value = outputJson;
                                response.Result.DataSet.Add(responseData);
                            }
                        }
                        else
                        {
                            int additionCount = outputContracts.Where(p => p.Type == "Addition").Count();
                            if ((outputContracts.Count - additionCount + (additionCount > 0 ? 1 : 0)) != outputs.Count)
                            {
                                applicationResponse.ExceptionText = $"'{transactionObject.TransactionID}|{request.Transaction.FunctionID}' 거래 입력에 출력 모델 개수 확인 필요, 계약 건수 - '{outputContracts.Count}', 응답 건수 - '{outputs.Count}'";
                                return applicationResponse;
                            }

                            var lastIndex = outputs.Count - 1;
                            for (int i = 0; i < outputs.Count; i++)
                            {
                                DataMapItem output = outputs[i];
                                ModelOutputContract outputContract = outputContracts[i];
                                Model? model = businessModels.GetBusinessModel(outputContract.ModelID);
                                if (model == null && outputContract.ModelID != "Unknown" && outputContract.ModelID != "Dynamic")
                                {
                                    applicationResponse.ExceptionText = $"'{transactionObject.TransactionID}|{request.Transaction.FunctionID}' 거래 입력에 '{outputContract.ModelID}' 출력 모델 ID가 계약에 있는지 확인";
                                    return applicationResponse;
                                }

                                dynamic? outputJson = null;
                                DataMapItem responseData = new DataMapItem();
                                responseData.FieldID = output.FieldID;

                                if (additionCount > 0 && i == lastIndex)
                                {
                                    try
                                    {
                                        JArray messagesJson = JArray.Parse(output.Value.ToStringSafe());
                                        for (int j = 0; j < messagesJson.Count; j++)
                                        {
                                            Addition adiMessage = new Addition();
                                            adiMessage.Code = messagesJson[j]["MSG_CD"].ToStringSafe();
                                            adiMessage.Text = messagesJson[j]["MSG_TXT"].ToStringSafe();
                                            response.Message.Additions.Add(adiMessage);
                                        }
                                    }
                                    catch (Exception exception)
                                    {
                                        Addition adiMessage = new Addition();
                                        adiMessage.Code = "E001";
                                        adiMessage.Text = exception.ToMessage();
                                        logger.Warning("[{LogCategory}] [{GlobalID}] " + adiMessage.Text, "Transaction/ADI_MSG", request.Transaction.GlobalID);
                                        response.Message.Additions.Add(adiMessage);
                                    }
                                    continue;
                                }

                                if (model == null)
                                {
                                    if (outputContract.ModelID == "Unknown")
                                    {
                                        if (outputContract.Type == "Form")
                                        {
                                            outputJson = JObject.Parse(output.Value.ToStringSafe());
                                            JObject jObject = (JObject)outputJson;
                                            foreach (JProperty property in jObject.Properties())
                                            {
                                                if (outputContract.Fields.Contains(property.Name) == false)
                                                {
                                                    applicationResponse.ExceptionText = $"{outputContract.Type} 출력 모델에 '{property.Name}' 항목 확인 필요";
                                                    return applicationResponse;
                                                }
                                            }
                                        }
                                        else if (outputContract.Type == "Grid" || outputContract.Type == "DataSet")
                                        {
                                            outputJson = JArray.Parse(output.Value.ToStringSafe());
                                            if (outputJson.Count > 0)
                                            {
                                                JObject jObject = (JObject)outputJson.First;
                                                foreach (JProperty property in jObject.Properties())
                                                {
                                                    if (outputContract.Fields.Contains(property.Name) == false)
                                                    {
                                                        applicationResponse.ExceptionText = $"{outputContract.Type} 출력 모델에 '{property.Name}' 항목 확인 필요";
                                                        return applicationResponse;
                                                    }
                                                }
                                            }
                                        }
                                        else if (outputContract.Type == "Chart")
                                        {
                                            outputJson = JToken.Parse(output.Value.ToStringSafe());
                                        }
                                        else if (outputContract.Type == "Dynamic")
                                        {
                                            outputJson = JToken.Parse(output.Value.ToStringSafe());
                                        }
                                    }
                                    else if (outputContract.ModelID == "Dynamic")
                                    {
                                        if (outputContract.Type == "Form")
                                        {
                                            outputJson = JObject.Parse(output.Value.ToStringSafe());
                                        }
                                        else if (outputContract.Type == "Grid")
                                        {
                                            outputJson = JArray.Parse(output.Value.ToStringSafe());
                                        }
                                        else if (outputContract.Type == "Chart")
                                        {
                                            outputJson = JToken.Parse(output.Value.ToStringSafe());
                                        }
                                        else if (outputContract.Type == "DataSet")
                                        {
                                            outputJson = JToken.Parse(output.Value.ToStringSafe());
                                        }
                                        else if (outputContract.Type == "Dynamic")
                                        {
                                            outputJson = JToken.Parse(output.Value.ToStringSafe());
                                        }
                                    }
                                }
                                else
                                {
                                    if (outputContract.Type == "Form")
                                    {
                                        outputJson = JObject.Parse(output.Value.ToStringSafe());
                                        JObject jObject = (JObject)outputJson;
                                        foreach (JProperty property in jObject.Properties())
                                        {
                                            if (model.Columns.IsContain(property.Name) == false)
                                            {
                                                applicationResponse.ExceptionText = $"'{model.Name}' {outputContract.Type} 출력 모델에 '{property.Name}' 항목 확인 필요";
                                                return applicationResponse;
                                            }
                                        }
                                    }
                                    else if (outputContract.Type == "Grid" || outputContract.Type == "DataSet")
                                    {
                                        outputJson = JArray.Parse(output.Value.ToStringSafe());
                                        if (outputJson.Count > 0)
                                        {
                                            JObject jObject = (JObject)outputJson.First;
                                            foreach (JProperty property in jObject.Properties())
                                            {
                                                if (model.Columns.IsContain(property.Name) == false)
                                                {
                                                    applicationResponse.ExceptionText = $"'{model.Name}' {outputContract.Type} 출력 모델에 '{property.Name}' 항목 확인 필요";
                                                    return applicationResponse;
                                                }
                                            }
                                        }
                                    }
                                    else if (outputContract.Type == "Chart")
                                    {
                                        outputJson = JToken.Parse(output.Value.ToStringSafe());
                                    }
                                    else if (outputContract.Type == "Dynamic")
                                    {
                                        outputJson = JToken.Parse(output.Value.ToStringSafe());
                                    }
                                }

                                responseData.Value = outputJson;
                                response.Result.DataSet.Add(responseData);
                            }
                        }
                    }
                    break;
            }

            return applicationResponse;
        }

        private static void SetInputDefaultValue(DefaultValue defaultValue, DbColumn? column, DataMapItem tempReqInput)
        {
            if (column == null)
            {
                tempReqInput.Value = "";
            }
            else
            {
                switch (column.DataType)
                {
                    case "String":
                        tempReqInput.Value = defaultValue.String;
                        break;
                    case "Int32":
                        tempReqInput.Value = defaultValue.Integer;
                        break;
                    case "Boolean":
                        tempReqInput.Value = defaultValue.Boolean;
                        break;
                    case "DateTime":
                        DateTime dateValue;
                        if (DateTime.TryParseExact(defaultValue.String, "o", CultureInfo.InvariantCulture, DateTimeStyles.None, out dateValue) == true)
                        {
                            tempReqInput.Value = dateValue;
                        }
                        else
                        {
                            tempReqInput.Value = DateTime.Now;
                        }
                        break;
                    default:
                        tempReqInput.Value = "";
                        break;
                }
            }
        }

        private void MappingTransactionInputsValue(TransactionObject transactionObject, int modelInputIndex, ModelInputContract modelInputContract, JObject formOutput)
        {
            List<List<TransactField>> transactInputs = transactionObject.Inputs;
            int inputCount = 0;
            int inputOffset = 0;
            for (int i = 0; i < transactionObject.InputsItemCount.Count; i++)
            {
                inputCount = transactionObject.InputsItemCount[i];

                if (i <= modelInputIndex)
                {
                    break;
                }

                inputOffset = inputOffset + inputCount;
            }

            List<List<TransactField>> inputs = transactInputs.Skip(inputOffset).Take(inputCount).ToList();

            if (modelInputContract.Type == "Row")
            {
                if (inputs.Count > 0)
                {
                    List<TransactField> serviceParameters = inputs[0];

                    foreach (var item in formOutput)
                    {
                        TransactField? fieldItem = serviceParameters.Where(p => p.FieldID == item.Key).FirstOrDefault();
                        if (fieldItem != null)
                        {
                            if (item.Value == null)
                            {
                                fieldItem.Value = null;
                            }
                            else
                            {
                                fieldItem.Value = ((JValue)item.Value).Value;
                            }
                        }
                    }
                }
            }
            else if (modelInputContract.Type == "List")
            {
                if (inputs.Count > 0)
                {
                    List<TransactField> findParameters = inputs[0];

                    foreach (var item in formOutput)
                    {
                        TransactField? findItem = findParameters.Where(p => p.FieldID == item.Key).FirstOrDefault();
                        if (findItem != null)
                        {
                            for (int i = 0; i < inputs.Count; i++)
                            {
                                List<TransactField> serviceParameters = inputs[i];

                                TransactField? fieldItem = serviceParameters.Where(p => p.FieldID == item.Key).FirstOrDefault();
                                if (fieldItem != null)
                                {
                                    if (item.Value == null)
                                    {
                                        fieldItem.Value = null;
                                    }
                                    else
                                    {
                                        fieldItem.Value = ((JValue)item.Value).Value;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        private async Task<ApplicationResponse> SequentialRequestDataTransactionAsync(TransactionRequest request, TransactionObject transactionObject, SequentialOption sequentialOption, List<ModelInputContract> inputContracts, List<ModelOutputContract> outputContracts)
        {
            ApplicationResponse responseObject = new ApplicationResponse();
            responseObject.Acknowledge = AcknowledgeType.Failure;

            try
            {
                string businessID = string.IsNullOrEmpty(sequentialOption.TransactionProjectID) == true ? request.Transaction.BusinessID : sequentialOption.TransactionProjectID;
                string transactionID = string.IsNullOrEmpty(sequentialOption.TransactionID) == true ? request.Transaction.TransactionID : sequentialOption.TransactionID;
                string serviceID = string.IsNullOrEmpty(sequentialOption.ServiceID) == true ? transactionObject.ServiceID : sequentialOption.ServiceID;

                string routeSegmentID = request.System.ProgramID + request.Transaction.BusinessID + request.Transaction.CommandType + request.Environment;
                string? messageServerUrl = ModuleConfiguration.RouteCommandUrl.GetValueOrDefault(routeSegmentID);

                if (string.IsNullOrEmpty(messageServerUrl) == true)
                {
                    responseObject.ExceptionText = $"routeSegmentID: {routeSegmentID} 환경변수 확인";
                    return responseObject;
                }

                DynamicRequest dynamicRequest = new DynamicRequest();
                dynamicRequest.AccessToken = request.AccessToken;
                dynamicRequest.Action = request.Action;
                dynamicRequest.ClientTag = request.ClientTag;
                dynamicRequest.Environment = request.Environment;
                dynamicRequest.RequestID = request.RequestID;
                dynamicRequest.GlobalID = request.Transaction.GlobalID;
                dynamicRequest.Version = request.Version;
                dynamicRequest.LoadOptions = transactionObject.LoadOptions;
                dynamicRequest.IsTransaction = transactionObject.TransactionScope;
                dynamicRequest.ReturnType = (ExecuteDynamicTypeObject)Enum.Parse(typeof(ExecuteDynamicTypeObject), transactionObject.ReturnType);
                List<DynamicObject> dynamicObjects = new List<DynamicObject>();

                List<List<TransactField>> transactInputs = transactionObject.Inputs;

                int inputOffset = 0;
                Dictionary<string, List<List<TransactField>>> requestInputItems = new Dictionary<string, List<List<TransactField>>>();
                for (int i = 0; i < transactionObject.InputsItemCount.Count; i++)
                {
                    int inputCount = transactionObject.InputsItemCount[i];
                    if (inputCount > 0 && inputContracts.Count > 0)
                    {
                        ModelInputContract inputContract = inputContracts[i];
                        List<List<TransactField>> inputs = transactInputs.Skip(inputOffset).Take(inputCount).ToList();

                        for (int j = 0; j < inputs.Count; j++)
                        {
                            List<TransactField> serviceParameters = inputs[j];

                            DynamicObject dynamicObject = new DynamicObject();

                            dynamicObject.QueryID = string.Concat(request.System.ProgramID, "|", businessID, "|", transactionID, "|", serviceID, i.ToString().PadLeft(2, '0'));

                            List<JsonObjectType> jsonObjectTypes = new List<JsonObjectType>();
                            foreach (ModelOutputContract item in outputContracts)
                            {
                                JsonObjectType jsonObjectType = (JsonObjectType)Enum.Parse(typeof(JsonObjectType), item.Type + "Json");
                                jsonObjectTypes.Add(jsonObjectType);

                                if (jsonObjectType == JsonObjectType.AdditionJson)
                                {
                                    dynamicObject.JsonObject = jsonObjectType;
                                }
                            }
                            dynamicObject.JsonObjects = jsonObjectTypes;

                            List<DynamicParameter> parameters = new List<DynamicParameter>();
                            foreach (var item in serviceParameters)
                            {
                                parameters.Append(item.FieldID, (DbType)Enum.Parse(typeof(DbType), item.DataType), item.Value);
                            }

                            dynamicObject.Parameters = parameters;
                            dynamicObject.BaseFieldMappings = inputContract.BaseFieldMappings;
                            dynamicObject.IgnoreResult = inputContract.IgnoreResult;
                            dynamicObjects.Add(dynamicObject);
                        }
                    }
                    else
                    {
                        DynamicObject dynamicObject = new DynamicObject();
                        dynamicObject.QueryID = string.Concat(request.System.ProgramID, "|", businessID, "|", transactionID, "|", serviceID, i.ToString().PadLeft(2, '0'));

                        List<JsonObjectType> jsonObjectTypes = new List<JsonObjectType>();
                        foreach (ModelOutputContract item in outputContracts)
                        {
                            JsonObjectType jsonObjectType = (JsonObjectType)Enum.Parse(typeof(JsonObjectType), item.Type + "Json");
                            jsonObjectTypes.Add(jsonObjectType);

                            if (jsonObjectType == JsonObjectType.AdditionJson)
                            {
                                dynamicObject.JsonObject = jsonObjectType;
                            }
                        }
                        dynamicObject.JsonObjects = jsonObjectTypes;
                        dynamicObject.Parameters = new List<DynamicParameter>();
                        dynamicObject.BaseFieldMappings = new List<BaseFieldMapping>();
                        dynamicObject.IgnoreResult = false;
                        dynamicObjects.Add(dynamicObject);
                    }

                    inputOffset = inputOffset + inputCount;
                }

                dynamicRequest.DynamicObjects = dynamicObjects;
                dynamicRequest.ClientTag = transactionObject.ClientTag;

                var restClient = new RestClient(messageServerUrl);
                var restRequest = new RestRequest(Method.POST);

                restRequest.AddHeader("Content-Type", "application/json");
                string json = JsonConvert.SerializeObject(dynamicRequest);
                restRequest.AddParameter("application/json", json, ParameterType.RequestBody);

                DynamicResponse? response;
                IRestResponse restResponse = await restClient.ExecuteAsync(restRequest);

                if (restResponse.StatusCode == HttpStatusCode.OK)
                {
                    if (dynamicRequest.ReturnType == ExecuteDynamicTypeObject.Xml)
                    {
                        response = new DynamicResponse();
                        response.ResultObject = restResponse.Content;
                    }
                    else
                    {
                        response = JsonConvert.DeserializeObject<DynamicResponse>(restResponse.Content);
                    }

                    if (response != null)
                    {
                        responseObject.Acknowledge = response.Acknowledge;

                        if (responseObject.Acknowledge == AcknowledgeType.Success)
                        {
                            switch (dynamicRequest.ReturnType)
                            {
                                case ExecuteDynamicTypeObject.Json:
                                    responseObject.ResultMeta = response.ResultMeta;
                                    responseObject.ResultJson = response.ResultJson == null ? "[]" : response.ResultJson.ToString();
                                    break;
                                case ExecuteDynamicTypeObject.Scalar:
                                    responseObject.ResultObject = response.ResultObject;
                                    break;
                                case ExecuteDynamicTypeObject.NonQuery:
                                    responseObject.ResultInteger = response.ResultInteger;
                                    break;
                                case ExecuteDynamicTypeObject.SQLText:
                                    responseObject.ResultJson = response.ResultJson == null ? "[]" : response.ResultJson.ToString();
                                    break;
                                case ExecuteDynamicTypeObject.SchemeOnly:
                                    responseObject.ResultJson = response.ResultJson == null ? "[]" : response.ResultJson.ToString();
                                    break;
                                case ExecuteDynamicTypeObject.CodeHelp:
                                    responseObject.ResultJson = response.ResultJson == null ? "[]" : response.ResultJson.ToString();
                                    break;
                                case ExecuteDynamicTypeObject.Xml:
                                    responseObject.ResultObject = response.ResultObject as string;
                                    break;
                                case ExecuteDynamicTypeObject.DynamicJson:
                                    responseObject.ResultJson = response.ResultJson == null ? "[]" : response.ResultJson.ToString();
                                    break;
                            }
                        }
                        else
                        {
                            responseObject.ExceptionText = response.ExceptionText;
                        }
                    }
                    else
                    {
                        responseObject.ExceptionText = "AP X-Requested Response Error: " + Environment.NewLine + restResponse.Content;
                    }
                }
                else
                {
                    responseObject.ExceptionText = "AP X-Requested Transfort Error: " + Environment.NewLine + restResponse.ErrorMessage;
                }
            }
            catch (Exception exception)
            {
                responseObject.ExceptionText = exception.ToMessage();
                if (ModuleConfiguration.IsLogServer == true)
                {
                    transactLoggerClient.ProgramMessageLogging("N", "E", responseObject.ExceptionText, "Transaction/SequentialRequestDataTransaction", (string error) =>
                    {
                        logger.Error("[{LogCategory}] [{GlobalID}] " + "fallback error: " + error + ", " + responseObject.ExceptionText, "Transaction/SequentialRequestDataTransaction", request.Transaction.GlobalID);
                    });
                }
                else
                {
                    logger.Error("[{LogCategory}] [{GlobalID}] " + responseObject.ExceptionText, "Transaction/SequentialRequestDataTransaction", request.Transaction.GlobalID);
                }
            }

            return responseObject;
        }

        private async Task<ApplicationResponse> RequestDataTransactionAsync(TransactionRequest request, TransactionInfo transactionInfo, TransactionObject transactionObject, List<ModelInputContract> inputContracts, List<ModelOutputContract> outputContracts)
        {
            ApplicationResponse responseObject = new ApplicationResponse();
            responseObject.Acknowledge = AcknowledgeType.Failure;

            try
            {
                string routeSegmentID = request.System.ProgramID + request.Transaction.BusinessID + request.Transaction.CommandType + request.Environment;
                string? messageServerUrl = ModuleConfiguration.RouteCommandUrl.GetValueOrDefault(routeSegmentID);

                if (string.IsNullOrEmpty(messageServerUrl) == true)
                {
                    responseObject.ExceptionText = $"routeSegmentID: {routeSegmentID} 환경변수 확인";
                    return responseObject;
                }

                DynamicRequest dynamicRequest = new DynamicRequest();
                dynamicRequest.AccessToken = request.AccessToken;
                dynamicRequest.Action = request.Action;
                dynamicRequest.ClientTag = request.ClientTag;
                dynamicRequest.Environment = request.Environment;
                dynamicRequest.RequestID = request.RequestID;
                dynamicRequest.GlobalID = request.Transaction.GlobalID;
                dynamicRequest.Version = request.Version;
                dynamicRequest.LoadOptions = transactionObject.LoadOptions;
                dynamicRequest.IsTransaction = transactionObject.TransactionScope;
                dynamicRequest.ReturnType = (ExecuteDynamicTypeObject)Enum.Parse(typeof(ExecuteDynamicTypeObject), transactionObject.ReturnType);
                List<DynamicObject> dynamicObjects = new List<DynamicObject>();

                List<List<TransactField>> transactInputs = transactionObject.Inputs;

                int inputOffset = 0;
                Dictionary<string, List<List<TransactField>>> requestInputItems = new Dictionary<string, List<List<TransactField>>>();
                for (int i = 0; i < transactionObject.InputsItemCount.Count; i++)
                {
                    int inputCount = transactionObject.InputsItemCount[i];
                    if (inputCount > 0 && inputContracts.Count > 0)
                    {
                        ModelInputContract inputContract = inputContracts[i];
                        List<List<TransactField>> inputs = transactInputs.Skip(inputOffset).Take(inputCount).ToList();

                        for (int j = 0; j < inputs.Count; j++)
                        {
                            List<TransactField> serviceParameters = inputs[j];

                            DynamicObject dynamicObject = new DynamicObject();

                            dynamicObject.QueryID = string.Concat(transactionObject.TransactionID, "|", transactionObject.ServiceID, i.ToString().PadLeft(2, '0'));

                            List<JsonObjectType> jsonObjectTypes = new List<JsonObjectType>();
                            foreach (ModelOutputContract item in outputContracts)
                            {
                                JsonObjectType jsonObjectType = (JsonObjectType)Enum.Parse(typeof(JsonObjectType), item.Type + "Json");
                                jsonObjectTypes.Add(jsonObjectType);

                                if (jsonObjectType == JsonObjectType.AdditionJson)
                                {
                                    dynamicObject.JsonObject = jsonObjectType;
                                }
                            }
                            dynamicObject.JsonObjects = jsonObjectTypes;

                            List<DynamicParameter> parameters = new List<DynamicParameter>();
                            foreach (var item in serviceParameters)
                            {
                                parameters.Append(item.FieldID, (DbType)Enum.Parse(typeof(DbType), item.DataType), item.Value);
                            }

                            dynamicObject.Parameters = parameters;
                            dynamicObject.BaseFieldMappings = inputContract.BaseFieldMappings;
                            dynamicObject.IgnoreResult = inputContract.IgnoreResult;
                            dynamicObjects.Add(dynamicObject);
                        }
                    }
                    else
                    {
                        DynamicObject dynamicObject = new DynamicObject();
                        dynamicObject.QueryID = string.Concat(transactionObject.TransactionID, "|", transactionObject.ServiceID, i.ToString().PadLeft(2, '0'));

                        List<JsonObjectType> jsonObjectTypes = new List<JsonObjectType>();
                        foreach (ModelOutputContract item in outputContracts)
                        {
                            JsonObjectType jsonObjectType = (JsonObjectType)Enum.Parse(typeof(JsonObjectType), item.Type + "Json");
                            jsonObjectTypes.Add(jsonObjectType);

                            if (jsonObjectType == JsonObjectType.AdditionJson)
                            {
                                dynamicObject.JsonObject = jsonObjectType;
                            }
                        }
                        dynamicObject.JsonObjects = jsonObjectTypes;
                        dynamicObject.Parameters = new List<DynamicParameter>();
                        dynamicObject.BaseFieldMappings = new List<BaseFieldMapping>();
                        dynamicObject.IgnoreResult = false;
                        dynamicObjects.Add(dynamicObject);
                    }

                    inputOffset = inputOffset + inputCount;
                }

                dynamicRequest.DynamicObjects = dynamicObjects;
                dynamicRequest.ClientTag = transactionObject.ClientTag;

                DynamicResponse? response = null;

                if (messageServerUrl.IndexOf("event://") > -1)
                {
                    string moduleEventName = messageServerUrl.Replace("event://", "");
                    Type? type = Assembly.Load(moduleEventName.Split(".")[0])?.GetType(moduleEventName);
                    if (type != null)
                    {
                        object? instance = Activator.CreateInstance(type, dynamicRequest);
                        if (instance == null)
                        {
                            response = new DynamicResponse();
                            response.ExceptionText = $"moduleEventName: {moduleEventName} 확인 필요";
                        }
                        else
                        {
                            object? eventResponse = await mediator.Send(instance);
                            if (eventResponse != null)
                            {
                                response = JsonConvert.DeserializeObject<DynamicResponse>(JsonConvert.SerializeObject(eventResponse));
                            }
                            else
                            {
                                response = new DynamicResponse();
                                response.ExceptionText = $"moduleEventName: {moduleEventName} 확인 필요";
                            }
                        }
                    }
                    else
                    {
                        response = new DynamicResponse();
                        response.ExceptionText = $"moduleEventName: {moduleEventName} 확인 필요";
                    }
                }
                else
                {
                    var restClient = new RestClient(messageServerUrl);
                    // restClient.Proxy = BypassWebProxy.Default;
                    var restRequest = new RestRequest(Method.POST);

                    restRequest.AddHeader("Content-Type", "application/json");
                    string json = JsonConvert.SerializeObject(dynamicRequest);
                    restRequest.AddParameter("application/json", json, ParameterType.RequestBody);

                    IRestResponse restResponse = await restClient.ExecuteAsync(restRequest);

                    if (restResponse.StatusCode == HttpStatusCode.OK)
                    {
                        if (dynamicRequest.ReturnType == ExecuteDynamicTypeObject.Xml)
                        {
                            response = new DynamicResponse();
                            response.ResultObject = restResponse.Content;
                        }
                        else
                        {
                            response = JsonConvert.DeserializeObject<DynamicResponse>(restResponse.Content);
                        }
                    }
                    else
                    {
                        responseObject.ExceptionText = "AP X-Requested Transfort Error: " + Environment.NewLine + restResponse.ErrorMessage;
                    }
                }

                if (response != null)
                {
                    responseObject.Acknowledge = response.Acknowledge;

                    if (responseObject.Acknowledge == AcknowledgeType.Success)
                    {
                        switch (dynamicRequest.ReturnType)
                        {
                            case ExecuteDynamicTypeObject.Json:
                                responseObject.ResultMeta = response.ResultMeta;
                                responseObject.ResultJson = response.ResultJson == null ? "[]" : response.ResultJson.ToString();
                                break;
                            case ExecuteDynamicTypeObject.Scalar:
                                responseObject.ResultObject = response.ResultObject;
                                break;
                            case ExecuteDynamicTypeObject.NonQuery:
                                responseObject.ResultInteger = response.ResultInteger;
                                break;
                            case ExecuteDynamicTypeObject.SQLText:
                                responseObject.ResultJson = response.ResultJson == null ? "[]" : response.ResultJson.ToString();
                                break;
                            case ExecuteDynamicTypeObject.SchemeOnly:
                                responseObject.ResultJson = response.ResultJson == null ? "[]" : response.ResultJson.ToString();
                                break;
                            case ExecuteDynamicTypeObject.CodeHelp:
                                responseObject.ResultJson = response.ResultJson == null ? "[]" : response.ResultJson.ToString();
                                break;
                            case ExecuteDynamicTypeObject.Xml:
                                responseObject.ResultObject = response.ResultObject as string;
                                break;
                            case ExecuteDynamicTypeObject.DynamicJson:
                                responseObject.ResultJson = response.ResultJson == null ? "[]" : response.ResultJson.ToString();
                                break;
                        }
                    }
                    else
                    {
                        if (string.IsNullOrEmpty(response.ExceptionText) == true)
                        {
                            responseObject.ExceptionText = $"GlobalID: {dynamicRequest.GlobalID} 거래 확인 필요";
                        }
                        else
                        {
                            responseObject.ExceptionText = response.ExceptionText;
                        }
                    }
                }
                else
                {
                    responseObject.ExceptionText = $"AP X-Requested {messageServerUrl} 확인 필요";
                }
            }
            catch (Exception exception)
            {
                responseObject.ExceptionText = exception.ToMessage();
                if (ModuleConfiguration.IsLogServer == true)
                {
                    transactLoggerClient.ProgramMessageLogging("N", "E", responseObject.ExceptionText, "Transaction/RequestDataTransaction", (string error) =>
                    {
                        logger.Error("[{LogCategory}] [{GlobalID}] " + "fallback error: " + error + ", " + responseObject.ExceptionText, "Transaction/RequestDataTransaction", request.Transaction.GlobalID);
                    });
                }
                else
                {
                    logger.Error("[{LogCategory}] [{GlobalID}] " + responseObject.ExceptionText, "Transaction/RequestDataTransaction", request.Transaction.GlobalID);
                }
            }

            return responseObject;
        }

        private JArray ToJson(string? val)
        {
            JArray result = new JArray();

            if (val != null)
            {
                char delimeter = '｜';
                char newline = '↵';
                var lines = val.Split(newline);
                var headers = lines[0].Split(delimeter);

                for (int i = 0; i < headers.Length; i++)
                {
                    headers[i] = headers[i].Replace(@"(^[\s""]+|[\s""]+$)", "");
                }

                int lineLength = lines.Length;
                for (int i = 1; i < lineLength; i++)
                {
                    var row = lines[i].Split(delimeter);
                    JObject item = new JObject();
                    for (var j = 0; j < headers.Length; j++)
                    {
                        item[headers[j]] = ToDynamic(row[j]);
                    }
                    result.Add(item);
                }
            }

            return result;
        }

        private dynamic ToDynamic(string val)
        {
            dynamic result;

            if (val == "true" || val == "True" || val == "TRUE")
            {
                result = true;
            }
            else if (val == "false" || val == "False" || val == "FALSE")
            {
                result = false;
            }
            else if (val.Length > 1 && val.IndexOf('.') == -1 && val.StartsWith('0') == true)
            {
                result = val;
            }
            else if (Regex.IsMatch(val, @"^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$") == true)
            {
                int intValue = 0;
                bool isParsable = int.TryParse(val, out intValue);
                if (isParsable == true)
                {
                    result = intValue;
                }
                else
                {
                    float floatValue = 0;
                    isParsable = float.TryParse(val, out floatValue);
                    if (isParsable == true)
                    {
                        result = floatValue;
                    }
                    else
                    {
                        result = 0;
                    }
                }
            }
            else if (Regex.IsMatch(val, @"(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))") == true)
            {
                result = DateTime.Parse(val);
            }
            else
            {
                result = val;
            }

            return result;
        }

        private ActionResult LoggingAndReturn(TransactionResponse response, string acknowledge, TransactionInfo? transactionInfo)
        {
            if (ModuleConfiguration.IsTransactionLogging == true || (transactionInfo != null && transactionInfo.TransactionLog == true))
            {
                transactLoggerClient.TransactionResponseLogging(response, acknowledge, (string error) =>
                {
                    // var transactionLogger = loggerFactory.CreateLogger($"{response.TH.PGM_ID}|{response.TH.BIZ_ID}|{response.TH.TRN_CD}|{response.TH.FUNC_CD}");
                    // transactionLogger.LogWarning($"Response GlobalID: {response.SH.GLBL_ID}, JSON: {JsonConvert.SerializeObject(response)}");
                });
            }

            if (response.System.Routes.Count > 0)
            {
                var route = response.System.Routes[response.System.Routes.Count - 1];
                route.ResponseTick = DateTime.UtcNow.GetJavascriptTime();
            }

            return Content(JsonConvert.SerializeObject(response), "application/json");
        }

        private void DefaultResponseHeaderConfiguration(TransactionRequest request, TransactionResponse response)
        {
            response.CorrelationID = request.RequestID;
            response.Environment = request.Environment;
            response.Version = request.Version;
            response.System.ProgramID = GlobalConfiguration.ApplicationName;
            response.System.LocaleID = request.System.LocaleID;
            response.Transaction.GlobalID = request.Transaction.GlobalID;
            response.Transaction.BusinessID = request.Transaction.BusinessID;
            response.Transaction.TransactionID = request.Transaction.TransactionID;
            response.Transaction.FunctionID = request.Transaction.FunctionID;
            response.Transaction.SimulationType = request.Transaction.SimulationType;
            response.Transaction.CompressionYN = request.Transaction.CompressionYN;
            response.Transaction.DataFormat = request.Transaction.DataFormat;
            response.System.Routes = request.System.Routes;

            if (response.System.Routes.Count > 0)
            {
                var route = response.System.Routes[response.System.Routes.Count - 1];
                route.SystemID = GlobalConfiguration.SystemID;
                route.HostName = GlobalConfiguration.HostName;
                route.AcceptTick = DateTime.UtcNow.GetJavascriptTime();
            }
        }
    }
}
