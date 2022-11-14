using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Sockets;

using ack.Extensions;

using AspNetCoreRateLimit;

using MediatR;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Net.Http.Headers;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using HandStack.Core.Extensions;
using HandStack.Web;
using HandStack.Web.ApiClient;
using HandStack.Web.Extensions;
using HandStack.Web.Modules;

using Serilog;

namespace ack
{
    public class Startup
    {
        private string? startTime = null;
        private int processID = 0;
        bool useProxyForward = false;
        bool useResponseComression = false;
        private readonly IConfiguration configuration;
        private readonly IWebHostEnvironment environment;
        static readonly ServerEventListener serverEventListener = new ServerEventListener();

        public Startup(IWebHostEnvironment environment, IConfiguration configuration)
        {
            Process currentProcess = Process.GetCurrentProcess();
            processID = currentProcess.Id;
            startTime = currentProcess.StartTime.ToString();

            this.configuration = configuration;
            this.environment = environment;
            this.useProxyForward = bool.Parse(configuration.GetSection("AppSettings")["UseForwardProxy"]);
            this.useResponseComression = bool.Parse(configuration.GetSection("AppSettings")["UseResponseComression"]);
        }

        public void ConfigureServices(IServiceCollection services)
        {
            var appSettings = configuration.GetSection("AppSettings");
            GlobalConfiguration.ApplicationName = appSettings.GetSection("ProgramName").Exists() == true ? appSettings["ProgramName"] : environment.ApplicationName;
            GlobalConfiguration.ContentRootPath = environment.ContentRootPath;
            GlobalConfiguration.EnvironmentName = environment.EnvironmentName;
            GlobalConfiguration.WebRootPath = environment.WebRootPath;
            GlobalConfiguration.BusinessServerUrl = appSettings["BusinessServerUrl"];
            GlobalConfiguration.RunningEnvironment = appSettings["RunningEnvironment"];
            GlobalConfiguration.HostName = appSettings["HostName"];
            GlobalConfiguration.SystemID = appSettings["SystemID"];
            GlobalConfiguration.IsExceptionDetailText = bool.Parse(appSettings["IsExceptionDetailText"]);
            GlobalConfiguration.LoadModuleBasePath = appSettings["LoadModuleBasePath"];

            string withOrigins = appSettings["WithOrigins"].ToString();
            if (string.IsNullOrEmpty(withOrigins) == false)
            {
                foreach (string item in withOrigins.Split(","))
                {
                    GlobalConfiguration.WithOrigins.Add(item.Trim());
                }
            }

            var moduleConfigurationUrls = appSettings.GetSection("ModuleConfigurationUrl").AsEnumerable();
            foreach (var moduleConfigurationUrl in moduleConfigurationUrls)
            {
                if (moduleConfigurationUrl.Value != null)
                {
                    GlobalConfiguration.ModuleConfigurationUrl.Add(moduleConfigurationUrl.Value);
                }
            }

            GlobalConfiguration.IsConfigure = true;

            TransactionConfig.ApiFindUrl = appSettings["ApiFindUrl"];
            TransactionConfig.DomainServerType = appSettings["DomainServerType"];
            TransactionConfig.Transaction.SystemID = appSettings["SystemID"];
            TransactionConfig.Transaction.RunningEnvironment = appSettings["RunningEnvironment"];

            GlobalConfiguration.WebRootPath = environment.WebRootPath;
            GlobalConfiguration.ContentRootPath = environment.ContentRootPath;

            TransactionClient businessApiClient = new TransactionClient(Log.Logger);
            var domainAPIServer = new JObject();
            domainAPIServer.Add("ExceptionText", null);
            domainAPIServer.Add("RequestID", "");
            domainAPIServer.Add("ServerID", appSettings["DomainAPIServer:ServerID"]);
            domainAPIServer.Add("ServerType", appSettings["DomainAPIServer:ServerType"]);
            domainAPIServer.Add("Protocol", appSettings["DomainAPIServer:Protocol"]);
            domainAPIServer.Add("IP", appSettings["DomainAPIServer:IP"]);
            domainAPIServer.Add("Port", appSettings["DomainAPIServer:Port"]);
            domainAPIServer.Add("Path", appSettings["DomainAPIServer:Path"]);
            domainAPIServer.Add("ClientIP", appSettings["DomainAPIServer:ClientIP"]);
            GlobalConfiguration.DomainAPIServer = domainAPIServer;

            businessApiClient.AddApiService(TransactionConfig.Transaction.SystemID, TransactionConfig.DomainServerType, GlobalConfiguration.DomainAPIServer);

            if (useResponseComression == true)
            {
                services.AddResponseCompression(options =>
                {
                    options.EnableForHttps = bool.Parse(configuration.GetSection("AppSettings")["ComressionEnableForHttps"]);
                    options.Providers.Add<BrotliCompressionProvider>();
                    options.Providers.Add<GzipCompressionProvider>();

                    List<string> mimeTypes = new List<string>();
                    var comressionMimeTypes = configuration.GetSection("AppSettings").GetSection("ComressionMimeTypes").AsEnumerable();
                    foreach (var comressionMimeType in comressionMimeTypes)
                    {
                        if (comressionMimeType.Value != null)
                        {
                            mimeTypes.Add(comressionMimeType.Value);
                        }
                    }

                    options.MimeTypes = mimeTypes;
                });
            }

            if (useProxyForward == true)
            {
                services.Configure<ForwardedHeadersOptions>(options =>
                {
                    var forwards = configuration.GetSection("AppSettings").GetSection("ForwardProxyIP").AsEnumerable();
                    foreach (var item in forwards)
                    {
                        if (string.IsNullOrEmpty(item.Value) == false)
                        {
                            options.KnownProxies.Add(IPAddress.Parse(item.Value));
                        }
                    }

                    bool useSameIPProxy = bool.Parse(configuration.GetSection("AppSettings")["UseSameIPProxy"]);
                    if (useSameIPProxy == true)
                    {
                        IPHostEntry host = Dns.GetHostEntry(Dns.GetHostName());
                        foreach (IPAddress ipAddress in host.AddressList)
                        {
                            if (ipAddress.AddressFamily == AddressFamily.InterNetwork)
                            {
                                options.KnownProxies.Add(ipAddress);
                            }
                        }
                    }
                });
            }

            var ipRateLimitingSection = configuration.GetSection("IpRateLimiting");
            if (ipRateLimitingSection.Exists() == true)
            {
                services.AddMemoryCache();
                services.Configure<IpRateLimitOptions>(configuration.GetSection("IpRateLimiting"));
                services.AddInMemoryRateLimiting();
                services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();
            }

            services.AddHttpContextAccessor();
            services.AddSingleton<TransactionClient>();
            services.AddSingleton<BusinessApiClient>();
            services.AddSingleton(Log.Logger);
            services.AddSingleton(configuration);
            services.AddTransient<ISequentialIdGenerator, SequentialIdGenerator>();
            services.AddAntiforgery(options => options.HeaderName = "X-XSRF-Token");
#pragma warning disable CS8621
            services.AddScoped<ServiceFactory>(p => p.GetService);
#pragma warning restore CS8621
            services.AddScoped<IMediator, Mediator>();
            services.AddRouting(options =>
            {
                options.LowercaseUrls = true;
                options.ConstraintMap["slugify"] = typeof(SlugifyParameterTransformer);
            });

            if (GlobalConfiguration.WithOrigins.Count > 0)
            {
                services.AddCors(options =>
                {
                    options.AddDefaultPolicy(
                    builder => builder
                        .AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .WithOrigins(GlobalConfiguration.WithOrigins.ToArray())
                        .SetIsOriginAllowedToAllowWildcardSubdomains()
                        .SetPreflightMaxAge(TimeSpan.FromSeconds(86400))
                        .WithHeaders(HeaderNames.CacheControl)
                    );
                });
            }

            services.AddMvc().AddMvcOptions(options =>
            {
                options.EnableEndpointRouting = false;
                options.SuppressAsyncSuffixInActionNames = false;
            });
            services.AddControllersWithViews(options =>
            {
                options.Conventions.Add(new RouteTokenTransformerConvention(new SlugifyParameterTransformer()));
            })
            .AddNewtonsoftJson();

            services.AddRazorPages()
            .AddRazorPagesOptions(options =>
            {
                options.Conventions.Add(new PageRouteTransformerConvention(new SlugifyParameterTransformer()));
                options.Conventions.ConfigureFilter(new IgnoreAntiforgeryTokenAttribute());
            });

            services.AddModules();
            services.AddCustomizedMvc(GlobalConfiguration.Modules);

            foreach (var module in GlobalConfiguration.Modules)
            {
                if (module.Assembly != null)
                {
                    var moduleInitializerType = module.Assembly.GetTypes().FirstOrDefault(t => typeof(IModuleInitializer).IsAssignableFrom(t));
                    if (moduleInitializerType != null && (moduleInitializerType != typeof(IModuleInitializer)))
                    {
                        object? instance = Activator.CreateInstance(moduleInitializerType);
                        if (instance != null)
                        {
                            var moduleInitializer = instance as IModuleInitializer;
                            if (moduleInitializer != null)
                            {
                                services.AddSingleton(typeof(IModuleInitializer), moduleInitializer);
                                moduleInitializer.ConfigureServices(services, environment, configuration);
                            }
                        }
                    }
                }
            }
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment webHostEnvironment, IHostApplicationLifetime lifetime)
        {
            lifetime.ApplicationStarted.Register(() => ServerPortDetect(app.ServerFeatures));

            var ipRateLimitingSection = configuration.GetSection("IpRateLimiting");
            if (ipRateLimitingSection.Exists() == true)
            {
                app.UseIpRateLimiting();
            }

            if (useResponseComression == true)
            {
                app.UseResponseCompression();
            }

            if (useProxyForward == true)
            {
                app.UseForwardedHeaders(new ForwardedHeadersOptions
                {
                    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
                });
            }

            if (GlobalConfiguration.WithOrigins.Count > 0)
            {
                if (GlobalConfiguration.WithOrigins.Contains("http://*:*") == true || GlobalConfiguration.WithOrigins.Contains("https://*:*") == true)
                {
                    app.UseCors(policy =>
                    {
                        policy
                            .AllowAnyOrigin()
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .SetIsOriginAllowedToAllowWildcardSubdomains()
                            .SetPreflightMaxAge(TimeSpan.FromSeconds(86400))
                            .WithHeaders(HeaderNames.CacheControl);
                    });
                }
                else
                {
                    app.UseCors();
                }
            }

            var provider = new FileExtensionContentTypeProvider();
            provider.Mappings[".apk"] = "application/vnd.android.package-archive";

            // wwwroot 디렉토리내 파일들은 Cache-Control 값을 적용
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")),
                ServeUnknownFileTypes = true,
                ContentTypeProvider = provider,
                OnPrepareResponse = httpContext =>
                {
                    if (httpContext.Context.Request.Path.ToString().IndexOf("syn.loader.js") > -1)
                    {
                        if (httpContext.Context.Response.Headers.ContainsKey("Cache-Control") == true)
                        {
                            httpContext.Context.Response.Headers.Remove("Cache-Control");
                        }

                        httpContext.Context.Response.Headers.Add("Cache-Control", "no-cache, no-store");

                        if (httpContext.Context.Response.Headers.ContainsKey("Expires") == false)
                        {
                            httpContext.Context.Response.Headers.Remove("Expires");
                        }

                        httpContext.Context.Response.Headers.Add("Expires", "-1");
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
                        httpContext.Context.Response.Headers.Append("p3p", "CP=\"ALL ADM DEV PSAi COM OUR OTRo STP IND ONL\"");
                    }
                }
            });

            app.UseRouting();

            var moduleInitializers = app.ApplicationServices.GetServices<IModuleInitializer>();
            foreach (var moduleInitializer in moduleInitializers)
            {
                moduleInitializer.Configure(app, webHostEnvironment);
            }

            if (webHostEnvironment != null && webHostEnvironment.IsDevelopment() == true)
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/httpstatus/500");
            }

            app.UseStatusCodePages();
            app.UseCookiePolicy();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/diagnostics", async context =>
                {
                    var result = new
                    {
                        Environment = new
                        {
                            ProcessID = processID,
                            StartTime = startTime,
                            SystemID = GlobalConfiguration.SystemID,
                            ApplicationName = GlobalConfiguration.ApplicationName,
                            Is64Bit = Environment.Is64BitOperatingSystem,
                            MachineName = Environment.MachineName,
                            HostName = GlobalConfiguration.HostName,
                            RunningEnvironment = GlobalConfiguration.RunningEnvironment
                        },
                        Modules = GlobalConfiguration.Modules.Select(p => new
                        {
                            ModuleID = p.ModuleID,
                            Name = p.Name,
                            BasePath = p.BasePath,
                            IsBundledWithHost = p.IsBundledWithHost,
                            Version = p.Version.ToString(),
                        }),
                        System = serverEventListener.SystemRuntime,
                        Hosting = serverEventListener.AspNetCoreHosting,
                        Kestrel = serverEventListener.AspNetCoreServerKestrel,
                        NetSocket = serverEventListener.SystemNetSocket
                    };
                    context.Response.Headers["Content-Type"] = "application/json";
                    await context.Response.WriteAsync(JsonConvert.SerializeObject(result));
                });
            });

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
                endpoints.MapAreaControllerRoute(
                    name: "areas",
                    areaName: "areas",
                    pattern: "{area:exists}/{controller:slugify=Home}/{action:slugify=Index}/{id:slugify?}");
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller:slugify=Home}/{action:slugify=Index}/{id:slugify?}");
            });
            app.UseMvcWithDefaultRoute();

            try
            {
                if (webHostEnvironment.IsProduction() == true || webHostEnvironment.IsStaging() == true)
                {
                    File.WriteAllText("app-startup.log", DateTime.Now.ToString());
                }
            }
            catch
            {
            }
        }

        private static void ServerPortDetect(IFeatureCollection features)
        {
            int port = 80;
            var addressFeature = features.Get<IServerAddressesFeature>();
            if (addressFeature != null)
            {
                foreach (var address in addressFeature.Addresses)
                {
                    port = int.Parse(address.Split(':').Last());
                }
            }

            GlobalConfiguration.ServerPort = port;
        }
    }
}
