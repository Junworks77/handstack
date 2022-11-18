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

namespace dbclient.Extensions
{
    public class DbClientLoggerClient
    {
        private Serilog.ILogger logger { get; }
        public CircuitBreakerPolicy<IRestResponse>? circuitBreakerPolicy = null;
        public DateTime? BreakDateTime = DateTime.Now;

        public DbClientLoggerClient(Serilog.ILogger logger)
        {

            this.logger = logger;

            circuitBreakerPolicy = Policy
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

        public IRestResponse Send(Method httpVerb, string hostUrl, LogMessage logMessage, Action<string> fallbackFunction, Dictionary<string, string>? headers = null)
        {
            IRestResponse restResponse = new RestResponse
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

        private IRestResponse RestResponseWithPolicy(RestClient restClient, RestRequest restRequest, Action<string> fallbackFunction)
        {
            IRestResponse result = new RestResponse
            {
                Content = "",
                ErrorMessage = "Equivalent to HTTP status 503",
                ResponseStatus = ResponseStatus.None,
                StatusCode = HttpStatusCode.ServiceUnavailable
            };

            if (circuitBreakerPolicy != null && circuitBreakerPolicy.CircuitState == CircuitState.Closed)
            {
                result = circuitBreakerPolicy.Execute(() =>
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
                if (circuitBreakerPolicy == null)
                {
                    fallbackFunction($"CircuitBreaker Error Reason: Unhandled Null");
                }
                else
                {
                    fallbackFunction($"CircuitBreaker Error Reason: {circuitBreakerPolicy.CircuitState.ToString()}");
                }
            }

            return result;
        }

        public void ProgramMessageLogging(string acknowledge, string applicationID, string message, string properties, Action<string> fallbackFunction)
        {
            LogMessage logMessage = new LogMessage();
            logMessage.ServerID = GlobalConfiguration.HostName;
            logMessage.RunningEnvironment = GlobalConfiguration.RunningEnvironment;
            logMessage.ProgramName = ModuleConfiguration.ModuleID;
            logMessage.GlobalID = "";
            logMessage.Acknowledge = string.IsNullOrEmpty(acknowledge) == true ? "N" : acknowledge;
            logMessage.ApplicationID = string.IsNullOrEmpty(applicationID) == true ? GlobalConfiguration.SystemID : applicationID;
            logMessage.ProjectID = "";
            logMessage.TransactionID = "";
            logMessage.ServiceID = "";
            logMessage.Type = "A";
            logMessage.Flow = "N";
            logMessage.Level = "V";
            logMessage.Format = "P";
            logMessage.Message = message;
            logMessage.Properties = properties;
            logMessage.UserID = "";

            LogRequest logRequest = new LogRequest();
            logRequest.LogMessage = logMessage;
            logRequest.FallbackFunction = fallbackFunction;

            ThreadPool.QueueUserWorkItem(BackgroundTask, logRequest);
        }

        public void ProgramMessageLogging(string globalID, string acknowledge, string applicationID, string message, string properties, Action<string> fallbackFunction)
        {
            LogMessage logMessage = new LogMessage();
            logMessage.ServerID = GlobalConfiguration.HostName;
            logMessage.RunningEnvironment = GlobalConfiguration.RunningEnvironment;
            logMessage.ProgramName = ModuleConfiguration.ModuleID;
            logMessage.GlobalID = globalID;
            logMessage.Acknowledge = string.IsNullOrEmpty(acknowledge) == true ? "N" : acknowledge;
            logMessage.ApplicationID = applicationID;
            logMessage.ProjectID = "";
            logMessage.TransactionID = "";
            logMessage.ServiceID = "";
            logMessage.Type = "A";
            logMessage.Flow = "N";
            logMessage.Level = "V";
            logMessage.Format = "P";
            logMessage.Message = message;
            logMessage.Properties = properties;
            logMessage.UserID = "";

            LogRequest logRequest = new LogRequest();
            logRequest.LogMessage = logMessage;
            logRequest.FallbackFunction = fallbackFunction;

            ThreadPool.QueueUserWorkItem(BackgroundTask, logRequest);
        }

        public void ProgramMessageLogging(string globalID, string acknowledge, string applicationID, string projectID, string transactionID, string serviceID, string level, string userID, string message, string properties, Action<string> fallbackFunction)
        {
            LogMessage logMessage = new LogMessage();
            logMessage.ServerID = GlobalConfiguration.HostName;
            logMessage.RunningEnvironment = GlobalConfiguration.RunningEnvironment;
            logMessage.ProgramName = ModuleConfiguration.ModuleID;
            logMessage.GlobalID = globalID;
            logMessage.Acknowledge = acknowledge;
            logMessage.ApplicationID = applicationID;
            logMessage.ProjectID = projectID;
            logMessage.TransactionID = transactionID;
            logMessage.ServiceID = serviceID;
            logMessage.Type = "A";
            logMessage.Flow = "N";
            logMessage.Level = level;
            logMessage.Format = "P";
            logMessage.Message = message;
            logMessage.Properties = properties;
            logMessage.UserID = userID;

            LogRequest logRequest = new LogRequest();
            logRequest.LogMessage = logMessage;
            logRequest.FallbackFunction = fallbackFunction;

            ThreadPool.QueueUserWorkItem(BackgroundTask, logRequest);
        }

        public void ProgramMessageLogging(string globalID, string acknowledge, string applicationID, string projectID, string transactionID, string serviceID, string message, string properties, Action<string> fallbackFunction)
        {
            LogMessage logMessage = new LogMessage();
            logMessage.ServerID = GlobalConfiguration.HostName;
            logMessage.RunningEnvironment = GlobalConfiguration.RunningEnvironment;
            logMessage.ProgramName = ModuleConfiguration.ModuleID;
            logMessage.GlobalID = globalID;
            logMessage.Acknowledge = string.IsNullOrEmpty(acknowledge) == true ? "N" : acknowledge;
            logMessage.ApplicationID = applicationID;
            logMessage.ProjectID = projectID;
            logMessage.TransactionID = transactionID;
            logMessage.ServiceID = serviceID;
            logMessage.Type = "A";
            logMessage.Flow = "N";
            logMessage.Level = "V";
            logMessage.Format = "P";
            logMessage.Message = message;
            logMessage.Properties = properties;
            logMessage.UserID = "";

            LogRequest logRequest = new LogRequest();
            logRequest.LogMessage = logMessage;
            logRequest.FallbackFunction = fallbackFunction;

            ThreadPool.QueueUserWorkItem(BackgroundTask, logRequest);
        }

        public void DynamicResponseLogging(string globalID, string acknowledge, string applicationID, string message, string properties, Action<string> fallbackFunction)
        {
            if (ModuleConfiguration.IsLogServer == true)
            {
                LogMessage logMessage = new LogMessage();
                logMessage.ServerID = GlobalConfiguration.HostName;
                logMessage.RunningEnvironment = GlobalConfiguration.RunningEnvironment;
                logMessage.ProgramName = ModuleConfiguration.ModuleID;
                logMessage.GlobalID = globalID;
                logMessage.Acknowledge = string.IsNullOrEmpty(acknowledge) == true ? "N" : acknowledge;
                logMessage.ApplicationID = applicationID;
                logMessage.ProjectID = "";
                logMessage.TransactionID = "";
                logMessage.ServiceID = "";
                logMessage.Type = "T";
                logMessage.Flow = "O";
                logMessage.Level = "V";
                logMessage.Format = "J";
                logMessage.Message = message;
                logMessage.Properties = properties;
                logMessage.UserID = "";

                LogRequest logRequest = new LogRequest();
                logRequest.LogMessage = logMessage;
                logRequest.FallbackFunction = fallbackFunction;

                ThreadPool.QueueUserWorkItem(BackgroundTask, logRequest);
            }
            else
            {
                logger.Warning($"Response GlobalID: {globalID}, {properties}, {message}");
            }
        }

        public void DynamicRequestLogging(DynamicRequest request, string acknowledge, string applicationID, Action<string> fallbackFunction)
        {
            if (ModuleConfiguration.IsLogServer == true)
            {
                LogMessage logMessage = new LogMessage();
                logMessage.ServerID = GlobalConfiguration.HostName;
                logMessage.RunningEnvironment = GlobalConfiguration.RunningEnvironment;
                logMessage.ProgramName = ModuleConfiguration.ModuleID;
                logMessage.GlobalID = request.GlobalID;
                logMessage.Acknowledge = string.IsNullOrEmpty(acknowledge) == true ? "N" : acknowledge;
                logMessage.ApplicationID = applicationID;
                logMessage.ProjectID = "";
                logMessage.TransactionID = "";
                logMessage.ServiceID = "";
                logMessage.Type = "T";
                logMessage.Flow = "I";
                logMessage.Level = "V";
                logMessage.Format = "J";
                logMessage.Message = JsonConvert.SerializeObject(request);
                logMessage.Properties = "";
                logMessage.UserID = "";

                LogRequest logRequest = new LogRequest();
                logRequest.LogMessage = logMessage;
                logRequest.FallbackFunction = fallbackFunction;

                ThreadPool.QueueUserWorkItem(BackgroundTask, logRequest);
            }
            else
            {
                logger.Warning($"Request GlobalID: {request.GlobalID}, {JsonConvert.SerializeObject(request)}");
            }
        }

        private void BackgroundTask(object? state)
        {
            if (state != null)
            {
                LogRequest? logRequest = state as LogRequest;

                if (circuitBreakerPolicy != null && logRequest != null)
                {
                    try
                    {

                        var circuitState = circuitBreakerPolicy.CircuitState;
                        if (circuitState == CircuitState.Closed)
                        {
                            Send(Method.POST, ModuleConfiguration.LogServerUrl, logRequest.LogMessage, (string error) =>
                            {
                                BreakDateTime = DateTime.Now;
                                circuitBreakerPolicy.Isolate();

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
                            if (BreakDateTime != null && BreakDateTime.Value.Ticks < DateTime.Now.AddSeconds(-ModuleConfiguration.CircuitBreakResetSecond).Ticks)
                            {
                                BreakDateTime = null;
                                circuitBreakerPolicy.Reset();
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
                            circuitBreakerPolicy.Isolate();
                        }
                        catch (Exception innerException)
                        {
                            logger.Error(innerException, $"BackgroundTask Inner Exception, BreakDateTime: {BreakDateTime}");
                        }
                    }
                }
            }
        }
    }
}
