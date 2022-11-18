using System;
using System.IO;
using System.Linq;

using HandStack.Core.ExtensionMethod;
using HandStack.Logger.Logging.Handlers;
using HandStack.Web;
using HandStack.Web.Modules;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;

using Newtonsoft.Json;

using Serilog;

using transact.Entity;
using transact.Extensions;

namespace transact
{
    public class ModuleInitializer : IModuleInitializer
    {
        public string ModuleID;

        public ModuleInitializer()
        {
            ModuleID = typeof(ModuleInitializer).Assembly.GetName().Name.ToStringSafe();
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
                        ModuleConfiguration.SystemID = moduleConfig.SystemID;
                        ModuleConfiguration.AvailableEnvironment = moduleConfig.AvailableEnvironment;
                        ModuleConfiguration.UseApiAuthorize = moduleConfig.UseApiAuthorize;
                        ModuleConfiguration.BypassAuthorizeIP = moduleConfig.BypassAuthorizeIP;
                        ModuleConfiguration.WithOrigins = moduleConfig.WithOrigins;
                        ModuleConfiguration.DefaultCommandTimeout = moduleConfig.DefaultCommandTimeout;
                        ModuleConfiguration.IsExceptionDetailText = moduleConfig.IsExceptionDetailText;
                        ModuleConfiguration.IsLogServer = moduleConfig.IsLogServer;
                        ModuleConfiguration.IsContractFileWatchingUpdate = moduleConfig.IsContractFileWatchingUpdate;
                        ModuleConfiguration.IsTransactionLogging = moduleConfig.IsTransactionLogging;
                        ModuleConfiguration.LogServerUrl = moduleConfig.LogServerUrl;
                        ModuleConfiguration.ContractBasePath = moduleConfig.ContractBasePath;
                        ModuleConfiguration.TransactionLogFilePath = moduleConfig.TransactionLogFilePath;
                        ModuleConfiguration.PublicTransactions = moduleConfig.PublicTransactions;

                        foreach (var item in moduleConfig.RouteCommandUrl.AsEnumerable())
                        {
                            ModuleConfiguration.RouteCommandUrl.Add(item.Key, item.Value);
                        }

                        ModuleConfiguration.IsConfigure = true;

                        if (string.IsNullOrEmpty(ModuleConfiguration.TransactionLogFilePath) != true)
                        {
                            FileInfo fileInfo = new FileInfo(ModuleConfiguration.TransactionLogFilePath);
                            Logger.LoggerHandlerManager
                                .AddHandler(new ConsoleLoggerHandler())
                                .AddHandler(new FileLoggerHandler(fileInfo.Name, fileInfo.DirectoryName))
                                .AddHandler(new DebugConsoleLoggerHandler());
                        }
                        else
                        {
                            Logger.LoggerHandlerManager
                                .AddHandler(new ConsoleLoggerHandler())
                                .AddHandler(new FileLoggerHandler("transaction.log"))
                                .AddHandler(new DebugConsoleLoggerHandler());
                        }
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

                TransactLoggerClient transactLoggerClient = new TransactLoggerClient(Log.Logger);
                services.AddSingleton(transactLoggerClient);

                TransactionMapper.LoadContract(environment.EnvironmentName, Log.Logger, configuration);

                services.AddCors(options =>
                {
                    options.AddPolicy(
                        ModuleID,
                        builder => builder
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .WithOrigins(ModuleConfiguration.WithOrigins.ToArray())
                            .SetIsOriginAllowedToAllowWildcardSubdomains()
                        );
                });

                services.AddMvc().AddMvcOptions(option =>
                {
                    option.InputFormatters.Add(new RawRequestBodyFormatter(Log.Logger));
                });
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

                if (ModuleConfiguration.WithOrigins.Contains("http://*:*") == true || ModuleConfiguration.WithOrigins.Contains("https://*:*") == true)
                {
                    app.UseCors(builder =>
                    {
                        builder
                           .AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader();
                    });
                }
                else
                {
                    app.UseCors(ModuleID);
                }
            }
        }
    }

    internal class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("transact");
        }
    }
}
