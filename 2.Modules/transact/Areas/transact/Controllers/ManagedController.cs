using System;

using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

using HandStack.Core.Extensions;
using HandStack.Core.Helpers;
using HandStack.Web;

using Serilog;

using transact.Extensions;

namespace transact.Areas.transact.Controllers
{
    [Area("transact")]
    [Route("[area]/api/[controller]")]
    [ApiController]
    [EnableCors("transact")]
    public class ManagedController : ControllerBase
    {
        private TransactLoggerClient transactLoggerClient { get; }
        private Serilog.ILogger logger { get; }
        private IConfiguration configuration { get; }
        private IWebHostEnvironment environment { get; }

        public ManagedController(IWebHostEnvironment environment, IConfiguration configuration, Serilog.ILogger logger, TransactLoggerClient transactLoggerClient)
        {
            this.configuration = configuration;
            this.environment = environment;
            this.logger = logger;
            this.transactLoggerClient = transactLoggerClient;
        }

        // http://localhost:5000/transact/api/managed/reset-contract
        [HttpGet("[action]")]
        public ActionResult ResetContract()
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
                    TransactionMapper.LoadContract(GlobalConfiguration.EnvironmentName, Log.Logger, configuration);

                    result = Ok();
                }
                catch (Exception exception)
                {
                    string exceptionText = exception.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        transactLoggerClient.ProgramMessageLogging("N", "E", exceptionText, "Managed/ResetContract", (string error) =>
                        {
                            logger.Error("[{LogCategory}] fallback error: " + error + ", " + exceptionText, "Managed/ResetContract");
                        });
                    }
                    else
                    {
                        logger.Error("[{LogCategory}] " + exceptionText, "Managed/ResetContract");
                    }

                    result = StatusCode(500, exceptionText);
                }
            }

            return result;
        }

        // http://localhost:5000/transact/api/managed/string-encrypt?value=helloworld
        [HttpGet("[action]")]
        public ActionResult StringEncrypt(string value)
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
                    result = Content(SynCryptoHelper.Encrypt(value));
                }
                catch (Exception exception)
                {
                    string exceptionText = exception.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        transactLoggerClient.ProgramMessageLogging("N", "E", exceptionText, "Managed/StringEncrypt", (string error) =>
                        {
                            logger.Error("[{LogCategory}] fallback error: " + error + ", " + exceptionText, "Managed/StringEncrypt");
                        });
                    }
                    else
                    {
                        logger.Error("[{LogCategory}] " + exceptionText, "Managed/ResetContract");
                    }

                    result = StatusCode(500, exceptionText);
                }
            }

            return result;
        }

        // http://localhost:5000/transact/api/managed/string-decrypt?value=WzE2MSwxNTIsMTYyLDIwNSwxNjAsMTc1LDE2OCwxNjUsMTYyLDE5N10uOTM2YTE4
        [HttpGet("[action]")]
        public ActionResult StringDecrypt(string value)
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
                    result = Content(SynCryptoHelper.Decrypt(value));
                }
                catch (Exception exception)
                {
                    string exceptionText = exception.ToMessage();
                    if (ModuleConfiguration.IsLogServer == true)
                    {
                        transactLoggerClient.ProgramMessageLogging("N", "E", exceptionText, "Managed/StringDecrypt", (string error) =>
                        {
                            logger.Error("[{LogCategory}] fallback error: " + error + ", " + exceptionText, "Managed/StringDecrypt");
                        });
                    }
                    else
                    {
                        logger.Error("[{LogCategory}] " + exceptionText, "Managed/ResetContract");
                    }

                    result = StatusCode(500, exceptionText);
                }
            }

            return result;
        }
    }
}
