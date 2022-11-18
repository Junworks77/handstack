using System;
using System.IO;
using System.Linq;

using HandStack.Web;
using HandStack.Web.Modules;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;

namespace template
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
            }
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment? webHostEnvironment)
        {
            ModuleInfo? module = GlobalConfiguration.Modules.FirstOrDefault(p => p.ModuleID == typeof(ModuleInitializer).Assembly.GetName().Name);
            if (string.IsNullOrEmpty(ModuleID) == false && module != null)
            {
                app.UseStatusCodePagesWithReExecute("/error/{0}");
                app.UseExceptionHandler("/error/500");

                string wwwrootDirectory = Path.Combine(module.BasePath, "wwwroot", ModuleID);

                app.UseStaticFiles(new StaticFileOptions
                {
                    RequestPath = "/" + ModuleID,
                    FileProvider = new PhysicalFileProvider(Path.Combine(wwwrootDirectory)),
                    ServeUnknownFileTypes = true
                });
            }
        }
    }

    internal class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("template");
        }
    }
}
