﻿using System;
using System.IO;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Net.Http.Headers;

using Newtonsoft.Json;

using HandStack.Core.Extensions;
using HandStack.Web.MessageContract.Message;

using Serilog;

namespace function.Extensions
{
    public class RawRequestBodyFormatter : InputFormatter
    {
        private ILogger logger { get; }

        public RawRequestBodyFormatter(ILogger logger)
        {
            this.logger = logger;

            SupportedMediaTypes.Add(new MediaTypeHeaderValue("application/json"));
        }

        public override bool CanRead(InputFormatterContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            var contentType = context.HttpContext.Request.ContentType;
            if (string.IsNullOrEmpty(contentType) == false && contentType.IndexOf("application/json") > -1)
            {
                return true;
            }

            return false;
        }

        public override async Task<InputFormatterResult> ReadRequestBodyAsync(InputFormatterContext context)
        {
            var request = context.HttpContext.Request;
            var contentType = context.HttpContext.Request.ContentType;

            if (string.IsNullOrEmpty(contentType) == false)
            {
                DynamicRequest? dynamicRequest;

                try
                {
                    if (contentType.IndexOf("application/json") > -1)
                    {
                        using (var reader = new StreamReader(request.Body))
                        {
                            var content = await reader.ReadToEndAsync();
                            dynamicRequest = JsonConvert.DeserializeObject<DynamicRequest>(content);
                            return await InputFormatterResult.SuccessAsync(dynamicRequest);
                        }
                    }
                }
                catch (Exception exception)
                {
                    logger.Error("[{LogCategory}] " + exception.ToMessage(), "ReadRequestBodyAsync");
                }
            }

            return await InputFormatterResult.FailureAsync();
        }
    }
}
