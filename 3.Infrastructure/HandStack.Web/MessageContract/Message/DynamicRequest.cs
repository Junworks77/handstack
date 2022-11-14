using HandStack.Web.MessageContract.DataObject;
using HandStack.Web.MessageContract.Enumeration;

namespace HandStack.Web.MessageContract.Message
{
    public class DynamicRequest
    {
        public DynamicRequest()
        {
            ClientTag = "";
            AccessToken = "";
            Version = "";
            RequestID = "";
            LoadOptions = new Dictionary<string, object>();
            Action = "";
            Environment = "";
            ReturnType = ExecuteDynamicTypeObject.Json;
            GlobalID = "";
            IsTransaction = false;
            DynamicObjects = new List<DynamicObject>();
        }

        public string ClientTag;

        public string AccessToken;

        public string Version;

        public string RequestID;

        public Dictionary<string, object> LoadOptions;

        public string Action;

        public string Environment;

        public ExecuteDynamicTypeObject ReturnType { get; set; }

        public string GlobalID { get; set; }

        public bool IsTransaction { get; set; }

        public List<DynamicObject> DynamicObjects { get; set; }
    }
}
