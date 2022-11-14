﻿using Newtonsoft.Json;

namespace HandStack.Web.MessageContract.Contract
{
    public partial class SystemType
    {
        [JsonProperty("programID")]
        public string ProgramID { get; set; }

        [JsonProperty("version")]
        public string Version { get; set; }

        [JsonProperty("routes")]
        public List<Route> Routes { get; set; }

        [JsonProperty("localeID")]
        public string LocaleID { get; set; }

        [JsonProperty("hostName")]
        public string HostName { get; set; }

        public SystemType()
        {
            ProgramID = "";
            Version = "";
            Routes = new List<Route>();
            LocaleID = "";
            HostName = "";
        }
    }
}
