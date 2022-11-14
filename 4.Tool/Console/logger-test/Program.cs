using System;

using Microsoft.Extensions.Logging;

using HandStack.Logger;
using HandStack.Logger.Logging.Handlers;
using HandStack.Logger.Logging.Module;
using HandStack.Logger.Logging.Module.Database;

namespace logger_test
{
    internal class Program
    {
        static void Main()
        {
            TraceLogger.LoggerHandlerManager
                .AddHandler(new ConsoleLoggerHandler())
                .AddHandler(new FileLoggerHandler())
                .AddHandler(new DebugConsoleLoggerHandler());

            TraceLogger.Log();

            TraceLogger.Log("Hello world");

            TraceLogger.Log(Level.Trace, "Explicit define level");

            TraceLogger.Log<Program>("Explicit define log class");
            TraceLogger.Log<Program>(Level.Trace, "Explicit define log class and level");

            TraceLogger.DefaultLevel = Level.Fatal;

            try
            {
                throw new Exception();
            }
            catch (Exception exception)
            {
                TraceLogger.Log(exception);
                TraceLogger.Log<Program>(exception);
            }

            TraceLogger.Debug.Log("Debug log");
            TraceLogger.Debug.Log<Program>("Debug log");

            TraceLogger.DebugOff();
            TraceLogger.Debug.Log("Not-logged message");

            TraceLogger.DebugOn();
            TraceLogger.Debug.Log("I'am back!");

            // WriteToFileAndOverwrite
            var tmpFile = "file.log";
            try
            {
                using (var factory = new LoggerFactory())
                {
                    factory.AddProvider(new FileLoggerProvider(tmpFile, false));
                    var logger = factory.CreateLogger("TEST");
                    logger.LogInformation("Line1");
                }

                using (var factory = new LoggerFactory())
                {
                    var logger = factory.CreateLogger("TEST");
                    factory.AddProvider(new FileLoggerProvider(tmpFile, false));
                    logger.LogInformation("Line2");
                }
            }
            finally
            {
            }

            // WriteToFileAndAppend
            try
            {
                var factory = new LoggerFactory();
                factory.AddProvider(new FileLoggerProvider(tmpFile));

                var logger = factory.CreateLogger("TEST");
                logger.LogDebug("Debug message");

                logger.LogWarning("Warning message");

                factory.Dispose();

                var logEntries = System.IO.File.ReadAllLines(tmpFile);

                var entry1Parts = logEntries[0].Split('\t');
                var entry2Parts = logEntries[1].Split('\t');

                factory = new LoggerFactory();
                logger = factory.CreateLogger("TEST2");
                factory.AddProvider(new FileLoggerProvider(tmpFile, true));
                logger.LogInformation("Just message");
                factory.Dispose();
            }
            finally
            {
            }

            // WriteRollingFile
            try
            {
                LoggerFactory factory;
                ILogger logger;
                createFactoryAndTestLogger();

                for (int i = 0; i < 400; i++)
                {
                    logger.LogInformation("TEST 0123456789");
                    if (i % 50 == 0)
                    {
                        System.Threading.Thread.Sleep(20);
                    }
                }
                factory.Dispose();

                createFactoryAndTestLogger();
                logger.LogInformation("TEST 0123456789");
                factory.Dispose();

                createFactoryAndTestLogger();
                for (int i = 0; i < 1000; i++)
                {
                    logger.LogInformation("TEST 0123456789");
                }
                factory.Dispose();

                void createFactoryAndTestLogger()
                {
                    factory = new LoggerFactory();
                    factory.AddProvider(new FileLoggerProvider(tmpFile, new FileLoggerOptions()
                    {
                        FileSizeLimitBytes = 1024 * 8,
                        MaxRollingFiles = 5
                    }));
                    logger = factory.CreateLogger("TEST");
                }

            }
            finally
            {
            }
        }

        private static void MySqlDatabaseLoggerModuleSample()
        {
            TraceLogger.Modules.Install(new DatabaseLoggerModule(DatabaseType.MySql, "Your connection string here!"));
            TraceLogger.Log("My first database log! ");
        }

        private static void MsSqlDatabaseLoggerModuleSample()
        {
            TraceLogger.Modules.Install(new DatabaseLoggerModule(DatabaseType.MsSql, "Your connection string here!"));
            TraceLogger.Log("My first database log! ");
        }

        private static void OracleDatabaseLoggerModuleSample()
        {
            TraceLogger.Modules.Install(new DatabaseLoggerModule(DatabaseType.Oracle, "Your connection string here!"));
            TraceLogger.Log("My first database log! ");
        }

        public static void EmailModuleSample()
        {
            var smtpServerConfiguration = new SmtpServerConfiguration("userName", "password", "smtp.gmail.com", 587);

            var emailSenderLoggerModule = new EmailSenderLoggerModule(smtpServerConfiguration)
            {
                EnableSsl = true,
                Sender = "sender-email@gmail.com"
            };

            emailSenderLoggerModule.Recipients.Add("recipients@gmail.com");

            TraceLogger.Modules.Install(emailSenderLoggerModule);

            try
            {
                throw new NullReferenceException();
            }
            catch (Exception exception)
            {
                TraceLogger.Log(exception);
            }
        }
    }
}
