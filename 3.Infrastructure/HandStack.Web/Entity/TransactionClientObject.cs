﻿using Newtonsoft.Json;

using HandStack.Web.MessageContract.Contract;

namespace HandStack.Web.Entity
{
    public class TransactionClientObject
    {
        [JsonProperty(Required = Required.DisallowNull)]
        public string ProgramID { get; set; }

        [JsonProperty(Required = Required.DisallowNull)]
        public string BusinessID { get; set; }

        [JsonProperty(Required = Required.DisallowNull)]
        public string SystemID { get; set; }

        [JsonProperty(Required = Required.DisallowNull)]
        public string TransactionID { get; set; }

        [JsonProperty(Required = Required.DisallowNull)]
        public string FunctionID { get; set; }

        [JsonProperty(Required = Required.DisallowNull)]
        public string ScreenID { get; set; }

        public string RequestID { get; set; }

        public string Kind { get; set; }

        public string SimulationType { get; set; }

        public string ReturnType { get; set; }

        public string TransactionMapID { get; set; }

        public List<Masking> Maskings = new List<Masking>();

        public List<int> InputsItemCount = new List<int>();

        public List<List<ServiceParameter>> Inputs = new List<List<ServiceParameter>>();

        public TransactionClientObject()
        {
            ProgramID = "";
            BusinessID = "";
            SystemID = "";
            TransactionID = "";
            FunctionID = "";
            ScreenID = "";
            RequestID = "";
            Kind = "BIZ";
            SimulationType = "N";
            ReturnType = "";
            TransactionMapID = "";
        }
    }
}
