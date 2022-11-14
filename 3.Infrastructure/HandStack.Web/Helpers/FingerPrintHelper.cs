using System.ComponentModel;
using System.Diagnostics;
using System.Management;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;

using HandStack.Core.ExtensionMethod;

namespace HandStack.Web.Helpers
{
    public static class FingerPrintHelper
    {
        public static bool IsWindows => RuntimeInformation.IsOSPlatform(OSPlatform.Windows);

        public static bool IsMacOs => RuntimeInformation.IsOSPlatform(OSPlatform.OSX);

        public static bool IsLinux => RuntimeInformation.IsOSPlatform(OSPlatform.Linux);

        public static string? WindowsInstallationDirectory => Path.GetPathRoot(Environment.SystemDirectory);

        public static bool Is64 => Environment.Is64BitOperatingSystem;

        public static string OsArch => Is64 ? "64" : "32";

        public static bool IsInDesignMode => LicenseManager.UsageMode == LicenseUsageMode.Designtime;

        public static string Generate()
        {
            var hostInformation = new[]
            {
                GetInfo(Hardware.Cpuid),
                GetInfo(Hardware.Motherboard)
            };

            var input = string.Join("\n", hostInformation);
            var result = Hash(input);

            return result;
        }

        private static string Hash(string input)
        {
            using (SHA1 sha256Hash = SHA1.Create())
            {
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(input));
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }

        private static string Wmi(string wmiClass, string wmiProperty)
        {
            var result = "";
            if (IsWindows == true)
            {
#pragma warning disable CA1416
                var mc = new ManagementClass(wmiClass);
                var moc = mc.GetInstances();

                foreach (var o in moc)
                {
                    var mo = (ManagementObject)o;

                    if (result != "")
                    {
                        continue;
                    }

                    try
                    {
                        result = mo[wmiProperty].ToStringSafe();
                        break;
                    }
                    catch
                    {
                    }
                }
#pragma warning restore CA1416
            }

            return result;
        }

        private static string Dmidecode(string query, string find)
        {
            var cmd = new Cmd();

            var k = cmd.Run("/usr/bin/sudo", $" {query}", new CmdOptions
            {
                WindowStyle = ProcessWindowStyle.Hidden,
                CreateNoWindow = true,
                RedirectStdOut = true,
                UseOsShell = false
            }, true);

            find = find.EndsWith(":") ? find : $"{find}:";

            var lines = k.Output.Split(new[]
                {
                    Environment.NewLine
                }, StringSplitOptions.RemoveEmptyEntries)
                .Select(a => a.Trim(' ', '\t'));

            var line = lines.First(a => a.StartsWith(find));
            var res = line.Substring(line.IndexOf(find, StringComparison.Ordinal) + find.Length).Trim(' ', '\t');

            return res;
        }

        private static string? GetIoregOutput(string node)
        {
            string? result = null;
            var proc = new Process();

            var psi = new ProcessStartInfo
            {
                FileName = "/bin/sh"
            };

            var command = @"/usr/sbin/ioreg -rd1 -c IOPlatformExpertDevice | awk -F'\""' '/" + node + "/{ print $(NF-1) }'";

            psi.Arguments = $"-c \"{command}\"";
            psi.WindowStyle = ProcessWindowStyle.Hidden;
            psi.RedirectStandardOutput = true;
            psi.UseShellExecute = false;
            proc.StartInfo = psi;

            proc.OutputDataReceived += (s, e) =>
            {
                if (string.IsNullOrEmpty(e.Data) == false)
                {
                    result = e.Data;
                }
            };

            proc.Start();
            proc.BeginOutputReadLine();
            proc.WaitForExit();

            return result;
        }

        private static string GetInfo(Hardware hardware)
        {
            switch (hardware)
            {
                case Hardware.Motherboard when IsLinux:
                    {
                        var result = Dmidecode("dmidecode -t 2", "Manufacturer");

                        return result;
                    }
                case Hardware.Motherboard when IsWindows:
                    return Wmi("Win32_BaseBoard", "Manufacturer");
                case Hardware.Motherboard when IsMacOs:
                    var macSerial = GetIoregOutput("IOPlatformSerialNumber");
                    return string.IsNullOrEmpty(macSerial) == true ? "" : macSerial;
                case Hardware.Cpuid when IsLinux:
                    {
                        var res = Dmidecode("dmidecode -t 4", "ID");
                        var parts = res.Split(' ').Reverse();
                        var result = string.Join("", parts);

                        return result;
                    }
                case Hardware.Cpuid when IsWindows:
                    var asmCpuId = Asm.GetProcessorId();
                    return asmCpuId?.Length > 2 ? asmCpuId : Wmi("Win32_Processor", "ProcessorId");
                case Hardware.Cpuid when IsMacOs:
                    var uuid = GetIoregOutput("IOPlatformUUID");
                    return string.IsNullOrEmpty(uuid) == true ? "" : uuid;
                default:
                    throw new InvalidEnumArgumentException();
            }
        }

        private enum Hardware
        {
            Motherboard,
            Cpuid
        }
    }

    internal class Cmd
    {
        public Process CreateHiddenProcess(string appPath, string args, CmdOptions k)
        {
            var o = k ?? CmdOptions.Default;

            return new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = appPath,
                    Arguments = args,
                    CreateNoWindow = o.CreateNoWindow,
                    WindowStyle = o.WindowStyle,
                    RedirectStandardOutput = o.RedirectStdOut,
                    UseShellExecute = o.UseOsShell,
                    WorkingDirectory = o.WorkingDirectory
                }
            };
        }

        public Process CreateHiddenProcess(string appPath, string args)
        {
            return CreateHiddenProcess(appPath, args, CmdOptions.Default);
        }

        public CommandLineRunResult Run(string appPath, string args, CmdOptions o, bool waitForExit)
        {
            var process = CreateHiddenProcess(appPath, args, o);

            var res = new CommandLineRunResult
            {
                AppPath = appPath,
                Args = args
            };

            try
            {
                if (waitForExit)
                {
                    process.Start();
                    res.Output = process.StandardOutput.ReadToEnd();
                    process.WaitForExit();
                    res.ExitType = CommandLineExitTypes.Ok;
                    res.ExitCode = process.ExitCode;
                    if (process.HasExited == false) process.Kill();
                }
                else
                {
                    process.Start();
                    res.Output = process.StandardOutput.ReadToEnd();
                }
            }
            catch (Exception ex)
            {
                res.ExitCode = int.MaxValue;
                res.ExitType = CommandLineExitTypes.ExceptionBeforeRun;
                res.Msg = ex.ToString();
            }

            return res;
        }

        public CommandLineRunResult Run(string appPath, string args, bool waitForExit)
        {
            return Run(appPath, args, CmdOptions.Default, waitForExit);
        }
    }

    internal class CmdOptions
    {
        static CmdOptions()
        {
            Default = new CmdOptions();
        }

        public CmdOptions() { }

        public CmdOptions(bool useOsShell = false, bool createNoWindow = true, ProcessWindowStyle windowStyle = ProcessWindowStyle.Hidden, bool redirectStdOut = true) : this()
        {
            UseOsShell = useOsShell;
            CreateNoWindow = createNoWindow;
            WindowStyle = windowStyle;
            RedirectStdOut = redirectStdOut;
        }

        public static CmdOptions Default { get; }

        public bool UseOsShell { get; set; }

        public bool CreateNoWindow { get; set; } = true;

        public ProcessWindowStyle WindowStyle { get; set; } = ProcessWindowStyle.Hidden;

        public bool RedirectStdOut { get; set; } = true;

        public string WorkingDirectory { get; set; } = "";
    }

    internal enum CommandLineExitTypes
    {
        ExceptionBeforeRun,
        Ok
    }

    internal class CommandLineRunResult
    {
        public string AppPath { get; set; } = "";

        public string Args { get; set; } = "";

        public CommandLineExitTypes ExitType { get; set; }

        public int ExitCode { get; set; }

        public string Msg { get; set; } = "";

        public string Output { get; set; } = "";

        public string Command => $"{AppPath}{Args}";
    }

    public static class Asm
    {
        private const int PageExecuteReadwrite = 0x40;

        [DllImport("user32", EntryPoint = "CallWindowProcW", CharSet = CharSet.Unicode, SetLastError = true, ExactSpelling = true)]

        private static extern IntPtr CallWindowProcW([In] byte[] bytes, IntPtr hWnd, int msg, [In][Out] byte[] wParam, IntPtr lParam);

        [return: MarshalAs(UnmanagedType.Bool)]
        [DllImport("kernel32", CharSet = CharSet.Unicode, SetLastError = true)]
        public static extern bool VirtualProtect([In] byte[] bytes, IntPtr size, int newProtect, out int oldProtect);

        public static string GetProcessorId()
        {
            var sn = new byte[8];

            return !ExecuteCode(ref sn) ? "ND" : $"{BitConverter.ToUInt32(sn, 4):X8}{BitConverter.ToUInt32(sn, 0):X8}";
        }

        private static bool ExecuteCode(ref byte[] result)
        {
            byte[] codeX86 =
            {
                0x55, /* push ebp */
                0x89,
                0xe5, /* mov  ebp, esp */
                0x57, /* push edi */
                0x8b,
                0x7d,
                0x10, /* mov  edi, [ebp+0x10] */
                0x6a,
                0x01, /* push 0x1 */
                0x58, /* pop  eax */
                0x53, /* push ebx */
                0x0f,
                0xa2, /* cpuid    */
                0x89,
                0x07, /* mov  [edi], eax */
                0x89,
                0x57,
                0x04, /* mov  [edi+0x4], edx */
                0x5b, /* pop  ebx */
                0x5f, /* pop  edi */
                0x89,
                0xec, /* mov  esp, ebp */
                0x5d, /* pop  ebp */
                0xc2,
                0x10,
                0x00, /* ret  0x10 */
            };

            byte[] codeX64 =
            {
                0x53, /* push rbx */
                0x48,
                0xc7,
                0xc0,
                0x01,
                0x00,
                0x00,
                0x00, /* mov rax, 0x1 */
                0x0f,
                0xa2, /* cpuid */
                0x41,
                0x89,
                0x00, /* mov [r8], eax */
                0x41,
                0x89,
                0x50,
                0x04, /* mov [r8+0x4], edx */
                0x5b, /* pop rbx */
                0xc3, /* ret */
            };

            var asmCode = IsX64Process() ? ref codeX64 : ref codeX86;

            var ptr = new IntPtr(asmCode.Length);

            if (!VirtualProtect(asmCode, ptr, PageExecuteReadwrite, out _))
                Marshal.ThrowExceptionForHR(Marshal.GetHRForLastWin32Error());

            ptr = new IntPtr(result.Length);

            return CallWindowProcW(asmCode, IntPtr.Zero, 0, result, ptr) != IntPtr.Zero;
        }

        private static bool IsX64Process()
        {
            return IntPtr.Size == 8;
        }
    }
}
