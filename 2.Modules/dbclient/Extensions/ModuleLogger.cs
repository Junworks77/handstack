using System;
using System.Collections.Generic;
using System.IO;

using Microsoft.Extensions.Configuration;

using HandStack.Web.MessageContract.Message;

using Polly.CircuitBreaker;

using RestSharp;

using Serilog;

namespace dbclient.Extensions
{
    // DbClientLoggerClient 가져올것
    internal class ModuleLogger
    {
        private Serilog.ILogger logger { get; }

        public ModuleLogger()
        {
            IConfigurationRoot configuration;
            var configurationBuilder = new ConfigurationBuilder().AddJsonFile("appsettings.json");

            string environmentFileName = $"module.json";
            if (File.Exists(Path.Combine(Environment.CurrentDirectory, environmentFileName)) == true)
            {
                configuration = configurationBuilder.AddJsonFile(environmentFileName).Build();
            }
            else
            {
                configuration = configurationBuilder.Build();
            }

            logger = new LoggerConfiguration()
                .ReadFrom.Configuration(configuration)
                .CreateLogger();
        }

        public CircuitBreakerPolicy<IRestResponse>? GetCircuitBreakerPolicy()
        {
            throw new NotImplementedException();
        }

        public IRestResponse Send(LogMessage logMessage, Action<string> fallbackFunction, Dictionary<string, string>? headers = null)
        {
            throw new NotImplementedException();
        }

        public IRestResponse WriteLine(LogMessage logMessage, Action<string> fallbackFunction)
        {
            throw new NotImplementedException();
        }
    }
}
