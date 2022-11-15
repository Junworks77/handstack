using System;
using System.Collections.Generic;
using System.IO;

using Newtonsoft.Json;

namespace HandStack.Web.Modules
{
    public class ModuleConfigurationManager : IModuleConfigurationManager
    {
        public IEnumerable<ModuleInfo> GetModules()
        {
            List<ModuleInfo> modules = new List<ModuleInfo>();
            if (string.IsNullOrEmpty(GlobalConfiguration.LoadModuleBasePath) == true)
            {
                GlobalConfiguration.LoadModuleBasePath = Path.Combine(GlobalConfiguration.ContentRootPath, @"modules");
            }

            if (Directory.Exists(GlobalConfiguration.LoadModuleBasePath) == false)
            {
                Directory.CreateDirectory(GlobalConfiguration.LoadModuleBasePath);
            }

            string modulesFileName = "module.json";
            foreach (string moduleBasePath in Directory.GetDirectories(GlobalConfiguration.LoadModuleBasePath))
            {
                var modulesPath = Path.Combine(moduleBasePath, modulesFileName);

                if (Directory.Exists(moduleBasePath) == true)
                {
                    using var reader = new StreamReader(modulesPath);
                    string content = reader.ReadToEnd();
                    dynamic? module = JsonConvert.DeserializeObject(content);

                    if (module != null)
                    {
                        if (GlobalConfiguration.ModuleNames.IndexOf(module.ModuleID.ToString()) > -1)
                        {
                            var moduleID = module.ModuleID;

                            var moduleInfo = new ModuleInfo();
                            moduleInfo.ModuleID = moduleID;
                            moduleInfo.BasePath = moduleBasePath;
                            moduleInfo.Name = moduleID;
                            moduleInfo.Version = Version.Parse(module.Version.ToString());
                            moduleInfo.IsBundledWithHost = module.IsBundledWithHost;

                            if (module.ModuleConfig?.EventAction != null)
                            {
                                Dictionary<string, string> keyValues = new Dictionary<string, string>();
                                foreach (var item in module.ModuleConfig.EventAction)
                                {
                                    keyValues.Add($"{moduleID}|{item.Name}", $"{item.Value}");
                                }

                                moduleInfo.EventAction = keyValues;
                            }

                            if (module.ModuleConfig?.SubscribeAction != null)
                            {
                                Dictionary<string, string> keyValues = new Dictionary<string, string>();
                                foreach (var item in module.ModuleConfig.SubscribeAction)
                                {
                                    keyValues.Add($"{moduleID}|{item.Name}", $"{item.Value}");
                                }

                                moduleInfo.SubscribeAction = keyValues;
                            }

                            modules.Add(moduleInfo);
                        }
                    }
                }
            }

            return modules;
        }
    }
}
