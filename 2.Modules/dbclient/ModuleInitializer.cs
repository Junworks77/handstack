using System.IO;
using System.Linq;

using dbclient.DataClient;
using dbclient.Encapsulation;
using dbclient.Entity;
using dbclient.Events;
using dbclient.Extensions;

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

using HandStack.Logger;
using HandStack.Logger.Logging.Handlers;
using HandStack.Web;
using HandStack.Web.Modules;

using Serilog;
using System;

namespace dbclient
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

                        if (moduleConfig.DataSource != null && moduleConfig.DataSource.Count > 0)
                        {
                            foreach (var item in moduleConfig.DataSource)
                            {
                                if (item != null)
                                {
                                    ModuleConfiguration.DataSource.Add(new DataSource()
                                    {
                                        ApplicationID = item.ApplicationID,
                                        ProjectID = item.ProjectID,
                                        DataSourceID = item.DataSourceID,
                                        DataProvider = item.DataProvider,
                                        ConnectionString = item.ConnectionString,
                                        IsEncryption = item.IsEncryption,
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

                DatabaseMapper.LoadContract(environment.EnvironmentName, Log.Logger, configuration);

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
                DbClientLoggerClient dbClientLoggerClient = new DbClientLoggerClient(Log.Logger);
                services.AddSingleton(dbClientLoggerClient);
                services.AddTransient<IQueryDataClient, QueryDataClient>();

                services.AddTransient<IRequestHandler<DbClientRequest, object?>, DbClientRequestHandler>();
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
            Console.WriteLine("dbclient");
        }
    }
}
