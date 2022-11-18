using System;

using HandStack.Web.Modules;

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace repository
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
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment? webHostEnvironment)
        {
        }
    }

    internal class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("repository");
        }
    }
}
