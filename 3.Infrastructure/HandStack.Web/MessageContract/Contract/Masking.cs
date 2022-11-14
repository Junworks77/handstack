using Newtonsoft.Json;

namespace HandStack.Web.MessageContract.Contract
{
    public partial class Masking
    {
        [JsonProperty("mapDataNo")]
        public int MapDataNo { get; set; }

        [JsonProperty("targetID")]
        public string TargetID { get; set; }

        [JsonProperty("decryptKey")]
        public string DecryptKey { get; set; }

        public Masking()
        {
            MapDataNo = 0;
            TargetID = "";
            DecryptKey = "";
        }
    }
}
