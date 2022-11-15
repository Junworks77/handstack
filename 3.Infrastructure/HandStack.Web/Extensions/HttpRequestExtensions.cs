using System.IO;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Http;

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

        public static string? GetParamData(this HttpRequest request, string requestKey)
        {
            string? result = null;
            if (request.Query.ContainsKey(requestKey) == true)
            {
                result = request.Query[requestKey].ToString();
            }
            else if (request.HasFormContentType == true && request.Form.ContainsKey(requestKey) == true)
            {
                result = request.Form[requestKey].ToString();
            }
            else
            {
                result = request.RouteValues[requestKey]?.ToString();
            }

            return result;
        }
    }
}
