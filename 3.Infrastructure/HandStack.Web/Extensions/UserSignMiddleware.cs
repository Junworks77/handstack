using System;
using System.Collections.Generic;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;

using HandStack.Core.ExtensionMethod;
using HandStack.Web;
using HandStack.Web.Entity;

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Session;

using Newtonsoft.Json;

using Serilog;

namespace HandStack.Core.Extensions
{
    public class UserSignMiddleware
    {
        private readonly IDataProtector dataProtector;
        private readonly RequestDelegate next;

        public UserSignMiddleware(IDataProtectionProvider dataProtectionProvider, RequestDelegate next)
        {
            dataProtector = dataProtectionProvider.CreateProtector(nameof(SessionMiddleware));
            this.next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            if (httpContext.User.Identity != null && httpContext.User.Identity.IsAuthenticated == false)
            {
                string? member = httpContext.Request.Cookies[$"{GlobalConfiguration.CookiePrefixName}.Member"];
                if (string.IsNullOrEmpty(member) == false)
                {
                    try
                    {
                        ApplicationMember? applicationMember = JsonConvert.DeserializeObject<ApplicationMember>(member.DecodeBase64());
                        if (applicationMember != null)
                        {
                            var lastedLoginTime = applicationMember.LoginDateTime.DateDiff(PartOfDateTime.Second, DateTime.Now);
                            var allowLimitTime = DateTime.Parse(applicationMember.LoginDateTime.AddDays(1).ToString("yyyy-MM-dd") + "T" + GlobalConfiguration.CookieUserSignExpire.ToString().Replace("-", "").PadLeft(2, '0') + ":00:00").DateDiff(PartOfDateTime.Second, DateTime.Now);
                            if ((GlobalConfiguration.CookieUserSignExpire > 0 && GlobalConfiguration.CookieUserSignExpire < lastedLoginTime) || allowLimitTime > lastedLoginTime)
                            {
                                await httpContext.SignOutAsync();
                                foreach (var cookieKey in httpContext.Request.Cookies.Keys)
                                {
                                    httpContext.Response.Cookies.Delete(cookieKey);
                                }

                                // httpContext.Response.Redirect("/Account/Login");

                                httpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                                await httpContext.Response.WriteAsync("401 Unauthorized");
                                return;
                            }
                            else
                            {
                                var claims = new List<Claim>
                            {
                                new Claim(ClaimTypes.NameIdentifier, applicationMember.MemberID),
                                new Claim(ClaimTypes.Name, applicationMember.MemberName),
                                new Claim("MemberNo", applicationMember.MemberNo),
                                new Claim("Roles", string.Join(",", applicationMember.Roles.ToArray())),
                                new Claim("LoginDateTime", applicationMember.LoginDateTime.ToString())
                            };

                                var claimsIdentity = new ClaimsIdentity(claims, $"{GlobalConfiguration.CookiePrefixName}.AuthenticationScheme");
                                var authenticationProperties = new AuthenticationProperties()
                                {
                                    AllowRefresh = true,
                                    IsPersistent = true
                                };

                                if (GlobalConfiguration.CookieUserSignExpire > 0)
                                {
                                    authenticationProperties.ExpiresUtc = DateTime.UtcNow.AddMinutes(GlobalConfiguration.CookieUserSignExpire - lastedLoginTime);
                                }
                                else if (GlobalConfiguration.CookieUserSignExpire < 0)
                                {
                                    int addDay = DateTime.Now.Day == applicationMember.LoginDateTime.Day ? 1 : 0;
                                    authenticationProperties.ExpiresUtc = DateTime.Parse(DateTime.Now.AddDays(addDay).ToString("yyyy-MM-dd") + "T" + GlobalConfiguration.CookieUserSignExpire.ToString().Replace("-", "").PadLeft(2, '0') + ":00:00");
                                }

                                await httpContext.AuthenticateAsync();
                                await httpContext.SignInAsync(new ClaimsPrincipal(claimsIdentity), authenticationProperties);

                                httpContext.Request.Cookies.TryGetValue(GlobalConfiguration.SessionCookieName, out string? cookieValue);
                                if (cookieValue != null)
                                {
                                    var protectedData = Convert.FromBase64String(cookieValue.SessionDecryptPad());
                                    var unprotectedData = dataProtector.Unprotect(protectedData);
                                    applicationMember.SessionKey = System.Text.Encoding.UTF8.GetString(unprotectedData);

                                    httpContext.Session.SetString("MemberNo", applicationMember.MemberNo);
                                    httpContext.Session.SetString("MemberID", applicationMember.MemberID);
                                    httpContext.Session.SetString("Email", applicationMember.Email);
                                    httpContext.Session.SetString("MemberName", applicationMember.MemberName);
                                    httpContext.Session.SetString("PhoneNo", applicationMember.PhoneNo);
                                    httpContext.Session.SetString("CertificationType", applicationMember.CertificationType);
                                    httpContext.Session.SetString("MemberType", applicationMember.MemberType);
                                    httpContext.Session.SetString("JoinDateTime", applicationMember.JoinDateTime);
                                    httpContext.Session.SetString("AgreeSMS", applicationMember.AgreeSMS);
                                    httpContext.Session.SetString("AgreeEmail", applicationMember.AgreeEmail);
                                    httpContext.Session.SetString("AgreePersonalInfo", applicationMember.AgreePersonalInfo);
                                    httpContext.Session.SetString("AgreeThirdPartyInfo", applicationMember.AgreeThirdPartyInfo);
                                    httpContext.Session.SetString("LoginDateTime", applicationMember.LoginDateTime.ToString());
                                    httpContext.Session.SetString("Roles", applicationMember.Roles.ToJoin(","));
                                }
                            }
                        }
                    }
                    catch (Exception exception)
                    {
                        Log.Warning("[{LogCategory}] " + $"{GlobalConfiguration.CookiePrefixName}.Member 복구 또는 로그아웃 처리 실패 " + exception.ToMessage(), "Startup/Configure");
                    }
                }
            }

            await next(httpContext);
        }
    }
}
