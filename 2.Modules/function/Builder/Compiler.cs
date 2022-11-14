﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;

using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.Text;
using Microsoft.CSharp.RuntimeBinder;

namespace function.Builder
{
    internal class Compiler
    {
        public Tuple<byte[]?, string?>? CompileText(string sourceCode)
        {
            Tuple<byte[]?, string?>? result = null;
            using (var memoryStream = new MemoryStream())
            {
                var emitResult = GenerateCode(sourceCode).Emit(memoryStream);

                if (emitResult.Success == false)
                {
                    List<string> failureMessages = new List<string>();
                    var failures = emitResult.Diagnostics.Where(diagnostic => diagnostic.IsWarningAsError || diagnostic.Severity == DiagnosticSeverity.Error);
                    foreach (var diagnostic in failures)
                    {
                        failureMessages.Add($"{diagnostic.Id}: {diagnostic.GetMessage()}");
                    }

                    result = new Tuple<byte[]?, string?>(null, string.Join("\n", failureMessages.ToArray()));
                }

                memoryStream.Seek(0, SeekOrigin.Begin);
                result = new Tuple<byte[]?, string?>(memoryStream.ToArray(), null);
            }

            return result;
        }

        public Tuple<byte[]?, string?>? CompileFile(string sourceFilePath)
        {
            Tuple<byte[]?, string?>? result = null;
            if (File.Exists(sourceFilePath))
            {
                var sourceCode = File.ReadAllText(sourceFilePath);

                using (var memoryStream = new MemoryStream())
                {
                    var emitResult = GenerateCode(sourceCode).Emit(memoryStream);

                    if (emitResult.Success == false)
                    {
                        List<string> failureMessages = new List<string>();
                        var failures = emitResult.Diagnostics.Where(diagnostic => diagnostic.IsWarningAsError || diagnostic.Severity == DiagnosticSeverity.Error);
                        foreach (var diagnostic in failures)
                        {
                            failureMessages.Add($"{diagnostic.Id}: {diagnostic.GetMessage()}");
                        }

                        result = new Tuple<byte[]?, string?>(null, string.Join("\n", failureMessages.ToArray()));
                        return result;
                    }

                    memoryStream.Seek(0, SeekOrigin.Begin);
                    result = new Tuple<byte[]?, string?>(memoryStream.ToArray(), null);
                }
            }

            return result;
        }

        private static bool AddReferenceAssemblyFilePath(List<string> referenceAssemblyLocations, string assemblyFilePath)
        {
            if (string.IsNullOrEmpty(assemblyFilePath) == true)
            {
                return false;
            }

            var file = Path.GetFullPath(assemblyFilePath);
            if (File.Exists(file) == false)
            {
                var path = Path.GetDirectoryName(typeof(object).Assembly.Location);
                if (path != null)
                {
                    file = Path.Combine(path, assemblyFilePath);
                    if (File.Exists(file) == false)
                    {
                        return false;
                    }
                }
                else
                {
                    return false;
                }
            }

            if (referenceAssemblyLocations.Any(r => r == file) == true)
            {
                return true;
            }

            try
            {
                var reference = MetadataReference.CreateFromFile(file);
                referenceAssemblyLocations.Add(file);
            }
            catch
            {
                return false;
            }

            return true;
        }

        private static CSharpCompilation GenerateCode(string sourceCode)
        {
            var codeString = SourceText.From(sourceCode);
            var options = CSharpParseOptions.Default.WithLanguageVersion(LanguageVersion.CSharp10);
            var parsedSyntaxTree = SyntaxFactory.ParseSyntaxTree(codeString, options);
            var references = new List<MetadataReference>()
            {
                MetadataReference.CreateFromFile(typeof(object).Assembly.Location),
                MetadataReference.CreateFromFile(typeof(RuntimeBinderException).Assembly.Location)
            };

            List<string> assemblyPaths = new List<string>();
            Assembly functionAssembly = typeof(ModuleInitializer).Assembly;
            functionAssembly.GetReferencedAssemblies().ToList()
                .ForEach((AssemblyName assemblyName) =>
                {
                    AddReferenceAssemblyFilePath(assemblyPaths, Assembly.Load(assemblyName).Location);
                });

            var baseAssemblyPath = Path.GetDirectoryName(typeof(object).Assembly.Location) + Path.DirectorySeparatorChar;
            AddReferenceAssemblyFilePath(assemblyPaths, baseAssemblyPath + "System.Private.CoreLib.dll");
            AddReferenceAssemblyFilePath(assemblyPaths, baseAssemblyPath + "System.Runtime.dll");
            AddReferenceAssemblyFilePath(assemblyPaths, baseAssemblyPath + "System.Console.dll");
            AddReferenceAssemblyFilePath(assemblyPaths, baseAssemblyPath + "System.Text.RegularExpressions.dll");
            AddReferenceAssemblyFilePath(assemblyPaths, baseAssemblyPath + "System.Linq.dll");
            AddReferenceAssemblyFilePath(assemblyPaths, baseAssemblyPath + "System.Linq.Expressions.dll");
            AddReferenceAssemblyFilePath(assemblyPaths, baseAssemblyPath + "System.IO.dll");
            AddReferenceAssemblyFilePath(assemblyPaths, baseAssemblyPath + "System.Net.Primitives.dll");
            AddReferenceAssemblyFilePath(assemblyPaths, baseAssemblyPath + "System.Net.Http.dll");
            AddReferenceAssemblyFilePath(assemblyPaths, baseAssemblyPath + "System.Private.Uri.dll");
            AddReferenceAssemblyFilePath(assemblyPaths, baseAssemblyPath + "System.Reflection.dll");
            AddReferenceAssemblyFilePath(assemblyPaths, baseAssemblyPath + "System.ComponentModel.Primitives.dll");
            AddReferenceAssemblyFilePath(assemblyPaths, baseAssemblyPath + "System.Globalization.dll");
            AddReferenceAssemblyFilePath(assemblyPaths, baseAssemblyPath + "System.Collections.Concurrent.dll");
            AddReferenceAssemblyFilePath(assemblyPaths, baseAssemblyPath + "System.Collections.NonGeneric.dll");
            AddReferenceAssemblyFilePath(assemblyPaths, baseAssemblyPath + "Microsoft.CSharp.dll");
            AddReferenceAssemblyFilePath(assemblyPaths, baseAssemblyPath + "System.Data.Common.dll");
            AddReferenceAssemblyFilePath(assemblyPaths, baseAssemblyPath + "System.ComponentModel.dll");
            AddReferenceAssemblyFilePath(assemblyPaths, baseAssemblyPath + "System.ComponentModel.TypeConverter.dll");
            AddReferenceAssemblyFilePath(assemblyPaths, baseAssemblyPath + "System.ComponentModel.Primitives.dll");
            AddReferenceAssemblyFilePath(assemblyPaths, baseAssemblyPath + "System.Xml.ReaderWriter.dll");
            AddReferenceAssemblyFilePath(assemblyPaths, baseAssemblyPath + "System.Private.Xml.dll");

            // 아래 코드를 module.json에 추가할 어셈블리 경로를 설정하도록 대체 할것
            // AddReferenceAssemblyFilePath(assemblyPaths, loadAssemblyFilePath.Replace("{baseAssemblyPath}", baseAssemblyPath));

            assemblyPaths.Add(functionAssembly.Location);
            assemblyPaths = assemblyPaths.Distinct().ToList();

            assemblyPaths.ForEach((string path) =>
            {
                var portableExecutableReference = MetadataReference.CreateFromFile(path);
                if (references.Contains(portableExecutableReference) == false)
                {
                    references.Add(portableExecutableReference);
                }
            });

            return CSharpCompilation.Create(null,
                new[] { parsedSyntaxTree },
                references: references,
                options: new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary,
                    optimizationLevel: OptimizationLevel.Release,
                    assemblyIdentityComparer: DesktopAssemblyIdentityComparer.Default));
        }
    }
}
