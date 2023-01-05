using System;
using System.IO;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

using HandStack.Web;

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

using RestSharp;

using Serilog;

namespace ack
{
    public class ApplicationManager
    {
        private static ApplicationManager? applicationManager;
        private CancellationTokenSource? cancellationTokenSource;
        private IHost? host;
        private bool isServiceRunning;
        private bool isRestart;

        public bool IsRestarting => isRestart;

        public bool IsServiceRunning => isServiceRunning;

        public ApplicationManager()
        {
            isServiceRunning = false;
            isRestart = false;
        }

        public static ApplicationManager Load()
        {
            if (applicationManager == null)
            {
                applicationManager = new ApplicationManager();
            }

            return applicationManager;
        }

        public async Task StartAsync(string[] args, IConfigurationRoot configuration)
        {
            if (isServiceRunning == true)
            {
                return;
            }

            if (cancellationTokenSource != null && cancellationTokenSource.IsCancellationRequested == true)
            {
                return;
            }

            cancellationTokenSource = new CancellationTokenSource();
            cancellationTokenSource.Token.ThrowIfCancellationRequested();
            isServiceRunning = true;

            ThreadPool.QueueUserWorkItem(BackgroundTaskAsync);

            host = BootstrappingVariables(args, configuration);
            Log.Information($"ack Start...");
            await host.RunAsync(cancellationTokenSource.Token);
            host.Dispose();
        }

        public void Stop()
        {
            if (isServiceRunning == false)
            {
                return;
            }

            if (cancellationTokenSource != null)
            {
                cancellationTokenSource.Cancel();
            }
            isServiceRunning = false;
            Log.Information($"ack Stop...");
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
                        var request = new RestRequest(RestSharp.Method.GET);
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
