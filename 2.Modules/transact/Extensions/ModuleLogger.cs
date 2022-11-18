using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Threading;

using HandStack.Core.ExtensionMethod;
using HandStack.Web.MessageContract.Message;

using Microsoft.Extensions.Configuration;

using Newtonsoft.Json;

using Polly;
using Polly.CircuitBreaker;

using RestSharp;

using Serilog;

namespace transact.Extensions
{
    // TransactLoggerClient 가져올것
    internal class ModuleLogger
    {
        private ILogger logger { get; }
        public CircuitBreakerPolicy<IRestResponse>? CircuitBreakerPolicy = null;
        private DateTime? breakDateTime = DateTime.Now;

        public ModuleLogger(ILogger logger)
        {
            this.logger = logger;
            IConfigurationRoot configuration;
            var configurationBuilder = new ConfigurationBuilder().AddJsonFile("appsettings.json");

            string environmentFileName = $"module.json";
            if (File.Exists(Path.Combine(Environment.CurrentDirectory, environmentFileName)) == true)
            {
                configuration = configurationBuilder.AddJsonFile(environmentFileName).Build();
            }
            else
            {
                configuration = configurationBuilder.Build();
            }

            logger = new LoggerConfiguration()
                .ReadFrom.Configuration(configuration)
                .CreateLogger();
        }

        public CircuitBreakerPolicy<IRestResponse> DefaultCircuitBreakerPolicy(Action<DelegateResult<IRestResponse>, TimeSpan, Context> onBreak, Action<Context> onReset)
        {
            CircuitBreakerPolicy = Policy
                .HandleResult<IRestResponse>(x => x.StatusCode != HttpStatusCode.OK)
                .CircuitBreaker(1, TimeSpan.FromSeconds(3),
                onBreak: onBreak,
                onReset: onReset);

            return CircuitBreakerPolicy;
        }

        public IRestResponse Send(LogMessage logMessage, Action<string> fallbackFunction, Dictionary<string, string>? headers = null)
        {
            IRestResponse restResponse = new RestResponse
            {
                Content = "",
                ErrorMessage = "Equivalent to HTTP status 503",
                ResponseStatus = ResponseStatus.None,
                StatusCode = HttpStatusCode.ServiceUnavailable
            };

            string hostUrl = ModuleConfiguration.LogServerUrl;
            try
            {
                if (string.IsNullOrEmpty(hostUrl) == true)
                {
                    fallbackFunction($"hostUrl 오류: {hostUrl}");
                    return restResponse;
                }

                var restRequest = new RestRequest(Method.POST);
                restRequest.AddHeader("cache-control", "no-cache");
                if (headers != null && headers.Count > 0)
                {
                    foreach (var header in headers)
                    {
                        restRequest.AddOrUpdateHeader(header.Key, header.Value);
                    }
                }

                restRequest.AddOrUpdateHeader("Content-Type", "application/json");

                var json = JsonConvert.SerializeObject(logMessage);

                restRequest.RequestFormat = DataFormat.Json;
                restRequest.AddParameter("application/json; charset=utf-8", json, ParameterType.RequestBody);

                if (CircuitBreakerPolicy == null)
                {
                    CircuitBreakerPolicy = DefaultCircuitBreakerPolicy((iRestResponse, timespan, context) =>
                    {
                        var logData = restRequest?.Body?.Value.ToStringSafe();
                        if (logData != null)
                        {
                            fallbackFunction($"CircuitBreaker Error LogMessage: {logData}, Reason: {iRestResponse.Result.Content}");
                        }
                        else
                        {
                            fallbackFunction($"CircuitBreaker Error Reason: {iRestResponse.Result.Content}");
                        }
                    }, (context) =>
                    {
                        Debug.WriteLine($"CircuitBreaker Reset, DateTime={DateTime.Now}");
                        Console.WriteLine($"CircuitBreaker Reset, DateTime={DateTime.Now}");
                    });
                }

                if (CircuitBreakerPolicy != null)
                {
                    restResponse = CircuitBreakerPolicy.Execute(() =>
                    {
                        RestClient restClient = new RestClient(hostUrl);
                        restClient.Timeout = 1000;
                        return restClient.Execute(restRequest);
                    });
                }
            }
            catch (Exception ex)
            {
                restResponse = new RestResponse
                {
                    Content = ex.Message,
                    ErrorMessage = ex.Message,
                    ResponseStatus = ResponseStatus.TimedOut,
                    StatusCode = HttpStatusCode.ServiceUnavailable
                };
            }

            return restResponse;
        }

        public void Execute(LogRequest logRequest)
        {
            ThreadPool.QueueUserWorkItem(BackgroundTask, logRequest);
        }

        private void BackgroundTask(object? state)
        {
            LogRequest? logRequest = state as LogRequest;

            if (logRequest == null || CircuitBreakerPolicy == null)
            {
                logger.Warning("LogRequest 또는 CircuitBreakerPolicy 확인 필요");
                return;
            }

            try
            {
                var circuitState = CircuitBreakerPolicy.CircuitState;
                if (circuitState == CircuitState.Closed)
                {
                    Send(logRequest.LogMessage, (string error) =>
                    {
                        breakDateTime = DateTime.Now;
                        CircuitBreakerPolicy.Isolate();

                        logger.Error("BackgroundTask CircuitBreaker 오류: " + error);
                        Console.WriteLine(error);

                        if (logRequest.FallbackFunction != null)
                        {
                            logRequest.FallbackFunction(error);
                        }
                    });
                }
                else
                {
                    if (breakDateTime != null && breakDateTime.Value.Ticks < DateTime.Now.AddSeconds(-ModuleConfiguration.CircuitBreakResetSecond).Ticks)
                    {
                        breakDateTime = null;
                        CircuitBreakerPolicy.Reset();
                    }

                    if (logRequest.FallbackFunction != null)
                    {
                        logRequest.FallbackFunction("CircuitBreaker CircuitState" + circuitState.ToString());
                    }
                }
            }
            catch (Exception exception)
            {
                try
                {
                    logger.Error(exception, "BackgroundTask 오류: " + JsonConvert.SerializeObject(logRequest.LogMessage));

                    breakDateTime = DateTime.Now;
                    CircuitBreakerPolicy.Isolate();
                }
                catch
                {
                }
            }
        }
    }
}
