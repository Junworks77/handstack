﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;

using HandStack.Web.Helpers;
using HandStack.Web.Model;
using HandStack.Web.Modules;

using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

using Newtonsoft.Json.Linq;

using Serilog;

namespace HandStack.Web
{
    public static class GlobalConfiguration
    {
        public static bool IsConfigure = false;
        public static string RunningEnvironment = "D";
        public static string HostName = Dns.GetHostName();
        public static string HostFingerPrint = FingerPrintHelper.Generate();
        public static string SystemID = "HAND Stack";
        public static bool UseStaticFilesAuthorize = false;
        public static string ApplicationName = "";
        public static string ContentRootPath = "";
        public static string EnvironmentName = "";
        public static string WebRootPath = "";
        public static string BusinessServerUrl = "";
        public static int StaticFileCacheMaxAge = 0;
        public static string AllowApplications = "";
        public static string AllowProjects = "";
        public static bool IsExceptionDetailText = false;
        public static string LoadModuleBasePath = "";
        public static int CookieUserSignExpire = 720;
        public static string CookiePrefixName = "";
        public static int ServerPort = 80;
        public static bool IsApiFindServer = true;
        public static JObject? DomainAPIServer = null;
        public static List<string> WithOrigins = new List<string>();
        public static Dictionary<string, string> StaticFilesAllowRolePath = new Dictionary<string, string>();
        public static List<string> ModuleConfigurationUrl = new List<string>();
        public static Dictionary<string, ApplicationCodeSetting?> ApplicationCodes = new Dictionary<string, ApplicationCodeSetting?>();
        public static string ApplicationRuntimeID = Guid.NewGuid().ToString();
        public static string SessionCookieName = "";
        public static List<string> ModuleNames { get; set; } = new List<string>();
        public static List<ModuleInfo> Modules { get; set; } = new List<ModuleInfo>();

        public static string DefaultCulture => "ko-KR";

        public static bool InitailizeAppSetting(Dictionary<string, JToken> transactionResult)
        {
            bool result = false;
            if (transactionResult.Count > 0 && transactionResult.ContainsKey("HasException") == false)
            {
                lock (ApplicationCodes)
                {
                    string? codeID = null;
                    foreach (var item in transactionResult["GridData0"])
                    {
                        codeID = item.Value<string>("CodeID");
                        if (codeID != null)
                        {
                            if (ApplicationCodes.ContainsKey(codeID) == true)
                            {
                                ApplicationCodes.Remove(codeID);
                            }

                            ApplicationCodes.Add(codeID, new ApplicationCodeSetting()
                            {
                                CodeID = codeID,
                                Value = item.Value<string>("Value"),
                                DataType = item.Value<string>("DataType"),
                                Area = item.Value<string>("Area"),
                                CommonYN = (item.Value<string>("CommonYN") == "Y")
                            });
                        }
                    }
                }

                result = true;
            }
            else
            {
                if (transactionResult.ContainsKey("HasException") == true)
                {
                    Log.Error("[{LogCategory}] " + transactionResult["HasException"].ToString(), "IndexController/InitailizeAppSettingAsync");
                }
                else
                {
                    Log.Error("[{LogCategory}] Core 환경설정 조회 오류", "IndexController/InitailizeAppSettingAsync");
                }
            }

            return result;
        }

        public static bool ClearPrivateAppSetting(string moduleID)
        {
            bool result = false;
            var clearModuleAppSettings = ApplicationCodes.Where(x => x.Value != null && x.Value.Area == moduleID && x.Value.CommonYN == false);
            lock (ApplicationCodes)
            {
                foreach (var item in clearModuleAppSettings)
                {
                    ApplicationCodes.Remove(item.Key);
                }
            }
            return result;
        }

        public static StringBuilder BootstrappingVariables(IWebHostEnvironment environment)
        {
            var sb = new StringBuilder();
            var nl = Environment.NewLine;

            sb.Append($"ApplicationName: {environment.ApplicationName}{nl}");
            sb.Append($"ContentRootFileProvider: {environment.ContentRootFileProvider}{nl}");
            sb.Append($"ContentRootPath: {environment.ContentRootPath}{nl}");
            sb.Append($"EnvironmentName: {environment.EnvironmentName}{nl}");
            sb.Append($"WebRootFileProvider: {environment.WebRootFileProvider}{nl}");
            sb.Append($"WebRootPath: {environment.WebRootPath}{nl}");

            return sb;
        }

        public static StringBuilder BootstrappingVariables(IConfigurationRoot configuration)
        {
            var sb = new StringBuilder();
            var nl = Environment.NewLine;
            var rule = string.Concat(nl, new string('-', 40), nl);

            sb.Append($"{nl}");
            sb.Append($"CurrentDirectory: {Directory.GetCurrentDirectory()}");
            sb.Append($"{nl}Configuration{rule}");
            foreach (var pair in configuration.AsEnumerable())
            {
                sb.Append($"{pair.Key}: {pair.Value}{nl}");
            }
            sb.Append(nl);

            sb.Append($"Environment Variables{rule}");
            var vars = Environment.GetEnvironmentVariables();
            foreach (var key in vars.Keys.Cast<string>().OrderBy(key => key, StringComparer.OrdinalIgnoreCase))
            {
                var value = vars[key];
                sb.Append($"{key}: {value}{nl}");
            }

            return sb;
        }
    }
}
