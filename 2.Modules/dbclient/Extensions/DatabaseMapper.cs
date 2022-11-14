using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;

using Dapper;

using dbclient.NativeParameters;

using HtmlAgilityPack;

using Microsoft.Extensions.Configuration;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using HandStack.Core.ExtensionMethod;
using HandStack.Core.Extensions;
using HandStack.Core.Helpers;
using HandStack.Data;
using HandStack.Web;
using HandStack.Web.MessageContract.DataObject;

using Serilog;

namespace dbclient.Extensions
{
    public static class DatabaseMapper
    {
        private static Random random = new Random();
        public static Dictionary<string, DataSourceMap> DataSourceMappings = new Dictionary<string, DataSourceMap>();
        public static Dictionary<string, StatementMap> StatementMappings = new Dictionary<string, StatementMap>();

        static DatabaseMapper()
        {
        }

        public static DataSourceMap GetDataSourceMap(string dataSourceID)
        {
            DataSourceMap result = new DataSourceMap();
            if (DataSourceMappings != null)
            {
                result = DataSourceMappings.FirstOrDefault(item => item.Key == dataSourceID).Value;
            }

            return result;
        }

        public static StatementMap GetStatementMap(string queryID)
        {
            StatementMap result = new StatementMap();
            if (StatementMappings != null)
            {
                result = StatementMappings.FirstOrDefault(item => item.Key == queryID).Value;
            }

            return result;
        }

        public static bool Remove(string projectID, string businessID, string transactionID, string statementID)
        {
            bool result = false;
            lock (StatementMappings)
            {
                string queryID = string.Concat(
                    projectID, "|",
                    businessID, "|",
                    transactionID, "|",
                    statementID
                );

                if (StatementMappings.ContainsKey(queryID) == true)
                {
                    result = StatementMappings.Remove(queryID);
                }
            }

            return result;
        }

        public static bool HasStatement(string projectID, string businessID, string transactionID, string statementID)
        {
            bool result = false;
            string queryID = string.Concat(
                projectID, "|",
                businessID, "|",
                transactionID, "|",
                statementID
            );

            result = StatementMappings.ContainsKey(queryID);

            return result;
        }

        public static bool AddStatementMap(string filePath, bool forceUpdate, ILogger logger)
        {
            bool result = false;
            lock (StatementMappings)
            {
                filePath = Path.Combine(ModuleConfiguration.ContractBasePath, filePath);

                if (File.Exists(filePath) == true)
                {
                    try
                    {
                        var htmlDocument = new HtmlDocument();
                        htmlDocument.OptionDefaultStreamEncoding = Encoding.UTF8;
                        htmlDocument.LoadHtml(ReplaceCData(File.ReadAllText(filePath)));
                        HtmlNode header = htmlDocument.DocumentNode.SelectSingleNode("//mapper/header");

                        var items = htmlDocument.DocumentNode.SelectNodes("//commands/statement");
                        if (items != null)
                        {
                            foreach (var item in items)
                            {
                                if (header.Element("use").InnerText == "Y")
                                {
                                    StatementMap statementMap = new StatementMap();
                                    statementMap.ApplicationID = header.Element("application").InnerText;
                                    statementMap.ProjectID = header.Element("project").InnerText;
                                    statementMap.TransactionID = header.Element("transaction").InnerText;
                                    statementMap.DataSourceID = header.Element("datasource").InnerText;
                                    statementMap.StatementID = item.Attributes["id"].Value + item.Attributes["seq"].Value.PadLeft(2, '0');
                                    statementMap.Seq = int.Parse(item.Attributes["seq"].Value);
                                    statementMap.Description = item.Attributes["desc"].Value;
                                    statementMap.NativeDataClient = item.Attributes["native"] == null ? false : item.Attributes["native"].Value == "Y";
                                    statementMap.Timeout = int.Parse(item.Attributes["timeout"].Value);
                                    statementMap.SQL = item.InnerHtml;

                                    string? beforetransaction = item.Attributes["before"]?.Value;
                                    if (string.IsNullOrEmpty(beforetransaction) == false)
                                    {
                                        statementMap.BeforeTransactionCommand = beforetransaction;
                                    }

                                    string? aftertransaction = item.Attributes["after"]?.Value;
                                    if (string.IsNullOrEmpty(aftertransaction) == false)
                                    {
                                        statementMap.AfterTransactionCommand = aftertransaction;
                                    }

                                    string? fallbacktransaction = item.Attributes["fallback"]?.Value;
                                    if (string.IsNullOrEmpty(fallbacktransaction) == false)
                                    {
                                        statementMap.FallbackTransactionCommand = fallbacktransaction;
                                    }

                                    statementMap.DbParameters = new List<DbParameterMap>();
                                    HtmlNodeCollection htmlNodes = item.SelectNodes("param");
                                    if (htmlNodes != null && htmlNodes.Count > 0)
                                    {
                                        foreach (HtmlNode paramNode in item.SelectNodes("param"))
                                        {
                                            statementMap.DbParameters.Add(new DbParameterMap()
                                            {
                                                Name = paramNode.Attributes["id"].Value.ToString(),
                                                DbType = paramNode.Attributes["type"].Value.ToString(),
                                                Length = int.Parse(paramNode.Attributes["length"].Value.ToString()),
                                                DefaultValue = paramNode.Attributes["value"].Value.ToString(),
                                                TestValue = paramNode.Attributes["test"] == null ? "" : paramNode.Attributes["test"].Value.ToString(),
                                                Direction = paramNode.Attributes["direction"] == null ? "Input" : paramNode.Attributes["direction"].Value.ToString()
                                            });
                                        }
                                    }

                                    var children = new HtmlDocument();
                                    children.OptionDefaultStreamEncoding = Encoding.UTF8;
                                    children.LoadHtml(statementMap.SQL);
                                    statementMap.Chidren = children;

                                    string queryID = string.Concat(
                                        statementMap.ApplicationID, "|",
                                        statementMap.ProjectID, "|",
                                        statementMap.TransactionID, "|",
                                        statementMap.StatementID
                                    );

                                    lock (StatementMappings)
                                    {
                                        if (StatementMappings.ContainsKey(queryID) == false)
                                        {
                                            StatementMappings.Add(queryID, statementMap);
                                        }
                                        else
                                        {
                                            if (forceUpdate == true)
                                            {
                                                StatementMappings.Remove(queryID);
                                                StatementMappings.Add(queryID, statementMap);
                                            }
                                            else
                                            {
                                                logger.Error("[{LogCategory}] " + $"SqlMap 정보 중복 오류 - {filePath}, ProjectID - {statementMap.ApplicationID}, BusinessID - {statementMap.ProjectID}, TransactionID - {statementMap.TransactionID}, StatementID - {statementMap.StatementID}", "DatabaseMapper/AddStatementMap");
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    catch (Exception exception)
                    {
                        logger.Error("[{LogCategory}] " + $"{filePath} 업무 계약 파일 오류 - " + exception.ToMessage(), "DatabaseMapper/AddStatementMap");
                    }
                    result = true;
                }
            }

            return result;
        }

        public static DynamicParameters GetSqlParameters(StatementMap statementMap, DynamicObject dynamicObject)
        {
            DynamicParameters dynamicParameters = new DynamicParameters();
            if (dynamicObject.Parameters.Count() > 0)
            {
                List<DbParameterMap> dbParameterMaps = statementMap.DbParameters;
                foreach (DbParameterMap dbParameterMap in dbParameterMaps)
                {
                    DynamicParameter? dynamicParameter = GetDbParameterMap(dbParameterMap.Name, dynamicObject.Parameters);

                    if (dynamicParameter != null)
                    {
                        dynamicParameters.Add(
                            dynamicParameter.ParameterName,
                            dynamicParameter.Value,
                            (DbType)Enum.Parse(typeof(DbType), string.IsNullOrEmpty(dbParameterMap.DbType) == true ? dynamicParameter.DbType : dbParameterMap.DbType),
                            (ParameterDirection)Enum.Parse(typeof(ParameterDirection), dbParameterMap.Direction),
                            dbParameterMap.Length <= 0 ? -1 : dbParameterMap.Length
                        );
                    }
                }
            }

            return dynamicParameters;
        }

        private static DynamicParameter? GetDbParameterMap(string parameterName, List<DynamicParameter> dynamicParameters)
        {
            DynamicParameter? result = null;

            var maps = from p in dynamicParameters
                       where p.ParameterName == parameterName.Replace("@", "").Replace(":", "")
                       select p;

            if (maps.Count() > 0)
            {
                foreach (var item in maps)
                {
                    result = item;
                    break;
                }
            }

            return result;
        }

        public static (string? SQL, string ResultType) FindPretreatment(StatementMap statementMap, DynamicObject dynamicObject)
        {
            string? pretreatmentSQL = null;
            string resultType = "";

            if (statementMap != null)
            {
                JObject parameters = new JObject();
                foreach (DynamicParameter item in dynamicObject.Parameters)
                {
                    parameters.Add(item.ParameterName, item.Value == null ? null : item.Value.ToString());
                }

                var htmlDocument = new HtmlDocument();
                htmlDocument.OptionDefaultStreamEncoding = Encoding.UTF8;
                htmlDocument.LoadHtml(statementMap.SQL);
                HtmlNode pretreatment = htmlDocument.DocumentNode.SelectSingleNode("//pretreatment");
                if (pretreatment != null)
                {
                    var htmlResultType = pretreatment.Attributes["resultType"];
                    if (htmlResultType != null)
                    {
                        resultType = htmlResultType.Value;
                    }
                    var children = new HtmlDocument();
                    children.OptionDefaultStreamEncoding = Encoding.UTF8;
                    children.LoadHtml(pretreatment.InnerHtml);

                    var childNodes = children.DocumentNode.ChildNodes;
                    foreach (var childNode in childNodes)
                    {
                        pretreatmentSQL = pretreatmentSQL + ConvertChildren(childNode, parameters);
                    }

                    // 처리되지 않는 변환값은 NULL값을 변환
                    // result = Regex.Replace(result, "(\\#|\\$){(.*?)}", "NULL");
                }
            }

            if (pretreatmentSQL != null)
            {
                pretreatmentSQL = pretreatmentSQL + new string(' ', random.Next(1, 100));
            }

            return (pretreatmentSQL, resultType);
        }

        public static string Find(StatementMap? statementMap, DynamicObject? dynamicObject)
        {
            string result = string.Empty;

            if (statementMap != null && dynamicObject != null)
            {
                JObject parameters = new JObject();
                foreach (DynamicParameter item in dynamicObject.Parameters)
                {
                    parameters.Add(item.ParameterName, item.Value == null ? null : JToken.FromObject(item.Value));
                }

                HtmlAgilityPack.HtmlDocument children = statementMap.Chidren;

                var childNodes = children.DocumentNode.ChildNodes;
                foreach (var childNode in childNodes)
                {
                    result = result + ConvertChildren(childNode, parameters);
                }
            }

            if (string.IsNullOrEmpty(result) == true)
            {
                result = "";
            }
            else
            {
                result = result + new string(' ', random.Next(1, 10));
            }

            return result;
        }

        public static string ConvertChildren(HtmlNode htmlNode, JObject parameters)
        {
            string result = "";
            string nodeType = htmlNode.NodeType.ToString();
            if (nodeType == "Text")
            {
                result = ConvertParameter(htmlNode, parameters);
            }
            else if (nodeType == "Element")
            {
                switch (htmlNode.Name.ToString().ToLower())
                {
                    case "if":
                        return ConvertIf(htmlNode, parameters);
                    case "foreach":
                        return ConvertForeach(htmlNode, parameters);
                    case "bind":
                        parameters = ConvertBind(htmlNode, parameters);
                        result = "";
                        break;
                    case "param":
                        return "";
                    default:
                        result = "";
                        break;
                }
            }

            return result;
        }

        public static string ConvertForeach(HtmlNode htmlNode, JObject parameters)
        {
            string result = "";
            // JArray list = Eval.Execute<JArray>(htmlNode.Attributes["collection"].Value, parameters);
            JArray? list = parameters[htmlNode.Attributes["collection"].Value] as JArray;
            if (list != null)
            {
                string item = htmlNode.Attributes["item"].Value;
                string open = htmlNode.Attributes["open"] == null ? "" : htmlNode.Attributes["open"].Value;
                string close = htmlNode.Attributes["close"] == null ? "" : htmlNode.Attributes["close"].Value;
                string separator = htmlNode.Attributes["separator"] == null ? "" : htmlNode.Attributes["separator"].Value;

                List<string> foreachTexts = new List<string>();
                foreach (var coll in list)
                {
                    var foreachParam = parameters;
                    foreachParam[item] = coll.Value<string>();

                    string foreachText = "";
                    foreach (var childNode in htmlNode.ChildNodes)
                    {
                        string childrenText = ConvertChildren(childNode, foreachParam);
                        childrenText = Regex.Replace(childrenText, "^\\s*$", "");

                        if (string.IsNullOrEmpty(childrenText) == false)
                        {
                            foreachText = foreachText + childrenText;
                        }
                    }

                    if (string.IsNullOrEmpty(foreachText) == false)
                    {
                        foreachTexts.Add(foreachText);
                    }
                }

                result = (open + string.Join(separator, foreachTexts.ToArray()) + close);
            }

            return result;
        }

        public static string ConvertIf(HtmlNode htmlNode, JObject parameters)
        {
            string evalString = htmlNode.Attributes["test"].Value;
            evalString = ReplaceEvalString(evalString, parameters);
            evalString = evalString.Replace(" and ", " && ");
            evalString = evalString.Replace(" or ", " || ");
            string evalText = evalString.Replace("'", "\"");

            // bool evalResult = Eval.Execute<bool>(evalText, parameters);
            string line = JsonUtils.GenerateDynamicLinqStatement(parameters);
            var queryable = new[] { parameters }.AsQueryable().Select(line);
            bool evalResult = queryable.Any(evalText);

            string convertString = "";
            if (evalResult == true)
            {
                foreach (var childNode in htmlNode.ChildNodes)
                {
                    convertString = convertString + ConvertChildren(childNode, parameters);
                }
            }

            return convertString;
        }

        public static JObject ConvertBind(HtmlNode htmlNode, JObject parameters)
        {
            string bindID = htmlNode.Attributes["name"].Value;
            string evalString = htmlNode.Attributes["value"].Value;
            evalString = ReplaceEvalString(evalString, parameters);
            string evalText = evalString.Replace("'", "\"");

            // string evalResult = Eval.Execute<string>(evalText, parameters);
            string evalResult = evalText;
            string line = JsonUtils.GenerateDynamicLinqStatement(parameters);
            var queryable = new[] { parameters }.AsQueryable().Select(line);
            var queryResult = queryable.Select<string>(evalText);
            if (queryResult.Any() == true)
            {
                evalResult = queryResult.First();
            }

            parameters[bindID] = evalResult;

            return parameters;
        }

        public static string ConvertParameter(HtmlNode htmlNode, JObject parameters)
        {
            string convertString = htmlNode.InnerText;
            if (parameters != null && parameters.Count > 0)
            {
                string keyString = "";
                convertString = RecursiveParameters(convertString, parameters, keyString);
            }

            try
            {
                convertString = Regex.Replace(convertString, "&amp;", "&");
                convertString = Regex.Replace(convertString, "&lt;", "<");
                convertString = Regex.Replace(convertString, "&gt;", ">");
                convertString = Regex.Replace(convertString, "&quot;", "\"");
            }
            catch (Exception exception)
            {
                Log.Error("[{LogCategory}] " + exception.ToMessage(), "DatabaseMapper/ConvertParameter");
                throw;
            }

            return convertString;
        }

        public static string RecursiveParameters(string convertString, JObject? parameters, string keyString)
        {
            if (parameters != null)
            {
                foreach (var parameter in parameters)
                {
                    if (parameter.Value != null)
                    {
                        if (parameter.Value.Type.ToString() == "Object")
                        {
                            var nextKeyString = keyString + parameter.Key + "\\.";
                            convertString = RecursiveParameters(convertString, parameter.Value?.ToObject<JObject>(), nextKeyString);
                        }
                        else
                        {
                            string name = parameter.Key;
                            string value = parameter.Value.ToStringSafe();

                            name = name.StartsWith("$") == true ? "\\" + name : name;
                            value = value.Replace("\"", "\\\"").Replace("'", "''");
                            // 문자값 변환
                            convertString = Regex.Replace(convertString, "\\#{" + name + "}", "'" + value + "'");

                            // 숫자값 변환
                            convertString = Regex.Replace(convertString, "\\${" + name + "}", value);
                        }
                    }
                }
            }

            return convertString;
        }

        public static string ReplaceEvalString(string evalString, JObject parameters)
        {
            foreach (var parameter in parameters)
            {
                if (parameter.Value != null)
                {
                    string replacePrefix = "";
                    string replacePostfix = "";
                    Regex paramRegex;

                    if (parameter.Value.Type.ToString() == "Object")
                    {
                        replacePostfix = "";
                        paramRegex = new Regex("(^|[^a-zA-Z0-9])(" + parameter.Key + "\\.)([a-zA-Z0-9]+)");
                    }
                    else
                    {
                        replacePostfix = " ";
                        paramRegex = new Regex("(^|[^a-zA-Z0-9])(" + parameter.Key + ")($|[^a-zA-Z0-9])");
                    }

                    if (paramRegex.IsMatch(evalString) == true)
                    {
                        evalString = paramRegex.Replace(evalString, "$1" + replacePrefix + "$2" + replacePostfix + "$3");
                    }
                }
            }

            return evalString;
        }

        public static string ReplaceCData(string rawText)
        {
            Regex cdataRegex = new Regex("(<!\\[CDATA\\[)([\\s\\S]*?)(\\]\\]>)");
            var matches = cdataRegex.Matches(rawText);

            if (matches != null && matches.Count > 0)
            {
                foreach (Match match in matches)
                {
                    string[] matchSplit = Regex.Split(match.Value, "(<!\\[CDATA\\[)([\\s\\S]*?)(\\]\\]>)");
                    string cdataText = matchSplit[2];
                    cdataText = Regex.Replace(cdataText, "&", "&amp;");
                    cdataText = Regex.Replace(cdataText, "<", "&lt;");
                    cdataText = Regex.Replace(cdataText, ">", "&gt;");
                    cdataText = Regex.Replace(cdataText, "\"", "&quot;");

                    rawText = rawText.Replace(match.Value, cdataText);
                }
            }
            return rawText;
        }

        public static void LoadContract(string environmentName, ILogger logger, IConfiguration configuration)
        {
            try
            {
                if (string.IsNullOrEmpty(ModuleConfiguration.ContractBasePath) == true)
                {
                    ModuleConfiguration.ContractBasePath = Path.Combine(GlobalConfiguration.ContentRootPath, @"Contracts");
                }

                if (Directory.Exists(ModuleConfiguration.ContractBasePath) == false)
                {
                    Directory.CreateDirectory(ModuleConfiguration.ContractBasePath);
                }

                logger.Information("[{LogCategory}] ContractBasePath: " + ModuleConfiguration.ContractBasePath, "DatabaseMapper/LoadContract");

                foreach (var item in ModuleConfiguration.DataSource)
                {
                    string projectIDText = item.ProjectID;
                    string[] projectIDList = projectIDText.Split(",");

                    for (int i = 0; i < projectIDList.Length; i++)
                    {
                        string projectID = projectIDList[i].Trim();
                        if (string.IsNullOrEmpty(projectID) == true)
                        {
                            continue;
                        }

                        string dataSourceID = $"{item.ApplicationID}_{projectID}_{item.DataSourceID}";

                        if (DataSourceMappings.ContainsKey(dataSourceID) == false)
                        {
                            var dataProvider = (DataProviders)Enum.Parse(typeof(DataProviders), item.DataProvider);
                            var connectionString = item.ConnectionString;

                            if (item.IsEncryption.ParseBool() == true)
                            {
                                connectionString = SynCryptoHelper.Decrypt(connectionString);
                            }

                            if (dataProvider == DataProviders.SQLite)
                            {
                                if (connectionString.IndexOf("#{ContentRootPath}") > -1)
                                {
                                    connectionString = connectionString.Replace("#{ContentRootPath}", GlobalConfiguration.ContentRootPath);
                                }
                            }

                            DataSourceMappings.Add(dataSourceID, new DataSourceMap()
                            {
                                DataProvider = dataProvider,
                                ConnectionString = connectionString
                            });
                        }
                    }
                }

                string[] sqlMapFiles = Directory.GetFiles(ModuleConfiguration.ContractBasePath, "*.xml", SearchOption.AllDirectories);
                foreach (string sqlMapFile in sqlMapFiles)
                {
                    try
                    {
                        FileInfo fileInfo = new FileInfo(sqlMapFile);
                        var htmlDocument = new HtmlDocument();
                        htmlDocument.OptionDefaultStreamEncoding = Encoding.UTF8;
                        htmlDocument.LoadHtml(ReplaceCData(File.ReadAllText(sqlMapFile)));
                        HtmlNode header = htmlDocument.DocumentNode.SelectSingleNode("//mapper/header");

                        var items = htmlDocument.DocumentNode.SelectNodes("//commands/statement");
                        if (items != null)
                        {
                            foreach (var item in items)
                            {
                                if (header.Element("use").InnerText == "Y")
                                {
                                    StatementMap statementMap = new StatementMap();
                                    statementMap.ApplicationID = header.Element("application").InnerText;
                                    statementMap.ProjectID = header.Element("project").InnerText;
                                    statementMap.TransactionID = header.Element("transaction").InnerText;
                                    statementMap.DataSourceID = header.Element("datasource").InnerText;
                                    statementMap.StatementID = item.Attributes["id"].Value + item.Attributes["seq"].Value.PadLeft(2, '0');
                                    statementMap.Seq = int.Parse(item.Attributes["seq"].Value);
                                    statementMap.Description = item.Attributes["desc"].Value;
                                    statementMap.NativeDataClient = item.Attributes["native"] == null ? false : item.Attributes["native"].Value == "Y";
                                    statementMap.Timeout = int.Parse(item.Attributes["timeout"].Value);
                                    statementMap.SQL = item.InnerHtml;

                                    string? beforetransaction = item.Attributes["before"]?.Value;
                                    if (string.IsNullOrEmpty(beforetransaction) == false)
                                    {
                                        statementMap.BeforeTransactionCommand = beforetransaction;
                                    }

                                    string? aftertransaction = item.Attributes["after"]?.Value;
                                    if (string.IsNullOrEmpty(aftertransaction) == false)
                                    {
                                        statementMap.AfterTransactionCommand = aftertransaction;
                                    }

                                    string? fallbacktransaction = item.Attributes["fallback"]?.Value;
                                    if (string.IsNullOrEmpty(fallbacktransaction) == false)
                                    {
                                        statementMap.FallbackTransactionCommand = fallbacktransaction;
                                    }

                                    statementMap.DbParameters = new List<DbParameterMap>();
                                    HtmlNodeCollection htmlNodes = item.SelectNodes("param");
                                    if (htmlNodes != null && htmlNodes.Count > 0)
                                    {
                                        foreach (HtmlNode paramNode in item.SelectNodes("param"))
                                        {
                                            statementMap.DbParameters.Add(new DbParameterMap()
                                            {
                                                Name = paramNode.Attributes["id"].Value.ToString(),
                                                DbType = paramNode.Attributes["type"].Value.ToString(),
                                                Length = int.Parse(paramNode.Attributes["length"].Value.ToString()),
                                                DefaultValue = paramNode.Attributes["value"].Value.ToString(),
                                                TestValue = paramNode.Attributes["test"] == null ? "" : paramNode.Attributes["test"].Value.ToString(),
                                                Direction = paramNode.Attributes["direction"] == null ? "Input" : paramNode.Attributes["direction"].Value.ToString()
                                            });
                                        }
                                    }

                                    var children = new HtmlDocument();
                                    children.OptionDefaultStreamEncoding = Encoding.UTF8;
                                    children.LoadHtml(statementMap.SQL);
                                    statementMap.Chidren = children;

                                    string queryID = string.Concat(
                                        statementMap.ApplicationID, "|",
                                        statementMap.ProjectID, "|",
                                        statementMap.TransactionID, "|",
                                        statementMap.StatementID
                                    );

                                    lock (StatementMappings)
                                    {
                                        if (StatementMappings.ContainsKey(queryID) == false)
                                        {
                                            StatementMappings.Add(queryID, statementMap);
                                        }
                                        else
                                        {
                                            logger.Warning("[{LogCategory}] " + $"SqlMap 정보 중복 오류 - {sqlMapFile}, ApplicationID - {statementMap.ApplicationID}, ProjectID - {statementMap.ProjectID}, TransactionID - {statementMap.TransactionID}, StatementID - {statementMap.StatementID}", "DatabaseMapper/LoadContract");
                                        }
                                    }
                                }
                            }
                        }
                    }
                    catch (Exception exception)
                    {
                        logger.Error("[{LogCategory}] " + $"{sqlMapFile} 업무 계약 파일 오류 - " + exception.ToMessage(), "DatabaseMapper/LoadContract");
                    }
                }
            }
            catch (Exception exception)
            {
                logger.Error("[{LogCategory}] " + $"LoadContract 오류 - " + exception.ToMessage(), "DatabaseMapper/LoadContract");
            }
        }

        public static Dictionary<string, object?> ToParametersDictionary(this DynamicParameters dynamicParams)
        {
            var result = new Dictionary<string, object?>();
            var iLookup = (SqlMapper.IParameterLookup)dynamicParams;

            foreach (var paramName in dynamicParams.ParameterNames)
            {
                var value = iLookup[paramName];
                result.Add(paramName, value);
            }

            var templates = dynamicParams.GetType().GetField("templates", BindingFlags.NonPublic | BindingFlags.Instance);
            if (templates != null)
            {
                var list = templates.GetValue(dynamicParams) as List<Object>;
                if (list != null)
                {
                    foreach (var props in list.Select(obj => obj.GetPropertyValuePairs().ToList()))
                    {
                        props.ForEach(p => result.Add(p.Key, p.Value));
                    }
                }
            }
            return result;
        }

        public static Dictionary<string, object?> ToParametersDictionary(this SqlServerDynamicParameters dynamicParams)
        {
            var result = new Dictionary<string, object?>();
            var parameters = dynamicParams.sqlParameters;
            foreach (var item in parameters)
            {
                result.Add(item.ParameterName, item.Value);
            }
            return result;
        }

        public static Dictionary<string, object?> ToParametersDictionary(this OracleDynamicParameters dynamicParams)
        {
            var result = new Dictionary<string, object?>();
            var parameters = dynamicParams.oracleParameters;
            foreach (var item in parameters)
            {
                result.Add(item.ParameterName, item.Value);
            }
            return result;
        }

        public static Dictionary<string, object?> ToParametersDictionary(this MySqlDynamicParameters dynamicParams)
        {
            var result = new Dictionary<string, object?>();
            var parameters = dynamicParams.mysqlParameters;
            foreach (var item in parameters)
            {
                result.Add(item.ParameterName, item.Value);
            }
            return result;
        }

        public static Dictionary<string, object?> ToParametersDictionary(this NpgsqlDynamicParameters dynamicParams)
        {
            var result = new Dictionary<string, object?>();
            var parameters = dynamicParams.npgsqlParameters;
            foreach (var item in parameters)
            {
                result.Add(item.ParameterName, item.Value);
            }
            return result;
        }
    }

    [JsonObject(MemberSerialization.OptIn)]
    public class StatementMap
    {
        [JsonProperty]
        public string ApplicationID { get; set; }

        [JsonProperty]
        public string ProjectID { get; set; }

        [JsonProperty]
        public string TransactionID { get; set; }

        [JsonProperty]
        public string DataSourceID { get; set; }

        [JsonProperty]
        public string StatementID { get; set; }

        [JsonProperty]
        public int Seq { get; set; }

        [JsonProperty]
        public string Description { get; set; }

        [JsonProperty]
        public bool NativeDataClient { get; set; }

        [JsonProperty]
        public string SQL { get; set; }

        [JsonProperty]
        public bool TransactionLog { get; set; }

        [JsonProperty]
        public int Timeout { get; set; }

        [JsonProperty]
        public string BeforeTransactionCommand { get; set; }

        [JsonProperty]
        public string AfterTransactionCommand { get; set; }

        [JsonProperty]
        public string FallbackTransactionCommand { get; set; }

        [JsonProperty]
        public List<DbParameterMap> DbParameters { get; set; }

        public HtmlDocument Chidren { get; set; }

        [JsonProperty]
        public DateTime ModifiedDateTime { get; set; }

        public StatementMap()
        {
            ApplicationID = "";
            ProjectID = "";
            TransactionID = "";
            DataSourceID = "";
            StatementID = "";
            Seq = 0;
            Description = "";
            NativeDataClient = false;
            SQL = "";
            TransactionLog = false;
            Timeout = 0;
            BeforeTransactionCommand = "";
            AfterTransactionCommand = "";
            FallbackTransactionCommand = "";
            DbParameters = new List<DbParameterMap>();
            Chidren = new HtmlDocument();
            ModifiedDateTime = DateTime.MinValue;
        }
    }

    public class DataSourceMap
    {
        public DataProviders DataProvider { get; set; }

        public string ConnectionString { get; set; }

        public DataSourceMap()
        {
            DataProvider = DataProviders.SqlServer;
            ConnectionString = "";
        }
    }

    public class DbParameterMap
    {
        public string Name { get; set; }

        public string DefaultValue { get; set; }

        public string TestValue { get; set; }

        public string DbType { get; set; }

        public int Length { get; set; }

        public string Direction { get; set; }

        public DbParameterMap()
        {
            Name = "";
            DefaultValue = "";
            TestValue = "";
            DbType = "";
            Length = 0;
            Direction = "";
        }
    }
}
