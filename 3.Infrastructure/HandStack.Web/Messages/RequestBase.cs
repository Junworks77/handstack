using System.ComponentModel;

using Newtonsoft.Json;

using HandStack.Web.MessageContract.Enumeration;

namespace HandStack.Web.Messages
{
    public class RequestBase
    {
        public RequestBase()
        {
            ClientTag = "";
            AccessToken = "";
            Version = "0";
            RequestID = "";
            LoadOptions = new Dictionary<string, object>();
            Action = "SYN";
            Kind = "BIZ";
            Environment = "D";
        }

        [JsonProperty("AccessToken")]
        public string AccessToken { get; set; }

        [JsonProperty("Action"), Description("'SYN: Request/Response, PSH: Execute/None, ACK: Subscribe'")]
        public string Action { get; set; }

        [JsonProperty("Kind"), Description("'DBG: Debug, BIZ: Business, URG: Urgent, FIN: Finish'")]
        public string Kind { get; set; }

        [JsonProperty("ClientTag")]
        public string ClientTag { get; set; }

        // CryptographyType: 'F:Full, H:Header, B:Body',
        // CryptographyKey: 'P:프로그램, K:KMS 서버, D:Decrypt 키',
        [JsonProperty("LoadOptions")]
        public Dictionary<string, object> LoadOptions { get; set; }

        [JsonProperty("RequestID")]
        public string RequestID { get; set; }

        [JsonProperty("Version")]
        public string Version { get; set; }

        [JsonProperty("Environment"), Description("'D: Development, P: Production, T: Test")]
        public string Environment { get; set; }

        public virtual bool ValidRequest(RequestBase request, ResponseBase response)
        {
            if (string.IsNullOrEmpty(GlobalConfiguration.AllowApplications) == false)
            {
                var allowApplications = GlobalConfiguration.AllowApplications.Split(",");

                if (allowApplications.Contains(request.ClientTag))
                {
                    response.Acknowledge = AcknowledgeType.Failure;
                    response.ExceptionText = "허가되지 않는 요청";
                    return false;
                }
            }

            return true;
        }
    }
}
