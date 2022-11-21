﻿using System;
using System.IO;
using System.Linq;
using System.Net.Sockets;
using System.Net;
using System.Text;
using System.Threading.Tasks;

using HandStack.Core.ExtensionMethod;

using HandStack.Core.Extensions;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.ActionConstraints;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Primitives;

namespace HandStack.Web.Extensions
{
    public static class HttpRequestExtensions
    {
        public static async Task<string> GetRawBodyStringAsync(this HttpRequest request, Encoding? encoding = null, Stream? inputStream = null)
        {
            if (encoding == null)
            {
                encoding = Encoding.UTF8;
            }

            if (inputStream == null)
            {
                inputStream = request.Body;
            }

            using (StreamReader reader = new StreamReader(inputStream, encoding))
            {
                return await reader.ReadToEndAsync();
            }
        }

        public static async Task<byte[]> GetRawBodyBytesAsync(this HttpRequest request, Stream? inputStream = null)
        {
            if (inputStream == null)
            {
                inputStream = request.Body;
            }

            using (var ms = new MemoryStream(8192))
            {
                await inputStream.CopyToAsync(ms);
                return ms.ToArray();
            }
        }

        public static string GetBaseUrl(this HttpRequest request)
        {
            return $"{request.Scheme}://{request.Host}";
        }

        public static string GetUrlAuthority(this HttpRequest request)
        {
            return $"{request.Scheme}://{request.Host}{request.Path}";
        }

        public static int GetInt(this string value)
        {
            int result;
            if (int.TryParse(value, out result) == true)
            {
                return result;
            }
            else
            {
                return 0;
            }
        }

        public static long GetLong(this string value)
        {
            long result;
            if (long.TryParse(value, out result) == true)
            {
                return result;
            }
            else
            {
                return 0;
            }
        }

        public static string? GetParamData(this HttpRequest request, string requestKey, string defaultValue = null)
        {
            string? result = null;
            if (request.HasFormContentType == true && request.Form.ContainsKey(requestKey) == true)
            {
                result = request.Form[requestKey].ToString();
            }
            else if (request.RouteValues.ContainsKey(requestKey) == true)
            {
                result = request.RouteValues[requestKey]?.ToString();
            }
            else if (request.Query.ContainsKey(requestKey) == true)
            {
                result = request.Query[requestKey].ToString();
            }

            if (result == null && defaultValue != null)
            {
                result = defaultValue;
            }

            return result;
        }

        public static ControllerActionDescriptor? GetControllerByUrl(this HttpContext httpContext)
        {
            ControllerActionDescriptor? result = null;
            var pathElements = httpContext.Request.Path.ToString().Replace("/api", "").Split("/").Where(m => m != "");
            string? controllerName = pathElements.ElementAtOrDefault(0);
            string? actionName = pathElements.ElementAtOrDefault(1);

            if (controllerName == null || actionName == null)
            {
            }
            else
            {
                var actionDescriptorsProvider = httpContext.RequestServices.GetRequiredService<IActionDescriptorCollectionProvider>();
                result = actionDescriptorsProvider.ActionDescriptors.Items
                .Where(s => s is ControllerActionDescriptor bb
                            && bb.ActionName == actionName
                            && bb.ControllerName == controllerName
                            && (bb.ActionConstraints == null
                                || (bb.ActionConstraints != null
                                    && bb.ActionConstraints.Any(x => x is HttpMethodActionConstraint cc
                                    && cc.HttpMethods.Any(m => m.ToLower() == httpContext.Request.Method.ToLower())))))
                .Select(s => s as ControllerActionDescriptor)
                .FirstOrDefault();
            }

            return result;
        }

        public static string? GetRemoteIpAddress(this HttpContext httpContext, bool tryUseXForwardHeader = true)
        {
            string? ip = "0.0.0.0";

            if (tryUseXForwardHeader == true)
            {
                ip = httpContext.Request.GetHeaderValueAs<string>("X-Forwarded-For")?.SplitCsv()?.FirstOrDefault();
            }

            if (string.IsNullOrEmpty(ip) == true && httpContext?.Connection?.RemoteIpAddress != null)
            {
                ip = httpContext.Connection.RemoteIpAddress.ToString();
            }

            if (string.IsNullOrEmpty(ip) == true)
            {
                ip = httpContext?.Request.GetHeaderValueAs<string>("REMOTE_ADDR");
            }

            if (string.IsNullOrEmpty(ip) == false && ip.Length > 7 && ip.Substring(0, 7) == "::ffff:")
            {
                ip = ip.Substring(7);
            }

            if (ip == "::1" || ip == "127.0.0.1" || (string.IsNullOrEmpty(ip) == true && httpContext?.Connection?.LocalIpAddress != null))
            {
                ip = httpContext?.Connection.LocalIpAddress?.ToString();
                if (ip == "::1" || ip == "127.0.0.1")
                {
                    IPHostEntry host = Dns.GetHostEntry(Dns.GetHostName());
                    foreach (IPAddress ipAddress in host.AddressList)
                    {
                        if (ipAddress.AddressFamily == AddressFamily.InterNetwork)
                        {
                            ip = ipAddress.ToString();
                            break;
                        }
                    }
                }
            }

            return ip;
        }

        public static T? GetHeaderValueAs<T>(this HttpRequest request, string headerName)
        {
            StringValues values = "";

            if (request?.Headers?.TryGetValue(headerName, out values) ?? false)
            {
                string rawValues = values.ToString();

                if (rawValues.IsNullOrWhitespace() == false)
                {
                    return (T)Convert.ChangeType(values.ToString(), typeof(T));
                }
            }
            return default(T);
        }
    }
}
