using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

using function.DataClient;
using function.Encapsulation;
using function.Entity;
using function.Events;
using function.Extensions;

using HandStack.Logger;
using HandStack.Logger.Logging.Handlers;
using HandStack.Web;
using HandStack.Web.Modules;

using Jering.Javascript.NodeJS;

using LiteDB;

using MediatR;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;

using Newtonsoft.Json;

using Serilog;

namespace function
{
    public class ModuleInitializer : IModuleInitializer
    {
        public string? ModuleID;

        public ModuleInitializer()
        {
            ModuleID = typeof(ModuleInitializer).Assembly.GetName().Name;
        }

        public void ConfigureServices(IServiceCollection services, IWebHostEnvironment environment, IConfiguration configuration)
        {
            ModuleInfo? module = GlobalConfiguration.Modules.FirstOrDefault(p => p.ModuleID == ModuleID);
            if (module != null)
            {
                string moduleConfigFilePath = Path.Combine(module.BasePath, "module.json");
                if (File.Exists(moduleConfigFilePath) == true)
                {
                    string configurationText = File.ReadAllText(moduleConfigFilePath);
                    ModuleConfigJson? moduleConfigJson = JsonConvert.DeserializeObject<ModuleConfigJson>(configurationText);

                    if (moduleConfigJson != null)
                    {
                        ModuleConfig moduleConfig = moduleConfigJson.ModuleConfig;
                        ModuleConfiguration.ModuleID = moduleConfigJson.ModuleID;
                        ModuleConfiguration.Version = moduleConfigJson.Version;
                        ModuleConfiguration.AuthorizationKey = GlobalConfiguration.SystemID + GlobalConfiguration.RunningEnvironment + GlobalConfiguration.HostName;
                        ModuleConfiguration.IsBundledWithHost = moduleConfigJson.IsBundledWithHost;
                        ModuleConfiguration.BusinessServerUrl = moduleConfig.BusinessServerUrl;
                        ModuleConfiguration.CircuitBreakResetSecond = moduleConfig.CircuitBreakResetSecond;
                        ModuleConfiguration.DefaultCommandTimeout = moduleConfig.DefaultCommandTimeout;
                        ModuleConfiguration.IsExceptionDetailText = moduleConfig.IsExceptionDetailText;
                        ModuleConfiguration.IsLogServer = moduleConfig.IsLogServer;
                        ModuleConfiguration.IsContractFileWatchingUpdate = moduleConfig.IsContractFileWatchingUpdate;
                        ModuleConfiguration.LogServerUrl = moduleConfig.LogServerUrl;
                        ModuleConfiguration.ContractBasePath = moduleConfig.ContractBasePath;
                        ModuleConfiguration.IsTransactionLogging = string.IsNullOrEmpty(moduleConfig.TransactionLogFilePath) == false;
                        ModuleConfiguration.TransactionLogFilePath = moduleConfig.TransactionLogFilePath;
                        ModuleConfiguration.IsProfileLogging = string.IsNullOrEmpty(moduleConfig.ProfileLogFilePath) == false;
                        ModuleConfiguration.ProfileLogFilePath = moduleConfig.ProfileLogFilePath;

                        ModuleConfiguration.LocalStoragePath = moduleConfig.NodeFunctionConfig.LocalStoragePath;
                        ModuleConfiguration.LogMinimumLevel = moduleConfig.NodeFunctionConfig.LogMinimumLevel;
                        ModuleConfiguration.FileLogBasePath = moduleConfig.NodeFunctionConfig.FileLogBasePath;
                        ModuleConfiguration.TimeoutMS = moduleConfig.NodeFunctionConfig.TimeoutMS;
                        ModuleConfiguration.IsSingleThread = moduleConfig.NodeFunctionConfig.IsSingleThread;
                        ModuleConfiguration.WatchGracefulShutdown = moduleConfig.NodeFunctionConfig.WatchGracefulShutdown;
                        ModuleConfiguration.EnableFileWatching = moduleConfig.NodeFunctionConfig.EnableFileWatching;
                        ModuleConfiguration.NodeAndV8Options = moduleConfig.NodeFunctionConfig.NodeAndV8Options;
                        ModuleConfiguration.EnvironmentVariables = moduleConfig.NodeFunctionConfig.EnvironmentVariables;

                        ModuleConfiguration.WatchFileNamePatterns.Clear();
                        ModuleConfiguration.WatchFileNamePatterns = moduleConfig.NodeFunctionConfig.WatchFileNamePatterns;

                        ModuleConfiguration.FunctionSource.Clear();
                        if (moduleConfig.FunctionSource != null && moduleConfig.FunctionSource.Count > 0)
                        {
                            foreach (var item in moduleConfig.FunctionSource)
                            {
                                if (item != null)
                                {
                                    ModuleConfiguration.FunctionSource.Add(new FunctionSource()
                                    {
                                        ApplicationID = item.ApplicationID,
                                        ProjectID = item.ProjectID,
                                        DataSourceID = item.DataSourceID,
                                        LanguageType = item.LanguageType,
                                        DataProvider = item.DataProvider,
                                        ConnectionString = item.ConnectionString,
                                        IsEncryption = item.IsEncryption,
                                        WorkingDirectoryPath = item.WorkingDirectoryPath,
                                        Description = item.Description
                                    });
                                }
                            }
                        }

                        if (string.IsNullOrEmpty(ModuleConfiguration.ProfileLogFilePath) != true)
                        {
                            FileInfo fileInfo = new FileInfo(ModuleConfiguration.ProfileLogFilePath);
                            Logger.LoggerHandlerManager
                                .AddHandler(new ConsoleLoggerHandler())
                                .AddHandler(new FileLoggerHandler(fileInfo.Name, fileInfo.DirectoryName))
                                .AddHandler(new DebugConsoleLoggerHandler());
                        }

                        ModuleConfiguration.IsConfigure = true;
                    }
                    else
                    {
                        string message = $"Json Deserialize 오류 module.json 파일 확인 필요: {moduleConfigFilePath}";
                        Log.Logger.Error("[{LogCategory}] " + message, "ModuleInitializer/ConfigureServices");
                        throw new FileLoadException(message);
                    }
                }
                else
                {
                    string message = $"module.json 파일 확인 필요: {moduleConfigFilePath}";
                    Log.Logger.Error("[{LogCategory}] " + message, "ModuleInitializer/ConfigureServices");
                    throw new FileNotFoundException(message);
                }

                FunctionMapper.LoadContract(environment.EnvironmentName, Log.Logger, configuration);

                services.AddNodeJS();
                services.Configure<NodeJSProcessOptions>(options =>
                {
                    if (string.IsNullOrEmpty(ModuleConfiguration.NodeAndV8Options) == false)
                    {
                        options.NodeAndV8Options = ModuleConfiguration.NodeAndV8Options;
                    }

                    Dictionary<string, string> nodeEnvironmentVariables = new Dictionary<string, string>();
                    if (string.IsNullOrEmpty(ModuleConfiguration.EnvironmentVariables) == false)
                    {
                        var environmentVariables = ModuleConfiguration.EnvironmentVariables.Split(";");
                        foreach (string item in environmentVariables)
                        {
                            if (string.IsNullOrEmpty(item) == false)
                            {
                                var keyValues = item.Split("=");
                                nodeEnvironmentVariables.Add(keyValues[0], keyValues[1]);
                            }
                        }
                    }

                    nodeEnvironmentVariables.Add("SYN_ContractBasePath", ModuleConfiguration.ContractBasePath);
                    nodeEnvironmentVariables.Add("SYN_LogMinimumLevel", ModuleConfiguration.LogMinimumLevel);
                    nodeEnvironmentVariables.Add("SYN_FileLogBasePath", ModuleConfiguration.FileLogBasePath);
                    nodeEnvironmentVariables.Add("SYN_LocalStoragePath", ModuleConfiguration.LocalStoragePath);

                    string synConfigFilePath = Path.Combine(module.BasePath, "syn.config.json");
                    if (File.Exists(synConfigFilePath) == true)
                    {
                        nodeEnvironmentVariables.Add("SYN_CONFIG", File.ReadAllText(synConfigFilePath));
                    }
                    else
                    {
                        string defaultEnvironmentVariables = "{\"ApplicationID\":\"HDS\",\"ProjectID\":\"WBD\",\"SystemID\":\"BOP01\",\"TransactionTimeout\":60000,\"IsConfiguration\":false,\"SolutionName\":\"HDS Solution\",\"ProgramName\":\"function\",\"IsDebugMode\":true,\"IsApiFindServer\":false,\"ApiFindUrl\":\"http://localhost:5000/api/find\",\"FileManagerUrl\":\"http://localhost:5000/api/filemanager\",\"FileManagerServer\":\"http://localhost:5000\",\"FileServerType\":\"L\",\"Environment\":\"Development\",\"LocalStoragePath\":\"C:\\\\home\\\\ack\\\\cache\\\\function\",\"LogMinimumLevel\":\"trace\",\"FileLogBasePath\":\"C:\\\\home\\\\ack\\\\log\\\\function\",\"DomainAPIServer\":{\"ServerID\":\"SERVERD01\",\"ServerType\":\"D\",\"Protocol\":\"http\",\"IP\":\"localhost\",\"Port\":\"5000\",\"Path\":\"/api/transaction\",\"ClientIP\":\"127.0.0.1\"},\"DomainServerType\":\"D\",\"IntranetServerIP\":\"127.0.0.1\",\"IntranetServerPort\":\"8080\",\"Program\":{\"ProgramVersion\":\"1.0.0\",\"LanguageID\":\"KO\",\"LocaleID\":\"ko-KR\",\"TerminalBranchCode\":\"\"},\"Transaction\":{\"ProtocolVersion\":\"001\",\"RunningEnvironment\":\"D\",\"DataFormat\":\"J\",\"MachineName\":\"\",\"SystemCode\":\"DTS\",\"SystemID\":\"BOP01\",\"SystemInterfaceID\":\"\",\"MachineTypeID\":\"SVR\",\"DataEncryptionYN\":\"N\"}}";
                        nodeEnvironmentVariables.Add("SYN_CONFIG", defaultEnvironmentVariables);
                    }
                    options.EnvironmentVariables = nodeEnvironmentVariables;
                });

                services.Configure<OutOfProcessNodeJSServiceOptions>(options =>
                {
                    options.Concurrency = ModuleConfiguration.IsSingleThread == true ? Concurrency.None : Concurrency.MultiProcess;
                    options.TimeoutMS = ModuleConfiguration.TimeoutMS;
                    options.EnableFileWatching = ModuleConfiguration.EnableFileWatching;
                    options.WatchPath = ModuleConfiguration.ContractBasePath;
                    options.GracefulProcessShutdown = ModuleConfiguration.WatchGracefulShutdown;
                    options.WatchFileNamePatterns = ModuleConfiguration.WatchFileNamePatterns;
                });

                services.AddMvc().AddMvcOptions(option =>
                {
                    option.InputFormatters.Add(new RawRequestBodyFormatter(Log.Logger));
                })
                .AddJsonOptions(jsonOptions =>
                {
                    jsonOptions.JsonSerializerOptions.PropertyNamingPolicy = null;
                });

                LoggerFactory loggerFactory = new LoggerFactory();
                loggerFactory.AddProvider(new FileLoggerProvider(ModuleConfiguration.TransactionLogFilePath, new FileLoggerOptions()
                {
                    Append = true,
                    FileSizeLimitBytes = 104857600,
                    MaxRollingFiles = 30
                }));

                services.AddSingleton(loggerFactory);
                FunctionLoggerClient functionLoggerClient = new FunctionLoggerClient(Log.Logger);
                services.AddSingleton(functionLoggerClient);
                services.AddTransient<IFunctionClient, FunctionClient>();

                services.AddTransient<IRequestHandler<FunctionRequest, object?>, FunctionRequestHandler>();
            }
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment? webHostEnvironment)
        {
            ModuleInfo? module = GlobalConfiguration.Modules.FirstOrDefault(p => p.ModuleID == ModuleID);
            if (string.IsNullOrEmpty(ModuleID) == false && module != null)
            {
                string wwwrootDirectory = Path.Combine(module.BasePath, "wwwroot", ModuleID);

                app.UseStaticFiles(new StaticFileOptions
                {
                    FileProvider = new PhysicalFileProvider(Path.Combine(wwwrootDirectory)),
                    RequestPath = "/" + ModuleID,
                    ServeUnknownFileTypes = true,
                    OnPrepareResponse = httpContext =>
                    {
                        if (httpContext.Context.Request.Path.ToString().IndexOf("ack.module.js") > -1)
                        {
                            if (httpContext.Context.Response.Headers.ContainsKey("Cache-Control") == false)
                            {
                                httpContext.Context.Response.Headers.Add("Cache-Control", "no-cache, no-store");
                            }

                            if (httpContext.Context.Response.Headers.ContainsKey("Expires") == false)
                            {
                                httpContext.Context.Response.Headers.Add("Expires", "-1");
                            }
                        }
                        else if (GlobalConfiguration.StaticFileCacheMaxAge > 0)
                        {
                            if (httpContext.Context.Response.Headers.ContainsKey("Cache-Control") == true)
                            {
                                httpContext.Context.Response.Headers.Remove("Cache-Control");
                            }

                            httpContext.Context.Response.Headers.Append("Cache-Control", $"public, max-age={GlobalConfiguration.StaticFileCacheMaxAge}");
                        }

                        if (httpContext.Context.Response.Headers.ContainsKey("p3p") == true)
                        {
                            httpContext.Context.Response.Headers.Remove("p3p");
                        }

                        httpContext.Context.Response.Headers.Append("p3p", "CP=\"ALL ADM DEV PSAi COM OUR OTRo STP IND ONL\"");
                    }
                });
            }
        }
    }

    internal class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("function");
        }
    }
}
