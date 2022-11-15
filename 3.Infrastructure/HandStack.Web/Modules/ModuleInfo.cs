using System;
using System.Collections.Generic;
using System.Reflection;

namespace HandStack.Web.Modules
{
    public class ModuleInfo
    {
        public string ModuleID { get; set; }

        public string Name { get; set; }

        public string BasePath { get; set; }

        public bool IsBundledWithHost { get; set; }

        public Version Version { get; set; }

        public Assembly? Assembly { get; set; }

        public Dictionary<string, string> EventAction { get; set; }

        public Dictionary<string, string> SubscribeAction { get; set; }

        public ModuleInfo()
        {
            ModuleID = "";
            Name = "";
            BasePath = "";
            IsBundledWithHost = false;
            Version = Version.Parse("0.0.0");
            Assembly = null;
            EventAction = new Dictionary<string, string>();
            SubscribeAction = new Dictionary<string, string>();
        }
    }
}
