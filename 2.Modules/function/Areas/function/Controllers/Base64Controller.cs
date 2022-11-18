using System;
using System.Net;

using function.Extensions;

using HandStack.Core.ExtensionMethod;
using HandStack.Core.Extensions;
using HandStack.Web;

using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace function.Areas.function.Controllers
{
    [Area("function")]
    [Route("[area]/api/[controller]")]
    [ApiController]
    [EnableCors("function")]
    public class Base64Controller : ControllerBase
    {
        private FunctionLoggerClient functionLoggerClient { get; }
        private LoggerFactory loggerFactory { get; }
        private Serilog.ILogger logger { get; }

        public Base64Controller(Serilog.ILogger logger, LoggerFactory loggerFactory, FunctionLoggerClient functionLoggerClient)
        {
            this.loggerFactory = loggerFactory;
            this.logger = logger;
            this.functionLoggerClient = functionLoggerClient;
        }

        // http://localhost:5000/function/api/base64/encode?value={"ProjectID":"SYN","BusinessID":"DSO","TransactionID":"0001","FunctionID":"R01"}
        [HttpGet("[action]")]
        public ActionResult Encode(string value)
        {
            ActionResult result;
            string authorizationKey = Request.Headers["AuthorizationKey"];
            if (string.IsNullOrEmpty(authorizationKey) == true || ModuleConfiguration.AuthorizationKey != authorizationKey)
            {
                result = BadRequest();
            }
            else
            {
                try
                {
                    value = WebUtility.UrlDecode(value);
                    result = Content(value.EncodeBase64(), "application/json");
                }
                catch (Exception exception)
                {
                    string exceptionText = exception.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        functionLoggerClient.ProgramMessageLogging("N", GlobalConfiguration.SystemID, exceptionText, "Base64/Encode", (string error) =>
                        {
                            logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + exceptionText, "Base64/Encode");
                        });
                    }
                    else
                    {
                        logger.Error("[{LogCategory}] " + exceptionText, "Base64/Encode");
                    }

                    result = StatusCode(500, exceptionText);
                }
            }

            return result;
        }

        // http://localhost:5000/function/api/base64/decode?value=eyJQcm9qZWN0SUQiOiJRQUYiLCJCdXNpbmVzc0lEIjoiRFNPIiwiVHJhbnNhY3Rpb25JRCI6IjAwMDEiLCJGdW5jdGlvbklEIjoiUjAxIn0=
        [HttpGet("[action]")]
        public ActionResult Decode(string value)
        {
            ActionResult result;
            string authorizationKey = Request.Headers["AuthorizationKey"];
            if (string.IsNullOrEmpty(authorizationKey) == true || ModuleConfiguration.AuthorizationKey != authorizationKey)
            {
                result = BadRequest();
            }
            else
            {
                try
                {
                    result = Content(value.DecodeBase64(), "application/json");
                }
                catch (Exception exception)
                {
                    string exceptionText = exception.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        functionLoggerClient.ProgramMessageLogging("N", GlobalConfiguration.SystemID, exceptionText, "Base64/Decode", (string error) =>
                        {
                            logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + exceptionText, "Base64/Decode");
                        });
                    }
                    else
                    {
                        logger.Error("[{LogCategory}] " + exceptionText, "Base64/Decode");
                    }

                    result = StatusCode(500, exceptionText);
                }
            }

            return result;
        }
    }
}
