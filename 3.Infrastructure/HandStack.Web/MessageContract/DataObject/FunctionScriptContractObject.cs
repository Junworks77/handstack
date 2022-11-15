using Newtonsoft.Json;

using HandStack.Web.MessageContract.Converter;
using System;
using System.Collections.Generic;

namespace HandStack.Web.MessageContract.DataObject
{
    public partial class FunctionScriptContract
    {
        [JsonProperty("Header")]
        public FunctionHeader Header { get; set; }

        [JsonProperty("Commands")]
        public List<FunctionCommand> Commands { get; set; }

        public static FunctionScriptContract? FromJson(string json)
        {
            FunctionScriptContract? result = null;
            if (string.IsNullOrEmpty(json) == true)
            {
                throw new Exception($"json 내용 확인 필요: {json}");
            }
            else
            {
                result = JsonConvert.DeserializeObject<FunctionScriptContract>(json, ConverterSetting.Settings);
            }

            return result;
        }

        public FunctionScriptContract()
        {
            Header = new FunctionHeader();
            Commands = new List<FunctionCommand>();
        }
    }

    public partial class FunctionCommand
    {
        [JsonProperty("ID")]
        public string ID { get; set; }

        [JsonProperty("Seq")]
        public int Seq { get; set; }

        [JsonProperty("Use")]
        public bool Use { get; set; }

        [JsonProperty("Timeout")]
        public int Timeout { get; set; }

        [JsonProperty]
        public string BeforeTransaction { get; set; }

        [JsonProperty]
        public string AfterTransaction { get; set; }

        [JsonProperty]
        public string FallbackTransaction { get; set; }

        [JsonProperty("Description")]
        public string Description { get; set; }

        [JsonProperty("ModifiedDateTime")]
        public DateTimeOffset ModifiedDateTime { get; set; }

        [JsonProperty("Params")]
        public List<FunctionParam> Params { get; set; }

        public FunctionCommand()
        {
            ID = "";
            Seq = 0;
            Use = false;
            Timeout = 0;
            BeforeTransaction = "";
            AfterTransaction = "";
            FallbackTransaction = "";
            Description = "";
            ModifiedDateTime = DateTimeOffset.Now;
            Params = new List<FunctionParam>();
        }
    }

    public partial class FunctionParam
    {
        [JsonProperty("id")]
        public string ID { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("length")]
        public int Length { get; set; }

        [JsonProperty("value")]
        public string? Value { get; set; }

        public FunctionParam()
        {
            ID = "";
            Type = "String";
            Length = -1;
            Value = null;
        }
    }

    public partial class FunctionHeader
    {
        [JsonProperty("ApplicationID")]
        public string ApplicationID { get; set; }

        [JsonProperty("ProjectID")]
        public string ProjectID { get; set; }

        [JsonProperty("TransactionID")]
        public string TransactionID { get; set; }

        [JsonProperty("Use")]
        public bool Use { get; set; }

        [JsonProperty("DataSourceID")]
        public string DataSourceID { get; set; }

        [JsonProperty("LanguageType")]
        public string LanguageType { get; set; }

        [JsonProperty("Description")]
        public string Description { get; set; }

        public FunctionHeader()
        {
            ApplicationID = "";
            ProjectID = "";
            TransactionID = "";
            Use = false;
            DataSourceID = "";
            LanguageType = "";
            Description = "";
        }
    }

    public static class FunctionScriptContractSerialize
    {
        public static string ToJson(this FunctionScriptContract self) => JsonConvert.SerializeObject(self, ConverterSetting.Settings);
    }
}
