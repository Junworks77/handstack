using System;
using System.Net;

using HandStack.Core.ExtensionMethod;
using HandStack.Core.Extensions;

using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

using transact.Extensions;

namespace transact.Areas.transact.Controllers
{
    [Area("transact")]
    [Route("[area]/api/[controller]")]
    [ApiController]
    [EnableCors("transact")]
    public class Base64Controller : ControllerBase
    {
        private TransactLoggerClient transactLoggerClient { get; }
        private Serilog.ILogger logger { get; }

        public Base64Controller(Serilog.ILogger logger, TransactLoggerClient transactLoggerClient)
        {
            this.logger = logger;
            this.transactLoggerClient = transactLoggerClient;
        }

        // http://localhost:5000/transact/api/base64/encode?value={"ProjectID":"SYN","BusinessID":"DSO","TransactionID":"0001","FunctionID":"R01"}
        [HttpGet("[action]")]
        public string Encode(string value)
        {
            string result = "";

            try
            {
                value = WebUtility.UrlDecode(value);
                result = value.EncodeBase64();
            }
            catch (Exception exception)
            {
                result = exception.ToMessage();

                string exceptionText = result;
                if (ModuleConfiguration.IsLogServer == true)
                {
                    transactLoggerClient.ProgramMessageLogging("N", "E", exceptionText, "Base64/Encode", (string error) =>
                    {
                        logger.Error("[{LogCategory}] fallback error: " + error + ", " + exceptionText, "Base64/Encode");
                    });
                }
                else
                {
                    logger.Error("[{LogCategory}] " + exceptionText, "Base64/Encode");
                }
            }

            // throw new Exception("hello world");
            return result;
        }

        // http://localhost:5000/transact/api/base64/decode?value=eyJQcm9qZWN0SUQiOiJRQUYiLCJCdXNpbmVzc0lEIjoiRFNPIiwiVHJhbnNhY3Rpb25JRCI6IjAwMDEiLCJGdW5jdGlvbklEIjoiUjAxIn0=
        [HttpGet("[action]")]
        public string Decode(string value)
        {
            string result = "";

            try
            {
                result = value.DecodeBase64();
            }
            catch (Exception exception)
            {
                result = exception.ToMessage();

                string exceptionText = result;
                if (ModuleConfiguration.IsLogServer == true)
                {
                    transactLoggerClient.ProgramMessageLogging("N", "E", exceptionText, "Base64/Decode", (string error) =>
                    {
                        logger.Error("[{LogCategory}] fallback error: " + error + ", " + exceptionText, "Base64/Decode");
                    });
                }
                else
                {
                    logger.Error("[{LogCategory}] " + exceptionText, "Base64/Decode");
                }
            }

            return result;
        }
    }
}
