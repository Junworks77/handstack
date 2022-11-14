using System.Data;
using System.Dynamic;
using System.Net;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using HandStack.Core.ExtensionMethod;
using HandStack.Web.Entity;
using HandStack.Web.MessageContract.Contract;
using HandStack.Web.MessageContract.Enumeration;
using HandStack.Web.MessageContract.Message;

using RestSharp;

using Serilog;

namespace HandStack.Web.ApiClient
{
    public class TransactionClient : IDisposable
    {
        private ILogger logger { get; }

        private static Dictionary<string, JObject> apiServices = new Dictionary<string, JObject>();

        public TransactionClient(ILogger logger)
        {
            this.logger = logger;
        }

        public bool AddFindService(string systemID, string serverType)
        {
            bool result = false;
            try
            {
                string findID = systemID + serverType;
                if (apiServices.ContainsKey(findID) == false)
                {
                    Uri uri = new Uri(TransactionConfig.ApiFindUrl + $"?systemID={systemID}&serverType={serverType}");
                    RestClient client = new RestClient(uri);
                    // client.Proxy = BypassWebProxy.Default;
                    RestRequest apiRequest = new RestRequest(Method.GET);
                    apiRequest.AddHeader("Content-Type", "application/json");
                    apiRequest.AddHeader("cache-control", "no-cache");

                    apiRequest.Timeout = TransactionConfig.TransactionTimeout;
                    var apiResponse = client.Execute<TransactionResponse>(apiRequest, Method.GET);

                    if (apiResponse.ResponseStatus == ResponseStatus.Completed)
                    {
                        JObject apiService = JObject.Parse(apiResponse.Content);
                        if (apiService != null)
                        {
                            var exception = apiService["ExceptionText"];
                            string exceptionText = exception == null ? "" : exception.ToString();
                            if (string.IsNullOrEmpty(exceptionText) == true)
                            {
                                result = true;
                                apiServices.Add(systemID + serverType, apiService);
                            }
                        }
                        else
                        {
                            logger.Error($"systemID: {systemID}, serverType: {serverType} AddFindService 오류: {apiResponse.Content}");
                        }
                    }
                }
                else
                {
                    result = true;
                }
            }
            catch (Exception exception)
            {
                logger.Error(exception, $"systemID: {systemID}, serverType: {serverType} AddFindService 오류");
            }

            return result;
        }

        public bool AddApiService(string systemID, string serverType, JObject apiService)
        {
            bool result = false;
            try
            {
                string findID = systemID + serverType;
                if (apiServices.ContainsKey(findID) == false)
                {
                    apiServices.Add(systemID + serverType, apiService);
                }
                else
                {
                    result = true;
                }
            }
            catch (Exception exception)
            {
                logger.Error(exception, $"systemID: {systemID}, serverType: {serverType} AddApiService 오류");
            }

            return result;
        }

        public async Task<Dictionary<string, JToken?>> ExecuteTransaction(TransactionClientObject transactionObject)
        {
            dynamic hasException = new ExpandoObject();
            string typeResult = "";
            Dictionary<string, JToken?> result = new Dictionary<string, JToken?>();
            try
            {
                transactionObject.ReturnType = string.IsNullOrEmpty(transactionObject.ReturnType) == true ? "Json" : transactionObject.ReturnType;

                if (transactionObject.InputsItemCount.Count == 0)
                {
                    transactionObject.InputsItemCount.Add(transactionObject.Inputs.Count);
                }

                JObject? findService = null;
                if (apiServices.TryGetValue(transactionObject.SystemID + TransactionConfig.DomainServerType, out findService) == true)
                {
                    var protocol = findService["Protocol"];
                    var ip = findService["IP"];
                    var requestID = findService["RequestID"];
                    var path = findService["Path"];
                    var port = findService["Port"];

                    if (protocol == null || ip == null || path == null || port == null)
                    {
                        hasException.ErrorMessage = $"Ok|Error|요청 오류 - {transactionObject.SystemID + TransactionConfig.DomainServerType}";
                        result.Add("HasException", JObject.FromObject(hasException));
                        return result;
                    }

                    var baseUrl = "";
                    if (string.IsNullOrEmpty(port.ToString()) == false)
                    {
                        baseUrl = $"{protocol}://{ip}:{port}";
                    }
                    else
                    {
                        baseUrl = $"{protocol}://{ip}";
                    }

                    transactionObject.RequestID = string.IsNullOrEmpty(requestID?.ToString()) == true ? "" : requestID.ToString();

                    TransactionRequest transactionRequest = CreateTransactionRequest("SYN", transactionObject);

                    RestClient client = new RestClient(baseUrl);
                    // client.Proxy = BypassWebProxy.Default;
                    var request = new RestRequest(path.ToString(), Method.POST);
                    request.AddJsonBody(transactionRequest);

                    request.AddHeader("Content-Type", "application/json");
                    request.AddHeader("cache-control", "no-cache");
                    request.AddHeader("ClientTag", TransactionConfig.ClientTag);

                    CancellationTokenSource cancellationTokenSource = new CancellationTokenSource();

                    var response = await client.ExecuteAsync<TransactionResponse>(request, cancellationTokenSource.Token);

                    if (response.ResponseStatus == ResponseStatus.Completed)
                    {
                        TransactionResponse? transactionResponse = JsonConvert.DeserializeObject<TransactionResponse>(response.Content);
                        if (transactionResponse == null)
                        {
                            hasException.ErrorMessage = $"Ok|Error|{string.Concat("응답 오류 - ", response.Content)}";
                            result.Add("HasException", JObject.FromObject(hasException));
                        }
                        else
                        {
                            if (transactionResponse.Acknowledge == AcknowledgeType.Success)
                            {
                                if (transactionResponse.Result.DataSet != null && transactionResponse.Result.DataSet.Count > 0)
                                {
                                    foreach (var item in transactionResponse.Result.DataSet)
                                    {
                                        try
                                        {
                                            result.Add(item.FieldID, item.Value as JToken);
                                        }
                                        catch (Exception exception)
                                        {
                                            hasException.ErrorMessage = $"Ok|Completed|{string.Concat(item.FieldID, " ", exception.Message)}";

                                            result.Clear();
                                            result.Add("HasException", JObject.FromObject(hasException));
                                            break;
                                        }
                                    }
                                }
                            }
                            else
                            {
                                hasException.ErrorMessage = $"Ok|Completed|{string.Concat("응답 오류 - ", transactionResponse.ExceptionText)}";
                                result.Add("HasException", JObject.FromObject(hasException));
                            }
                        }
                    }
                    else
                    {
                        string errorMessage = response.ErrorMessage;
                        ResponseStatus responseStatus = response.ResponseStatus;
                        HttpStatusCode statusCode = response.StatusCode;

                        hasException.ErrorMessage = $"{statusCode.ToString()}|{responseStatus.ToString()}|{errorMessage}";
                        result.Add("HasException", JObject.FromObject(hasException));
                    }
                }
                else
                {
                    string errorMessage = $"SystemID: {transactionObject.SystemID}, DomainServerType: {TransactionConfig.DomainServerType}에 대한 접속 정보를 확인할 수 없습니다";

                    hasException.ErrorMessage = $"Ok|Completed|{errorMessage}";
                    result.Add("HasException", JObject.FromObject(hasException));
                }
            }
            catch (Exception exception)
            {
                string errorMessage = $"{exception}, Result - {typeResult}";
                hasException.ErrorMessage = $"{HttpStatusCode.Gone}|None|{errorMessage}";
                result.Add("HasException", JObject.FromObject(hasException));
            }

            return result;
        }

        public async Task<(string, DataSet?)> ExecuteTransactionDataSet(string businessServerUrl, TransactionClientObject transactionObject)
        {
            // 34바이트 = Timestamp (yyyyMMddhhmmssfff) 17자리 + AppID 3자리 + ProjectID 3자리 + 환경ID 1자리 + 거래ID 6자리 + 기능ID 4자리
            string requestID = $"{DateTime.Now.ToString("yyyyMMddhhmmssfff")}{transactionObject.ProgramID}{transactionObject.BusinessID}{TransactionConfig.Transaction.RunningEnvironment}{transactionObject.TransactionID}{transactionObject.FunctionID}";
            return await ExecuteTransactionDataSet(requestID, businessServerUrl, transactionObject);
        }

        public async Task<(string, DataSet?)> ExecuteTransactionDataSet(string requestID, string businessServerUrl, TransactionClientObject transactionObject)
        {
            (string, DataSet?) result = ("", null);
            try
            {
                transactionObject.ReturnType = string.IsNullOrEmpty(transactionObject.ReturnType) == true ? "Json" : transactionObject.ReturnType;

                if (transactionObject.InputsItemCount.Count == 0)
                {
                    transactionObject.InputsItemCount.Add(transactionObject.Inputs.Count);
                }

                transactionObject.RequestID = requestID;

                TransactionRequest transactionRequest = CreateTransactionRequest("SYN", transactionObject);

                RestClient client = new RestClient();
                // client.Proxy = BypassWebProxy.Default;
                var restRequest = new RestRequest(businessServerUrl, Method.POST);
                restRequest.AddJsonBody(transactionRequest);

                restRequest.AddHeader("Content-Type", "application/json");
                restRequest.AddHeader("cache-control", "no-cache");
                restRequest.AddHeader("ClientTag", TransactionConfig.ClientTag);

                CancellationTokenSource cancellationTokenSource = new CancellationTokenSource();

                var restResponse = await client.ExecuteAsync<TransactionResponse>(restRequest, cancellationTokenSource.Token);

                if (restResponse.ResponseStatus == ResponseStatus.Completed)
                {
                    using (MemoryStream stream = new MemoryStream(restResponse.RawBytes))
                    {
                        result.Item2 = new DataSet();
                        result.Item2.ReadXml(stream, XmlReadMode.Auto);
                    }
                }
                else
                {
                    string errorMessage = restResponse.ErrorMessage;
                    ResponseStatus responseStatus = restResponse.ResponseStatus;
                    HttpStatusCode statusCode = restResponse.StatusCode;

                    result.Item1 = $"{statusCode.ToString()}, {responseStatus.ToString()}, {errorMessage}";
                }
            }
            catch (Exception exception)
            {
                result.Item2 = null;
                result.Item1 = $"{HttpStatusCode.Gone.ToString()}, None, {exception.Message}";
            }

            return result;
        }

        public async Task<Dictionary<string, JToken?>> ExecuteTransactionJson(string businessServerUrl, TransactionClientObject transactionObject)
        {
            // 34바이트 = Timestamp (yyyyMMddhhmmssfff) 17자리 + AppID 3자리 + ProjectID 3자리 + 환경ID 1자리 + 거래ID 6자리 + 기능ID 4자리
            string requestID = $"{DateTime.Now.ToString("yyyyMMddhhmmssfff")}{transactionObject.ProgramID}{transactionObject.BusinessID}{TransactionConfig.Transaction.RunningEnvironment}{transactionObject.TransactionID}{transactionObject.FunctionID}";
            return await ExecuteTransactionJson(requestID, businessServerUrl, transactionObject);
        }

        public async Task<Dictionary<string, JToken?>> ExecuteTransactionJson(string requestID, string businessServerUrl, TransactionClientObject transactionObject)
        {
            dynamic hasException = new ExpandoObject();
            Dictionary<string, JToken?> result = new Dictionary<string, JToken?>();
            try
            {
                transactionObject.ReturnType = string.IsNullOrEmpty(transactionObject.ReturnType) == true ? "Json" : transactionObject.ReturnType;

                if (transactionObject.InputsItemCount.Count == 0)
                {
                    transactionObject.InputsItemCount.Add(transactionObject.Inputs.Count);
                }

                transactionObject.RequestID = requestID;

                TransactionRequest transactionRequest = CreateTransactionRequest("SYN", transactionObject);

                RestClient client = new RestClient();
                // client.Proxy = BypassWebProxy.Default;
                var restRequest = new RestRequest(businessServerUrl, Method.POST);
                restRequest.AddJsonBody(transactionRequest);

                restRequest.AddHeader("Content-Type", "application/json");
                restRequest.AddHeader("cache-control", "no-cache");
                restRequest.AddHeader("ClientTag", TransactionConfig.ClientTag);

                CancellationTokenSource cancellationTokenSource = new CancellationTokenSource();

                var restResponse = await client.ExecuteAsync<TransactionResponse>(restRequest, cancellationTokenSource.Token);

                if (restResponse.ResponseStatus == ResponseStatus.Completed)
                {
                    TransactionResponse? transactionResponse = JsonConvert.DeserializeObject<TransactionResponse>(restResponse.Content);

                    if (transactionResponse != null && transactionResponse.Acknowledge == AcknowledgeType.Success)
                    {
                        if (transactionResponse.Result.DataSet != null && transactionResponse.Result.DataSet.Count > 0)
                        {
                            foreach (var item in transactionResponse.Result.DataSet)
                            {
                                try
                                {
                                    result.Add(item.FieldID, item.Value as JToken);
                                }
                                catch (Exception exception)
                                {
                                    result.Clear();
                                    hasException.ErrorMessage = $"Ok|Completed|{string.Concat(item.FieldID, " ", exception.Message)}";
                                    result.Add("HasException", JObject.FromObject(hasException));
                                    break;
                                }
                            }
                        }
                    }
                    else
                    {
                        hasException.ErrorMessage = $"Ok|Completed|{string.Concat("응답 오류 - ", restResponse.Content)}";
                        result.Add("HasException", JObject.FromObject(hasException));
                    }
                }
                else
                {
                    string errorMessage = restResponse.ErrorMessage;
                    ResponseStatus responseStatus = restResponse.ResponseStatus;
                    HttpStatusCode statusCode = restResponse.StatusCode;

                    hasException.ErrorMessage = $"{statusCode}|{responseStatus}|{errorMessage}";
                    result.Add("HasException", JObject.FromObject(hasException));
                }
            }
            catch (Exception exception)
            {
                hasException.ErrorMessage = $"{HttpStatusCode.Gone}|None|{exception.Message}";
                result.Add("HasException", JObject.FromObject(hasException));
            }

            return result;
        }

        public async Task<Dictionary<string, JToken?>?> ExecuteTransactionJson(string businessID, string transactionID, string functionID, params List<ServiceParameter>[] serviceParameters)
        {
            Dictionary<string, JToken?>? result = null;

            TransactionClientObject transactionObject = new TransactionClientObject();
            transactionObject.SystemID = TransactionConfig.Transaction.SystemID;
            transactionObject.ProgramID = GlobalConfiguration.SystemID;
            transactionObject.BusinessID = businessID;
            transactionObject.TransactionID = transactionID;
            transactionObject.FunctionID = functionID;

            if (serviceParameters == null || serviceParameters.Length == 0)
            {
                transactionObject.Inputs.Add(new List<ServiceParameter>());
            }
            else
            {
                foreach (var serviceParameter in serviceParameters)
                {
                    List<ServiceParameter> inputs = new List<ServiceParameter>();
                    foreach (var item in serviceParameter)
                    {
                        inputs.Add(item);
                    }
                    transactionObject.Inputs.Add(inputs);
                }
            }

            result = await ExecuteTransactionJson(GlobalConfiguration.BusinessServerUrl, transactionObject);

            return result;
        }

        public async Task<DataSet?> ExecuteTransactionDataSet(string businessID, string transactionID, string functionID, params List<ServiceParameter>[] serviceParameters)
        {
            DataSet? result = null;

            TransactionClientObject transactionObject = new TransactionClientObject();
            transactionObject.SystemID = TransactionConfig.Transaction.SystemID;
            transactionObject.ProgramID = GlobalConfiguration.SystemID;
            transactionObject.BusinessID = businessID;
            transactionObject.TransactionID = transactionID;
            transactionObject.FunctionID = functionID;

            if (serviceParameters == null || serviceParameters.Length == 0)
            {
                transactionObject.Inputs.Add(new List<ServiceParameter>());
            }
            else
            {
                foreach (var serviceParameter in serviceParameters)
                {
                    List<ServiceParameter> inputs = new List<ServiceParameter>();
                    foreach (var item in serviceParameter)
                    {
                        inputs.Add(item);
                    }
                    transactionObject.Inputs.Add(inputs);
                }
            }

            var validateResult = await ExecuteTransactionDataSet(GlobalConfiguration.BusinessServerUrl, transactionObject);

            if (string.IsNullOrEmpty(validateResult.Item1) == false)
            {
                logger.Error("[{LogCategory}] " + validateResult.Item1, "TransactionClient/UserInformation");
                return result;
            }
            else
            {
                result = validateResult.Item2;
            }

            return result;
        }

        public async Task<string?> ExecuteTransactionNone(string businessServerUrl, TransactionClientObject transactionObject, int timeout = 10000)
        {
            // 36바이트 = Timestamp (yyyyMMddhhmmssfff) 17자리 + AppID 3자리 + ProjectID 3자리 + 환경ID 1자리 + 거래ID 6자리 + 기능ID 3자리
            string requestID = $"{DateTime.Now.ToString("yyyyMMddhhmmssfff")}{transactionObject.ProgramID}{transactionObject.BusinessID}{TransactionConfig.Transaction.RunningEnvironment}{transactionObject.TransactionID}{transactionObject.FunctionID}";
            return await ExecuteTransactionNone(requestID, businessServerUrl, transactionObject, timeout);
        }

        public async Task<string?> ExecuteTransactionNone(string requestID, string businessServerUrl, TransactionClientObject transactionObject, int timeout = 10000)
        {
            string? result = null;
            try
            {
                transactionObject.ReturnType = string.IsNullOrEmpty(transactionObject.ReturnType) == true ? "Json" : transactionObject.ReturnType;

                if (transactionObject.InputsItemCount.Count == 0)
                {
                    transactionObject.InputsItemCount.Add(transactionObject.Inputs.Count);
                }

                transactionObject.RequestID = requestID;

                TransactionRequest transactionRequest = CreateTransactionRequest("SYN", transactionObject);

                RestClient client = new RestClient();
                // client.Proxy = BypassWebProxy.Default;
                var restRequest = new RestRequest(businessServerUrl, Method.POST);
                restRequest.AddJsonBody(transactionRequest);

                restRequest.AddHeader("Content-Type", "application/json");
                restRequest.AddHeader("cache-control", "no-cache");
                restRequest.AddHeader("ClientTag", TransactionConfig.ClientTag);

                CancellationTokenSource cancellationTokenSource = new CancellationTokenSource();
                cancellationTokenSource.CancelAfter(timeout);
                var restResponse = await client.ExecuteAsync<TransactionResponse>(restRequest, cancellationTokenSource.Token);

                if (restResponse.ResponseStatus == ResponseStatus.Completed)
                {
                    logger.Information($"ExecuteTransactionNone: {requestID}, Done");
                }
                else
                {
                    result = restResponse.ErrorMessage;
                    logger.Warning($"ExecuteTransactionNone: {requestID}, ErrorMessage: {restResponse.ErrorMessage}, ResponseStatus: {restResponse.ResponseStatus}, StatusCode: {restResponse.StatusCode}");
                }
            }
            catch (Exception exception)
            {
                result = exception.ToString();
                logger.Error(exception, $"ExecuteTransactionNone: {requestID}, message: {result}");
            }

            return result;
        }

        private TransactionRequest CreateTransactionRequest(string action, TransactionClientObject transactionObject)
        {
            TransactionRequest transactionRequest = new TransactionRequest();
            transactionRequest.AccessToken = "";
            transactionRequest.Action = action;
            transactionRequest.Kind = transactionObject.Kind;
            transactionRequest.ClientTag = string.Concat(TransactionConfig.Transaction.SystemID, "|", TransactionConfig.Transaction.MachineName, "|", TransactionConfig.Program.ProgramName, "|", TransactionConfig.Transaction.RunningEnvironment);
            transactionRequest.LoadOptions = new Dictionary<string, object>();
            transactionRequest.LoadOptions.Add("encryptionType", TransactionConfig.Transaction.EncryptionType);
            transactionRequest.LoadOptions.Add("encryptionKey", TransactionConfig.Transaction.EncryptionKey);
            transactionRequest.LoadOptions.Add("platform", Environment.OSVersion.Platform.ToString());
            transactionRequest.RequestID = string.Concat(transactionObject.ProgramID, transactionObject.BusinessID, transactionObject.TransactionID, transactionObject.FunctionID, TransactionConfig.Transaction.RunningEnvironment, DateTime.Now.ToString("yyyyMMddhhmmssffffff")).ToUpper();
            transactionRequest.Version = TransactionConfig.Transaction.ProtocolVersion;
            transactionRequest.Environment = TransactionConfig.Transaction.RunningEnvironment;

            transactionRequest.System.ProgramID = transactionObject.ProgramID;
            transactionRequest.System.Version = TransactionConfig.Program.ProgramVersion;
            transactionRequest.System.LocaleID = TransactionConfig.Program.LanguageID;
            transactionRequest.System.HostName = TransactionConfig.Transaction.MachineName;
            transactionRequest.System.Routes.Add(new Route()
            {
                SystemID = TransactionConfig.Transaction.SystemID,
                RequestTick = DateTimeExtensions.GetJavascriptTime()
            });

            transactionRequest.Interface.DevicePlatform = Environment.OSVersion.Platform.ToString();
            transactionRequest.Interface.InterfaceID = TransactionConfig.Transaction.MachineTypeID;
            transactionRequest.Interface.SourceIP = TransactionConfig.Program.IPAddress;
            transactionRequest.Interface.SourcePort = 0;
            transactionRequest.Interface.SourceMac = TransactionConfig.Program.MacAddress;
            transactionRequest.Interface.ConnectionType = TransactionConfig.Program.NetworkInterfaceType;
            transactionRequest.Interface.Timeout = TransactionConfig.TransactionTimeout;

            transactionRequest.Transaction.GlobalID = transactionRequest.RequestID;
            transactionRequest.Transaction.BusinessID = transactionObject.BusinessID;
            transactionRequest.Transaction.TransactionID = transactionObject.TransactionID;
            transactionRequest.Transaction.FunctionID = transactionObject.FunctionID;
            transactionRequest.Transaction.SimulationType = transactionObject.SimulationType;
            transactionRequest.Transaction.TerminalGroupID = TransactionConfig.Program.BranchCode;
            transactionRequest.Transaction.OperatorID = TransactionConfig.OperatorUser.UserID;
            transactionRequest.Transaction.ScreenID = string.IsNullOrEmpty(transactionObject.ScreenID) == true ? transactionObject.TransactionID : transactionObject.ScreenID;
            transactionRequest.Transaction.DataFormat = TransactionConfig.Transaction.DataFormat;
            transactionRequest.Transaction.CompressionYN = TransactionConfig.Transaction.CompressionYN;
            transactionRequest.Transaction.Maskings = transactionObject.Maskings;

            transactionRequest.PayLoad.MapID = transactionObject.TransactionMapID;
            transactionRequest.PayLoad.DataMapCount = transactionObject.InputsItemCount;
            transactionRequest.PayLoad.DataMapSet = new List<List<DataMapItem>>();

            foreach (var inputs in transactionObject.Inputs)
            {
                List<DataMapItem> reqInputs = new List<DataMapItem>();
                foreach (var item in inputs)
                {
                    reqInputs.Add(new DataMapItem() { FieldID = item.prop, Value = item.val });
                }
                transactionRequest.PayLoad.DataMapSet.Add(reqInputs);
            }

            return transactionRequest;
        }

        public void Dispose()
        {
        }
    }
}
