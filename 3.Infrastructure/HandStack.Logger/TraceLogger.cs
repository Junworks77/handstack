using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Reflection;

using HandStack.Logger.Logging;
using HandStack.Logger.Logging.Handlers;
using HandStack.Logger.Logging.Module;

namespace HandStack.Logger
{
    public static class TraceLogger
    {
        private static readonly LogPublisher LogPublisher;
        private static readonly ModuleManager ModuleManager;
        private static readonly DebugLogger DebugLogger;

        private static readonly object sync = new object();
        private static Level defaultLevel = Level.Info;
        private static bool isTurned = true;
        private static bool isTurnedDebug = true;

        static TraceLogger()
        {
            lock (sync)
            {
                LogPublisher = new LogPublisher();
                ModuleManager = new ModuleManager();
                DebugLogger = new DebugLogger();
            }
        }

        public static void DefaultInitialization()
        {
            LoggerHandlerManager
                .AddHandler(new ConsoleLoggerHandler())
                .AddHandler(new FileLoggerHandler());

            Log(Level.Info, "Logger initialization");
        }

        public static Level DefaultLevel
        {
            get { return defaultLevel; }
            set { defaultLevel = value; }
        }

        public static ILoggerHandlerManager LoggerHandlerManager
        {
            get { return LogPublisher; }
        }

        public static void Log()
        {
            Log("");
        }

        public static void Log(string message)
        {
            Log(defaultLevel, message);
        }

        public static void Log(Level level, string message)
        {
            var stackFrame = FindStackFrame();
            var methodBase = stackFrame == null ? null : GetCallingMethodBase(stackFrame);
            var callingMethod = methodBase == null ? "" : methodBase.Name;
            var reflectedType = methodBase?.ReflectedType?.Name;
            var lineNumber = stackFrame == null ? 0 : stackFrame.GetFileLineNumber();

            string callingClass = reflectedType == null ? "" : reflectedType;
            Log(level, message, callingClass, callingMethod, lineNumber);
        }

        public static void Log(Exception exception, Level level, string message)
        {
            var stackFrame = FindStackFrame();
            var methodBase = stackFrame == null ? null : GetCallingMethodBase(stackFrame);
            var callingMethod = methodBase == null ? "" : methodBase.Name;
            var reflectedType = methodBase?.ReflectedType?.Name;
            var lineNumber = stackFrame == null ? 0 : stackFrame.GetFileLineNumber();

            string callingClass = reflectedType == null ? "" : reflectedType;
            Log(level, message, callingClass, callingMethod, lineNumber);

            ModuleManager.ExceptionLog(exception);
        }

        public static void Log(Exception exception)
        {
            Log(Level.Error, exception.Message);
            ModuleManager.ExceptionLog(exception);
        }

        public static void Log<T>(Exception exception) where T : class
        {
            var message = string.Format("Log exception Message: {0}\nStackTrace: {1}", exception.Message, exception.StackTrace);
            Log<T>(Level.Error, message);
        }

        public static void Log<T>(string message) where T : class
        {
            Log<T>(defaultLevel, message);
        }

        public static void Log<T>(Level level, string message) where T : class
        {
            var stackFrame = FindStackFrame();
            var methodBase = stackFrame == null ? null : GetCallingMethodBase(stackFrame);
            var callingMethod = methodBase == null ? "" : methodBase.Name;
            var callingClass = nameof(T);
            var lineNumber = stackFrame == null ? 0 : stackFrame.GetFileLineNumber();

            Log(level, message, callingClass, callingMethod, lineNumber);
        }

        private static void Log(Level level, string message, string callingClass, string callingMethod, int lineNumber)
        {
            if (!isTurned || (!isTurnedDebug && level == Level.Debug))
                return;

            var currentDateTime = DateTime.Now;

            ModuleManager.BeforeLog();
            var logMessage = new LogData(level, message, currentDateTime, callingClass, callingMethod, lineNumber);
            LogPublisher.Publish(logMessage);
            ModuleManager.Execute(logMessage);
        }

        private static MethodBase? GetCallingMethodBase(StackFrame stackFrame)
        {
            return stackFrame == null ? MethodBase.GetCurrentMethod() : stackFrame.GetMethod();
        }

        private static StackFrame? FindStackFrame()
        {
            var stackTrace = new StackTrace();
            for (var i = 0; i < stackTrace.GetFrames().Length; i++)
            {
                var methodBase = stackTrace.GetFrame(i)?.GetMethod();
                var name = MethodBase.GetCurrentMethod()?.Name;
                if (methodBase != null && string.IsNullOrEmpty(name) == false && methodBase.Name.Equals("Log") == false && methodBase.Name.Equals(name) == false)
                {
                    return new StackFrame(i, true);
                }
            }
            return null;
        }

        public static void On()
        {
            isTurned = true;
        }

        public static void Off()
        {
            isTurned = false;
        }

        public static void DebugOn()
        {
            isTurnedDebug = true;
        }

        public static void DebugOff()
        {
            isTurnedDebug = false;
        }

        public static IEnumerable<LogData> Messages
        {
            get { return LogPublisher.Messages; }
        }

        public static DebugLogger Debug
        {
            get { return DebugLogger; }
        }

        public static ModuleManager Modules
        {
            get { return ModuleManager; }
        }

        public static bool StoreLogMessages
        {
            get { return LogPublisher.StoreLogMessages; }
            set { LogPublisher.StoreLogMessages = value; }
        }

        static class FilterPredicates
        {
            public static bool ByLevelHigher(Level logMessLevel, Level filterLevel)
            {
                return ((int)logMessLevel >= (int)filterLevel);
            }

            public static bool ByLevelLower(Level logMessLevel, Level filterLevel)
            {
                return ((int)logMessLevel <= (int)filterLevel);
            }

            public static bool ByLevelExactly(Level logMessLevel, Level filterLevel)
            {
                return ((int)logMessLevel == (int)filterLevel);
            }

            public static bool ByLevel(LogData logMessage, Level filterLevel, Func<Level, Level, bool> filterPred)
            {
                return filterPred(logMessage.Level, filterLevel);
            }
        }

        public class FilterByLevel
        {
            public Level FilteredLevel { get; set; }
            public bool ExactlyLevel { get; set; }
            public bool OnlyHigherLevel { get; set; }

            public FilterByLevel(Level level)
            {
                FilteredLevel = level;
                ExactlyLevel = true;
                OnlyHigherLevel = true;
            }

            public FilterByLevel()
            {
                ExactlyLevel = false;
                OnlyHigherLevel = true;
            }

            public Predicate<LogData> Filter
            {
                get
                {
                    return delegate (LogData logMessage)
                    {
                        return FilterPredicates.ByLevel(logMessage, FilteredLevel, delegate (Level lm, Level fl)
                        {
                            return ExactlyLevel ?
                                FilterPredicates.ByLevelExactly(lm, fl) :
                                (OnlyHigherLevel ?
                                    FilterPredicates.ByLevelHigher(lm, fl) :
                                    FilterPredicates.ByLevelLower(lm, fl)
                                );
                        });
                    };
                }
            }
        }
    }
}
