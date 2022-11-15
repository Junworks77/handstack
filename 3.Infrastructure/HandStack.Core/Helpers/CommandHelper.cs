using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Threading.Tasks;

using HandStack.Core.ExtensionMethod;

namespace HandStack.Core.Helpers
{
    // Task.Run(async () =>
    // {
    //     // https://github.com/mishoo/UglifyJS
    //     var executeResult = await CommandHelper.RunScript($"uglifyjs --compress --mangle --output {minifyFilePath} -- {outputFileName}");
    //     if (executeResult != 0)
    //     {
    //         System.IO.File.Copy(outputFileName, minifyFilePath);
    //     }
    //     GC.SuppressFinalize(this);
    // });
    public static class CommandHelper
    {
        public static async Task<int> RunScript(string script, bool useShellExecute = false, bool redirectStandardError = false, bool redirectStandardOutput = false, bool createNoWindow = true)
        {
            int result = 0;
            if (string.IsNullOrEmpty(script) == true)
            {
                result = -1;
            }
            else
            {
                List<string> executeCommands = new List<string>();
                string[] scripts = script.Split(Environment.NewLine);
                foreach (string item in scripts)
                {
                    string command = item.Trim();
                    if (string.IsNullOrEmpty(command) == false)
                    {
                        executeCommands.Add(command);
                    }
                }

                foreach (string item in executeCommands)
                {
                    using (var process = new Process())
                    {
                        var escapedArgs = item.Replace("\"", "\\\"");
                        process.StartInfo = RuntimeInformation.IsOSPlatform(OSPlatform.Windows)
                            ? new System.Diagnostics.ProcessStartInfo
                            {
                                FileName = "cmd",
                                Arguments = $"/c \"{escapedArgs}\"",
                                UseShellExecute = useShellExecute,
                                RedirectStandardError = redirectStandardError,
                                RedirectStandardOutput = redirectStandardOutput,
                                CreateNoWindow = createNoWindow

                            }
                            : new System.Diagnostics.ProcessStartInfo
                            {
                                FileName = "/bin/bash",
                                Arguments = $"-c \"{escapedArgs}\"",
                                UseShellExecute = useShellExecute,
                                RedirectStandardError = redirectStandardError,
                                RedirectStandardOutput = redirectStandardOutput,
                                CreateNoWindow = createNoWindow
                            };

                        await process.RunAsync(false, DefaultPrefix.Value);

                        if (process.ExitCode != 0)
                        {
                            result = process.ExitCode;
                            break;
                        }
                    }
                }
            }

            return result;
        }
    }

    internal static class DefaultPrefix
    {
        static DefaultPrefix()
        {
        }

        public static readonly string Value = Assembly.GetEntryAssembly()?.GetName().Name ?? "BatchClient";
    }
}
