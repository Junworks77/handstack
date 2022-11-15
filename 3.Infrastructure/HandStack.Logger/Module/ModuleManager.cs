using System;
using System.Collections.Generic;

namespace HandStack.Logger.Logging.Module
{
    public class ModuleManager
    {
        private readonly IDictionary<string, LoggerModule> loggerModules;

        public ModuleManager()
        {
            loggerModules = new Dictionary<string, LoggerModule>();
        }

        public void BeforeLog()
        {
            foreach (var loggerModule in loggerModules.Values)
            {
                loggerModule.BeforeLog();
            }
        }

        public void Execute(LogData logMessage)
        {
            foreach (var loggerModule in loggerModules.Values)
            {
                loggerModule.Execute(logMessage);
            }
        }

        public void ExceptionLog(Exception exception)
        {
            foreach (var loggerModule in loggerModules.Values)
            {
                loggerModule.ExceptionLog(exception);
            }
        }

        public void Install(LoggerModule module)
        {
            if (loggerModules.ContainsKey(module.Name) == false)
            {
                module.Initialize();
                loggerModules.Add(module.Name, module);
            }
            else
            {
                Uninstall(module.Name);
                Install(module);
            }
        }

        public void Uninstall(LoggerModule module)
        {
            if (loggerModules.ContainsKey(module.Name) == true)
            {
                loggerModules.Remove(module.Name);
            }
        }

        public void Uninstall(string moduleName)
        {
            if (loggerModules.ContainsKey(moduleName) == true)
            {
                loggerModules.Remove(moduleName);
            }
        }
    }
}
