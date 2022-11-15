using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Session;

using Newtonsoft.Json;

using HandStack.Core.ExtensionMethod;
using HandStack.Web;
using HandStack.Web.Entity;

using Serilog;
using System.Threading.Tasks;
using System;

namespace HandStack.Core.Extensions
{
    public class UserSessionMiddleware
    {

        private readonly IDataProtector dataProtector;
        private readonly RequestDelegate next;

        public UserSessionMiddleware(RequestDelegate next, IDataProtectionProvider dataProtectionProvider)
        {
            this.next = next;
            dataProtector = dataProtectionProvider.CreateProtector(nameof(SessionMiddleware));
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            string? value = GlobalConfiguration.ApplicationCodes.GetValue("Core.SessionState.ByPassUrls", "");
            string byPassUrls = value == null ? "" : value.ToLower();

            if (httpContext.Request.Path == null || httpContext.Request.Path.Value == null)
            {
            }
            else
            {
                if (httpContext.Session.IsAvailable == true && Array.IndexOf(byPassUrls.Split(","), httpContext.Request.Path.Value.ToLower()) == -1)
                {
                    httpContext.Request.Cookies.TryGetValue(GlobalConfiguration.SessionCookieName, out string? sessionCookieValue);

                    if (string.IsNullOrEmpty(sessionCookieValue) == true)
                    {
                        httpContext.Session.SetString("id", httpContext.Session.Id);
                    }

                    string? member = httpContext.Request.Cookies[$"{GlobalConfiguration.CookiePrefixName}.Member"];
                    if (string.IsNullOrEmpty(member) == false)
                    {
                        try
                        {
                            ApplicationMember? applicationMember = JsonConvert.DeserializeObject<ApplicationMember>(member.DecodeBase64());
                            if (applicationMember != null)
                            {
                                string userSessionKey = applicationMember.SessionKey;
                                string? contextSessionKey = GetSessionKey(httpContext.Request);

                                if (string.IsNullOrEmpty(contextSessionKey) == false && userSessionKey != contextSessionKey)
                                {
                                    applicationMember.SessionKey = contextSessionKey;

                                    CookieOptions cookieOptions = new CookieOptions();
                                    cookieOptions.HttpOnly = false;
                                    cookieOptions.SameSite = SameSiteMode.Lax;

                                    DateTime expireDate = DateTime.Now;
                                    if (GlobalConfiguration.CookieUserSignExpire > 0)
                                    {
                                        expireDate = DateTime.UtcNow.AddMinutes(GlobalConfiguration.CookieUserSignExpire);
                                        cookieOptions.Expires = expireDate;
                                    }
                                    else if (GlobalConfiguration.CookieUserSignExpire < 0)
                                    {
                                        int addDay = DateTime.Now.Day == applicationMember.LoginDateTime.Day ? 1 : 0;
                                        expireDate = DateTime.Parse(DateTime.Now.AddDays(addDay).ToString("yyyy-MM-dd") + "T" + GlobalConfiguration.CookieUserSignExpire.ToString().Replace("-", "").PadLeft(2, '0') + ":00:00");
                                        cookieOptions.Expires = expireDate;
                                    }

                                    WriteCookie(httpContext.Response, $"{GlobalConfiguration.CookiePrefixName}.Member", JsonConvert.SerializeObject(applicationMember).EncodeBase64(), cookieOptions);
                                }
                            }
                        }
                        catch (Exception exception)
                        {
                            Log.Warning("[{LogCategory}] " + "SessionKey 사용자 매칭 처리 실패 " + exception.ToMessage(), "UserSessionMiddleware/InvokeAsync");
                        }
                    }
                }
            }

            await next(httpContext);
        }

        public string? GetSessionKey(HttpRequest request)
        {
            string? result = null;

            try
            {
                request.Cookies.TryGetValue(GlobalConfiguration.SessionCookieName, out string? cookieValue);
                if (cookieValue != null)
                {
                    var protectedData = Convert.FromBase64String(cookieValue.SessionDecryptPad());
                    var unprotectedData = dataProtector.Unprotect(protectedData);
                    result = System.Text.Encoding.UTF8.GetString(unprotectedData);
                }
            }
            catch
            {
            }

            return result;
        }

        public void WriteCookie(HttpResponse response, string key, string value, CookieOptions? cookieOptions = null)
        {
            if (cookieOptions == null)
            {
                cookieOptions = new CookieOptions();
                cookieOptions.HttpOnly = false;
                cookieOptions.SameSite = SameSiteMode.Lax;

                if (GlobalConfiguration.CookieUserSignExpire > 0)
                {
                    cookieOptions.Expires = DateTime.UtcNow.AddMinutes(GlobalConfiguration.CookieUserSignExpire);
                }
                else if (GlobalConfiguration.CookieUserSignExpire < 0)
                {
                    cookieOptions.Expires = DateTime.Parse(DateTime.Now.AddDays(1).ToString("yyyy-MM-dd") + "T" + GlobalConfiguration.CookieUserSignExpire.ToString().Replace("-", "").PadLeft(2, '0') + ":00:00").AddTicks(TimeZoneInfo.Local.GetUtcOffset(DateTime.Now).Ticks);
                }
            }

            response.Cookies.Append(key, value, cookieOptions);
        }
    }
}
