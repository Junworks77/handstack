using Newtonsoft.Json;

using HandStack.Web.MessageContract.Converter;

namespace HandStack.Web.MessageContract.DataObject
{
    public class BusinessContract
    {
        [JsonProperty("ApplicationID")]
        public string ApplicationID { get; set; }

        [JsonProperty("ProjectID")]
        public string ProjectID { get; set; }

        [JsonProperty("TransactionProjectID")]
        public string TransactionProjectID { get; set; }

        [JsonProperty("TransactionID")]
        public string TransactionID { get; set; }

        [JsonProperty("Description")]
        public string Description { get; set; }

        [JsonProperty("ModifiedDate")]
        public string ModifiedDate { get; set; }

        [JsonProperty("Services")]
        public List<TransactionInfo> Services { get; set; }

        [JsonProperty("Models")]
        public List<Model> Models { get; set; }

        public static BusinessContract? FromJson(string json)
        {
            BusinessContract? result = null;
            if (string.IsNullOrEmpty(json) == true)
            {
                throw new Exception($"json 내용 확인 필요: {json}");
            }
            else
            {
                result = JsonConvert.DeserializeObject<BusinessContract>(json, ConverterSetting.Settings);
            }

            return result;
        }

        public BusinessContract()
        {
            ApplicationID = "";
            ProjectID = "";
            TransactionProjectID = "";
            TransactionID = "";
            Description = "";
            ModifiedDate = "";
            Services = new List<TransactionInfo>();
            Models = new List<Model>();
        }
    }

    public class Model
    {
        [JsonProperty("Name")]
        public string Name { get; set; }

        [JsonProperty("Owner")]
        public string Owner { get; set; }

        [JsonProperty("Description")]
        public string Description { get; set; }

        [JsonProperty("ModifiedDate")]
        public DateTimeOffset? ModifiedDate { get; set; }

        [JsonProperty("Columns")]
        public List<DbColumn> Columns { get; set; }

        public Model()
        {
            Name = "";
            Owner = "";
            Description = "";
            ModifiedDate = null;
            Columns = new List<DbColumn>();
        }
    }

    public class DbColumn
    {
        [JsonProperty("Name")]
        public string Name { get; set; }

        [JsonProperty("Description")]
        public string Description { get; set; }

        [JsonProperty("DataType")]
        public string DataType { get; set; }

        [JsonProperty("Length")]
        public int Length { get; set; }

        [JsonProperty("Require")]
        public bool Require { get; set; }

        [JsonProperty("Default")]
        public string Default { get; set; }

        public DbColumn()
        {
            Name = "";
            Description = "";
            DataType = "";
            Length = 0;
            Require = false;
            Default = "";
        }
    }

    public class TransactionInfo
    {
        [JsonProperty("ServiceID")]
        public string ServiceID { get; set; }

        [JsonProperty("Authorize")]
        public bool Authorize { get; set; }

        [JsonProperty("CommandType")]
        public string CommandType { get; set; }

        [JsonProperty("TransactionScope")]
        public bool TransactionScope { get; set; }

        [JsonProperty("SequentialOption")]
        public List<SequentialOption> SequentialOptions { get; set; }

        [JsonProperty("ReturnType")]
        public string ReturnType { get; set; }

        [JsonProperty("AccessScreenID")]
        public List<string> AccessScreenID { get; set; }

        [JsonProperty("Description")]
        public string Description { get; set; }

        [JsonProperty("TransactionLog")]
        public bool TransactionLog { get; set; }

        [JsonProperty("Inputs")]
        public List<ModelInputContract> Inputs { get; set; }

        [JsonProperty("Outputs")]
        public List<ModelOutputContract> Outputs { get; set; }

        public TransactionInfo()
        {
            ServiceID = "";
            Authorize = false;
            CommandType = "";
            TransactionScope = false;
            SequentialOptions = new List<SequentialOption>();
            ReturnType = "";
            AccessScreenID = new List<string>();
            Description = "";
            TransactionLog = false;
            Inputs = new List<ModelInputContract>();
            Outputs = new List<ModelOutputContract>();
        }
    }

    public partial class SequentialOption
    {
        [JsonProperty("TransactionProjectID")]
        public string TransactionProjectID { get; set; }

        [JsonProperty("TransactionID")]
        public string TransactionID { get; set; }

        [JsonProperty("ServiceID")]
        public string ServiceID { get; set; }

        [JsonProperty("CommandType")]
        public string CommandType { get; set; }

        [JsonProperty("ServiceInputFields")]
        public List<int> ServiceInputFields { get; set; }

        [JsonProperty("ServiceOutputs")]
        public List<ModelOutputContract> ServiceOutputs { get; set; }

        [JsonProperty("ResultHandling")]
        public string ResultHandling { get; set; }

        [JsonProperty("TargetInputFields")]
        public List<int> TargetInputFields { get; set; }

        [JsonProperty("ResultOutputFields")]
        public List<int> ResultOutputFields { get; set; }

        public SequentialOption()
        {
            TransactionProjectID = "";
            TransactionID = "";
            ServiceID = "";
            CommandType = "";
            ServiceInputFields = new List<int>();
            ServiceOutputs = new List<ModelOutputContract>();
            ResultHandling = "";
            TargetInputFields = new List<int>();
            ResultOutputFields = new List<int>();
        }
    }

    public class BaseFieldMapping
    {
        [JsonProperty("BaseSequence")]
        public string BaseSequence { get; set; }

        [JsonProperty("SourceFieldID")]
        public string SourceFieldID { get; set; }

        [JsonProperty("TargetFieldID")]
        public string TargetFieldID { get; set; }

        public BaseFieldMapping()
        {
            BaseSequence = "";
            SourceFieldID = "";
            TargetFieldID = "";
        }
    }

    public class ModelInputContract
    {
        [JsonProperty("ModelID")]
        public string ModelID { get; set; }

        [JsonProperty("Fields")]
        public List<string> Fields { get; set; }

        [JsonProperty("BearerFields")]
        public List<string> BearerFields { get; set; }

        [JsonProperty("TestValues", NullValueHandling = NullValueHandling.Ignore)]
        public List<TestValue> TestValues { get; set; }

        [JsonProperty("DefaultValues", NullValueHandling = NullValueHandling.Ignore)]
        public List<DefaultValue> DefaultValues { get; set; }

        [JsonProperty("Type")]
        public string Type { get; set; }

        [JsonProperty("BaseFieldMappings", NullValueHandling = NullValueHandling.Ignore)]
        public List<BaseFieldMapping> BaseFieldMappings { get; set; }

        [JsonProperty("ParameterHandling")]
        public string ParameterHandling { get; set; } // Rejected, ByPassing, DefaultValue

        [JsonProperty("IgnoreResult")]
        public bool IgnoreResult { get; set; }

        public ModelInputContract()
        {
            ModelID = "";
            Fields = new List<string>();
            BearerFields = new List<string>();
            TestValues = new List<TestValue>();
            DefaultValues = new List<DefaultValue>();
            Type = "";
            BaseFieldMappings = new List<BaseFieldMapping>();
            ParameterHandling = "";
            IgnoreResult = false;
        }
    }

    public class ModelOutputContract
    {
        [JsonProperty("ModelID")]
        public string ModelID { get; set; }

        [JsonProperty("Fields")]
        public List<string> Fields { get; set; }

        [JsonProperty("Type")]
        public string Type { get; set; }

        public ModelOutputContract()
        {
            ModelID = "";
            Fields = new List<string>();
            Type = "";
        }
    }

    public struct TestValue
    {
        public int? Integer;
        public string? String;
        public bool? Boolean;

        public static implicit operator TestValue(int Integer) => new TestValue { Integer = Integer };
        public static implicit operator TestValue(string String) => new TestValue { String = String };
        public static implicit operator TestValue(bool Boolean) => new TestValue { Boolean = Boolean };
        public bool IsNull => Integer == null && String == null && Boolean == null;
    }

    public struct DefaultValue
    {
        public int? Integer;
        public string? String;
        public bool? Boolean;

        public static implicit operator DefaultValue(int Integer) => new DefaultValue { Integer = Integer };
        public static implicit operator DefaultValue(string String) => new DefaultValue { String = String };
        public static implicit operator DefaultValue(bool Boolean) => new DefaultValue { Boolean = Boolean };
        public bool IsNull => Integer == null && String == null && Boolean == null;
    }

    public static class BusinessContractSerialize
    {
        public static string ToJson(this BusinessContract self)
        {
            return JsonConvert.SerializeObject(self, Formatting.Indented, ConverterSetting.Settings);
        }
    }
}
