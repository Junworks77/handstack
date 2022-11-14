using Newtonsoft.Json;

using HandStack.Web.MessageContract.Contract;
using HandStack.Web.Messages;

namespace HandStack.Web.MessageContract.Message
{
    public partial class TransactionRequest : RequestBase
    {
        [JsonProperty("System")]
        public SystemType System { get; set; }

        [JsonProperty("Interface")]
        public InterfaceType Interface { get; set; }

        [JsonProperty("Transaction")]
        public TransactionType Transaction { get; set; }

        [JsonProperty("PayLoad")]
        public PayLoadType PayLoad { get; set; }

        public TransactionRequest()
        {
            System = new SystemType();
            Interface = new InterfaceType();
            Transaction = new TransactionType();
            PayLoad = new PayLoadType();
        }

        public override bool ValidRequest(RequestBase request, ResponseBase response)
        {
            return true;
        }
    }
}
