using System;
using System.Collections.Generic;
using System.Net;
using System.Threading;

using HandStack.Web;
using HandStack.Web.MessageContract.Message;

using Newtonsoft.Json;

using Polly;
using Polly.CircuitBreaker;

using RestSharp;

namespace transact.Extensions
{
    public class TransactLoggerClient
    {
        private Serilog.ILogger logger { get; }
        public CircuitBreakerPolicy<IRestResponse>? ApplicationCircuitBreaker = null;
        public DateTime? BreakDateTime = DateTime.Now;

        public TransactLoggerClient(Serilog.ILogger logger)
        {
            this.logger = logger;

            ApplicationCircuitBreaker = Policy
                .HandleResult<IRestResponse>(x => x.StatusCode != HttpStatusCode.OK)
                .CircuitBreaker(1, TimeSpan.FromSeconds(ModuleConfiguration.CircuitBreakResetSecond),
                onBreak: (iRestResponse, timespan, context) =>
                {
                    logger.Error("[{LogCategory}] " + $"CircuitBreaker Error Reason: {iRestResponse.Result.Content}", "CircuitBreaker/onBreak");
                },
                onReset: (context) =>
                {
                    logger.Information("[{LogCategory}] " + $"CircuitBreaker Reset, DateTime={DateTime.Now}", "CircuitBreaker/onReset");
                });
        }

        public IRestResponse? Send(Method httpVerb, string hostUrl, LogMessage logMessage, Action<string> fallbackFunction, Dictionary<string, string>? headers = null)
        {
            IRestResponse? restResponse = new RestResponse
            {
                Content = "",
                ErrorMessage = "Equivalent to HTTP status 503",
                ResponseStatus = ResponseStatus.None,
                StatusCode = HttpStatusCode.ServiceUnavailable
            };

            try
            {
                if (string.IsNullOrEmpty(hostUrl) == true)
                {
                    fallbackFunction($"hostUrl 오류: {hostUrl}");
                    return restResponse;
                }

                var restRequest = new RestRequest(httpVerb);
                restRequest.AddHeader("cache-control", "no-cache");
                if (headers != null && headers.Count > 0)
                {
                    foreach (var header in headers)
                    {
                        restRequest.AddHeader(header.Key, header.Value);
                    }

                    if (headers.ContainsKey("Content-Type") == false)
                    {
                        restRequest.AddHeader("Content-Type", "application/json");
                    }
                }
                else
                {
                    restRequest.AddHeader("Content-Type", "application/json");
                }

                logMessage.CreateDateTime = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fffffff");

                var json = JsonConvert.SerializeObject(logMessage);
                if (httpVerb != Method.GET)
                {
                    restRequest.RequestFormat = DataFormat.Json;
                    restRequest.AddParameter("application/json; charset=utf-8", json, ParameterType.RequestBody);
                }

                restResponse = this.RestResponseWithPolicy(new RestClient(hostUrl), restRequest, fallbackFunction);
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

        private IRestResponse? RestResponseWithPolicy(RestClient restClient, RestRequest restRequest, Action<string> fallbackFunction)
        {
            IRestResponse? result = null;
            if (ApplicationCircuitBreaker != null && ApplicationCircuitBreaker.CircuitState == CircuitState.Closed)
            {
                result = ApplicationCircuitBreaker.Execute(() =>
                {
                    restClient.Timeout = 200;
                    return restClient.Execute(restRequest);
                });

                if (result.StatusCode != HttpStatusCode.OK)
                {
                    BreakDateTime = DateTime.Now;
                }
            }
            else
            {
                if (ApplicationCircuitBreaker == null)
                {

                }
                else
                {
                    fallbackFunction($"CircuitBreaker Error Reason: {ApplicationCircuitBreaker.CircuitState.ToString()}");
                }
            }

            return result;
        }

        public void ProgramMessageLogging(string acknowledge, string level, string message, string properties, Action<string> fallbackFunction)
        {
            LogMessage logMessage = new LogMessage();
            logMessage.ServerID = GlobalConfiguration.HostName;
            logMessage.RunningEnvironment = GlobalConfiguration.RunningEnvironment;
            logMessage.ProgramName = ModuleConfiguration.ModuleID;
            logMessage.GlobalID = "";
            logMessage.Acknowledge = acknowledge;
            logMessage.ApplicationID = ModuleConfiguration.SystemID;
            logMessage.ProjectID = "";
            logMessage.TransactionID = "";
            logMessage.ServiceID = "";
            logMessage.Type = "A";
            logMessage.Flow = "N";
            logMessage.Level = level;
            logMessage.Format = "P";
            logMessage.Message = message;
            logMessage.Properties = properties;
            logMessage.UserID = "";

            LogRequest logRequest = new LogRequest();
            logRequest.LogMessage = logMessage;
            logRequest.FallbackFunction = fallbackFunction;

            ThreadPool.QueueUserWorkItem(BackgroundTask, logRequest);
        }

        public void TransactionRequestLogging(TransactionRequest request, string acknowledge, Action<string> fallbackFunction)
        {
            if (ModuleConfiguration.IsLogServer == true)
            {
                LogMessage logMessage = new LogMessage();
                logMessage.ServerID = GlobalConfiguration.HostName;
                logMessage.RunningEnvironment = GlobalConfiguration.RunningEnvironment;
                logMessage.ProgramName = ModuleConfiguration.ModuleID;
                logMessage.GlobalID = request.Transaction.GlobalID;
                logMessage.Acknowledge = string.IsNullOrEmpty(acknowledge) == true ? "N" : acknowledge;
                logMessage.ApplicationID = request.System.ProgramID;
                logMessage.ProjectID = request.Transaction.BusinessID;
                logMessage.TransactionID = request.Transaction.TransactionID;
                logMessage.ServiceID = request.Transaction.FunctionID;
                logMessage.Type = "T";
                logMessage.Flow = "I";
                logMessage.Level = "V";
                logMessage.Format = request.Transaction.DataFormat;
                logMessage.Message = JsonConvert.SerializeObject(request);
                logMessage.Properties = JsonConvert.SerializeObject(request.PayLoad.Property);
                logMessage.UserID = request.Transaction.OperatorID;

                LogRequest logRequest = new LogRequest();
                logRequest.LogMessage = logMessage;
                logRequest.FallbackFunction = fallbackFunction;

                ThreadPool.QueueUserWorkItem(BackgroundTask, logRequest);
            }
            else
            {
                logger.Warning($"Request GlobalID: {request.Transaction.GlobalID}, JSON: {JsonConvert.SerializeObject(request)}");
            }
        }

        public void TransactionResponseLogging(TransactionResponse response, string acknowledge, Action<string> fallbackFunction)
        {
            if (ModuleConfiguration.IsLogServer == true)
            {
                LogMessage logMessage = new LogMessage();
                logMessage.ServerID = GlobalConfiguration.HostName;
                logMessage.RunningEnvironment = GlobalConfiguration.RunningEnvironment;
                logMessage.ProgramName = ModuleConfiguration.ModuleID;
                logMessage.GlobalID = response.Transaction.GlobalID;
                logMessage.Acknowledge = string.IsNullOrEmpty(acknowledge) == true ? "N" : acknowledge;
                logMessage.ApplicationID = response.System.ProgramID;
                logMessage.ProjectID = response.Transaction.BusinessID;
                logMessage.TransactionID = response.Transaction.TransactionID;
                logMessage.ServiceID = response.Transaction.FunctionID;
                logMessage.Type = "T";
                logMessage.Flow = "O";
                logMessage.Level = "V";
                logMessage.Format = "J";
                logMessage.Message = JsonConvert.SerializeObject(response);
                logMessage.Properties = JsonConvert.SerializeObject(response.Result.Property);
                logMessage.UserID = response.Transaction.OperatorID;

                LogRequest logRequest = new LogRequest();
                logRequest.LogMessage = logMessage;
                logRequest.FallbackFunction = fallbackFunction;

                ThreadPool.QueueUserWorkItem(BackgroundTask, logRequest);
            }
            else
            {
                logger.Warning($"Response GlobalID: {response.Transaction.GlobalID}, JSON: {JsonConvert.SerializeObject(response)}");
            }
        }

        private void BackgroundTask(object? state)
        {
            LogRequest? logRequest = state as LogRequest;

            if (ApplicationCircuitBreaker != null && logRequest != null)
            {
                try
                {
                    var circuitState = ApplicationCircuitBreaker.CircuitState;
                    if (circuitState == CircuitState.Closed)
                    {
                        Send(Method.POST, ModuleConfiguration.LogServerUrl, logRequest.LogMessage, (string error) =>
                        {
                            BreakDateTime = DateTime.Now;
                            ApplicationCircuitBreaker.Isolate();

                            logger.Error("BackgroundTask CircuitBreaker 오류: " + error);

                            if (logRequest.FallbackFunction != null)
                            {
                                logRequest.FallbackFunction(error);
                            }
                        });
                    }
                    else
                    {
                        if (BreakDateTime != null && BreakDateTime.Value.Ticks < DateTime.Now.AddSeconds(-ModuleConfiguration.CircuitBreakResetSecond).Ticks)
                        {
                            BreakDateTime = null;
                            ApplicationCircuitBreaker.Reset();
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

                        BreakDateTime = DateTime.Now;
                        ApplicationCircuitBreaker.Isolate();
                    }
                    catch
                    {
                    }
                }
            }
        }
    }
}
