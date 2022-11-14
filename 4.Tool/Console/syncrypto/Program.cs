using System;

using HandStack.Core.Helpers;

namespace syncrypto
{
    // syncrypto encrypt "hello" "블라블라 1234 hello WORLD"
    // syncrypto decrypt "hello" "WzQ4NzEwLDQ3MDcxLDQ4NzYyLDQ3MDIyLDg0LDk5LDE0OSwxNTMsMTAyLDg0LDE1NCwyMDAsMjEwLDE1OCwxNjMsODIsMTg2LDE4MSwxMzIsMTI4LDExOF0uMmNmMjQ%3D"
    internal class Program
    {
        static void Main(string[] args)
        {
            // args = new string[] { "encrypt", "hello", "1234" };
            // args = new string[] { "decrypt", "hello", "WzQ4NzEwLDQ3MDcxLDQ4NzYyLDQ3MDIyLDg0LDk5LDE0OSwxNTMsMTAyLDg0LDE1NCwyMDAsMjEwLDE1OCwxNjMsODIsMTg2LDE4MSwxMzIsMTI4LDExOF0uMmNmMjQ%3D" };
            if (args.Length == 3)
            {
                var command = args[0];
                var key = args[1];
                var value = args[2];
                try
                {
                    if (command == "encrypt")
                    {
                        Console.WriteLine(SynCryptoHelper.Encrypt(value, key));
                        Environment.Exit(0);
                    }
                    else if (command == "decrypt")
                    {
                        Console.WriteLine(SynCryptoHelper.Decrypt(value, key));
                        Environment.Exit(0);
                    }
                }
                catch (Exception exception)
                {
                    Console.WriteLine(exception);
                    throw;
                }
                Environment.Exit(-1);
            }

            Environment.Exit(-1);
        }
    }
}
