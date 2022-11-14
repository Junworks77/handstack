using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.CompilerServices;

namespace function.Builder
{
    public sealed class Runner
    {
        private Runner() { }

        private static readonly Lazy<Runner> instance = new Lazy<Runner>(() => new Runner());

        public static Runner Instance { get { return instance.Value; } }

        private Dictionary<string, UnloadableAssemblyLoadContext> assemblyCache = new Dictionary<string, UnloadableAssemblyLoadContext>();

        public object? ExecuteDynamicText(string sourceFilePath, string businessKey, string typeName, string methodName, params object[] args)
        {
            object? result = null;
            result = ExecuteDynamicMethod(false, sourceFilePath, businessKey, typeName, methodName, args, result);

            return result;
        }

        public object? ExecuteDynamicFile(string sourceFilePath, string businessKey, string typeName, string methodName, params object[] args)
        {
            object? result = null;
            result = ExecuteDynamicMethod(true, sourceFilePath, businessKey, typeName, methodName, args, result);

            return result;
        }

        private object? ExecuteDynamicMethod(bool isFileOrText, string dataSource, string businessKey, string typeName, string methodName, object[] args, object? result)
        {
            string cacheKey = $"{businessKey}|{typeName}|{methodName}";
            Assembly? entryAssembly = null;
            if (assemblyCache.ContainsKey(cacheKey) == true)
            {
                var assemblyLoadContext = assemblyCache[cacheKey];
                entryAssembly = assemblyLoadContext.Assemblies.FirstOrDefault();
            }
            else
            {
                var compiler = new Compiler();
                Tuple<byte[]?, string?>? compiledResult = isFileOrText == true ? compiler.CompileFile(dataSource) : compiler.CompileText(dataSource);
                if (compiledResult != null)
                {
                    var compiledAssembly = compiledResult.Item1;
                    var errorText = compiledResult.Item2;
                    if (string.IsNullOrEmpty(errorText) == true && compiledAssembly != null)
                    {
                        using (var asm = new MemoryStream(compiledAssembly))
                        {
                            var assemblyLoadContext = new UnloadableAssemblyLoadContext();
                            entryAssembly = assemblyLoadContext.LoadAssembliyFromStream(asm);

                            assemblyCache.Add(cacheKey, assemblyLoadContext);
                        }
                    }
                    else
                    {
                        throw new Exception(errorText);
                    }
                }
            }

            if (entryAssembly != null && string.IsNullOrEmpty(typeName) == false && string.IsNullOrEmpty(methodName) == false && entryAssembly.GetTypes().Count() > 0)
            {
                var myType = entryAssembly.GetType(typeName);
                if (myType != null)
                {
                    var myObject = Activator.CreateInstance(myType);
                    MethodInfo? entry = myObject?.GetType().GetMethod(methodName);

                    if (entry != null)
                    {
                        result = entry.GetParameters().Length > 0
                            ? entry.Invoke(myObject, args)
                            : entry.Invoke(myObject, null);
                    }
                }
            }

            return result;
        }

        public object? ExecuteAndUnload(Tuple<byte[]?, string?>? compiledResult, string typeName, string methodName, params string[] args)
        {
            object? result = null;
            if (compiledResult != null)
            {
                var compiledAssembly = compiledResult.Item1;
                var errorText = compiledResult.Item2;
                if (string.IsNullOrEmpty(errorText) == false && compiledAssembly != null)
                {
                    var executeResult = LoadAndExecute(compiledAssembly, typeName, methodName, args);

                    for (var i = 0; i < 8 && executeResult.Item2.IsAlive; i++)
                    {
                        GC.Collect();
                        GC.WaitForPendingFinalizers();
                    }

                    result = executeResult.Item1;
                }
            }

            return result;
        }

        [MethodImpl(MethodImplOptions.NoInlining)]
        private Tuple<object?, WeakReference> LoadAndExecute(byte[] compiledAssembly, string typeName, string methodName, params string[] args)
        {
            Tuple<object?, WeakReference>? result = null;
            using (var asm = new MemoryStream(compiledAssembly))
            using (var assemblyLoadContext = new UnloadableAssemblyLoadContext())
            {
                var assembly = assemblyLoadContext.LoadAssembliyFromStream(asm);

                object? executeResult = null;
                MethodInfo? entry = null;
                if (string.IsNullOrEmpty(typeName) == false && string.IsNullOrEmpty(methodName) == false && assembly != null && assembly.GetTypes().Count() > 0)
                {
                    var myType = assembly.GetType(typeName);
                    if (myType != null)
                    {
                        var myObject = Activator.CreateInstance(myType);
                        entry = myObject?.GetType().GetMethod(methodName);

                        if (entry != null)
                        {
                            executeResult = entry.GetParameters().Length > 0
                                ? entry.Invoke(myObject, new object[] { args })
                                : entry.Invoke(myObject, null);
                        }
                    }
                }

                result = new Tuple<object?, WeakReference>(executeResult, new WeakReference(assemblyLoadContext));
            }

            return result;
        }
    }
}
