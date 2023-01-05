using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

using HandStack.Core.Helpers;
using HandStack.Web;

using RestSharp;

using Serilog;

namespace ack
{
    public class Program
    {
        private static System.Timers.Timer? startupAwaitTimer;
        private static bool isDebuggerAttach = false;
        private static CancellationTokenSource cancellationTokenSource = new CancellationTokenSource();

        /// <param name="args">ack /modules=template,wwwroot,dbclient,managed</param>
        public static async Task Main(string[] args)
        {
            try
            {
                ArgumentHelper arguments = new ArgumentHelper(args);
                string? debug = arguments["debug"];
                if (string.IsNullOrEmpty(debug) == false && debug.ToLower() == "true")
                {
                    int startupAwaitDelay = 0;
                    string? delay = arguments["delay"];
                    if (string.IsNullOrEmpty(delay) == false)
                    {
                        startupAwaitDelay = int.Parse(delay);
                    }

                    startupAwaitTimer = new System.Timers.Timer(1000);
                    startupAwaitTimer.Elapsed += (object? sender, System.Timers.ElapsedEventArgs e) =>
                    {
                        if (startupAwaitTimer != null && isDebuggerAttach == true)
                        {
                            startupAwaitTimer.Stop();
                            cancellationTokenSource.Cancel();
                        }
                    };
                    startupAwaitTimer.Start();

                    try
                    {
                        await Task.Delay(startupAwaitDelay, cancellationTokenSource.Token);
                    }
                    catch
                    {
                    }
                }

                var environmentName = Environment.GetEnvironmentVariable("ACK_ENVIRONMENT");
                if (string.IsNullOrEmpty(environmentName) == true)
                {
                    environmentName = "";
                }

                IConfigurationRoot configuration;
                var configurationBuilder = new ConfigurationBuilder().AddJsonFile("appsettings.json");

                string environmentFileName = $"appsettings.{environmentName}.json";
                if (File.Exists(Path.Combine(Environment.CurrentDirectory, environmentFileName)) == true)
                {
                    configuration = configurationBuilder.AddJsonFile(environmentFileName).Build();
                }
                else
                {
                    configuration = configurationBuilder.Build();
                }

                string? modules = arguments["modules"];
                if (string.IsNullOrEmpty(modules) == false)
                {
                    var runningModules = modules.Split(",");
                    foreach (var runningModule in runningModules)
                    {
                        string module = runningModule.Trim();
                        if (string.IsNullOrEmpty(module) == false)
                        {
                            GlobalConfiguration.ModuleNames.Add(module);
                        }
                    }
                }
                else
                {
                    var loadModules = configuration.GetSection("AppSettings").GetSection("LoadModules").AsEnumerable();
                    foreach (var item in loadModules)
                    {
                        if (string.IsNullOrEmpty(item.Value) == false)
                        {
                            GlobalConfiguration.ModuleNames.Add(item.Value);
                        }
                    }
                }

                Log.Logger = new LoggerConfiguration()
                    .ReadFrom.Configuration(configuration)
                    .CreateLogger();

                Log.Information($"ACK_ENVIRONMENT: {environmentName}, TargetFrameworkName: {AppContext.TargetFrameworkName}, BaseDirectory: {AppContext.BaseDirectory} ");
                Log.Verbose("");
                Log.Debug("");
                Log.Information("");
                Log.Warning("");
                Log.Error("");
                Log.Fatal("");

                var applicationManager = ApplicationManager.Load();
                await applicationManager.StartAsync(args, configuration);
            }
            catch (Exception exception)
            {
                Log.Fatal(exception, "Unable to bootstrap ack");
            }

            Log.CloseAndFlush();

            Process currentProcess = Process.GetCurrentProcess();
            currentProcess.Kill();
        }

        private static IHost BootstrappingVariables(string[] args, IConfigurationRoot configuration)
        {
            Log.Information($"Bootstrapping IConfigurationRoot... {GlobalConfiguration.BootstrappingVariables(configuration)}");

            var host = CreateWebHostBuilder(args).Build();

            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var environment = services.GetService<IWebHostEnvironment>();

                if (environment != null)
                {
                    Log.Information($"Bootstrapping IWebHostEnvironment... {GlobalConfiguration.BootstrappingVariables(environment)}");
                }
            }

            return host;
        }

        private static async void BackgroundTaskAsync(object? state)
        {
            string moduleConfigurationUrl = "";
            try
            {
                foreach (var item in GlobalConfiguration.ModuleConfigurationUrl)
                {
                    moduleConfigurationUrl = item;
                    if (Uri.TryCreate(moduleConfigurationUrl, UriKind.Absolute, out var uriResult) && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps) == true)
                    {
                        Log.Information($"ModuleConfigurationUrl: {item} 요청");

                        Uri baseUri = new Uri(item);
                        var client = new RestClient(baseUri);
                        client.Timeout = 10000;
                        var request = new RestRequest(Method.GET);
                        request.AddHeader("ApplicationName", GlobalConfiguration.ApplicationName);
                        request.AddHeader("SystemID", GlobalConfiguration.SystemID);
                        request.AddHeader("HostName", GlobalConfiguration.HostName);
                        request.AddHeader("RunningEnvironment", GlobalConfiguration.RunningEnvironment);
                        request.AddHeader("ApplicationRuntimeID", GlobalConfiguration.ApplicationRuntimeID);

                        var response = await client.ExecuteAsync(request);
                        if (response.StatusCode != HttpStatusCode.OK)
                        {
                            Log.Error($"ModuleConfigurationUrl: {item} 응답 확인 필요");
                        }
                    }
                    else
                    {
                        Log.Error($"ModuleConfigurationUrl: {item} 경로 확인 필요");
                    }
                }
            }
            catch (Exception exception)
            {
                Log.Error(exception, $"BackgroundTaskAsync 오류: {moduleConfigurationUrl}");
            }
        }

        public static IHostBuilder CreateWebHostBuilder(string[] args)
        {
            return Host.CreateDefaultBuilder(args)
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseSerilog((context, config) =>
                {
                    config.ReadFrom.Configuration(context.Configuration);
                })
                .ConfigureServices((context, services) =>
                {
                    services.Configure<KestrelServerOptions>(context.Configuration.GetSection("Kestrel"));
                })
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStaticWebAssets();
                    webBuilder.UseStartup<Startup>();
                    webBuilder.UseKestrel((options) =>
                    {
                        options.AddServerHeader = false;
                    });
                })
                .UseWindowsService()
                .UseSystemd();
        }
    }
}
