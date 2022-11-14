using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml.Serialization;

using Dapper;

using dbclient.Encapsulation;
using dbclient.Entity;
using dbclient.Extensions;
using dbclient.NativeParameters;
using dbclient.Profiler;

using Microsoft.Extensions.Logging;

using MySql.Data.MySqlClient;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using NpgsqlTypes;

using Oracle.ManagedDataAccess.Client;

using HandStack.Core.ExtensionMethod;
using HandStack.Core.Extensions;
using HandStack.Core.Helpers;
using HandStack.Data;
using HandStack.Web;
using HandStack.Web.Entity;
using HandStack.Web.Extensions;
using HandStack.Web.MessageContract.DataObject;
using HandStack.Web.MessageContract.Enumeration;
using HandStack.Web.MessageContract.Message;

namespace dbclient.DataClient
{
    /// <code>
    /// using (QueryDataClient queryDataClient = new QueryDataClient())
    /// {
    ///     DynamicRequest dynamicRequest = new DynamicRequest();
    ///     DynamicResponse dynamicResponse = new DynamicResponse();
    ///     List<DynamicObject> dynamicObjects = new List<DynamicObject>();
    ///     
    ///     DynamicObject dynamicObject = new DynamicObject();
    ///     dynamicObject.QueryID = "DZAAA001L00"; // HELLOWORLDR01
    ///     
    ///     List<DynamicParameter> parameters = new List<DynamicParameter>();
    ///     parameters.Add("#ApplicationID", 0);
    ///     parameters.Add("@ApplicationID", 0);
    ///     parameters.Add("@BusinessID", 0);
    ///     parameters.Add("@CodeGroupID", "hello world");
    ///     
    ///     // dynamicObject.Parameters = parameters;
    ///     dynamicObjects.Add(dynamicObject);
    ///     
    ///     dynamicRequest.DynamicObjects = dynamicObjects;
    ///     
    ///     var dynamicConnection = queryDataClient.ExecuteConnectionSQLMap(dynamicRequest, dynamicResponse);
    ///     if (string.IsNullOrEmpty(dynamicResponse.ExceptionText) == true)
    ///     {
    ///       string sql = dynamicConnection.Item1;
    ///       var sqlParameters = dynamicConnection.Item2;
    ///       List<Client> clients = queryDataClient.DbConnection.Query<Client>(sql, sqlParameters).AsList();
    ///     
    ///       return clients;
    ///     }
    ///	    var dynamicResult = queryDataClient.ExecuteConnectionSQLMap("DZAAA001L00", parameters);
    ///	    if (string.IsNullOrEmpty(dynamicResult.ExceptionText) == true)
    ///	    {
    ///	    	List<DomainClient> clients = queryDataClient.DbConnection.Query<DomainClient>(dynamicResult.ParseSQL, dynamicResult.DynamicParameters).AsList();
    ///	    }
    /// }
    /// </code>
    public class QueryDataClient : IQueryDataClient
    {
        public DbConnection? DbConnection { get; private set; } = null;

        public IDbConnection? IDbConnection { get; private set; } = null;

        private Encoding encoding = Encoding.UTF8;

        private Serilog.ILogger logger { get; }

        private LoggerFactory loggerFactory { get; }

        private DbClientLoggerClient dbClientLoggerClient { get; }

        private BusinessApiClient businessApiClient { get; }

        public QueryDataClient(LoggerFactory loggerFactory, Serilog.ILogger logger, BusinessApiClient businessApiClient, DbClientLoggerClient dbClientLoggerClient)
        {
            this.loggerFactory = loggerFactory;
            this.logger = logger;
            this.businessApiClient = businessApiClient;
            this.dbClientLoggerClient = dbClientLoggerClient;
        }

        public DynamicResult ExecuteConnectionSQLMap(string queryID, List<DynamicParameter> parameters, bool paddingParameter = false)
        {
            DynamicRequest request = new DynamicRequest();
            DynamicResponse response = new DynamicResponse();
            List<DynamicObject> dynamicObjects = new List<DynamicObject>();

            dynamicObjects.Add(new DynamicObject() { QueryID = queryID, Parameters = parameters });

            request.DynamicObjects = dynamicObjects;

            DynamicResult result = new DynamicResult();
            Dictionary<string, TransactionDynamicObjects> transactionDynamicObjects = new Dictionary<string, TransactionDynamicObjects>();
            DatabaseFactory? databaseFactory;
            IDbTransaction? dbTransaction;
            Tuple<string, DataProviders>? connectionInfo = null;

            try
            {
                List<string> logQuerys = new List<string>();
                int i = 0;
                foreach (DynamicObject dynamicObject in request.DynamicObjects)
                {
                    StatementMap statementMap = DatabaseMapper.GetStatementMap(dynamicObject.QueryID);
                    if (statementMap == null)
                    {
                        result.ExceptionText = $"QueryID - {dynamicObject.QueryID}에 대한 매핑 정보 필요";
                        return result;
                    }

                    if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                    {
                        if (logQuerys.Contains(dynamicObject.QueryID) == false)
                        {
                            logQuerys.Add(dynamicObject.QueryID);
                        }
                    }

                    if (connectionInfo == null)
                    {
                        connectionInfo = GetConnectionInfomation(statementMap.ApplicationID, statementMap.ProjectID, statementMap.DataSourceID);
                    }

                    if (connectionInfo != null)
                    {
                        transactionDynamicObjects.Add(string.Concat(dynamicObject.QueryID, "_", i.ToString()), new TransactionDynamicObjects()
                        {
                            DynamicObject = dynamicObject,
                            StatementMap = statementMap,
                        });
                    }

                    i = i + 1;
                }

                if (logQuerys.Count > 0)
                {
                    if (ModuleConfiguration.IsTransactionLogging == true)
                    {
                        string logData = $"QueryID: {string.Join(", ", logQuerys.ToArray())}";
                        if (ModuleConfiguration.IsLogServer == true)
                        {
                            dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", GlobalConfiguration.SystemID, logData, "QueryDataClient/ExecuteConnectionSQLMap", (string error) =>
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteConnectionSQLMap", request.GlobalID);
                            });
                        }
                        else
                        {
                            logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteConnectionSQLMap", request.GlobalID);
                        }
                    }
                }

                if (connectionInfo == null)
                {
                    result.ExceptionText = $"{request.RequestID}에 대한 DataSourceID 데이터 원본 정보 필요";
                    return result;
                }

                var databaseProvider = connectionInfo.Item2;
                databaseFactory = new DatabaseFactory(connectionInfo.Item1, connectionInfo.Item2);

                if (databaseFactory == null)
                {
                    result.ExceptionText = $"{request.RequestID}에 대한 DataProvider: {connectionInfo.Item2} 데이터 제공자 정보 확인 필요";
                    return result;
                }

                if (request.IsTransaction == true)
                {
                    dbTransaction = databaseFactory.BeginTransaction();
                }

                i = 0;
                List<object> mergeDatas = new List<object>();
                foreach (var transactionDynamicObject in transactionDynamicObjects)
                {
                    DynamicObject? dynamicObject = transactionDynamicObject.Value.DynamicObject;
                    StatementMap? statementMap = transactionDynamicObject.Value.StatementMap;

                    if (dynamicObject == null || statementMap == null)
                    {
                        continue;
                    }

                    if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                    {
                        string SQLID = dynamicObject.QueryID + "_" + i.ToString();
                        string logData = $"SQLID: {SQLID}, ParseSQL Parameters: {JsonConvert.SerializeObject(dynamicObject)}";
                        if (ModuleConfiguration.IsLogServer == true)
                        {
                            dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteConnectionSQLMap", (string error) =>
                            {
                                logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteConnectionSQLMap");
                            });
                        }
                        else
                        {
                            logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteConnectionSQLMap", request.GlobalID);
                        }
                    }

                    string parseSQL = DatabaseMapper.Find(statementMap, dynamicObject);

                    dynamic? dynamicParameters = CreateDynamicParameters(databaseProvider, statementMap);
                    if (dynamicParameters != null && dynamicObject.Parameters != null)
                    {
                        List<DbParameterMap> dbParameterMaps = statementMap.DbParameters;
                        foreach (DbParameterMap dbParameterMap in dbParameterMaps)
                        {
                            DynamicParameter? dynamicParameter = GetDbParameterMap(dbParameterMap.Name, dynamicObject.Parameters);

                            if (dynamicParameter == null)
                            {
                                if (paddingParameter == true)
                                {
                                    dynamicParameter = new DynamicParameter()
                                    {
                                        ParameterName = dbParameterMap.Name,
                                        DbType = dbParameterMap.DbType,
                                        Value = null
                                    };
                                }
                                else
                                {
                                    result.ExceptionText = $"ParameterMap - {dbParameterMap.Name}에 대한 매핑 정보 필요";
                                    return result;
                                }
                            }

                            if (dynamicParameters != null)
                            {
                                dynamicParameters.Add(
                                    dynamicParameter.ParameterName,
                                    dynamicParameter.Value == null && dbParameterMap.DefaultValue != "NULL" ? dbParameterMap.DefaultValue : dynamicParameter.Value,
                                    (DbType)Enum.Parse(typeof(DbType), string.IsNullOrEmpty(dbParameterMap.DbType) == true ? dynamicParameter.DbType : dbParameterMap.DbType),
                                    (ParameterDirection)Enum.Parse(typeof(ParameterDirection), dbParameterMap.Direction),
                                    dbParameterMap.Length <= 0 ? -1 : dbParameterMap.Length
                                );
                            }
                        }
                    }

                    DbConnection = databaseFactory.Connection;
                    IDbConnection = databaseFactory.Connection;

                    result.ParseSQL = parseSQL;
                    result.DynamicParameters = dynamicParameters;

                    if (ModuleConfiguration.IsTransactionLogging == true)
                    {
                        string logData = $"QueryID: {queryID}, Result: {JsonConvert.SerializeObject(result)}";
                        if (ModuleConfiguration.IsLogServer == true)
                        {
                            dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", GlobalConfiguration.SystemID, logData, "QueryDataClient/ExecuteConnectionSQLMap", (string error) =>
                            {
                                logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteConnectionSQLMap");
                            });
                        }
                        else
                        {
                            logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteConnectionSQLMap", request.GlobalID);
                        }
                    }

                    response.Acknowledge = AcknowledgeType.Success;

                    return result;
                }
            }
            catch (Exception exception)
            {
                result.ExceptionText = exception.ToMessage();

                if (ModuleConfiguration.IsLogServer == true)
                {
                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, response.ExceptionText, "QueryDataClient/ExecuteConnectionSQLMap", (string error) =>
                    {
                        logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + response.ExceptionText, "QueryDataClient/ExecuteConnectionSQLMap");
                    });
                }
                else
                {
                    logger.Error("[{LogCategory}] [{GlobalID}] " + response.ExceptionText, "QueryDataClient/ExecuteConnectionSQLMap", request.GlobalID);
                }
            }

            return result;
        }

        public DynamicResult ExecuteConnectionSQLMap(DynamicRequest request, DynamicResponse response)
        {
            request.RequestID = request.RequestID == null ? "NULL" : request.RequestID;
            DynamicResult result = new DynamicResult();
            Dictionary<string, TransactionDynamicObjects> transactionDynamicObjects = new Dictionary<string, TransactionDynamicObjects>();
            DatabaseFactory? databaseFactory = null;
            IDbTransaction? dbTransaction = null;
            Tuple<string, DataProviders>? connectionInfo = null;

            try
            {
                List<string> logQuerys = new List<string>();
                int i = 0;
                foreach (DynamicObject dynamicObject in request.DynamicObjects)
                {
                    StatementMap statementMap = DatabaseMapper.GetStatementMap(dynamicObject.QueryID);
                    if (statementMap == null)
                    {
                        response.ExceptionText = $"QueryID - {dynamicObject.QueryID}에 대한 매핑 정보 필요";
                        return result;
                    }

                    if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                    {
                        if (logQuerys.Contains(dynamicObject.QueryID) == false)
                        {
                            logQuerys.Add(dynamicObject.QueryID);
                        }
                    }

                    if (connectionInfo == null)
                    {
                        connectionInfo = GetConnectionInfomation(statementMap.ApplicationID, statementMap.ProjectID, statementMap.DataSourceID);
                    }

                    transactionDynamicObjects.Add(string.Concat(dynamicObject.QueryID, "_", i.ToString()), new TransactionDynamicObjects()
                    {
                        DynamicObject = dynamicObject,
                        StatementMap = statementMap,
                    });

                    i = i + 1;
                }

                if (logQuerys.Count > 0)
                {
                    if (ModuleConfiguration.IsTransactionLogging == true)
                    {
                        string logData = $"QueryID: {string.Join(", ", logQuerys.ToArray())}";
                        if (ModuleConfiguration.IsLogServer == true)
                        {
                            dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", GlobalConfiguration.SystemID, logData, "QueryDataClient/ExecuteConnectionSQLMap", (string error) =>
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteConnectionSQLMap", request.GlobalID);
                            });
                        }
                        else
                        {
                            logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteConnectionSQLMap", request.GlobalID);
                        }
                    }
                }

                if (connectionInfo == null)
                {
                    result.ExceptionText = $"{request.RequestID}에 대한 DataSourceID 데이터 원본 정보 필요";
                    return result;
                }

                var databaseProvider = connectionInfo.Item2;
                databaseFactory = new DatabaseFactory(connectionInfo.Item1, connectionInfo.Item2);

                if (databaseFactory == null)
                {
                    result.ExceptionText = $"{request.RequestID}에 대한 DataProvider: {connectionInfo.Item2} 데이터 제공자 정보 확인 필요";
                    return result;
                }

                if (request.IsTransaction == true)
                {
                    dbTransaction = databaseFactory.BeginTransaction();
                }

                i = 0;
                List<object> mergeDatas = new List<object>();
                foreach (var transactionDynamicObject in transactionDynamicObjects)
                {
                    DynamicObject? dynamicObject = transactionDynamicObject.Value.DynamicObject;
                    StatementMap? statementMap = transactionDynamicObject.Value.StatementMap;

                    if (dynamicObject == null || statementMap == null)
                    {
                        continue;
                    }

                    if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                    {
                        string SQLID = dynamicObject.QueryID + "_" + i.ToString();
                        string logData = $"SQLID: {SQLID}, ParseSQL Parameters: {JsonConvert.SerializeObject(dynamicObject)}";
                        if (ModuleConfiguration.IsLogServer == true)
                        {
                            dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteConnectionSQLMap", (string error) =>
                            {
                                logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteConnectionSQLMap");
                            });
                        }
                        else
                        {
                            logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteConnectionSQLMap", request.GlobalID);
                        }
                    }

                    string parseSQL = DatabaseMapper.Find(statementMap, dynamicObject);

                    dynamic? dynamicParameters = CreateDynamicParameters(databaseProvider, statementMap);
                    if (dynamicParameters != null && dynamicObject.Parameters != null)
                    {
                        List<DbParameterMap> dbParameterMaps = statementMap.DbParameters;
                        foreach (DbParameterMap dbParameterMap in dbParameterMaps)
                        {
                            DynamicParameter? dynamicParameter = GetDbParameterMap(dbParameterMap.Name, dynamicObject.Parameters);

                            if (dynamicParameter == null)
                            {
                                response.ExceptionText = $"ParameterMap - {dbParameterMap.Name}에 대한 매핑 정보 필요";
                                return result;
                            }

                            if (dynamicParameters != null)
                            {
                                dynamicParameters.Add(
                                    dynamicParameter.ParameterName,
                                    dynamicParameter.Value == null && dbParameterMap.DefaultValue != "NULL" ? dbParameterMap.DefaultValue : dynamicParameter.Value,
                                    (DbType)Enum.Parse(typeof(DbType), string.IsNullOrEmpty(dbParameterMap.DbType) == true ? dynamicParameter.DbType : dbParameterMap.DbType),
                                    (ParameterDirection)Enum.Parse(typeof(ParameterDirection), dbParameterMap.Direction),
                                    dbParameterMap.Length <= 0 ? -1 : dbParameterMap.Length
                                );
                            }
                        }
                    }

                    DbConnection = databaseFactory.Connection;
                    IDbConnection = databaseFactory.Connection;

                    result.ParseSQL = parseSQL;
                    result.DynamicParameters = dynamicParameters;

                    if (ModuleConfiguration.IsTransactionLogging == true)
                    {
                        string logData = $"QueryID: {dynamicObject.QueryID}, Result: {JsonConvert.SerializeObject(result)}";
                        if (ModuleConfiguration.IsLogServer == true)
                        {
                            dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", GlobalConfiguration.SystemID, logData, "QueryDataClient/ExecuteConnectionSQLMap", (string error) =>
                            {
                                logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteConnectionSQLMap");
                            });
                        }
                        else
                        {
                            logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteConnectionSQLMap", request.GlobalID);
                        }
                    }

                    response.Acknowledge = AcknowledgeType.Success;

                    return result;
                }
            }
            catch (Exception exception)
            {
                response.ExceptionText = exception.ToMessage();

                if (ModuleConfiguration.IsLogServer == true)
                {
                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, response.ExceptionText, "QueryDataClient/ExecuteConnectionSQLMap", (string error) =>
                    {
                        logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + response.ExceptionText, "QueryDataClient/ExecuteConnectionSQLMap");
                    });
                }
                else
                {
                    logger.Error("[{LogCategory}] [{GlobalID}] " + response.ExceptionText, "QueryDataClient/ExecuteConnectionSQLMap", request.GlobalID);
                }
            }

            return result;
        }

        public void ExecuteDynamicSQLMap(DynamicRequest request, DynamicResponse response)
        {
            request.RequestID = request.RequestID == null ? "NULL" : request.RequestID;
            Dictionary<string, TransactionDynamicObjects> transactionDynamicObjects = new Dictionary<string, TransactionDynamicObjects>();
            DatabaseFactory? databaseFactory = null;
            IDbTransaction? dbTransaction = null;
            Tuple<string, DataProviders>? connectionInfo = null;

            try
            {
                List<string> logQuerys = new List<string>();
                int i = 0;
                foreach (DynamicObject dynamicObject in request.DynamicObjects)
                {
                    StatementMap statementMap = DatabaseMapper.GetStatementMap(dynamicObject.QueryID);
                    if (statementMap == null)
                    {
                        response.ExceptionText = $"QueryID - {dynamicObject.QueryID}에 대한 매핑 정보 필요";
                        return;
                    }

                    if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                    {
                        if (logQuerys.Contains(dynamicObject.QueryID) == false)
                        {
                            logQuerys.Add(dynamicObject.QueryID);
                        }
                    }

                    if (connectionInfo == null)
                    {
                        connectionInfo = GetConnectionInfomation(statementMap.ApplicationID, statementMap.ProjectID, statementMap.DataSourceID);
                    }

                    transactionDynamicObjects.Add(string.Concat(dynamicObject.QueryID, "_", i.ToString()), new TransactionDynamicObjects()
                    {
                        DynamicObject = dynamicObject,
                        StatementMap = statementMap
                    });

                    i = i + 1;
                }

                if (logQuerys.Count > 0)
                {
                    if (ModuleConfiguration.IsTransactionLogging == true)
                    {
                        string logData = $"QueryID: {string.Join(", ", logQuerys.ToArray())}";
                        if (ModuleConfiguration.IsLogServer == true)
                        {
                            dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", GlobalConfiguration.SystemID, logData, "QueryDataClient/ExecuteDynamicSQLMap", (string error) =>
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLMap", request.GlobalID);
                            });
                        }
                        else
                        {
                            logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLMap", request.GlobalID);
                        }
                    }
                }

                if (connectionInfo == null)
                {
                    response.ExceptionText = $"{request.RequestID}에 대한 DataSourceID 데이터 원본 정보 필요";
                    return;
                }

                var databaseProvider = connectionInfo.Item2;
                databaseFactory = new DatabaseFactory(connectionInfo.Item1, connectionInfo.Item2);

                if (databaseFactory == null)
                {
                    response.ExceptionText = $"{request.RequestID}에 대한 DataProvider: {connectionInfo.Item2} 데이터 제공자 정보 확인 필요";
                    return;
                }

                if (request.IsTransaction == true)
                {
                    dbTransaction = databaseFactory.BeginTransaction();
                }

                i = 0;

                Dictionary<int, DataRow?> dataRows = new Dictionary<int, DataRow?>();
                DataTable additionalData = new DataTable();
                additionalData.Columns.Add("MSG_CD", typeof(string));
                additionalData.Columns.Add("MSG_TXT", typeof(string));
                List<string> mergeMetaDatas = new List<string>();
                List<object> mergeDatas = new List<object>();
                foreach (var transactionDynamicObject in transactionDynamicObjects)
                {
                    DynamicObject? dynamicObject = transactionDynamicObject.Value.DynamicObject;
                    StatementMap? statementMap = transactionDynamicObject.Value.StatementMap;

                    if (dynamicObject == null || statementMap == null)
                    {
                        continue;
                    }

                    dynamic? dynamicParameters = CreateDynamicParameters(databaseProvider, statementMap);
                    if (dynamicParameters != null && dynamicObject.Parameters.Count() > 0)
                    {
                        if (dynamicObject.BaseFieldMappings != null && dynamicObject.BaseFieldMappings.Count() > 0)
                        {
                            int baseSequence = statementMap.Seq - 1;
                            DataRow? dataRow = null;
                            if (dataRows.Count > 0 && statementMap.Seq > 0)
                            {
                                dataRow = dataRows.GetValueOrDefault(baseSequence);
                            }

                            for (int baseFieldIndex = 0; baseFieldIndex < dynamicObject.BaseFieldMappings.Count; baseFieldIndex++)
                            {
                                BaseFieldMapping baseFieldMapping = dynamicObject.BaseFieldMappings[baseFieldIndex];

                                if (string.IsNullOrEmpty(baseFieldMapping.BaseSequence) == false)
                                {
                                    int baseSequenceMapping = int.Parse(baseFieldMapping.BaseSequence);
                                    if (baseSequence != baseSequenceMapping)
                                    {
                                        baseSequence = baseSequenceMapping;
                                        dataRow = dataRows.GetValueOrDefault(baseSequence);
                                    }
                                }

                                if (dataRow == null)
                                {
                                    response.ExceptionText = $"BaseFieldMappings - QueryID: '{dynamicObject.QueryID}', Sequence: '{baseSequence}'에 대한 매핑 정보 필요";
                                    return;
                                }

                                if (dataRow[baseFieldMapping.SourceFieldID] == null)
                                {
                                    response.ExceptionText = $"BaseFieldMappings - QueryID: '{dynamicObject.QueryID}', Sequence: '{baseSequence}'에 대한 SourceFieldID {baseFieldMapping.SourceFieldID} 컬럼 정보 필요";
                                    return;
                                }

                                DynamicParameter? dynamicParameter = dynamicObject.Parameters.Where(p => p.ParameterName == baseFieldMapping.TargetFieldID).FirstOrDefault();

                                if (dynamicParameter == null)
                                {
                                    response.ExceptionText = $"BaseFieldMappings - {dynamicObject.QueryID}에 대한 TargetFieldID {baseFieldMapping.SourceFieldID} 컬럼 정보 필요";
                                    return;
                                }

                                dynamicParameter.Value = dataRow[baseFieldMapping.SourceFieldID];
                            }
                        }

                        SetDbParameterMapping(databaseFactory, databaseProvider, dynamicObject, statementMap, dynamicParameters);
                    }
                    else
                    {
                        SetDbParameterMapping(databaseFactory, databaseProvider, dynamicObject, statementMap, dynamicParameters);
                    }

                    string SQLID = string.Empty;
                    string executeDataID = dynamicObject.QueryID + "_" + i.ToString();

                    if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                    {
                        string logData = $"Pretreatment: {executeDataID}, ParseSQL Parameters: {JsonConvert.SerializeObject(dynamicObject)}";
                        if (ModuleConfiguration.IsLogServer == true)
                        {
                            dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLMap", (string error) =>
                            {
                                logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLMap");
                            });
                        }
                        else
                        {
                            logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLMap", request.GlobalID);
                        }
                    }

                    var pretreatment = DatabaseMapper.FindPretreatment(statementMap, dynamicObject);
                    if (pretreatment.SQL != null && pretreatment.ResultType != null)
                    {
                        if (pretreatment.SQL.Replace(Environment.NewLine, "").Replace("\t", "").Trim() != "")
                        {
                            SQLID = executeDataID + "_pretreatment";

                            if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                            {
                                string logData = $"SQLID: {SQLID}, Parameters: {JsonConvert.SerializeObject(dynamicParameters)}";
                                if (ModuleConfiguration.IsLogServer == true)
                                {
                                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLMap", (string error) =>
                                    {
                                        logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLMap");
                                    });
                                }
                                else
                                {
                                    logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLMap", request.GlobalID);
                                }
                            }

                            ConsoleProfiler consoleProfiler = new ConsoleProfiler(request.RequestID, SQLID, ModuleConfiguration.IsTransactionLogging == true ? ModuleConfiguration.TransactionLogFilePath : null);
                            var preConnection = new ProfilerDbConnection(databaseFactory.Connection, consoleProfiler);

                            IDataReader? preReader = null;

                            try
                            {
                                preReader = preConnection.ExecuteReader(pretreatment.SQL, dynamicParameters as SqlMapper.IDynamicParameters, dbTransaction, statementMap.Timeout < 0 ? ModuleConfiguration.DefaultCommandTimeout : statementMap.Timeout);

                                string logData = $"SQLID: {SQLID}, ExecuteSQL: {consoleProfiler.ExecuteSQL}";
                                if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                                {
                                    if (ModuleConfiguration.IsLogServer == true)
                                    {
                                        dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLMap", (string error) =>
                                        {
                                            logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLMap");
                                        });
                                    }
                                    else
                                    {
                                        logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLMap", request.GlobalID);
                                    }
                                }
                            }
                            catch (Exception exception)
                            {
                                if (request.IsTransaction == true)
                                {
                                    databaseFactory.RollbackTransaction();
                                }

                                response.ExceptionText = $"SQLID: {SQLID}, ExecuteSQL: {consoleProfiler.ExecuteSQL}, ExceptionText: {exception.ToMessage()}";

                                if (ModuleConfiguration.IsLogServer == true)
                                {
                                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, response.ExceptionText, "QueryDataClient/ExecuteDynamicSQLMap", (string error) =>
                                    {
                                        logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + response.ExceptionText, "QueryDataClient/ExecuteDynamicSQLMap");
                                    });
                                }
                                else
                                {
                                    logger.Error("[{LogCategory}] [{GlobalID}] " + response.ExceptionText, "QueryDataClient/ExecuteDynamicSQLMap", request.GlobalID);
                                }

                                if (preReader != null)
                                {
                                    preReader.Close();
                                }

                                if (preConnection.IsConnectionOpen() == true)
                                {
                                    preConnection.Close();
                                }

                                return;
                            }

                            using (DataSet? ds = DataTableHelper.DataReaderToDataSet(preReader))
                            {
                                var resultTypes = pretreatment.ResultType.Split(",");
                                if (ds == null || resultTypes.Count() != ds.Tables.Count)
                                {
                                    response.ExceptionText = $"Pretreatment - 전처리 쿼리 실행 결과와 {pretreatment.ResultType} 설정 확인 필요";
                                    return;
                                }

                                for (int j = 0; j < ds.Tables.Count; j++)
                                {
                                    string resultType = resultTypes[j].Trim();
                                    DataTable table = ds.Tables[j];

                                    if (resultType == "Row")
                                    {
                                        DataRow rowItem = table.Rows[0];
                                        DataColumnCollection colItems = table.Columns;
                                        foreach (DataColumn item in colItems)
                                        {
                                            PretreatmentAddParameter(databaseProvider, statementMap, dynamicParameters, rowItem, item);

                                            DynamicParameter? dynamicParameter = dynamicObject.Parameters.Where(p => p.ParameterName == item.ColumnName).FirstOrDefault();

                                            if (dynamicParameter == null)
                                            {
                                                DataProviders? dataProvider = null;
                                                if (statementMap.NativeDataClient == true)
                                                {
                                                    dataProvider = databaseProvider;
                                                }

                                                dynamicParameter = new DynamicParameter();
                                                dynamicParameter.ParameterName = item.ColumnName;
                                                dynamicParameter.Length = item.MaxLength;
                                                dynamicParameter.DbType = GetProviderDbType(item, dataProvider);
                                                dynamicParameter.Value = rowItem[item.ColumnName];
                                                dynamicObject.Parameters.Add(dynamicParameter);
                                            }
                                            else
                                            {
                                                dynamicParameter.Value = rowItem[item.ColumnName];
                                            }
                                        }
                                    }
                                    else if (resultType == "List")
                                    {
                                        List<object> parameters = new List<object>();
                                        DataColumnCollection colItems = table.Columns;
                                        foreach (DataColumn item in colItems)
                                        {
                                            DataView dataView = new DataView(table);
                                            DataTable dataTable = dataView.ToTable(true, item.ColumnName);
                                            foreach (DataRow row in dataTable.Rows)
                                            {
                                                parameters.Add(row[0]);
                                            }

                                            if (parameters.Count > 0)
                                            {
                                                if (dynamicParameters != null)
                                                {
                                                    dynamicParameters.Add(item.ColumnName, parameters);
                                                }

                                                DynamicParameter? dynamicParameter = dynamicObject.Parameters.Where(p => p.ParameterName == item.ColumnName).FirstOrDefault();

                                                if (dynamicParameter == null)
                                                {
                                                    DataProviders? dataProvider = null;
                                                    if (statementMap.NativeDataClient == true)
                                                    {
                                                        dataProvider = databaseProvider;
                                                    }

                                                    dynamicParameter = new DynamicParameter();
                                                    dynamicParameter.ParameterName = item.ColumnName;
                                                    dynamicParameter.Length = item.MaxLength;
                                                    dynamicParameter.DbType = GetProviderDbType(item, dataProvider);
                                                    dynamicParameter.Value = parameters;
                                                    dynamicObject.Parameters.Add(dynamicParameter);
                                                }
                                                else
                                                {
                                                    dynamicParameter.Value = parameters;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (string.IsNullOrEmpty(statementMap.BeforeTransactionCommand) == false)
                    {
                        string logData = "";
                        if (ModuleConfiguration.IsTransactionLogging == true)
                        {
                            logData = $"GlobalID={request.GlobalID}, QueryID={dynamicObject.QueryID}, CommandID={statementMap.BeforeTransactionCommand}, , dynamicParameters={JsonConvert.SerializeObject(dynamicParameters)}";
                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", GlobalConfiguration.SystemID, logData, $"ExecuteDynamicSQLMap/BeforeTransactionCommand", (string error) =>
                                {
                                    logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "ExecuteDynamicSQLMap/BeforeTransactionCommand");
                                });
                            }
                            else
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "ExecuteDynamicSQLMap/BeforeTransactionCommand", request.GlobalID);
                            }
                        }

                        var transactionCommands = statementMap.BeforeTransactionCommand.Split("|");
                        BusinessApiClient businessApiClient = new BusinessApiClient(logger);
                        string? beforeCommandResult = businessApiClient.OnewayTransactionCommand(transactionCommands, request.GlobalID, dynamicObject.QueryID, dynamicParameters);
                        if (string.IsNullOrEmpty(beforeCommandResult) == false)
                        {
                            response.ExceptionText = $"ExecuteDynamicSQLMap.BeforeTransactionCommand Error: {beforeCommandResult}";

                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, $"{response.ExceptionText}, {logData}", $"ExecuteDynamicSQLMap/BeforeTransactionCommand", (string error) =>
                                {
                                    logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + $"{response.ExceptionText}, {logData}", "ExecuteDynamicSQLMap/BeforeTransactionCommand");
                                });
                            }
                            else
                            {
                                logger.Error("[{LogCategory}] [{GlobalID}] " + $"{response.ExceptionText}, {logData}", "ExecuteDynamicSQLMap/BeforeTransactionCommand", request.GlobalID);
                            }

                            return;
                        }
                    }

                    SQLID = executeDataID + "_statement";
                    ConsoleProfiler profiler = new ConsoleProfiler(request.RequestID, executeDataID, ModuleConfiguration.IsTransactionLogging == true ? ModuleConfiguration.TransactionLogFilePath : null);
                    IDataReader? reader = null;
                    try
                    {
                        if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                        {
                            string logData = $"SQLID: {SQLID}, ParseSQL Parameters: {JsonConvert.SerializeObject(dynamicObject)}";
                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLMap", (string error) =>
                                {
                                    logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLMap");
                                });
                            }
                            else
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLMap", request.GlobalID);
                            }
                        }

                        string parseSQL = DatabaseMapper.Find(statementMap, dynamicObject);
                        if (string.IsNullOrEmpty(parseSQL) == true || parseSQL.Replace(Environment.NewLine, "").Replace("\t", "").Trim() == "")
                        {
                            if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                            {
                                string logData = $"SQLID: {SQLID}, Parameters: {JsonConvert.SerializeObject(dynamicParameters)}";
                                if (ModuleConfiguration.IsLogServer == true)
                                {
                                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLMap", (string error) =>
                                    {
                                        logger.Information("[{LogCategory}] " + "fallback error: " + error + ", empty SQL passing" + logData, "QueryDataClient/ExecuteDynamicSQLMap");
                                    });
                                }
                                else
                                {
                                    logger.Information("[{LogCategory}] [{GlobalID}] empty SQL passing" + logData, "QueryDataClient/ExecuteDynamicSQLMap", request.GlobalID);
                                }
                            }

                            continue;
                        }

                        if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                        {
                            string logData = $"SQLID: {SQLID}, Parameters: {JsonConvert.SerializeObject(dynamicParameters)}";
                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLMap", (string error) =>
                                {
                                    logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLMap");
                                });
                            }
                            else
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLMap", request.GlobalID);
                            }
                        }

                        var connection = new ProfilerDbConnection(databaseFactory.Connection, profiler);

                        try
                        {
                            reader = connection.ExecuteReader(parseSQL, dynamicParameters as SqlMapper.IDynamicParameters, dbTransaction, statementMap.Timeout < 0 ? ModuleConfiguration.DefaultCommandTimeout : statementMap.Timeout);
                        }
                        catch
                        {
                            if (reader != null && reader.IsClosed == false)
                            {
                                reader.Close();
                            }

                            if (connection.IsConnectionOpen() == true)
                            {
                                connection.Close();
                            }
                            throw;
                        }

                        if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                        {
                            string logData = $"SQLID: {SQLID}, ExecuteSQL: {profiler.ExecuteSQL}";
                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLMap", (string error) =>
                                {
                                    logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLMap");
                                });
                            }
                            else
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLMap", request.GlobalID);
                            }
                        }
                    }
                    catch (Exception exception)
                    {
                        if (request.IsTransaction == true)
                        {
                            databaseFactory.RollbackTransaction();
                        }

                        response.ExceptionText = exception.ToMessage();
                        string logData = $"SQLID: {SQLID}, ExecuteSQL: {profiler.ExecuteSQL}, ExceptionText: {response.ExceptionText}";

                        if (ModuleConfiguration.IsLogServer == true)
                        {
                            dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLMap", (string error) =>
                            {
                                logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLMap");
                            });
                        }
                        else
                        {
                            logger.Error("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLMap", request.GlobalID);
                        }

                        if (string.IsNullOrEmpty(statementMap.FallbackTransactionCommand) == false)
                        {
                            logData = $"GlobalID={request.GlobalID}, QueryID={dynamicObject.QueryID}, FallbackTransactionCommand: {statementMap.FallbackTransactionCommand}, dynamicParameters={JsonConvert.SerializeObject(dynamicParameters)}";
                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", GlobalConfiguration.SystemID, logData, "QueryDataClient/FallbackTransactionCommand", (string error) =>
                                {
                                    logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/FallbackTransactionCommand");
                                });
                            }
                            else
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/FallbackTransactionCommand", request.GlobalID);
                            }

                            var transactionCommands = statementMap.FallbackTransactionCommand.Split("|");
                            BusinessApiClient businessApiClient = new BusinessApiClient(logger);
                            string? fallbackCommandResult = businessApiClient.OnewayTransactionCommandAsync(transactionCommands, request.GlobalID, dynamicObject.QueryID, dynamicParameters);
                            if (string.IsNullOrEmpty(fallbackCommandResult) == false)
                            {
                                response.ExceptionText = response.ExceptionText + $", ExecuteDynamicSQLMap.FallbackTransactionCommand Error: {fallbackCommandResult}";

                                if (ModuleConfiguration.IsLogServer == true)
                                {
                                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, $"{response.ExceptionText}, {logData}", $"QueryDataClient/FallbackTransactionCommand", (string error) =>
                                    {
                                        logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + $"{response.ExceptionText}, {logData}", "QueryDataClient/FallbackTransactionCommand");
                                    });
                                }
                                else
                                {
                                    logger.Error("[{LogCategory}] [{GlobalID}] " + $"{response.ExceptionText}, {logData}", "QueryDataClient/FallbackTransactionCommand", request.GlobalID);
                                }

                                return;
                            }
                        }
                    }
                    finally
                    {
                        if (string.IsNullOrEmpty(response.ExceptionText) == false)
                        {
                            if (reader != null)
                            {
                                if (reader.IsClosed == false)
                                {
                                    reader.Close();
                                }
                                reader.Dispose();
                            }
                        }
                    }

                    if (string.IsNullOrEmpty(response.ExceptionText) == true)
                    {
                        if (string.IsNullOrEmpty(statementMap.AfterTransactionCommand) == false)
                        {
                            var transactionCommands = statementMap.AfterTransactionCommand.Split("|");
                            BusinessApiClient businessApiClient = new BusinessApiClient(logger);
                            string? afterCommandResult = businessApiClient.OnewayTransactionCommandAsync(transactionCommands, request.GlobalID, dynamicObject.QueryID, dynamicParameters);
                            if (string.IsNullOrEmpty(afterCommandResult) == false)
                            {
                                response.ExceptionText = $"ExecuteDynamicSQLMap.AfterTransactionCommand Error: GlobalID={request.GlobalID}, QueryID={dynamicObject.QueryID}, CommandID={statementMap.AfterTransactionCommand}, CommandResult={afterCommandResult}";
                                return;
                            }
                        }
                    }
                    else
                    {
                        return;
                    }

                    if (dynamicObject.IgnoreResult == true)
                    {
                        using (DataTable dataTable = new DataTable())
                        using (DataTable? schemaTable = reader?.GetSchemaTable())
                        {
                            if (schemaTable == null)
                            {
                                continue;
                            }

                            DataRow row;

                            string columnName;
                            DataColumn column;
                            int count = schemaTable.Rows.Count;

                            for (int j = 0; j < count; j++)
                            {
                                row = schemaTable.Rows[j];
                                columnName = (string)row["ColumnName"];

                                column = new DataColumn(columnName, (Type)row["DataType"]);
                                dataTable.Columns.Add(column);
                            }

                            object[] values = new object[count];

                            if (reader != null)
                            {
                                try
                                {
                                    dataTable.BeginLoadData();
                                    while (reader.Read())
                                    {
                                        reader.GetValues(values);
                                        dataTable.LoadDataRow(values, true);
                                    }
                                }
                                catch (Exception exception)
                                {
                                    if (reader.IsClosed == false)
                                    {
                                        reader.Close();
                                    }
                                    logger.Error("[{LogCategory}] [{GlobalID}] " + exception.ToMessage(), "QueryDataClient/ExecuteDynamicSQLMap", request.GlobalID);
                                    throw;
                                }
                                finally
                                {
                                    dataTable.EndLoadData();
                                    reader.Close();
                                }
                            }

                            if (dataTable.Rows.Count > 0)
                            {
                                dataRows[statementMap.Seq] = dataTable.Rows[dataTable.Rows.Count - 1];
                            }
                            else
                            {
                                dataRows[statementMap.Seq] = null;
                            }
                        }
                    }
                    else
                    {
                        using (DataSet? ds = DataTableHelper.DataReaderToDataSet(reader))
                        {
                            if (ds != null)
                            {
                                JsonObjectType jsonObjectType = JsonObjectType.FormJson;

                                for (int j = 0; j < ds.Tables.Count; j++)
                                {
                                    DataTable table = ds.Tables[j];

                                    if (dynamicObject.JsonObjects == null || dynamicObject.JsonObjects.Count == 0)
                                    {
                                        jsonObjectType = dynamicObject.JsonObject;
                                    }
                                    else
                                    {
                                        try
                                        {
                                            jsonObjectType = dynamicObject.JsonObjects[i];
                                        }
                                        catch
                                        {
                                            jsonObjectType = dynamicObject.JsonObject;
                                        }
                                    }

                                    StringBuilder sb = new StringBuilder(256);
                                    for (int k = 0; k < table.Columns.Count; k++)
                                    {
                                        var column = table.Columns[k];
                                        sb.Append($"{column.ColumnName}:{JsonExtensions.toMetaDataType(column.DataType.Name)};");
                                    }

                                    switch (jsonObjectType)
                                    {
                                        case JsonObjectType.FormJson:
                                            mergeMetaDatas.Add(sb.ToString());
                                            mergeDatas.Add(FormJson.ToJsonObject("FormData" + i.ToString(), table));
                                            break;
                                        case JsonObjectType.jqGridJson:
                                            mergeMetaDatas.Add(sb.ToString());
                                            mergeDatas.Add(jqGridJson.ToJsonObject("jqGridData" + i.ToString(), table));
                                            break;
                                        case JsonObjectType.GridJson:
                                            mergeMetaDatas.Add(sb.ToString());
                                            mergeDatas.Add(GridJson.ToJsonObject("GridData" + i.ToString(), table));
                                            break;
                                        case JsonObjectType.ChartJson:
                                            mergeMetaDatas.Add(sb.ToString());
                                            mergeDatas.Add(ChartGridJson.ToJsonObject("ChartData" + i.ToString(), table));
                                            break;
                                        case JsonObjectType.DataSetJson:
                                            mergeMetaDatas.Add(sb.ToString());
                                            mergeDatas.Add(DataTableJson.ToJsonObject("DataSetData" + i.ToString(), table));
                                            break;
                                        case JsonObjectType.AdditionJson:
                                            additionalData.Merge(table);
                                            break;
                                    }

                                    if (table.Rows.Count > 0)
                                    {
                                        dataRows[statementMap.Seq] = table.Rows[table.Rows.Count - 1];
                                    }
                                    else
                                    {
                                        dataRows[statementMap.Seq] = null;
                                    }

                                    i++;
                                }
                            }
                        }

                        if (reader != null)
                        {
                            reader.Close();
                        }
                    }
                }

                if (request.IsTransaction == true)
                {
                    databaseFactory.CommitTransaction();
                }

                if (additionalData.Rows.Count > 0)
                {
                    mergeDatas.Add(GridJson.ToJsonObject("AdditionalData", additionalData));
                }

                response.ResultMeta = mergeMetaDatas;
                response.ResultJson = mergeDatas;
                response.Acknowledge = AcknowledgeType.Success;
            }
            catch (Exception exception)
            {
                if (request.IsTransaction == true)
                {
                    if (databaseFactory != null)
                    {
                        databaseFactory.RollbackTransaction();
                    }
                }

                response.ExceptionText = exception.ToMessage();
                if (ModuleConfiguration.IsLogServer == true)
                {
                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, response.ExceptionText, "QueryDataClient/ExecuteDynamicSQLMap", (string error) =>
                    {
                        logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + response.ExceptionText, "QueryDataClient/ExecuteDynamicSQLMap");
                    });
                }
                else
                {
                    logger.Error("[{LogCategory}] [{GlobalID}] " + response.ExceptionText, "QueryDataClient/ExecuteDynamicSQLMap", request.GlobalID);
                }
            }
            finally
            {
                databaseFactory?.Connection?.Close();
                databaseFactory?.Dispose();
            }
        }

        public void ExecuteDynamicSQLMapToScalar(DynamicRequest request, DynamicResponse response)
        {
            request.RequestID = request.RequestID == null ? "NULL" : request.RequestID;
            Dictionary<string, TransactionDynamicObjects> transactionDynamicObjects = new Dictionary<string, TransactionDynamicObjects>();
            DatabaseFactory? databaseFactory = null;
            IDbTransaction? dbTransaction = null;
            Tuple<string, DataProviders>? connectionInfo = null;

            try
            {
                List<string> logQuerys = new List<string>();
                int i = 0;
                foreach (DynamicObject dynamicObject in request.DynamicObjects)
                {
                    StatementMap statementMap = DatabaseMapper.GetStatementMap(dynamicObject.QueryID);
                    if (statementMap == null)
                    {
                        response.ExceptionText = $"QueryID - {dynamicObject.QueryID}에 대한 매핑 정보 필요";
                        return;
                    }

                    if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                    {
                        if (logQuerys.Contains(dynamicObject.QueryID) == false)
                        {
                            logQuerys.Add(dynamicObject.QueryID);
                        }
                    }

                    if (connectionInfo == null)
                    {
                        connectionInfo = GetConnectionInfomation(statementMap.ApplicationID, statementMap.ProjectID, statementMap.DataSourceID);
                    }

                    transactionDynamicObjects.Add(string.Concat(dynamicObject.QueryID, "_", i.ToString()), new TransactionDynamicObjects()
                    {
                        DynamicObject = dynamicObject,
                        StatementMap = statementMap
                    });

                    i = i + 1;
                }

                if (logQuerys.Count > 0)
                {
                    if (ModuleConfiguration.IsTransactionLogging == true)
                    {
                        string logData = $"QueryID: {string.Join(", ", logQuerys.ToArray())}";
                        if (ModuleConfiguration.IsLogServer == true)
                        {
                            dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", GlobalConfiguration.SystemID, logData, "QueryDataClient/ExecuteDynamicSQLMapToScalar", (string error) =>
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLMapToScalar", request.GlobalID);
                            });
                        }
                        else
                        {
                            logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLMapToScalar", request.GlobalID);
                        }
                    }
                }

                if (connectionInfo == null)
                {
                    response.ExceptionText = $"{request.RequestID}에 대한 DataSourceID 데이터 원본 정보 필요";
                    return;
                }

                var databaseProvider = connectionInfo.Item2;
                databaseFactory = new DatabaseFactory(connectionInfo.Item1, connectionInfo.Item2);

                if (databaseFactory == null)
                {
                    response.ExceptionText = $"{request.RequestID}에 대한 DataProvider: {connectionInfo.Item2} 데이터 제공자 정보 확인 필요";
                    return;
                }

                if (request.IsTransaction == true)
                {
                    dbTransaction = databaseFactory.BeginTransaction();
                }

                i = 0;
                Dictionary<int, DataRow?> dataRows = new Dictionary<int, DataRow?>();
                DataTable additionalData = new DataTable();
                additionalData.Columns.Add("MSG_CD", typeof(string));
                additionalData.Columns.Add("MSG_TXT", typeof(string));
                object? result = null;
                foreach (var transactionDynamicObject in transactionDynamicObjects)
                {
                    DynamicObject? dynamicObject = transactionDynamicObject.Value.DynamicObject;
                    StatementMap? statementMap = transactionDynamicObject.Value.StatementMap;

                    if (dynamicObject == null || statementMap == null)
                    {
                        continue;
                    }

                    dynamic? dynamicParameters = CreateDynamicParameters(databaseProvider, statementMap);
                    if (dynamicParameters != null && dynamicObject.Parameters.Count() > 0)
                    {
                        if (dynamicObject.BaseFieldMappings != null && dynamicObject.BaseFieldMappings.Count() > 0)
                        {
                            int baseSequence = statementMap.Seq - 1;
                            DataRow? dataRow = null;
                            if (dataRows.Count > 0 && statementMap.Seq > 0)
                            {
                                dataRow = dataRows.GetValueOrDefault(baseSequence);
                            }

                            for (int baseFieldIndex = 0; baseFieldIndex < dynamicObject.BaseFieldMappings.Count; baseFieldIndex++)
                            {
                                BaseFieldMapping baseFieldMapping = dynamicObject.BaseFieldMappings[baseFieldIndex];

                                if (string.IsNullOrEmpty(baseFieldMapping.BaseSequence) == false)
                                {
                                    int baseSequenceMapping = int.Parse(baseFieldMapping.BaseSequence);
                                    if (baseSequence != baseSequenceMapping)
                                    {
                                        baseSequence = baseSequenceMapping;
                                        dataRow = dataRows.GetValueOrDefault(baseSequence);
                                    }
                                }

                                if (dataRow == null)
                                {
                                    response.ExceptionText = $"BaseFieldMappings - QueryID: '{dynamicObject.QueryID}', Sequence: '{baseSequence}'에 대한 매핑 정보 필요";
                                    return;
                                }

                                if (dataRow[baseFieldMapping.SourceFieldID] == null)
                                {
                                    response.ExceptionText = $"BaseFieldMappings - QueryID: '{dynamicObject.QueryID}', Sequence: '{baseSequence}'에 대한 SourceFieldID {baseFieldMapping.SourceFieldID} 컬럼 정보 필요";
                                    return;
                                }

                                DynamicParameter? dynamicParameter = dynamicObject.Parameters.Where(p => p.ParameterName == baseFieldMapping.TargetFieldID).FirstOrDefault();

                                if (dynamicParameter == null)
                                {
                                    response.ExceptionText = $"BaseFieldMappings - {dynamicObject.QueryID}에 대한 TargetFieldID {baseFieldMapping.SourceFieldID} 컬럼 정보 필요";
                                    return;
                                }

                                dynamicParameter.Value = dataRow[baseFieldMapping.SourceFieldID];
                            }
                        }

                        SetDbParameterMapping(databaseFactory, databaseProvider, dynamicObject, statementMap, dynamicParameters);
                    }
                    else
                    {
                        SetDbParameterMapping(databaseFactory, databaseProvider, dynamicObject, statementMap, dynamicParameters);
                    }

                    string SQLID = string.Empty;
                    string executeDataID = dynamicObject.QueryID + "_" + i.ToString();

                    if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                    {
                        string logData = $"Pretreatment {executeDataID}, ParseSQL Parameters: {JsonConvert.SerializeObject(dynamicObject)}";
                        if (ModuleConfiguration.IsLogServer == true)
                        {
                            dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLToScalar", (string error) =>
                            {
                                logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLToScalar");
                            });
                        }
                        else
                        {
                            logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLToScalar", request.GlobalID);
                        }
                    }

                    var pretreatment = DatabaseMapper.FindPretreatment(statementMap, dynamicObject);
                    if (pretreatment.SQL != null && pretreatment.ResultType != null)
                    {
                        if (pretreatment.SQL.Replace(Environment.NewLine, "").Replace("\t", "").Trim() != "")
                        {
                            SQLID = executeDataID + "_pretreatment";

                            if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                            {
                                string logData = $"SQLID: {SQLID}, Parameters: {JsonConvert.SerializeObject(dynamicParameters)}";
                                if (ModuleConfiguration.IsLogServer == true)
                                {
                                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLMap", (string error) =>
                                    {
                                        logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLToScalar");
                                    });
                                }
                                else
                                {
                                    logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLToScalar", request.GlobalID);
                                }
                            }

                            ConsoleProfiler consoleProfiler = new ConsoleProfiler(request.RequestID, SQLID, ModuleConfiguration.IsTransactionLogging == true ? ModuleConfiguration.TransactionLogFilePath : null);
                            var preConnection = new ProfilerDbConnection(databaseFactory.Connection, consoleProfiler);

                            IDataReader? preReader = null;

                            try
                            {
                                preReader = preConnection.ExecuteReader(pretreatment.SQL, dynamicParameters as SqlMapper.IDynamicParameters, dbTransaction, statementMap.Timeout < 0 ? ModuleConfiguration.DefaultCommandTimeout : statementMap.Timeout);

                                string logData = $"SQLID: {SQLID}, ExecuteSQL: {consoleProfiler.ExecuteSQL}";
                                if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                                {
                                    if (ModuleConfiguration.IsLogServer == true)
                                    {
                                        dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLToScalar", (string error) =>
                                        {
                                            logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLToScalar");
                                        });
                                    }
                                    else
                                    {
                                        logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLToScalar", request.GlobalID);
                                    }
                                }
                            }
                            catch (Exception exception)
                            {
                                if (request.IsTransaction == true)
                                {
                                    databaseFactory.RollbackTransaction();
                                }

                                response.ExceptionText = $"SQLID: {SQLID}, ExecuteSQL: {consoleProfiler.ExecuteSQL}, ExceptionText: {exception.ToMessage()}";

                                if (ModuleConfiguration.IsLogServer == true)
                                {
                                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, response.ExceptionText, "QueryDataClient/ExecuteDynamicSQLToScalar", (string error) =>
                                    {
                                        logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + response.ExceptionText, "QueryDataClient/ExecuteDynamicSQLToScalar");
                                    });
                                }
                                else
                                {
                                    logger.Error("[{LogCategory}] [{GlobalID}] " + response.ExceptionText, "QueryDataClient/ExecuteDynamicSQLToScalar", request.GlobalID);
                                }

                                if (preReader != null)
                                {
                                    preReader.Close();
                                }

                                if (preConnection.IsConnectionOpen() == true)
                                {
                                    preConnection.Close();
                                }

                                return;
                            }

                            using (DataSet? ds = DataTableHelper.DataReaderToDataSet(preReader))
                            {
                                var resultTypes = pretreatment.ResultType.Split(",");
                                if (ds == null || resultTypes.Count() != ds.Tables.Count)
                                {
                                    response.ExceptionText = $"Pretreatment - 전처리 쿼리 실행 결과와 {pretreatment.ResultType} 설정 확인 필요";
                                    return;
                                }

                                for (int j = 0; j < ds.Tables.Count; j++)
                                {
                                    string resultType = resultTypes[j].Trim();
                                    DataTable table = ds.Tables[j];

                                    if (resultType == "Row")
                                    {
                                        DataRow rowItem = table.Rows[0];
                                        DataColumnCollection colItems = table.Columns;
                                        foreach (DataColumn item in colItems)
                                        {
                                            PretreatmentAddParameter(databaseProvider, statementMap, dynamicParameters, rowItem, item);

                                            DynamicParameter? dynamicParameter = dynamicObject.Parameters.Where(p => p.ParameterName == item.ColumnName).FirstOrDefault();

                                            if (dynamicParameter == null)
                                            {
                                                DataProviders? dataProvider = null;
                                                if (statementMap.NativeDataClient == true)
                                                {
                                                    dataProvider = databaseProvider;
                                                }

                                                dynamicParameter = new DynamicParameter();
                                                dynamicParameter.ParameterName = item.ColumnName;
                                                dynamicParameter.Length = item.MaxLength;
                                                dynamicParameter.DbType = GetProviderDbType(item, dataProvider);
                                                dynamicParameter.Value = rowItem[item.ColumnName];
                                                dynamicObject.Parameters.Add(dynamicParameter);
                                            }
                                            else
                                            {
                                                dynamicParameter.Value = rowItem[item.ColumnName];
                                            }
                                        }
                                    }
                                    else if (resultType == "List")
                                    {
                                        List<object> parameters = new List<object>();
                                        DataColumnCollection colItems = table.Columns;
                                        foreach (DataColumn item in colItems)
                                        {
                                            DataView dataView = new DataView(table);
                                            DataTable dataTable = dataView.ToTable(true, item.ColumnName);
                                            foreach (DataRow row in dataTable.Rows)
                                            {
                                                parameters.Add(row[0]);
                                            }

                                            if (parameters.Count > 0)
                                            {
                                                if (dynamicParameters != null)
                                                {
                                                    dynamicParameters.Add(item.ColumnName, parameters);
                                                }

                                                DynamicParameter? dynamicParameter = dynamicObject.Parameters.Where(p => p.ParameterName == item.ColumnName).FirstOrDefault();

                                                if (dynamicParameter == null)
                                                {
                                                    DataProviders? dataProvider = null;
                                                    if (statementMap.NativeDataClient == true)
                                                    {
                                                        dataProvider = databaseProvider;
                                                    }

                                                    dynamicParameter = new DynamicParameter();
                                                    dynamicParameter.ParameterName = item.ColumnName;
                                                    dynamicParameter.Length = item.MaxLength;
                                                    dynamicParameter.DbType = GetProviderDbType(item, dataProvider);
                                                    dynamicParameter.Value = parameters;
                                                    dynamicObject.Parameters.Add(dynamicParameter);
                                                }
                                                else
                                                {
                                                    dynamicParameter.Value = parameters;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (string.IsNullOrEmpty(statementMap.BeforeTransactionCommand) == false)
                    {
                        string logData = "";
                        if (ModuleConfiguration.IsTransactionLogging == true)
                        {
                            logData = $"GlobalID={request.GlobalID}, QueryID={dynamicObject.QueryID}, CommandID={statementMap.BeforeTransactionCommand}, , dynamicParameters={JsonConvert.SerializeObject(dynamicParameters)}";
                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", GlobalConfiguration.SystemID, logData, $"ExecuteDynamicSQLMapToScalar/BeforeTransactionCommand", (string error) =>
                                {
                                    logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "ExecuteDynamicSQLMapToScalar/BeforeTransactionCommand");
                                });
                            }
                            else
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "ExecuteDynamicSQLMapToScalar/BeforeTransactionCommand", request.GlobalID);
                            }
                        }

                        var transactionCommands = statementMap.BeforeTransactionCommand.Split("|");
                        BusinessApiClient businessApiClient = new BusinessApiClient(logger);
                        string? beforeCommandResult = businessApiClient.OnewayTransactionCommand(transactionCommands, request.GlobalID, dynamicObject.QueryID, dynamicParameters);
                        if (string.IsNullOrEmpty(beforeCommandResult) == false)
                        {
                            response.ExceptionText = $"ExecuteDynamicSQLMapToScalar.BeforeTransactionCommand Error: {beforeCommandResult}";

                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, $"{response.ExceptionText}, {logData}", $"ExecuteDynamicSQLMapToScalar/BeforeTransactionCommand", (string error) =>
                                {
                                    logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + $"{response.ExceptionText}, {logData}", "ExecuteDynamicSQLMapToScalar/BeforeTransactionCommand");
                                });
                            }
                            else
                            {
                                logger.Error("[{LogCategory}] [{GlobalID}] " + $"{response.ExceptionText}, {logData}", "ExecuteDynamicSQLMapToScalar/BeforeTransactionCommand", request.GlobalID);
                            }

                            return;
                        }
                    }

                    SQLID = executeDataID + "_statement";
                    ConsoleProfiler profiler = new ConsoleProfiler(request.RequestID, executeDataID, ModuleConfiguration.IsTransactionLogging == true ? ModuleConfiguration.TransactionLogFilePath : null);
                    IDataReader? reader = null;
                    try
                    {
                        if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                        {
                            string logData = $"SQLID: {SQLID}, ParseSQL Parameters: {JsonConvert.SerializeObject(dynamicObject)}";
                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLMapToScalar", (string error) =>
                                {
                                    logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLMapToScalar");
                                });
                            }
                            else
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLMapToScalar", request.GlobalID);
                            }
                        }

                        string parseSQL = DatabaseMapper.Find(statementMap, dynamicObject);
                        if (string.IsNullOrEmpty(parseSQL) == true || parseSQL.Replace(Environment.NewLine, "").Replace("\t", "").Trim() == "")
                        {
                            if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                            {
                                string logData = $"SQLID: {SQLID}, Parameters: {JsonConvert.SerializeObject(dynamicParameters)}";
                                if (ModuleConfiguration.IsLogServer == true)
                                {
                                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLMap", (string error) =>
                                    {
                                        logger.Information("[{LogCategory}] " + "fallback error: " + error + ", empty SQL passing" + logData, "QueryDataClient/ExecuteDynamicSQLMapToScalar");
                                    });
                                }
                                else
                                {
                                    logger.Information("[{LogCategory}] [{GlobalID}] empty SQL passing" + logData, "QueryDataClient/ExecuteDynamicSQLMapToScalar", request.GlobalID);
                                }
                            }

                            continue;
                        }

                        if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                        {
                            string logData = $"SQLID: {SQLID}, Parameters: {JsonConvert.SerializeObject(dynamicParameters)}";
                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLMapToScalar", (string error) =>
                                {
                                    logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLMapToScalar");
                                });
                            }
                            else
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLMapToScalar", request.GlobalID);
                            }
                        }

                        var connection = new ProfilerDbConnection(databaseFactory.Connection, profiler);

                        try
                        {
                            reader = connection.ExecuteReader(parseSQL, dynamicParameters as SqlMapper.IDynamicParameters, dbTransaction, statementMap.Timeout < 0 ? ModuleConfiguration.DefaultCommandTimeout : statementMap.Timeout);
                        }
                        catch
                        {
                            if (reader != null && reader.IsClosed == false)
                            {
                                reader.Close();
                            }

                            if (connection.IsConnectionOpen() == true)
                            {
                                connection.Close();
                            }
                            throw;
                        }

                        if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                        {
                            string logData = $"SQLID: {SQLID}, ExecuteSQL: {profiler.ExecuteSQL}";
                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLMapToScalar", (string error) =>
                                {
                                    logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLMapToScalar");
                                });
                            }
                            else
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLMapToScalar", request.GlobalID);
                            }
                        }
                    }
                    catch (Exception exception)
                    {
                        if (request.IsTransaction == true)
                        {
                            databaseFactory.RollbackTransaction();
                        }

                        response.ExceptionText = exception.ToMessage();
                        string logData = $"SQLID: {SQLID}, ExecuteSQL: {profiler.ExecuteSQL}, ExceptionText: {response.ExceptionText}";

                        if (ModuleConfiguration.IsLogServer == true)
                        {
                            dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLMapToScalar", (string error) =>
                            {
                                logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLMapToScalar");
                            });
                        }
                        else
                        {
                            logger.Error("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLMapToScalar", request.GlobalID);
                        }

                        if (string.IsNullOrEmpty(statementMap.FallbackTransactionCommand) == false)
                        {
                            logData = $"GlobalID={request.GlobalID}, QueryID={dynamicObject.QueryID}, FallbackTransactionCommand: {statementMap.FallbackTransactionCommand}, dynamicParameters={JsonConvert.SerializeObject(dynamicParameters)}";
                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", GlobalConfiguration.SystemID, logData, "QueryDataClient/FallbackTransactionCommand", (string error) =>
                                {
                                    logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/FallbackTransactionCommand");
                                });
                            }
                            else
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/FallbackTransactionCommand", request.GlobalID);
                            }

                            var transactionCommands = statementMap.FallbackTransactionCommand.Split("|");
                            BusinessApiClient businessApiClient = new BusinessApiClient(logger);
                            string? fallbackCommandResult = businessApiClient.OnewayTransactionCommandAsync(transactionCommands, request.GlobalID, dynamicObject.QueryID, dynamicParameters);
                            if (string.IsNullOrEmpty(fallbackCommandResult) == false)
                            {
                                response.ExceptionText = response.ExceptionText + $", ExecuteDynamicSQLMapToScalar.FallbackTransactionCommand Error: {fallbackCommandResult}";

                                if (ModuleConfiguration.IsLogServer == true)
                                {
                                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, $"{response.ExceptionText}, {logData}", $"QueryDataClient/FallbackTransactionCommand", (string error) =>
                                    {
                                        logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + $"{response.ExceptionText}, {logData}", "QueryDataClient/FallbackTransactionCommand");
                                    });
                                }
                                else
                                {
                                    logger.Error("[{LogCategory}] [{GlobalID}] " + $"{response.ExceptionText}, {logData}", "QueryDataClient/FallbackTransactionCommand", request.GlobalID);
                                }

                                return;
                            }
                        }
                    }
                    finally
                    {
                        if (string.IsNullOrEmpty(response.ExceptionText) == false)
                        {
                            if (reader != null)
                            {
                                if (reader.IsClosed == false)
                                {
                                    reader.Close();
                                }
                                reader.Dispose();
                            }
                        }
                    }

                    if (string.IsNullOrEmpty(response.ExceptionText) == true)
                    {
                        if (string.IsNullOrEmpty(statementMap.AfterTransactionCommand) == false)
                        {
                            var transactionCommands = statementMap.AfterTransactionCommand.Split("|");
                            BusinessApiClient businessApiClient = new BusinessApiClient(logger);
                            string? afterCommandResult = businessApiClient.OnewayTransactionCommandAsync(transactionCommands, request.GlobalID, dynamicObject.QueryID, dynamicParameters);
                            if (string.IsNullOrEmpty(afterCommandResult) == false)
                            {
                                response.ExceptionText = $"ExecuteDynamicSQLMapToScalar.AfterTransactionCommand Error: GlobalID={request.GlobalID}, QueryID={dynamicObject.QueryID}, CommandID={statementMap.AfterTransactionCommand}, CommandResult={afterCommandResult}";
                                return;
                            }
                        }
                    }
                    else
                    {
                        return;
                    }

                    if (dynamicObject.IgnoreResult == true)
                    {
                        using (DataTable dataTable = new DataTable())
                        using (DataTable? schemaTable = reader?.GetSchemaTable())
                        {
                            if (schemaTable == null)
                            {
                                continue;
                            }

                            DataRow row;

                            string columnName;
                            DataColumn column;
                            int count = schemaTable.Rows.Count;

                            for (int j = 0; j < count; j++)
                            {
                                row = schemaTable.Rows[j];
                                columnName = (string)row["ColumnName"];

                                column = new DataColumn(columnName, (Type)row["DataType"]);
                                dataTable.Columns.Add(column);
                            }

                            object[] values = new object[count];

                            if (reader != null)
                            {
                                try
                                {
                                    dataTable.BeginLoadData();
                                    while (reader.Read())
                                    {
                                        reader.GetValues(values);
                                        dataTable.LoadDataRow(values, true);
                                    }
                                }
                                catch (Exception exception)
                                {
                                    if (reader.IsClosed == false)
                                    {
                                        reader.Close();
                                    }
                                    logger.Error("[{LogCategory}] [{GlobalID}] " + exception.ToMessage(), "QueryDataClient/ExecuteDynamicSQLMapToScalar", request.GlobalID);
                                    throw;
                                }
                                finally
                                {
                                    dataTable.EndLoadData();
                                    reader.Close();
                                }
                            }

                            if (dataTable.Rows.Count > 0)
                            {
                                dataRows[statementMap.Seq] = dataTable.Rows[dataTable.Rows.Count - 1];
                            }
                            else
                            {
                                dataRows[statementMap.Seq] = null;
                            }
                        }
                    }
                    else
                    {
                        using (DataSet? ds = DataTableHelper.DataReaderToDataSet(reader))
                        {
                            if (ds != null && ds.Tables.Count > 0)
                            {
                                for (int j = 0; j < ds.Tables.Count; j++)
                                {
                                    i++;
                                }

                                DataTable table = ds.Tables[ds.Tables.Count - 1];
                                if (table.Rows.Count > 0)
                                {
                                    dataRows[statementMap.Seq] = table.Rows[table.Rows.Count - 1];
                                }
                                else
                                {
                                    dataRows[statementMap.Seq] = null;
                                }
                            }
                            else
                            {
                                dataRows[statementMap.Seq] = null;
                            }
                        }

                        if (reader != null)
                        {
                            reader.Close();
                        }
                    }
                }

                if (request.IsTransaction == true)
                {
                    databaseFactory.CommitTransaction();
                }

                response.ResultObject = result;
                response.Acknowledge = AcknowledgeType.Success;
            }
            catch (Exception exception)
            {
                if (databaseFactory != null && request.IsTransaction == true)
                {
                    databaseFactory.RollbackTransaction();
                }

                response.ExceptionText = exception.ToMessage();

                if (ModuleConfiguration.IsLogServer == true)
                {
                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, response.ExceptionText, "QueryDataClient/ExecuteDynamicSQLMapScalar", (string error) =>
                    {
                        logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + response.ExceptionText, "QueryDataClient/ExecuteDynamicSQLMapScalar");
                    });
                }
                else
                {
                    logger.Error("[{LogCategory}] [{GlobalID}] " + response.ExceptionText, "QueryDataClient/ExecuteDynamicSQLMapScalar", request.GlobalID);
                }
            }
            finally
            {
                if (databaseFactory != null)
                {
                    databaseFactory.Connection?.Close();
                    databaseFactory?.Dispose();
                }
            }
        }

        public void ExecuteDynamicSQLMapToNonQuery(DynamicRequest request, DynamicResponse response)
        {
            request.RequestID = request.RequestID == null ? "NULL" : request.RequestID;
            Dictionary<string, TransactionDynamicObjects> transactionDynamicObjects = new Dictionary<string, TransactionDynamicObjects>();
            DatabaseFactory? databaseFactory = null;
            IDbTransaction? dbTransaction = null;
            Tuple<string, DataProviders>? connectionInfo = null;

            try
            {
                List<string> logQuerys = new List<string>();
                int i = 0;
                foreach (DynamicObject dynamicObject in request.DynamicObjects)
                {
                    StatementMap statementMap = DatabaseMapper.GetStatementMap(dynamicObject.QueryID);
                    if (statementMap == null)
                    {
                        response.ExceptionText = $"QueryID - {dynamicObject.QueryID}에 대한 매핑 정보 필요";
                        return;
                    }

                    if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                    {
                        if (logQuerys.Contains(dynamicObject.QueryID) == false)
                        {
                            logQuerys.Add(dynamicObject.QueryID);
                        }
                    }

                    if (connectionInfo == null)
                    {
                        connectionInfo = GetConnectionInfomation(statementMap.ApplicationID, statementMap.ProjectID, statementMap.DataSourceID);
                    }

                    transactionDynamicObjects.Add(string.Concat(dynamicObject.QueryID, "_", i.ToString()), new TransactionDynamicObjects()
                    {
                        DynamicObject = dynamicObject,
                        StatementMap = statementMap
                    });

                    i = i + 1;
                }

                if (logQuerys.Count > 0)
                {
                    if (ModuleConfiguration.IsTransactionLogging == true)
                    {
                        string logData = $"QueryID: {string.Join(", ", logQuerys.ToArray())}";
                        if (ModuleConfiguration.IsLogServer == true)
                        {
                            dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", GlobalConfiguration.SystemID, logData, "QueryDataClient/ExecuteDynamicSQLMapToNonQuery", (string error) =>
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLMapToNonQuery", request.GlobalID);
                            });
                        }
                        else
                        {
                            logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLMapToNonQuery", request.GlobalID);
                        }
                    }
                }

                if (connectionInfo == null)
                {
                    response.ExceptionText = $"{request.RequestID}에 대한 DataSourceID 데이터 원본 정보 필요";
                    return;
                }

                var databaseProvider = connectionInfo.Item2;
                databaseFactory = new DatabaseFactory(connectionInfo.Item1, connectionInfo.Item2);

                if (databaseFactory == null)
                {
                    response.ExceptionText = $"{request.RequestID}에 대한 DataProvider: {connectionInfo.Item2} 데이터 제공자 정보 확인 필요";
                    return;
                }

                if (request.IsTransaction == true)
                {
                    dbTransaction = databaseFactory.BeginTransaction();
                }

                i = 0;
                Dictionary<int, DataRow?> dataRows = new Dictionary<int, DataRow?>();
                DataTable additionalData = new DataTable();
                additionalData.Columns.Add("MSG_CD", typeof(string));
                additionalData.Columns.Add("MSG_TXT", typeof(string));
                int result = 0;
                foreach (var transactionDynamicObject in transactionDynamicObjects)
                {
                    DynamicObject? dynamicObject = transactionDynamicObject.Value.DynamicObject;
                    StatementMap? statementMap = transactionDynamicObject.Value.StatementMap;

                    if (dynamicObject == null || statementMap == null)
                    {
                        continue;
                    }

                    dynamic? dynamicParameters = CreateDynamicParameters(databaseProvider, statementMap);
                    if (dynamicParameters != null && dynamicObject.Parameters.Count() > 0)
                    {
                        if (dynamicObject.BaseFieldMappings != null && dynamicObject.BaseFieldMappings.Count() > 0)
                        {
                            int baseSequence = statementMap.Seq - 1;
                            DataRow? dataRow = null;
                            if (dataRows.Count > 0 && statementMap.Seq > 0)
                            {
                                dataRow = dataRows.GetValueOrDefault(baseSequence);
                            }

                            for (int baseFieldIndex = 0; baseFieldIndex < dynamicObject.BaseFieldMappings.Count; baseFieldIndex++)
                            {
                                BaseFieldMapping baseFieldMapping = dynamicObject.BaseFieldMappings[baseFieldIndex];

                                if (string.IsNullOrEmpty(baseFieldMapping.BaseSequence) == false)
                                {
                                    int baseSequenceMapping = int.Parse(baseFieldMapping.BaseSequence);
                                    if (baseSequence != baseSequenceMapping)
                                    {
                                        baseSequence = baseSequenceMapping;
                                        dataRow = dataRows.GetValueOrDefault(baseSequence);
                                    }
                                }

                                if (dataRow == null)
                                {
                                    response.ExceptionText = $"BaseFieldMappings - QueryID: '{dynamicObject.QueryID}', Sequence: '{baseSequence}'에 대한 매핑 정보 필요";
                                    return;
                                }

                                if (dataRow[baseFieldMapping.SourceFieldID] == null)
                                {
                                    response.ExceptionText = $"BaseFieldMappings - QueryID: '{dynamicObject.QueryID}', Sequence: '{baseSequence}'에 대한 SourceFieldID {baseFieldMapping.SourceFieldID} 컬럼 정보 필요";
                                    return;
                                }

                                DynamicParameter? dynamicParameter = dynamicObject.Parameters.Where(p => p.ParameterName == baseFieldMapping.TargetFieldID).FirstOrDefault();

                                if (dynamicParameter == null)
                                {
                                    response.ExceptionText = $"BaseFieldMappings - {dynamicObject.QueryID}에 대한 TargetFieldID {baseFieldMapping.SourceFieldID} 컬럼 정보 필요";
                                    return;
                                }

                                dynamicParameter.Value = dataRow[baseFieldMapping.SourceFieldID];
                            }
                        }

                        SetDbParameterMapping(databaseFactory, databaseProvider, dynamicObject, statementMap, dynamicParameters);
                    }
                    else
                    {
                        SetDbParameterMapping(databaseFactory, databaseProvider, dynamicObject, statementMap, dynamicParameters);
                    }

                    string SQLID = string.Empty;
                    string executeDataID = dynamicObject.QueryID + "_" + i.ToString();

                    if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                    {
                        string logData = $"Pretreatment {executeDataID}, ParseSQL Parameters: {JsonConvert.SerializeObject(dynamicObject)}";
                        if (ModuleConfiguration.IsLogServer == true)
                        {
                            dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLToNonQuery", (string error) =>
                            {
                                logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLToNonQuery");
                            });
                        }
                        else
                        {
                            logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLToNonQuery", request.GlobalID);
                        }
                    }

                    var pretreatment = DatabaseMapper.FindPretreatment(statementMap, dynamicObject);
                    if (pretreatment.SQL != null && pretreatment.ResultType != null)
                    {
                        if (pretreatment.SQL.Replace(Environment.NewLine, "").Replace("\t", "").Trim() != "")
                        {
                            SQLID = executeDataID + "_pretreatment";

                            if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                            {
                                string logData = $"SQLID: {SQLID}, Parameters: {JsonConvert.SerializeObject(dynamicParameters)}";
                                if (ModuleConfiguration.IsLogServer == true)
                                {
                                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLMap", (string error) =>
                                    {
                                        logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLToNonQuery");
                                    });
                                }
                                else
                                {
                                    logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLToNonQuery", request.GlobalID);
                                }
                            }

                            ConsoleProfiler consoleProfiler = new ConsoleProfiler(request.RequestID, SQLID, ModuleConfiguration.IsTransactionLogging == true ? ModuleConfiguration.TransactionLogFilePath : null);
                            var preConnection = new ProfilerDbConnection(databaseFactory.Connection, consoleProfiler);

                            IDataReader? preReader = null;

                            try
                            {
                                preReader = preConnection.ExecuteReader(pretreatment.SQL, dynamicParameters as SqlMapper.IDynamicParameters, dbTransaction, statementMap.Timeout < 0 ? ModuleConfiguration.DefaultCommandTimeout : statementMap.Timeout);

                                string logData = $"SQLID: {SQLID}, ExecuteSQL: {consoleProfiler.ExecuteSQL}";
                                if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                                {
                                    if (ModuleConfiguration.IsLogServer == true)
                                    {
                                        dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLToNonQuery", (string error) =>
                                        {
                                            logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLToNonQuery");
                                        });
                                    }
                                    else
                                    {
                                        logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLToNonQuery", request.GlobalID);
                                    }
                                }
                            }
                            catch (Exception exception)
                            {
                                if (request.IsTransaction == true)
                                {
                                    databaseFactory.RollbackTransaction();
                                }

                                response.ExceptionText = $"SQLID: {SQLID}, ExecuteSQL: {consoleProfiler.ExecuteSQL}, ExceptionText: {exception.ToMessage()}";

                                if (ModuleConfiguration.IsLogServer == true)
                                {
                                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, response.ExceptionText, "QueryDataClient/ExecuteDynamicSQLToNonQuery", (string error) =>
                                    {
                                        logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + response.ExceptionText, "QueryDataClient/ExecuteDynamicSQLToNonQuery");
                                    });
                                }
                                else
                                {
                                    logger.Error("[{LogCategory}] [{GlobalID}] " + response.ExceptionText, "QueryDataClient/ExecuteDynamicSQLToNonQuery", request.GlobalID);
                                }

                                if (preReader != null)
                                {
                                    preReader.Close();
                                }

                                if (preConnection.IsConnectionOpen() == true)
                                {
                                    preConnection.Close();
                                }

                                return;
                            }

                            using (DataSet? ds = DataTableHelper.DataReaderToDataSet(preReader))
                            {
                                var resultTypes = pretreatment.ResultType.Split(",");
                                if (ds == null || resultTypes.Count() != ds.Tables.Count)
                                {
                                    response.ExceptionText = $"Pretreatment - 전처리 쿼리 실행 결과와 {pretreatment.ResultType} 설정 확인 필요";
                                    return;
                                }

                                for (int j = 0; j < ds.Tables.Count; j++)
                                {
                                    string resultType = resultTypes[j].Trim();
                                    DataTable table = ds.Tables[j];

                                    if (resultType == "Row")
                                    {
                                        DataRow rowItem = table.Rows[0];
                                        DataColumnCollection colItems = table.Columns;
                                        foreach (DataColumn item in colItems)
                                        {
                                            PretreatmentAddParameter(databaseProvider, statementMap, dynamicParameters, rowItem, item);

                                            DynamicParameter? dynamicParameter = dynamicObject.Parameters.Where(p => p.ParameterName == item.ColumnName).FirstOrDefault();

                                            if (dynamicParameter == null)
                                            {
                                                DataProviders? dataProvider = null;
                                                if (statementMap.NativeDataClient == true)
                                                {
                                                    dataProvider = databaseProvider;
                                                }

                                                dynamicParameter = new DynamicParameter();
                                                dynamicParameter.ParameterName = item.ColumnName;
                                                dynamicParameter.Length = item.MaxLength;
                                                dynamicParameter.DbType = GetProviderDbType(item, dataProvider);
                                                dynamicParameter.Value = rowItem[item.ColumnName];
                                                dynamicObject.Parameters.Add(dynamicParameter);
                                            }
                                            else
                                            {
                                                dynamicParameter.Value = rowItem[item.ColumnName];
                                            }
                                        }
                                    }
                                    else if (resultType == "List")
                                    {
                                        List<object> parameters = new List<object>();
                                        DataColumnCollection colItems = table.Columns;
                                        foreach (DataColumn item in colItems)
                                        {
                                            DataView dataView = new DataView(table);
                                            DataTable dataTable = dataView.ToTable(true, item.ColumnName);
                                            foreach (DataRow row in dataTable.Rows)
                                            {
                                                parameters.Add(row[0]);
                                            }

                                            if (parameters.Count > 0)
                                            {
                                                if (dynamicParameters != null)
                                                {
                                                    dynamicParameters.Add(item.ColumnName, parameters);
                                                }

                                                DynamicParameter? dynamicParameter = dynamicObject.Parameters.Where(p => p.ParameterName == item.ColumnName).FirstOrDefault();

                                                if (dynamicParameter == null)
                                                {
                                                    DataProviders? dataProvider = null;
                                                    if (statementMap.NativeDataClient == true)
                                                    {
                                                        dataProvider = databaseProvider;
                                                    }

                                                    dynamicParameter = new DynamicParameter();
                                                    dynamicParameter.ParameterName = item.ColumnName;
                                                    dynamicParameter.Length = item.MaxLength;
                                                    dynamicParameter.DbType = GetProviderDbType(item, dataProvider);
                                                    dynamicParameter.Value = parameters;
                                                    dynamicObject.Parameters.Add(dynamicParameter);
                                                }
                                                else
                                                {
                                                    dynamicParameter.Value = parameters;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (string.IsNullOrEmpty(statementMap.BeforeTransactionCommand) == false)
                    {
                        string logData = "";
                        if (ModuleConfiguration.IsTransactionLogging == true)
                        {
                            logData = $"GlobalID={request.GlobalID}, QueryID={dynamicObject.QueryID}, CommandID={statementMap.BeforeTransactionCommand}, , dynamicParameters={JsonConvert.SerializeObject(dynamicParameters)}";
                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", GlobalConfiguration.SystemID, logData, $"ExecuteDynamicSQLMapToNonQuery/BeforeTransactionCommand", (string error) =>
                                {
                                    logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "ExecuteDynamicSQLMapToNonQuery/BeforeTransactionCommand");
                                });
                            }
                            else
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "ExecuteDynamicSQLMapToNonQuery/BeforeTransactionCommand", request.GlobalID);
                            }
                        }

                        var transactionCommands = statementMap.BeforeTransactionCommand.Split("|");
                        BusinessApiClient businessApiClient = new BusinessApiClient(logger);
                        string? beforeCommandResult = businessApiClient.OnewayTransactionCommand(transactionCommands, request.GlobalID, dynamicObject.QueryID, dynamicParameters);
                        if (string.IsNullOrEmpty(beforeCommandResult) == false)
                        {
                            response.ExceptionText = $"ExecuteDynamicSQLMapToNonQuery.BeforeTransactionCommand Error: {beforeCommandResult}";

                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, $"{response.ExceptionText}, {logData}", $"ExecuteDynamicSQLMapToNonQuery/BeforeTransactionCommand", (string error) =>
                                {
                                    logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + $"{response.ExceptionText}, {logData}", "ExecuteDynamicSQLMapToNonQuery/BeforeTransactionCommand");
                                });
                            }
                            else
                            {
                                logger.Error("[{LogCategory}] [{GlobalID}] " + $"{response.ExceptionText}, {logData}", "ExecuteDynamicSQLMapToNonQuery/BeforeTransactionCommand", request.GlobalID);
                            }

                            return;
                        }
                    }

                    SQLID = executeDataID + "_statement";
                    ConsoleProfiler profiler = new ConsoleProfiler(request.RequestID, executeDataID, ModuleConfiguration.IsTransactionLogging == true ? ModuleConfiguration.TransactionLogFilePath : null);
                    IDataReader? reader = null;
                    try
                    {
                        if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                        {
                            string logData = $"SQLID: {SQLID}, ParseSQL Parameters: {JsonConvert.SerializeObject(dynamicObject)}";
                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLMapToNonQuery", (string error) =>
                                {
                                    logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLMapToNonQuery");
                                });
                            }
                            else
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLMapToNonQuery", request.GlobalID);
                            }
                        }

                        string parseSQL = DatabaseMapper.Find(statementMap, dynamicObject);
                        if (string.IsNullOrEmpty(parseSQL) == true || parseSQL.Replace(Environment.NewLine, "").Replace("\t", "").Trim() == "")
                        {
                            if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                            {
                                string logData = $"SQLID: {SQLID}, Parameters: {JsonConvert.SerializeObject(dynamicParameters)}";
                                if (ModuleConfiguration.IsLogServer == true)
                                {
                                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLMap", (string error) =>
                                    {
                                        logger.Information("[{LogCategory}] " + "fallback error: " + error + ", empty SQL passing" + logData, "QueryDataClient/ExecuteDynamicSQLMapToNonQuery");
                                    });
                                }
                                else
                                {
                                    logger.Information("[{LogCategory}] [{GlobalID}] empty SQL passing" + logData, "QueryDataClient/ExecuteDynamicSQLMapToNonQuery", request.GlobalID);
                                }
                            }

                            continue;
                        }

                        if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                        {
                            string logData = $"SQLID: {SQLID}, Parameters: {JsonConvert.SerializeObject(dynamicParameters)}";
                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLMapToNonQuery", (string error) =>
                                {
                                    logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLMapToNonQuery");
                                });
                            }
                            else
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLMapToNonQuery", request.GlobalID);
                            }
                        }

                        var connection = new ProfilerDbConnection(databaseFactory.Connection, profiler);

                        try
                        {
                            reader = connection.ExecuteReader(parseSQL, dynamicParameters as SqlMapper.IDynamicParameters, dbTransaction, statementMap.Timeout < 0 ? ModuleConfiguration.DefaultCommandTimeout : statementMap.Timeout);
                        }
                        catch
                        {
                            if (reader != null && reader.IsClosed == false)
                            {
                                reader.Close();
                            }

                            if (connection.IsConnectionOpen() == true)
                            {
                                connection.Close();
                            }
                            throw;
                        }

                        if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                        {
                            string logData = $"SQLID: {SQLID}, ExecuteSQL: {profiler.ExecuteSQL}";
                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLMapToNonQuery", (string error) =>
                                {
                                    logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLMapToNonQuery");
                                });
                            }
                            else
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLMapToNonQuery", request.GlobalID);
                            }
                        }
                    }
                    catch (Exception exception)
                    {
                        if (request.IsTransaction == true)
                        {
                            databaseFactory.RollbackTransaction();
                        }

                        response.ExceptionText = exception.ToMessage();
                        string logData = $"SQLID: {SQLID}, ExecuteSQL: {profiler.ExecuteSQL}, ExceptionText: {response.ExceptionText}";

                        if (ModuleConfiguration.IsLogServer == true)
                        {
                            dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLMapToNonQuery", (string error) =>
                            {
                                logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLMapToNonQuery");
                            });
                        }
                        else
                        {
                            logger.Error("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLMapToNonQuery", request.GlobalID);
                        }

                        if (string.IsNullOrEmpty(statementMap.FallbackTransactionCommand) == false)
                        {
                            logData = $"GlobalID={request.GlobalID}, QueryID={dynamicObject.QueryID}, FallbackTransactionCommand: {statementMap.FallbackTransactionCommand}, dynamicParameters={JsonConvert.SerializeObject(dynamicParameters)}";
                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", GlobalConfiguration.SystemID, logData, "QueryDataClient/FallbackTransactionCommand", (string error) =>
                                {
                                    logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/FallbackTransactionCommand");
                                });
                            }
                            else
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/FallbackTransactionCommand", request.GlobalID);
                            }

                            var transactionCommands = statementMap.FallbackTransactionCommand.Split("|");
                            BusinessApiClient businessApiClient = new BusinessApiClient(logger);
                            string? fallbackCommandResult = businessApiClient.OnewayTransactionCommandAsync(transactionCommands, request.GlobalID, dynamicObject.QueryID, dynamicParameters);
                            if (string.IsNullOrEmpty(fallbackCommandResult) == false)
                            {
                                response.ExceptionText = response.ExceptionText + $", ExecuteDynamicSQLMapToNonQuery.FallbackTransactionCommand Error: {fallbackCommandResult}";

                                if (ModuleConfiguration.IsLogServer == true)
                                {
                                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, $"{response.ExceptionText}, {logData}", $"QueryDataClient/FallbackTransactionCommand", (string error) =>
                                    {
                                        logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + $"{response.ExceptionText}, {logData}", "QueryDataClient/FallbackTransactionCommand");
                                    });
                                }
                                else
                                {
                                    logger.Error("[{LogCategory}] [{GlobalID}] " + $"{response.ExceptionText}, {logData}", "QueryDataClient/FallbackTransactionCommand", request.GlobalID);
                                }

                                return;
                            }
                        }
                    }
                    finally
                    {
                        if (string.IsNullOrEmpty(response.ExceptionText) == false)
                        {
                            if (reader != null)
                            {
                                if (reader.IsClosed == false)
                                {
                                    reader.Close();
                                }
                                reader.Dispose();
                            }
                        }
                    }


                    if (string.IsNullOrEmpty(response.ExceptionText) == true)
                    {
                        if (string.IsNullOrEmpty(statementMap.AfterTransactionCommand) == false)
                        {
                            var transactionCommands = statementMap.AfterTransactionCommand.Split("|");
                            BusinessApiClient businessApiClient = new BusinessApiClient(logger);
                            string? afterCommandResult = businessApiClient.OnewayTransactionCommandAsync(transactionCommands, request.GlobalID, dynamicObject.QueryID, dynamicParameters);
                            if (string.IsNullOrEmpty(afterCommandResult) == false)
                            {
                                response.ExceptionText = $"ExecuteDynamicSQLMapToNonQuery.AfterTransactionCommand Error: GlobalID={request.GlobalID}, QueryID={dynamicObject.QueryID}, CommandID={statementMap.AfterTransactionCommand}, CommandResult={afterCommandResult}";
                                return;
                            }
                        }
                    }
                    else
                    {
                        return;
                    }

                    if (dynamicObject.IgnoreResult == true)
                    {
                        using (DataTable dataTable = new DataTable())
                        using (DataTable? schemaTable = reader?.GetSchemaTable())
                        {
                            if (schemaTable == null)
                            {
                                continue;
                            }

                            DataRow row;

                            string columnName;
                            DataColumn column;
                            int count = schemaTable.Rows.Count;

                            for (int j = 0; j < count; j++)
                            {
                                row = schemaTable.Rows[j];
                                columnName = (string)row["ColumnName"];

                                column = new DataColumn(columnName, (Type)row["DataType"]);
                                dataTable.Columns.Add(column);
                            }

                            object[] values = new object[count];

                            if (reader != null)
                            {
                                try
                                {
                                    result = result + reader.RecordsAffected;
                                    dataTable.BeginLoadData();
                                    while (reader.Read())
                                    {
                                        reader.GetValues(values);
                                        dataTable.LoadDataRow(values, true);
                                    }
                                }
                                catch (Exception exception)
                                {
                                    if (reader.IsClosed == false)
                                    {
                                        reader.Close();
                                    }
                                    logger.Error("[{LogCategory}] [{GlobalID}] " + exception.ToMessage(), "QueryDataClient/ExecuteDynamicSQLMapToNonQuery", request.GlobalID);
                                    throw;
                                }
                                finally
                                {
                                    dataTable.EndLoadData();
                                    reader.Close();
                                }
                            }

                            if (dataTable.Rows.Count > 0)
                            {
                                dataRows[statementMap.Seq] = dataTable.Rows[dataTable.Rows.Count - 1];
                            }
                            else
                            {
                                dataRows[statementMap.Seq] = null;
                            }
                        }
                    }
                    else
                    {
                        using (DataSet? ds = DataTableHelper.DataReaderToDataSet(reader))
                        {
                            if (ds != null && ds.Tables.Count > 0)
                            {
                                for (int j = 0; j < ds.Tables.Count; j++)
                                {
                                    i++;
                                }

                                DataTable table = ds.Tables[ds.Tables.Count - 1];
                                if (table.Rows.Count > 0)
                                {
                                    dataRows[statementMap.Seq] = table.Rows[table.Rows.Count - 1];
                                }
                                else
                                {
                                    dataRows[statementMap.Seq] = null;
                                }
                            }
                            else
                            {
                                dataRows[statementMap.Seq] = null;
                            }
                        }

                        if (reader != null)
                        {
                            result = result + reader.RecordsAffected;
                            reader.Close();
                        }
                    }
                }

                if (request.IsTransaction == true)
                {
                    databaseFactory.CommitTransaction();
                }

                response.ResultInteger = result;
                response.Acknowledge = AcknowledgeType.Success;
            }
            catch (Exception exception)
            {
                if (databaseFactory != null && request.IsTransaction == true)
                {
                    databaseFactory.RollbackTransaction();
                }

                response.ExceptionText = exception.ToMessage();

                if (ModuleConfiguration.IsLogServer == true)
                {
                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, response.ExceptionText, "QueryDataClient/ExecuteDynamicSQLMapToNonQuery", (string error) =>
                    {
                        logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + response.ExceptionText, "QueryDataClient/ExecuteDynamicSQLMapToNonQuery");
                    });
                }
                else
                {
                    logger.Error("[{LogCategory}] [{GlobalID}] " + response.ExceptionText, "QueryDataClient/ExecuteDynamicSQLMapToNonQuery", request.GlobalID);
                }
            }
            finally
            {
                databaseFactory?.Connection?.Close();
                databaseFactory?.Dispose();
            }
        }

        private string GetProviderDbType(DataColumn column, DataProviders? databaseProvider = null)
        {
            string result = "";

            if (databaseProvider == null)
            {
                result = "String";
                switch (column.DataType.Name)
                {
                    case "Int16":
                    case "Int32":
                    case "Int64":
                    case "Decimal":
                    case "Double":
                    case "Single":
                    case "Boolean":
                    case "DateTime":
                    case "DateTimeOffset":
                    case "Byte":
                        result = column.DataType.Name;
                        break;
                    case "TimeSpan":
                        result = "Time";
                        break;
                    case "Byte[]":
                        result = "Binary";
                        break;
                    case "Guid":
                        result = "Guid";
                        break;
                }
            }
            else
            {
                switch (databaseProvider)
                {
                    case DataProviders.SqlServer:
                        result = "NVarChar";
                        switch (column.DataType.Name)
                        {
                            case "Int16":
                                result = "SmallInt";
                                break;
                            case "Int32":
                                result = "Int";
                                break;
                            case "Int64":
                                result = "BigInt";
                                break;
                            case "Decimal":
                                result = "Decimal";
                                break;
                            case "Double":
                                result = "Float";
                                break;
                            case "Single":
                                result = "Real";
                                break;
                            case "Boolean":
                                result = "Bit";
                                break;
                            case "DateTime":
                                result = "DateTime";
                                break;
                            case "DateTimeOffset":
                                result = "DateTimeOffset";
                                break;
                            case "TimeSpan":
                                result = "Time";
                                break;
                            case "Byte":
                                result = "TinyInt";
                                break;
                            case "Byte[]":
                                result = "VarBinary";
                                break;
                            case "Guid":
                                result = "UniqueIdentifier";
                                break;
                        }
                        break;
                    case DataProviders.Oracle:
                        result = "NVarchar2";
                        switch (column.DataType.Name)
                        {
                            case "Int16":
                                result = "Int16";
                                break;
                            case "Int32":
                                result = "Int32";
                                break;
                            case "Int64":
                                result = "Int64";
                                break;
                            case "Decimal":
                                result = "Decimal";
                                break;
                            case "Double":
                                result = "Double";
                                break;
                            case "Single":
                                result = "Double";
                                break;
                            case "Boolean":
                                result = "Boolean";
                                break;
                            case "DateTime":
                                result = "Date";
                                break;
                            case "DateTimeOffset":
                                result = "TimeStampTZ";
                                break;
                            case "TimeSpan":
                                result = "IntervalDS";
                                break;
                            case "Byte":
                                result = "Byte";
                                break;
                            case "Byte[]":
                                result = "Raw";
                                break;
                            case "Guid":
                                result = "Varchar2";
                                break;
                        }
                        break;
                    case DataProviders.MySQL:
                        result = "Text";
                        switch (column.DataType.Name)
                        {
                            case "Int16":
                                result = "Int16";
                                break;
                            case "Int32":
                                result = "Int32";
                                break;
                            case "Int64":
                                result = "Int64";
                                break;
                            case "Decimal":
                                result = "Decimal";
                                break;
                            case "Double":
                                result = "Double";
                                break;
                            case "Single":
                                result = "Float";
                                break;
                            case "Boolean":
                                result = "Bit";
                                break;
                            case "DateTime":
                                result = "DateTime";
                                break;
                            case "DateTimeOffset":
                                result = "Timestamp";
                                break;
                            case "TimeSpan":
                                result = "Time";
                                break;
                            case "Byte":
                                result = "Byte";
                                break;
                            case "Byte[]":
                                result = "VarBinary";
                                break;
                            case "Guid":
                                result = "Guid";
                                break;
                        }
                        break;
                    case DataProviders.PostgreSQL:
                        result = "Varchar";
                        switch (column.DataType.Name)
                        {
                            case "Int16":
                                result = "Smallint";
                                break;
                            case "Int32":
                                result = "Integer";
                                break;
                            case "Int64":
                                result = "Bigint";
                                break;
                            case "Decimal":
                                result = "Numeric";
                                break;
                            case "Double":
                                result = "Double";
                                break;
                            case "Single":
                                result = "Real";
                                break;
                            case "Boolean":
                                result = "Boolean";
                                break;
                            case "DateTime":
                                result = "Timestamp";
                                break;
                            case "DateTimeOffset":
                                result = "TimestampTZ";
                                break;
                            case "TimeSpan":
                                result = "Time";
                                break;
                            case "Byte":
                                result = "Char";
                                break;
                            case "Byte[]":
                                result = "Bytea";
                                break;
                            case "Guid":
                                result = "Uuid";
                                break;
                        }
                        break;
                }
            }

            return result;
        }

        public void ExecuteDynamicSQLMapToXml(DynamicRequest request, DynamicResponse response)
        {
            request.RequestID = request.RequestID == null ? "NULL" : request.RequestID;
            Dictionary<string, TransactionDynamicObjects> transactionDynamicObjects = new Dictionary<string, TransactionDynamicObjects>();
            DatabaseFactory? databaseFactory = null;
            IDbTransaction? dbTransaction = null;
            Tuple<string, DataProviders>? connectionInfo = null;

            try
            {
                if (request.DynamicObjects.Count != 1)
                {
                    response.ExceptionText = "거래 요청 정보 확인 필요";
                    return;
                }

                List<string> logQuerys = new List<string>();
                int i = 0;
                foreach (DynamicObject dynamicObject in request.DynamicObjects)
                {
                    StatementMap statementMap = DatabaseMapper.GetStatementMap(dynamicObject.QueryID);
                    if (statementMap == null)
                    {
                        response.ExceptionText = $"QueryID - {dynamicObject.QueryID}에 대한 매핑 정보 필요";
                        return;
                    }

                    if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                    {
                        if (logQuerys.Contains(dynamicObject.QueryID) == false)
                        {
                            logQuerys.Add(dynamicObject.QueryID);
                        }
                    }

                    if (connectionInfo == null)
                    {
                        connectionInfo = GetConnectionInfomation(statementMap.ApplicationID, statementMap.ProjectID, statementMap.DataSourceID);
                    }

                    transactionDynamicObjects.Add(string.Concat(dynamicObject.QueryID, "_", i.ToString()), new TransactionDynamicObjects()
                    {
                        DynamicObject = dynamicObject,
                        StatementMap = statementMap
                    });

                    i = i + 1;
                }

                if (logQuerys.Count > 0)
                {
                    if (ModuleConfiguration.IsTransactionLogging == true)
                    {
                        string logData = $"QueryID: {string.Join(", ", logQuerys.ToArray())}";
                        if (ModuleConfiguration.IsLogServer == true)
                        {
                            dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", GlobalConfiguration.SystemID, logData, "QueryDataClient/ExecuteDynamicSQLMapToXml", (string error) =>
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLMapToXml", request.GlobalID);
                            });
                        }
                        else
                        {
                            logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLMapToXml", request.GlobalID);
                        }
                    }
                }

                if (connectionInfo == null)
                {
                    response.ExceptionText = $"{request.RequestID}에 대한 DataSourceID 데이터 원본 정보 필요";
                    return;
                }

                var databaseProvider = connectionInfo.Item2;
                databaseFactory = new DatabaseFactory(connectionInfo.Item1, connectionInfo.Item2);

                if (databaseFactory == null)
                {
                    response.ExceptionText = $"{request.RequestID}에 대한 DataProvider: {connectionInfo.Item2} 데이터 제공자 정보 확인 필요";
                    return;
                }

                if (request.IsTransaction == true)
                {
                    dbTransaction = databaseFactory.BeginTransaction();
                }

                i = 0;
                List<DataTable> results = new List<DataTable>();
                Dictionary<int, DataRow?> dataRows = new Dictionary<int, DataRow?>();
                foreach (var transactionDynamicObject in transactionDynamicObjects)
                {
                    DynamicObject? dynamicObject = transactionDynamicObject.Value.DynamicObject;
                    StatementMap? statementMap = transactionDynamicObject.Value.StatementMap;

                    if (dynamicObject == null || statementMap == null)
                    {
                        continue;
                    }

                    dynamic? dynamicParameters = CreateDynamicParameters(databaseProvider, statementMap);
                    if (dynamicParameters != null && dynamicObject.Parameters.Count() > 0)
                    {
                        if (dynamicObject.BaseFieldMappings != null && dynamicObject.BaseFieldMappings.Count() > 0)
                        {
                            int baseSequence = statementMap.Seq - 1;
                            DataRow? dataRow = null;
                            if (dataRows.Count > 0 && statementMap.Seq > 0)
                            {
                                dataRow = dataRows.GetValueOrDefault(baseSequence);
                            }

                            for (int baseFieldIndex = 0; baseFieldIndex < dynamicObject.BaseFieldMappings.Count; baseFieldIndex++)
                            {
                                BaseFieldMapping baseFieldMapping = dynamicObject.BaseFieldMappings[baseFieldIndex];

                                if (string.IsNullOrEmpty(baseFieldMapping.BaseSequence) == false)
                                {
                                    int baseSequenceMapping = int.Parse(baseFieldMapping.BaseSequence);
                                    if (baseSequence != baseSequenceMapping)
                                    {
                                        baseSequence = baseSequenceMapping;
                                        dataRow = dataRows.GetValueOrDefault(baseSequence);
                                    }
                                }

                                if (dataRow == null)
                                {
                                    response.ExceptionText = $"BaseFieldMappings - QueryID: '{dynamicObject.QueryID}', Sequence: '{baseSequence}'에 대한 매핑 정보 필요";
                                    return;
                                }

                                if (dataRow[baseFieldMapping.SourceFieldID] == null)
                                {
                                    response.ExceptionText = $"BaseFieldMappings - QueryID: '{dynamicObject.QueryID}', Sequence: '{baseSequence}'에 대한 SourceFieldID {baseFieldMapping.SourceFieldID} 컬럼 정보 필요";
                                    return;
                                }

                                DynamicParameter? dynamicParameter = dynamicObject.Parameters.Where(p => p.ParameterName == baseFieldMapping.TargetFieldID).FirstOrDefault();

                                if (dynamicParameter == null)
                                {
                                    response.ExceptionText = $"BaseFieldMappings - {dynamicObject.QueryID}에 대한 TargetFieldID {baseFieldMapping.SourceFieldID} 컬럼 정보 필요";
                                    return;
                                }

                                dynamicParameter.Value = dataRow[baseFieldMapping.SourceFieldID];
                            }
                        }

                        SetDbParameterMapping(databaseFactory, databaseProvider, dynamicObject, statementMap, dynamicParameters);
                    }
                    else
                    {
                        SetDbParameterMapping(databaseFactory, databaseProvider, dynamicObject, statementMap, dynamicParameters);
                    }

                    string SQLID = string.Empty;
                    string executeDataID = dynamicObject.QueryID + "_" + i.ToString();
                    if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                    {
                        string logData = $"Pretreatment {executeDataID}, ParseSQL Parameters: {JsonConvert.SerializeObject(dynamicObject)}";
                        if (ModuleConfiguration.IsLogServer == true)
                        {
                            dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLToXml", (string error) =>
                            {
                                logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLToXml");
                            });
                        }
                        else
                        {
                            logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLToXml", request.GlobalID);
                        }
                    }

                    var pretreatment = DatabaseMapper.FindPretreatment(statementMap, dynamicObject);
                    if (pretreatment.SQL != null && pretreatment.ResultType != null)
                    {
                        if (pretreatment.SQL.Replace(Environment.NewLine, "").Replace("\t", "").Trim() != "")
                        {
                            SQLID = executeDataID + "_pretreatment";

                            if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                            {
                                string logData = $"SQLID: {SQLID}, Parameters: {JsonConvert.SerializeObject(dynamicParameters)}";
                                if (ModuleConfiguration.IsLogServer == true)
                                {
                                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLMap", (string error) =>
                                    {
                                        logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLToXml");
                                    });
                                }
                                else
                                {
                                    logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLToXml", request.GlobalID);
                                }
                            }

                            ConsoleProfiler consoleProfiler = new ConsoleProfiler(request.RequestID, SQLID, ModuleConfiguration.IsTransactionLogging == true ? ModuleConfiguration.TransactionLogFilePath : null);
                            var preConnection = new ProfilerDbConnection(databaseFactory.Connection, consoleProfiler);

                            IDataReader? preReader = null;

                            try
                            {
                                preReader = preConnection.ExecuteReader(pretreatment.SQL, dynamicParameters as SqlMapper.IDynamicParameters, dbTransaction, statementMap.Timeout < 0 ? ModuleConfiguration.DefaultCommandTimeout : statementMap.Timeout);

                                string logData = $"SQLID: {SQLID}, ExecuteSQL: {consoleProfiler.ExecuteSQL}";
                                if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                                {
                                    if (ModuleConfiguration.IsLogServer == true)
                                    {
                                        dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLToXml", (string error) =>
                                        {
                                            logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLToXml");
                                        });
                                    }
                                    else
                                    {
                                        logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLToXml", request.GlobalID);
                                    }
                                }
                            }
                            catch (Exception exception)
                            {
                                if (request.IsTransaction == true)
                                {
                                    databaseFactory.RollbackTransaction();
                                }

                                response.ExceptionText = $"SQLID: {SQLID}, ExecuteSQL: {consoleProfiler.ExecuteSQL}, ExceptionText: {exception.ToMessage()}";

                                if (ModuleConfiguration.IsLogServer == true)
                                {
                                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, response.ExceptionText, "QueryDataClient/ExecuteDynamicSQLToXml", (string error) =>
                                    {
                                        logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + response.ExceptionText, "QueryDataClient/ExecuteDynamicSQLToXml");
                                    });
                                }
                                else
                                {
                                    logger.Error("[{LogCategory}] [{GlobalID}] " + response.ExceptionText, "QueryDataClient/ExecuteDynamicSQLToXml", request.GlobalID);
                                }

                                if (preReader != null)
                                {
                                    preReader.Close();
                                }

                                if (preConnection.IsConnectionOpen() == true)
                                {
                                    preConnection.Close();
                                }

                                return;
                            }

                            using (DataSet? ds = DataTableHelper.DataReaderToDataSet(preReader))
                            {
                                var resultTypes = pretreatment.ResultType.Split(",");
                                if (ds == null || resultTypes.Count() != ds.Tables.Count)
                                {
                                    response.ExceptionText = $"Pretreatment - 전처리 쿼리 실행 결과와 {pretreatment.ResultType} 설정 확인 필요";
                                    return;
                                }

                                for (int j = 0; j < ds.Tables.Count; j++)
                                {
                                    string resultType = resultTypes[j].Trim();
                                    DataTable table = ds.Tables[j];

                                    if (resultType == "Row")
                                    {
                                        DataRow rowItem = table.Rows[0];
                                        DataColumnCollection colItems = table.Columns;
                                        foreach (DataColumn item in colItems)
                                        {
                                            PretreatmentAddParameter(databaseProvider, statementMap, dynamicParameters, rowItem, item);

                                            DynamicParameter? dynamicParameter = dynamicObject.Parameters.Where(p => p.ParameterName == item.ColumnName).FirstOrDefault();

                                            if (dynamicParameter == null)
                                            {
                                                DataProviders? dataProvider = null;
                                                if (statementMap.NativeDataClient == true)
                                                {
                                                    dataProvider = databaseProvider;
                                                }

                                                dynamicParameter = new DynamicParameter();
                                                dynamicParameter.ParameterName = item.ColumnName;
                                                dynamicParameter.Length = item.MaxLength;
                                                dynamicParameter.DbType = GetProviderDbType(item, dataProvider);
                                                dynamicParameter.Value = rowItem[item.ColumnName];
                                                dynamicObject.Parameters.Add(dynamicParameter);
                                            }
                                            else
                                            {
                                                dynamicParameter.Value = rowItem[item.ColumnName];
                                            }
                                        }
                                    }
                                    else if (resultType == "List")
                                    {
                                        List<object> parameters = new List<object>();
                                        DataColumnCollection colItems = table.Columns;
                                        foreach (DataColumn item in colItems)
                                        {
                                            DataView dataView = new DataView(table);
                                            DataTable dataTable = dataView.ToTable(true, item.ColumnName);
                                            foreach (DataRow row in dataTable.Rows)
                                            {
                                                parameters.Add(row[0]);
                                            }

                                            if (parameters.Count > 0)
                                            {
                                                if (dynamicParameters != null)
                                                {
                                                    dynamicParameters.Add(item.ColumnName, parameters);
                                                }

                                                DynamicParameter? dynamicParameter = dynamicObject.Parameters.Where(p => p.ParameterName == item.ColumnName).FirstOrDefault();

                                                if (dynamicParameter == null)
                                                {
                                                    DataProviders? dataProvider = null;
                                                    if (statementMap.NativeDataClient == true)
                                                    {
                                                        dataProvider = databaseProvider;
                                                    }

                                                    dynamicParameter = new DynamicParameter();
                                                    dynamicParameter.ParameterName = item.ColumnName;
                                                    dynamicParameter.Length = item.MaxLength;
                                                    dynamicParameter.DbType = GetProviderDbType(item, dataProvider);
                                                    dynamicParameter.Value = parameters;
                                                    dynamicObject.Parameters.Add(dynamicParameter);
                                                }
                                                else
                                                {
                                                    dynamicParameter.Value = parameters;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (string.IsNullOrEmpty(statementMap.BeforeTransactionCommand) == false)
                    {
                        string logData = "";
                        if (ModuleConfiguration.IsTransactionLogging == true)
                        {
                            logData = $"GlobalID={request.GlobalID}, QueryID={dynamicObject.QueryID}, CommandID={statementMap.BeforeTransactionCommand}, , dynamicParameters={JsonConvert.SerializeObject(dynamicParameters)}";
                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", GlobalConfiguration.SystemID, logData, $"ExecuteDynamicSQLMapToXml/BeforeTransactionCommand", (string error) =>
                                {
                                    logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "ExecuteDynamicSQLMapToXml/BeforeTransactionCommand");
                                });
                            }
                            else
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "ExecuteDynamicSQLMapToXml/BeforeTransactionCommand", request.GlobalID);
                            }
                        }

                        var transactionCommands = statementMap.BeforeTransactionCommand.Split("|");
                        BusinessApiClient businessApiClient = new BusinessApiClient(logger);
                        string? beforeCommandResult = businessApiClient.OnewayTransactionCommand(transactionCommands, request.GlobalID, dynamicObject.QueryID, dynamicParameters);
                        if (string.IsNullOrEmpty(beforeCommandResult) == false)
                        {
                            response.ExceptionText = $"ExecuteDynamicSQLMapToXml.BeforeTransactionCommand Error: {beforeCommandResult}";

                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, $"{response.ExceptionText}, {logData}", $"ExecuteDynamicSQLMapToXml/BeforeTransactionCommand", (string error) =>
                                {
                                    logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + $"{response.ExceptionText}, {logData}", "ExecuteDynamicSQLMapToXml/BeforeTransactionCommand");
                                });
                            }
                            else
                            {
                                logger.Error("[{LogCategory}] [{GlobalID}] " + $"{response.ExceptionText}, {logData}", "ExecuteDynamicSQLMapToXml/BeforeTransactionCommand", request.GlobalID);
                            }

                            return;
                        }
                    }

                    SQLID = executeDataID + "_statement";
                    ConsoleProfiler profiler = new ConsoleProfiler(request.RequestID, executeDataID, ModuleConfiguration.IsTransactionLogging == true ? ModuleConfiguration.TransactionLogFilePath : null);
                    IDataReader? reader = null;
                    try
                    {
                        if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                        {
                            string logData = $"SQLID: {SQLID}, ParseSQL Parameters: {JsonConvert.SerializeObject(dynamicObject)}";
                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLMapToXml", (string error) =>
                                {
                                    logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLMapToXml");
                                });
                            }
                            else
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLMapToXml", request.GlobalID);
                            }
                        }

                        string parseSQL = DatabaseMapper.Find(statementMap, dynamicObject);
                        if (string.IsNullOrEmpty(parseSQL) == true || parseSQL.Replace(Environment.NewLine, "").Replace("\t", "").Trim() == "")
                        {
                            if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                            {
                                string logData = $"SQLID: {SQLID}, Parameters: {JsonConvert.SerializeObject(dynamicParameters)}";
                                if (ModuleConfiguration.IsLogServer == true)
                                {
                                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLMap", (string error) =>
                                    {
                                        logger.Information("[{LogCategory}] " + "fallback error: " + error + ", empty SQL passing" + logData, "QueryDataClient/ExecuteDynamicSQLMapToXml");
                                    });
                                }
                                else
                                {
                                    logger.Information("[{LogCategory}] [{GlobalID}] empty SQL passing" + logData, "QueryDataClient/ExecuteDynamicSQLMapToXml", request.GlobalID);
                                }
                            }

                            continue;
                        }

                        if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                        {
                            string logData = $"SQLID: {SQLID}, Parameters: {JsonConvert.SerializeObject(dynamicParameters)}";
                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLMapToXml", (string error) =>
                                {
                                    logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLMapToXml");
                                });
                            }
                            else
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLMapToXml", request.GlobalID);
                            }
                        }

                        var connection = new ProfilerDbConnection(databaseFactory.Connection, profiler);

                        try
                        {
                            reader = connection.ExecuteReader(parseSQL, dynamicParameters as SqlMapper.IDynamicParameters, dbTransaction, statementMap.Timeout < 0 ? ModuleConfiguration.DefaultCommandTimeout : statementMap.Timeout);
                        }
                        catch
                        {
                            if (reader != null && reader.IsClosed == false)
                            {
                                reader.Close();
                            }

                            if (connection.IsConnectionOpen() == true)
                            {
                                connection.Close();
                            }
                            throw;
                        }

                        if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                        {
                            string logData = $"SQLID: {SQLID}, ExecuteSQL: {profiler.ExecuteSQL}";
                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLMapToXml", (string error) =>
                                {
                                    logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLMapToXml");
                                });
                            }
                            else
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLMapToXml", request.GlobalID);
                            }
                        }
                    }
                    catch (Exception exception)
                    {
                        if (request.IsTransaction == true)
                        {
                            databaseFactory.RollbackTransaction();
                        }

                        response.ExceptionText = exception.ToMessage();
                        string logData = $"SQLID: {SQLID}, ExecuteSQL: {profiler.ExecuteSQL}, ExceptionText: {response.ExceptionText}";

                        if (ModuleConfiguration.IsLogServer == true)
                        {
                            dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLMapToXml", (string error) =>
                            {
                                logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLMapToXml");
                            });
                        }
                        else
                        {
                            logger.Error("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLMapToXml", request.GlobalID);
                        }

                        if (string.IsNullOrEmpty(statementMap.FallbackTransactionCommand) == false)
                        {
                            logData = $"GlobalID={request.GlobalID}, QueryID={dynamicObject.QueryID}, FallbackTransactionCommand: {statementMap.FallbackTransactionCommand}, dynamicParameters={JsonConvert.SerializeObject(dynamicParameters)}";
                            if (ModuleConfiguration.IsLogServer == true)
                            {
                                dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", GlobalConfiguration.SystemID, logData, "QueryDataClient/FallbackTransactionCommand", (string error) =>
                                {
                                    logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/FallbackTransactionCommand");
                                });
                            }
                            else
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/FallbackTransactionCommand", request.GlobalID);
                            }

                            var transactionCommands = statementMap.FallbackTransactionCommand.Split("|");
                            BusinessApiClient businessApiClient = new BusinessApiClient(logger);
                            string? fallbackCommandResult = businessApiClient.OnewayTransactionCommandAsync(transactionCommands, request.GlobalID, dynamicObject.QueryID, dynamicParameters);
                            if (string.IsNullOrEmpty(fallbackCommandResult) == false)
                            {
                                response.ExceptionText = response.ExceptionText + $", ExecuteDynamicSQLMapToXml.FallbackTransactionCommand Error: {fallbackCommandResult}";

                                if (ModuleConfiguration.IsLogServer == true)
                                {
                                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, $"{response.ExceptionText}, {logData}", $"QueryDataClient/FallbackTransactionCommand", (string error) =>
                                    {
                                        logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + $"{response.ExceptionText}, {logData}", "QueryDataClient/FallbackTransactionCommand");
                                    });
                                }
                                else
                                {
                                    logger.Error("[{LogCategory}] [{GlobalID}] " + $"{response.ExceptionText}, {logData}", "QueryDataClient/FallbackTransactionCommand", request.GlobalID);
                                }

                                return;
                            }
                        }
                    }
                    finally
                    {
                        if (string.IsNullOrEmpty(response.ExceptionText) == false)
                        {
                            if (reader != null)
                            {
                                if (reader.IsClosed == false)
                                {
                                    reader.Close();
                                }
                                reader.Dispose();
                            }
                        }
                    }

                    if (string.IsNullOrEmpty(response.ExceptionText) == true)
                    {
                        if (string.IsNullOrEmpty(statementMap.AfterTransactionCommand) == false)
                        {
                            var transactionCommands = statementMap.AfterTransactionCommand.Split("|");
                            BusinessApiClient businessApiClient = new BusinessApiClient(logger);
                            string? afterCommandResult = businessApiClient.OnewayTransactionCommandAsync(transactionCommands, request.GlobalID, dynamicObject.QueryID, dynamicParameters);
                            if (string.IsNullOrEmpty(afterCommandResult) == false)
                            {
                                response.ExceptionText = $"ExecuteDynamicSQLMapToXml.AfterTransactionCommand Error: GlobalID={request.GlobalID}, QueryID={dynamicObject.QueryID}, CommandID={statementMap.AfterTransactionCommand}, CommandResult={afterCommandResult}";
                                return;
                            }
                        }
                    }
                    else
                    {
                        return;
                    }

                    if (dynamicObject.IgnoreResult == true)
                    {
                        using (DataTable dataTable = new DataTable())
                        using (DataTable? schemaTable = reader?.GetSchemaTable())
                        {
                            if (schemaTable == null)
                            {
                                continue;
                            }

                            DataRow row;

                            string columnName;
                            DataColumn column;
                            int count = schemaTable.Rows.Count;

                            for (int j = 0; j < count; j++)
                            {
                                row = schemaTable.Rows[j];
                                columnName = (string)row["ColumnName"];

                                column = new DataColumn(columnName, (Type)row["DataType"]);
                                dataTable.Columns.Add(column);
                            }

                            object[] values = new object[count];

                            if (reader != null)
                            {
                                try
                                {
                                    dataTable.BeginLoadData();
                                    while (reader.Read())
                                    {
                                        reader.GetValues(values);
                                        dataTable.LoadDataRow(values, true);
                                    }
                                }
                                catch (Exception exception)
                                {
                                    if (reader.IsClosed == false)
                                    {
                                        reader.Close();
                                    }
                                    logger.Error("[{LogCategory}] [{GlobalID}] " + exception.ToMessage(), "QueryDataClient/ExecuteDynamicSQLMapToXml", request.GlobalID);
                                    throw;
                                }
                                finally
                                {
                                    dataTable.EndLoadData();
                                    reader.Close();
                                }
                            }

                            if (dataTable.Rows.Count > 0)
                            {
                                dataRows[statementMap.Seq] = dataTable.Rows[dataTable.Rows.Count - 1];
                            }
                            else
                            {
                                dataRows[statementMap.Seq] = null;
                            }
                        }
                    }
                    else
                    {
                        using (DataSet? ds = DataTableHelper.DataReaderToDataSet(reader, "Table" + statementMap.Seq.ToString(), 1))
                        {
                            if (ds != null)
                            {
                                for (int j = 0; j < ds.Tables.Count; j++)
                                {
                                    DataTable table = ds.Tables[j];

                                    if (table.Rows.Count > 0)
                                    {
                                        dataRows[statementMap.Seq] = table.Rows[table.Rows.Count - 1];
                                    }
                                    else
                                    {
                                        dataRows[statementMap.Seq] = null;
                                    }

                                    results.Add(table.Copy());

                                    i++;
                                }
                            }
                        }
                    }
                }

                if (request.IsTransaction == true)
                {
                    databaseFactory.CommitTransaction();
                }

                using (DataSet ds = new DataSet())
                using (var memoryStream = new MemoryStream())
                using (TextWriter streamWriter = new StreamWriter(memoryStream))
                {
                    ds.Tables.AddRange(results.ToArray());
                    var xmlSerializer = new XmlSerializer(typeof(DataSet));
                    xmlSerializer.Serialize(streamWriter, ds);
                    response.ResultObject = Encoding.UTF8.GetString(memoryStream.ToArray());
                }

                response.Acknowledge = AcknowledgeType.Success;
            }
            catch (Exception exception)
            {
                if (databaseFactory != null && request.IsTransaction == true)
                {
                    databaseFactory.RollbackTransaction();
                }

                response.ExceptionText = exception.ToMessage();

                if (ModuleConfiguration.IsLogServer == true)
                {
                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, response.ExceptionText, "QueryDataClient/ExecuteDynamicSQLMapToXml", (string error) =>
                    {
                        logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + response.ExceptionText, "QueryDataClient/ExecuteDynamicSQLMapToXml");
                    });
                }
                else
                {
                    logger.Error("[{LogCategory}] [{GlobalID}] " + response.ExceptionText, "QueryDataClient/ExecuteDynamicSQLMapToXml", request.GlobalID);
                }
            }
            finally
            {
                databaseFactory?.Connection?.Close();
                databaseFactory?.Dispose();
            }
        }

        public void ExecuteCodeHelpSQLMap(DynamicRequest request, DynamicResponse response)
        {
            request.RequestID = request.RequestID == null ? "NULL" : request.RequestID;
            Dictionary<string, TransactionDynamicObjects> transactionDynamicObjects = new Dictionary<string, TransactionDynamicObjects>();
            DatabaseFactory? databaseFactory = null;
            IDbTransaction? dbTransaction = null;
            Tuple<string, DataProviders>? connectionInfo = null;

            try
            {
                List<string> logQuerys = new List<string>();
                int i = 0;
                foreach (DynamicObject dynamicObject in request.DynamicObjects)
                {
                    StatementMap statementMap = DatabaseMapper.GetStatementMap(dynamicObject.QueryID);
                    if (statementMap == null)
                    {
                        response.ExceptionText = $"QueryID - {dynamicObject.QueryID}에 대한 매핑 정보 필요";
                        return;
                    }

                    if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                    {
                        if (logQuerys.Contains(dynamicObject.QueryID) == false)
                        {
                            logQuerys.Add(dynamicObject.QueryID);
                        }
                    }

                    if (connectionInfo == null)
                    {
                        connectionInfo = GetConnectionInfomation(statementMap.ApplicationID, statementMap.ProjectID, statementMap.DataSourceID);
                    }

                    transactionDynamicObjects.Add(string.Concat(dynamicObject.QueryID, "_", i.ToString()), new TransactionDynamicObjects()
                    {
                        DynamicObject = dynamicObject,
                        StatementMap = statementMap,
                    });

                    i = i + 1;
                }

                if (logQuerys.Count > 0)
                {
                    if (ModuleConfiguration.IsTransactionLogging == true)
                    {
                        string logData = $"QueryID: {string.Join(", ", logQuerys.ToArray())}";
                        if (ModuleConfiguration.IsLogServer == true)
                        {
                            dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", GlobalConfiguration.SystemID, logData, "QueryDataClient/ExecuteCodeHelpSQLMap", (string error) =>
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteCodeHelpSQLMap", request.GlobalID);
                            });
                        }
                        else
                        {
                            logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteCodeHelpSQLMap", request.GlobalID);
                        }
                    }
                }

                if (connectionInfo == null)
                {
                    response.ExceptionText = $"{request.RequestID}에 대한 DataSourceID 데이터 원본 정보 필요";
                    return;
                }

                var databaseProvider = connectionInfo.Item2;
                databaseFactory = new DatabaseFactory(connectionInfo.Item1, connectionInfo.Item2);

                if (databaseFactory == null)
                {
                    response.ExceptionText = $"{request.RequestID}에 대한 DataProvider: {connectionInfo.Item2} 데이터 제공자 정보 확인 필요";
                    return;
                }

                if (request.IsTransaction == true)
                {
                    dbTransaction = databaseFactory.BeginTransaction();
                }

                i = 0;
                ResponseCodeObject responseCodeObject = new ResponseCodeObject();
                foreach (var transactionDynamicObject in transactionDynamicObjects)
                {
                    DynamicObject? dynamicObject = transactionDynamicObject.Value.DynamicObject;
                    StatementMap? statementMap = transactionDynamicObject.Value.StatementMap;

                    if (dynamicObject == null || statementMap == null)
                    {
                        continue;
                    }

                    if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                    {
                        string SQLID = dynamicObject.QueryID + "_" + i.ToString();
                        string logData = $"SQLID: {SQLID}, ParseSQL Parameters: {JsonConvert.SerializeObject(dynamicObject)}";
                        if (ModuleConfiguration.IsLogServer == true)
                        {
                            dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteCodeHelpSQLMap", (string error) =>
                            {
                                logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteCodeHelpSQLMap");
                            });
                        }
                        else
                        {
                            logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteCodeHelpSQLMap", request.GlobalID);
                        }
                    }

                    string parseSQL = DatabaseMapper.Find(statementMap, dynamicObject);
                    dynamic? dynamicParameters = CreateDynamicParameters(databaseProvider, statementMap);
                    SetDbParameterMapping(databaseFactory, databaseProvider, dynamicObject, statementMap, dynamicParameters);
                    var connection = new ProfilerDbConnection(databaseFactory.Connection, new ConsoleProfiler(request.RequestID, dynamicObject.QueryID + "_" + i.ToString() + "_statment", ModuleConfiguration.IsTransactionLogging == true ? ModuleConfiguration.TransactionLogFilePath : null));
                    var reader = connection.ExecuteReader(parseSQL, dynamicParameters as SqlMapper.IDynamicParameters, dbTransaction, statementMap.Timeout < 0 ? ModuleConfiguration.DefaultCommandTimeout : statementMap.Timeout);
                    using (DataSet? ds = DataTableHelper.DataReaderToDataSet(reader))
                    {
                        if (ds == null || ds.Tables.Count < 2)
                        {
                            response.ExceptionText = $"TransactionID: {statementMap.TransactionID}, StatementID: {statementMap.StatementID}에 대한 데이터 정보 확인 필요";
                            return;
                        }

                        DataTable table = ds.Tables[0];
                        if (table.Rows.Count == 1)
                        {
                            DataRow item = table.Rows[0];
                            Tuple<string, DataProviders>? businessConnectionInfo = GetConnectionInfomation(item.GetStringEmpty("ApplicationID"), item.GetStringEmpty("ProjectID"), item.GetStringEmpty("DataSourceID"));

                            if (businessConnectionInfo == null)
                            {
                                response.ExceptionText = $"DataSourceID - {item.GetStringEmpty("ApplicationID")}_{item.GetStringEmpty("ProjectID")}_{item.GetStringEmpty("DataSourceID")}에 대한 데이터 원본 정보 필요";
                                return;
                            }

                            string commandText = item.GetStringEmpty("CommandText");

                            DynamicParameters businessParameters = new DynamicParameters();
                            JObject adHocParameters = new JObject();

                            object? value = dynamicObject.Parameters[2].Value;
                            if (value != null)
                            {
                                string? dynamicValue = value.ToString();
                                string parameters = string.IsNullOrEmpty(dynamicValue) == true ? "" : dynamicValue;

                                string[] codeHelpParameters = parameters.Split(';');
                                foreach (string codeHelpParameter in codeHelpParameters)
                                {
                                    if (codeHelpParameter.Length > 0)
                                    {
                                        string parameterName = codeHelpParameter.Split(':')[0].Trim();
                                        string parameterValue = codeHelpParameter.Split(':')[1].Trim();

                                        businessParameters.Add(
                                            parameterName,
                                            parameterValue,
                                            DbType.String,
                                            ParameterDirection.Input,
                                            -1
                                        );

                                        adHocParameters.Add(GetParameterName(parameterName), string.IsNullOrEmpty(parameterValue) == true ? null : JToken.FromObject(parameterValue));
                                    }
                                }
                            }

                            responseCodeObject.Description = item.GetStringEmpty("Description");
                            responseCodeObject.CodeColumnID = item.GetStringEmpty("CodeColumnID");
                            responseCodeObject.ValueColumnID = item.GetStringEmpty("ValueColumnID");
                            responseCodeObject.CreateDateTime = item.GetStringEmpty("CreateDateTime");
                            responseCodeObject.Scheme = new List<Scheme>();

                            DataTable schemeDataTable = ds.Tables[1];
                            foreach (DataRow row in schemeDataTable.Rows)
                            {
                                string val = row.GetStringEmpty("HiddenYN");

                                responseCodeObject.Scheme.Add(new Scheme()
                                {
                                    ColumnID = row.GetStringEmpty("ColumnID"),
                                    ColumnText = row.GetStringEmpty("ColumnText"),
                                    HiddenYN = (val == "true" || val == "True" || val == "TRUE" || val == "Y" || val == "1")
                                });
                            }

                            string keyString = "";
                            commandText = DatabaseMapper.RecursiveParameters(commandText, adHocParameters, keyString);

                            var transactionLogger = loggerFactory.CreateLogger(dynamicObject.QueryID);
                            transactionLogger.LogWarning($"Request GlobalID: {request.RequestID}, SQL: {commandText}");

                            using (DatabaseFactory businessDatabase = new DatabaseFactory(businessConnectionInfo.Item1, businessConnectionInfo.Item2))
                            {
                                DbConnection? businessConnection = businessDatabase.Connection;
                                if (businessConnection != null)
                                {
                                    var businessReader = businessConnection.ExecuteReader(commandText, businessParameters);

                                    using (DataSet? dsCode = DataTableHelper.DataReaderToDataSet(businessReader))
                                    {
                                        if (dsCode != null && dsCode.Tables.Count > 0)
                                        {
                                            responseCodeObject.DataSource = dsCode.Tables[0];
                                        }
                                    }
                                }
                            }
                        }
                    }

                    reader.Close();
                }

                if (request.IsTransaction == true)
                {
                    databaseFactory.CommitTransaction();
                }

                response.ResultJson = responseCodeObject;
                response.Acknowledge = AcknowledgeType.Success;
            }
            catch (Exception exception)
            {
                if (databaseFactory != null && request.IsTransaction == true)
                {
                    databaseFactory.RollbackTransaction();
                }

                response.ExceptionText = exception.ToMessage();

                if (ModuleConfiguration.IsLogServer == true)
                {
                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, response.ExceptionText, "QueryDataClient/ExecuteCodeHelpSQLMap", (string error) =>
                    {
                        logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + response.ExceptionText, "QueryDataClient/ExecuteCodeHelpSQLMap");
                    });
                }
                else
                {
                    logger.Error("[{LogCategory}] [{GlobalID}] " + response.ExceptionText, "QueryDataClient/ExecuteCodeHelpSQLMap", request.GlobalID);
                }
            }
            finally
            {
                databaseFactory?.Connection?.Close();
                databaseFactory?.Dispose();
            }
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

        public void ExecuteSchemeOnlySQLMap(DynamicRequest request, DynamicResponse response)
        {
            request.RequestID = request.RequestID == null ? "NULL" : request.RequestID;
            Dictionary<string, TransactionDynamicObjects> transactionDynamicObjects = new Dictionary<string, TransactionDynamicObjects>();
            DatabaseFactory? databaseFactory = null;
            IDbTransaction? dbTransaction = null;
            Tuple<string, DataProviders>? connectionInfo = null;

            try
            {
                List<string> logQuerys = new List<string>();
                int i = 0;
                foreach (DynamicObject dynamicObject in request.DynamicObjects)
                {
                    StatementMap statementMap = DatabaseMapper.GetStatementMap(dynamicObject.QueryID);
                    if (statementMap == null)
                    {
                        response.ExceptionText = $"QueryID - {dynamicObject.QueryID}에 대한 매핑 정보 필요";
                        return;
                    }

                    if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                    {
                        if (logQuerys.Contains(dynamicObject.QueryID) == false)
                        {
                            logQuerys.Add(dynamicObject.QueryID);
                        }
                    }

                    if (connectionInfo == null)
                    {
                        connectionInfo = GetConnectionInfomation(statementMap.ApplicationID, statementMap.ProjectID, statementMap.DataSourceID);
                    }

                    transactionDynamicObjects.Add(string.Concat(dynamicObject.QueryID, "_", i.ToString()), new TransactionDynamicObjects()
                    {
                        DynamicObject = dynamicObject,
                        StatementMap = statementMap
                    });

                    i = i + 1;
                }

                if (logQuerys.Count > 0)
                {
                    if (ModuleConfiguration.IsTransactionLogging == true)
                    {
                        string logData = $"QueryID: {string.Join(", ", logQuerys.ToArray())}";
                        if (ModuleConfiguration.IsLogServer == true)
                        {
                            dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", GlobalConfiguration.SystemID, logData, "QueryDataClient/ExecuteSchemeOnlySQLMap", (string error) =>
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteSchemeOnlySQLMap", request.GlobalID);
                            });
                        }
                        else
                        {
                            logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteSchemeOnlySQLMap", request.GlobalID);
                        }
                    }
                }

                if (connectionInfo == null)
                {
                    response.ExceptionText = $"{request.RequestID}에 대한 DataSourceID 데이터 원본 정보 필요";
                    return;
                }

                var databaseProvider = connectionInfo.Item2;
                databaseFactory = new DatabaseFactory(connectionInfo.Item1, connectionInfo.Item2);

                if (databaseFactory == null)
                {
                    response.ExceptionText = $"{request.RequestID}에 대한 DataProvider: {connectionInfo.Item2} 데이터 제공자 정보 확인 필요";
                    return;
                }

                if (request.IsTransaction == true)
                {
                    dbTransaction = databaseFactory.BeginTransaction();
                }

                i = 0;
                DataRow? dataRow = null;
                DataTable additionalData = new DataTable();
                additionalData.Columns.Add("MSG_CD", typeof(string));
                additionalData.Columns.Add("MSG_TXT", typeof(string));
                Dictionary<string, List<HandStack.Web.MessageContract.DataObject.DbColumn>> mergeDatas = new Dictionary<string, List<HandStack.Web.MessageContract.DataObject.DbColumn>>();
                foreach (var transactionDynamicObject in transactionDynamicObjects)
                {
                    DynamicObject? dynamicObject = transactionDynamicObject.Value.DynamicObject;
                    StatementMap? statementMap = transactionDynamicObject.Value.StatementMap;

                    if (dynamicObject == null || statementMap == null)
                    {
                        continue;
                    }

                    dynamic? dynamicParameters = CreateDynamicParameters(databaseProvider, statementMap);
                    if (dynamicParameters != null && dynamicObject.Parameters.Count() > 0)
                    {
                        if (dynamicObject.BaseFieldMappings != null && dynamicObject.BaseFieldMappings.Count() > 0)
                        {
                            if (dataRow == null)
                            {
                                response.ExceptionText = $"BaseFieldMappings - {dynamicObject.QueryID}에 대한 매핑 정보 필요";
                                return;
                            }

                            for (int baseFieldIndex = 0; baseFieldIndex < dynamicObject.BaseFieldMappings.Count; baseFieldIndex++)
                            {
                                BaseFieldMapping baseFieldMapping = dynamicObject.BaseFieldMappings[baseFieldIndex];

                                if (dataRow[baseFieldMapping.SourceFieldID] == null)
                                {
                                    response.ExceptionText = $"BaseFieldMappings - {dynamicObject.QueryID}에 대한 SourceFieldID {baseFieldMapping.SourceFieldID} 컬럼 정보 필요";
                                    return;
                                }

                                DynamicParameter? dynamicParameter = dynamicObject.Parameters.Where(p => p.ParameterName == baseFieldMapping.TargetFieldID).FirstOrDefault();

                                if (dynamicParameter == null)
                                {
                                    response.ExceptionText = $"BaseFieldMappings - {dynamicObject.QueryID}에 대한 TargetFieldID {baseFieldMapping.SourceFieldID} 컬럼 정보 필요";
                                    return;
                                }

                                dynamicParameter.Value = dataRow[baseFieldMapping.SourceFieldID];
                            }
                        }

                        SetDbParameterMapping(databaseFactory, databaseProvider, dynamicObject, statementMap, dynamicParameters);
                    }
                    else
                    {
                        SetDbParameterMapping(databaseFactory, databaseProvider, dynamicObject, statementMap, dynamicParameters);
                    }

                    string SQLID = string.Empty;
                    string executeDataID = dynamicObject.QueryID + "_" + i.ToString();
                    if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                    {
                        string logData = $"Pretreatment {executeDataID}, ParseSQL Parameters: {JsonConvert.SerializeObject(dynamicObject)}";
                        if (ModuleConfiguration.IsLogServer == true)
                        {
                            dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteSchemeOnlySQLMap", (string error) =>
                            {
                                logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteSchemeOnlySQLMap");
                            });
                        }
                        else
                        {
                            logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteSchemeOnlySQLMap", request.GlobalID);
                        }
                    }

                    var pretreatment = DatabaseMapper.FindPretreatment(statementMap, dynamicObject);
                    if (pretreatment.SQL != null && pretreatment.ResultType != null)
                    {
                        if (pretreatment.SQL.Replace(Environment.NewLine, "").Replace("\t", "").Trim() != "")
                        {
                            SQLID = executeDataID + "_pretreatment";

                            if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                            {
                                string logData = $"SQLID: {SQLID}, Parameters: {JsonConvert.SerializeObject(dynamicParameters)}";
                                if (ModuleConfiguration.IsLogServer == true)
                                {
                                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLMap", (string error) =>
                                    {
                                        logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteSchemeOnlySQLMap");
                                    });
                                }
                                else
                                {
                                    logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteSchemeOnlySQLMap", request.GlobalID);
                                }
                            }

                            ConsoleProfiler consoleProfiler = new ConsoleProfiler(request.RequestID, SQLID, ModuleConfiguration.IsTransactionLogging == true ? ModuleConfiguration.TransactionLogFilePath : null);
                            var preConnection = new ProfilerDbConnection(databaseFactory.Connection, consoleProfiler);

                            IDataReader? preReader = null;

                            try
                            {
                                preReader = preConnection.ExecuteReader(pretreatment.SQL, dynamicParameters as SqlMapper.IDynamicParameters, dbTransaction, statementMap.Timeout < 0 ? ModuleConfiguration.DefaultCommandTimeout : statementMap.Timeout);

                                string logData = $"SQLID: {SQLID}, ExecuteSQL: {consoleProfiler.ExecuteSQL}";
                                if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                                {
                                    if (ModuleConfiguration.IsLogServer == true)
                                    {
                                        dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteSchemeOnlySQLMap", (string error) =>
                                        {
                                            logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteSchemeOnlySQLMap");
                                        });
                                    }
                                    else
                                    {
                                        logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteSchemeOnlySQLMap", request.GlobalID);
                                    }
                                }
                            }
                            catch (Exception exception)
                            {
                                if (request.IsTransaction == true)
                                {
                                    databaseFactory.RollbackTransaction();
                                }

                                response.ExceptionText = $"SQLID: {SQLID}, ExecuteSQL: {consoleProfiler.ExecuteSQL}, ExceptionText: {exception.ToMessage()}";

                                if (ModuleConfiguration.IsLogServer == true)
                                {
                                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, response.ExceptionText, "QueryDataClient/ExecuteSchemeOnlySQLMap", (string error) =>
                                    {
                                        logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + response.ExceptionText, "QueryDataClient/ExecuteSchemeOnlySQLMap");
                                    });
                                }
                                else
                                {
                                    logger.Error("[{LogCategory}] [{GlobalID}] " + response.ExceptionText, "QueryDataClient/ExecuteSchemeOnlySQLMap", request.GlobalID);
                                }

                                if (preReader != null)
                                {
                                    preReader.Close();
                                }

                                if (preConnection.IsConnectionOpen() == true)
                                {
                                    preConnection.Close();
                                }

                                return;
                            }

                            using (DataSet? ds = DataTableHelper.DataReaderToDataSet(preReader))
                            {
                                var resultTypes = pretreatment.ResultType.Split(",");
                                if (ds == null || resultTypes.Count() != ds.Tables.Count)
                                {
                                    response.ExceptionText = $"Pretreatment - 전처리 쿼리 실행 결과와 {pretreatment.ResultType} 설정 확인 필요";
                                    return;
                                }

                                for (int j = 0; j < ds.Tables.Count; j++)
                                {
                                    string resultType = resultTypes[j].Trim();
                                    DataTable table = ds.Tables[j];

                                    if (resultType == "Row")
                                    {
                                        DataRow rowItem = table.Rows[0];
                                        DataColumnCollection colItems = table.Columns;
                                        foreach (DataColumn item in colItems)
                                        {
                                            PretreatmentAddParameter(databaseProvider, statementMap, dynamicParameters, rowItem, item);

                                            DynamicParameter? dynamicParameter = dynamicObject.Parameters.Where(p => p.ParameterName == item.ColumnName).FirstOrDefault();

                                            if (dynamicParameter == null)
                                            {
                                                DataProviders? dataProvider = null;
                                                if (statementMap.NativeDataClient == true)
                                                {
                                                    dataProvider = databaseProvider;
                                                }

                                                dynamicParameter = new DynamicParameter();
                                                dynamicParameter.ParameterName = item.ColumnName;
                                                dynamicParameter.Length = item.MaxLength;
                                                dynamicParameter.DbType = GetProviderDbType(item, dataProvider);
                                                dynamicParameter.Value = rowItem[item.ColumnName];
                                                dynamicObject.Parameters.Add(dynamicParameter);
                                            }
                                            else
                                            {
                                                dynamicParameter.Value = rowItem[item.ColumnName];
                                            }
                                        }
                                    }
                                    else if (resultType == "List")
                                    {
                                        List<object> parameters = new List<object>();
                                        DataColumnCollection colItems = table.Columns;
                                        foreach (DataColumn item in colItems)
                                        {
                                            DataView dataView = new DataView(table);
                                            DataTable dataTable = dataView.ToTable(true, item.ColumnName);
                                            foreach (DataRow row in dataTable.Rows)
                                            {
                                                parameters.Add(row[0]);
                                            }

                                            if (parameters.Count > 0)
                                            {
                                                if (dynamicParameters != null)
                                                {
                                                    dynamicParameters.Add(item.ColumnName, parameters);
                                                }

                                                DynamicParameter? dynamicParameter = dynamicObject.Parameters.Where(p => p.ParameterName == item.ColumnName).FirstOrDefault();

                                                if (dynamicParameter == null)
                                                {
                                                    DataProviders? dataProvider = null;
                                                    if (statementMap.NativeDataClient == true)
                                                    {
                                                        dataProvider = databaseProvider;
                                                    }

                                                    dynamicParameter = new DynamicParameter();
                                                    dynamicParameter.ParameterName = item.ColumnName;
                                                    dynamicParameter.Length = item.MaxLength;
                                                    dynamicParameter.DbType = GetProviderDbType(item, dataProvider);
                                                    dynamicParameter.Value = parameters;
                                                    dynamicObject.Parameters.Add(dynamicParameter);
                                                }
                                                else
                                                {
                                                    dynamicParameter.Value = parameters;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                    {
                        SQLID = dynamicObject.QueryID + "_" + i.ToString();
                        string logData = $"SQLID: {SQLID}, ParseSQL Parameters: {JsonConvert.SerializeObject(dynamicObject)}";
                        if (ModuleConfiguration.IsLogServer == true)
                        {
                            dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteSchemeOnlySQLMap", (string error) =>
                            {
                                logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteSchemeOnlySQLMap");
                            });
                        }
                        else
                        {
                            logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteSchemeOnlySQLMap", request.GlobalID);
                        }
                    }

                    string parseSQL = DatabaseMapper.Find(statementMap, dynamicObject);
                    var connection = new ProfilerDbConnection(databaseFactory.Connection, new ConsoleProfiler(request.RequestID, executeDataID + "_statment", ModuleConfiguration.IsTransactionLogging == true ? ModuleConfiguration.TransactionLogFilePath : null));
                    var reader = connection.ExecuteReader(parseSQL, dynamicParameters as SqlMapper.IDynamicParameters, dbTransaction, statementMap.Timeout < 0 ? ModuleConfiguration.DefaultCommandTimeout : statementMap.Timeout);

                    if (dynamicObject.IgnoreResult == true)
                    {
                        using (DataTable dataTable = new DataTable())
                        using (DataTable? schemaTable = reader?.GetSchemaTable())
                        {
                            if (schemaTable == null)
                            {
                                continue;
                            }

                            DataRow row;

                            string columnName;
                            DataColumn column;
                            int count = schemaTable.Rows.Count;

                            for (int j = 0; j < count; j++)
                            {
                                row = schemaTable.Rows[j];
                                columnName = (string)row["ColumnName"];

                                column = new DataColumn(columnName, (Type)row["DataType"]);
                                dataTable.Columns.Add(column);
                            }

                            object[] values = new object[count];

                            if (reader != null)
                            {
                                try
                                {
                                    dataTable.BeginLoadData();
                                    while (reader.Read())
                                    {
                                        reader.GetValues(values);
                                        dataTable.LoadDataRow(values, true);
                                    }
                                }
                                catch (Exception exception)
                                {
                                    if (reader.IsClosed == false)
                                    {
                                        reader.Close();
                                    }
                                    logger.Error("[{LogCategory}] [{GlobalID}] " + exception.ToMessage(), "QueryDataClient/ExecuteSchemeOnlySQLMap", request.GlobalID);
                                    throw;
                                }
                                finally
                                {
                                    dataTable.EndLoadData();
                                    reader.Close();
                                }
                            }

                            if (dataTable.Rows.Count > 0)
                            {
                                dataRow = dataTable.Rows[0];
                            }
                            else
                            {
                                dataRow = null;
                            }
                        }
                    }
                    else
                    {
                        using (DataSet? ds = DataTableHelper.DataReaderToSchemeOnly(reader, "Table", 1))
                        {
                            if (ds != null)
                            {
                                JsonObjectType jsonObjectType = JsonObjectType.FormJson;

                                for (int j = 0; j < ds.Tables.Count; j++)
                                {
                                    DataTable table = ds.Tables[j];

                                    if (dynamicObject.JsonObjects == null || dynamicObject.JsonObjects.Count == 0)
                                    {
                                        jsonObjectType = dynamicObject.JsonObject;
                                    }
                                    else
                                    {
                                        try
                                        {
                                            jsonObjectType = dynamicObject.JsonObjects[i];
                                        }
                                        catch
                                        {
                                            jsonObjectType = dynamicObject.JsonObject;
                                        }
                                    }

                                    switch (jsonObjectType)
                                    {
                                        case JsonObjectType.FormJson:
                                            // mergeDatas.Add("FormData" + i.ToString(), table.GetMetaColumns());
                                            mergeDatas.Add("FormData" + i.ToString(), table.GetDbColumns());
                                            break;
                                        case JsonObjectType.jqGridJson:
                                            // mergeDatas.Add("jqGridData" + i.ToString(), table.GetMetaColumns());
                                            mergeDatas.Add("jqGridData" + i.ToString(), table.GetDbColumns());
                                            break;
                                        case JsonObjectType.GridJson:
                                            // mergeDatas.Add("GridData" + i.ToString(), table.GetMetaColumns());
                                            mergeDatas.Add("GridData" + i.ToString(), table.GetDbColumns());
                                            break;
                                        case JsonObjectType.ChartJson:
                                            // mergeDatas.Add("ChartData" + i.ToString(), table.GetMetaColumns());
                                            mergeDatas.Add("ChartData" + i.ToString(), table.GetDbColumns());
                                            break;
                                        case JsonObjectType.DataSetJson:
                                            // mergeDatas.Add("DataTable" + i.ToString(), table.GetMetaColumns());
                                            mergeDatas.Add("DataTable" + i.ToString(), table.GetDbColumns());
                                            break;
                                    }

                                    if (table.Rows.Count > 0)
                                    {
                                        dataRow = table.Rows[0];
                                    }
                                    else
                                    {
                                        dataRow = null;
                                    }

                                    i++;
                                }
                            }
                        }
                    }
                }

                if (request.IsTransaction == true)
                {
                    databaseFactory.CommitTransaction();
                }

                response.ResultJson = mergeDatas;
                response.Acknowledge = AcknowledgeType.Success;
            }
            catch (Exception exception)
            {
                if (databaseFactory != null && request.IsTransaction == true)
                {
                    databaseFactory.RollbackTransaction();
                }

                response.ExceptionText = exception.ToMessage();

                if (ModuleConfiguration.IsLogServer == true)
                {
                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, response.ExceptionText, "QueryDataClient/ExecuteSchemeOnlySQLMap", (string error) =>
                    {
                        logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + response.ExceptionText, "QueryDataClient/ExecuteSchemeOnlySQLMap");
                    });
                }
                else
                {
                    logger.Error("[{LogCategory}] [{GlobalID}] " + response.ExceptionText, "QueryDataClient/ExecuteSchemeOnlySQLMap", request.GlobalID);
                }
            }
            finally
            {
                databaseFactory?.Connection?.Close();
                databaseFactory?.Dispose();
            }
        }

        private DynamicParameter? GetDbParameterMap(string parameterName, List<DynamicParameter>? dynamicParameters)
        {
            DynamicParameter? result = null;

            if (dynamicParameters != null)
            {
                var maps = from p in dynamicParameters
                           where p.ParameterName == GetParameterName(parameterName)
                           select p;

                if (maps.Count() > 0)
                {
                    foreach (var item in maps)
                    {
                        result = item;
                        break;
                    }
                }
            }

            return result;
        }

        private string GetParameterName(string parameterName)
        {
            return parameterName.Replace("@", "").Replace("#", "").Replace(":", "");
        }

        public void ExecuteDynamicSQLText(DynamicRequest request, DynamicResponse response)
        {
            SQLMapMeta result = new SQLMapMeta();
            request.RequestID = request.RequestID == null ? "NULL" : request.RequestID;
            Dictionary<string, TransactionDynamicObjects> transactionDynamicObjects = new Dictionary<string, TransactionDynamicObjects>();
            DatabaseFactory? databaseFactory = null;
            IDbTransaction? dbTransaction = null;
            Tuple<string, DataProviders>? connectionInfo = null;

            try
            {
                List<string> logQuerys = new List<string>();
                int i = 0;
                foreach (DynamicObject dynamicObject in request.DynamicObjects)
                {
                    StatementMap statementMap = DatabaseMapper.GetStatementMap(dynamicObject.QueryID);
                    if (statementMap == null)
                    {
                        response.ExceptionText = $"QueryID - {dynamicObject.QueryID}에 대한 매핑 정보 필요";
                        return;
                    }

                    if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                    {
                        if (logQuerys.Contains(dynamicObject.QueryID) == false)
                        {
                            logQuerys.Add(dynamicObject.QueryID);
                        }
                    }

                    if (connectionInfo == null)
                    {
                        connectionInfo = GetConnectionInfomation(statementMap.ApplicationID, statementMap.ProjectID, statementMap.DataSourceID);
                    }

                    transactionDynamicObjects.Add(string.Concat(dynamicObject.QueryID, "_", i.ToString()), new TransactionDynamicObjects()
                    {
                        DynamicObject = dynamicObject,
                        StatementMap = statementMap
                    });

                    i = i + 1;
                }

                if (logQuerys.Count > 0)
                {
                    if (ModuleConfiguration.IsTransactionLogging == true)
                    {
                        string logData = $"QueryID: {string.Join(", ", logQuerys.ToArray())}";
                        if (ModuleConfiguration.IsLogServer == true)
                        {
                            dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", GlobalConfiguration.SystemID, logData, "QueryDataClient/ExecuteDynamicSQLText", (string error) =>
                            {
                                logger.Information("[{LogCategory}] [{GlobalID}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLText", request.GlobalID);
                            });
                        }
                        else
                        {
                            logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLText", request.GlobalID);
                        }
                    }
                }

                if (connectionInfo == null)
                {
                    response.ExceptionText = $"{request.RequestID}에 대한 DataSourceID 데이터 원본 정보 필요";
                    return;
                }

                var databaseProvider = connectionInfo.Item2;
                databaseFactory = new DatabaseFactory(connectionInfo.Item1, connectionInfo.Item2);

                if (databaseFactory == null)
                {
                    response.ExceptionText = $"{request.RequestID}에 대한 DataProvider: {connectionInfo.Item2} 데이터 제공자 정보 확인 필요";
                    return;
                }

                dbTransaction = databaseFactory.BeginTransaction();

                i = 0;
                DataRow? dataRow = null;
                DataTable additionalData = new DataTable();
                additionalData.Columns.Add("MSG_CD", typeof(string));
                additionalData.Columns.Add("MSG_TXT", typeof(string));
                List<object> mergeDatas = new List<object>();
                foreach (var transactionDynamicObject in transactionDynamicObjects)
                {
                    DynamicObject? dynamicObject = transactionDynamicObject.Value.DynamicObject;
                    StatementMap? statementMap = transactionDynamicObject.Value.StatementMap;

                    if (dynamicObject == null || statementMap == null)
                    {
                        continue;
                    }

                    StatementMap? cloneStatement = statementMap.ShallowCopy();
                    if (cloneStatement != null)
                    {
                        cloneStatement.SQL = cloneStatement.SQL.EncodeBase64();
                        if (result.Statements.Contains(cloneStatement) == false)
                        {
                            result.Statements.Add(cloneStatement);
                        }
                    }

                    dynamic? dynamicParameters = CreateDynamicParameters(databaseProvider, statementMap);
                    if (dynamicParameters != null && dynamicObject.Parameters.Count() > 0)
                    {
                        if (dynamicObject.BaseFieldMappings != null && dynamicObject.BaseFieldMappings.Count() > 0)
                        {
                            if (dataRow == null)
                            {
                                response.ExceptionText = $"BaseFieldMappings - {dynamicObject.QueryID}에 대한 매핑 정보 필요";
                                return;
                            }

                            for (int baseFieldIndex = 0; baseFieldIndex < dynamicObject.BaseFieldMappings.Count; baseFieldIndex++)
                            {
                                BaseFieldMapping baseFieldMapping = dynamicObject.BaseFieldMappings[baseFieldIndex];

                                if (dataRow[baseFieldMapping.SourceFieldID] == null)
                                {
                                    response.ExceptionText = $"BaseFieldMappings - {dynamicObject.QueryID}에 대한 SourceFieldID {baseFieldMapping.SourceFieldID} 컬럼 정보 필요";
                                    return;
                                }

                                DynamicParameter? dynamicParameter = dynamicObject.Parameters.Where(p => p.ParameterName == baseFieldMapping.TargetFieldID).FirstOrDefault();

                                if (dynamicParameter == null)
                                {
                                    response.ExceptionText = $"BaseFieldMappings - {dynamicObject.QueryID}에 대한 TargetFieldID {baseFieldMapping.SourceFieldID} 컬럼 정보 필요";
                                    return;
                                }

                                dynamicParameter.Value = dataRow[baseFieldMapping.SourceFieldID];
                            }
                        }

                        SetDbParameterMapping(databaseFactory, databaseProvider, dynamicObject, statementMap, dynamicParameters);
                    }
                    else
                    {
                        SetDbParameterMapping(databaseFactory, databaseProvider, dynamicObject, statementMap, dynamicParameters);
                    }

                    string SQLID = string.Empty;
                    string executeDataID = dynamicObject.QueryID + "_" + i.ToString();
                    if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                    {
                        string logData = $"Pretreatment {executeDataID}, ParseSQL Parameters: {JsonConvert.SerializeObject(dynamicObject)}";
                        if (ModuleConfiguration.IsLogServer == true)
                        {
                            dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLText", (string error) =>
                            {
                                logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLText");
                            });
                        }
                        else
                        {
                            logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLText", request.GlobalID);
                        }
                    }

                    var pretreatment = DatabaseMapper.FindPretreatment(statementMap, dynamicObject);
                    if (pretreatment.SQL != null && pretreatment.ResultType != null)
                    {
                        if (pretreatment.SQL.Replace(Environment.NewLine, "").Replace("\t", "").Trim() != "")
                        {
                            string pretreatmentSQLID = executeDataID + "_pretreatment";
                            result.DefinedSQL.Add(pretreatmentSQLID, pretreatment.SQL.EncodeBase64());

                            Dictionary<string, object?> pretreatmentParametersDictionary = new Dictionary<string, object?>();
                            if (dynamicParameters is SqlServerDynamicParameters)
                            {
                                pretreatmentParametersDictionary = ((SqlServerDynamicParameters)dynamicParameters).ToParametersDictionary();
                            }
                            else if (dynamicParameters is OracleDynamicParameters)
                            {
                                pretreatmentParametersDictionary = ((OracleDynamicParameters)dynamicParameters).ToParametersDictionary();
                            }
                            else if (dynamicParameters is MySqlDynamicParameters)
                            {
                                pretreatmentParametersDictionary = ((MySqlDynamicParameters)dynamicParameters).ToParametersDictionary();
                            }
                            else if (dynamicParameters is NpgsqlDynamicParameters)
                            {
                                pretreatmentParametersDictionary = ((NpgsqlDynamicParameters)dynamicParameters).ToParametersDictionary();
                            }
                            else
                            {
                                if (dynamicParameters != null)
                                {
                                    pretreatmentParametersDictionary = dynamicParameters.ToParametersDictionary();
                                }
                            }

                            result.Parameters.Add(pretreatmentSQLID, pretreatmentParametersDictionary);

                            ConsoleProfiler pretreatmentConsoleProfiler = new ConsoleProfiler(request.RequestID, pretreatmentSQLID, ModuleConfiguration.IsTransactionLogging == true ? ModuleConfiguration.TransactionLogFilePath : null);
                            var preConnection = new ProfilerDbConnection(databaseFactory.Connection, pretreatmentConsoleProfiler);

                            IDataReader? preReader = null;

                            try
                            {
                                preReader = preConnection.ExecuteReader(pretreatment.SQL, dynamicParameters as SqlMapper.IDynamicParameters, dbTransaction, statementMap.Timeout < 0 ? ModuleConfiguration.DefaultCommandTimeout : statementMap.Timeout);
                            }
                            catch (Exception exception)
                            {
                                string logData = $"ExecuteSQL: {pretreatmentConsoleProfiler.ExecuteSQL}, Exception{exception.ToMessage()}";

                                if (ModuleConfiguration.IsLogServer == true)
                                {
                                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, logData, "QueryDataClient/ExecuteDynamicSQLText", (string error) =>
                                    {
                                        logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLText");
                                    });
                                }
                                else
                                {
                                    logger.Error("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLText", request.GlobalID);
                                }

                                result.ExecuteSQL.Add(pretreatmentSQLID, string.IsNullOrEmpty(pretreatmentConsoleProfiler.ExecuteSQL) == true ? "" : pretreatmentConsoleProfiler.ExecuteSQL.EncodeBase64());

                                if (preReader != null)
                                {
                                    preReader.Close();
                                }

                                if (preConnection.IsConnectionOpen() == true)
                                {
                                    preConnection.Close();
                                }

                                throw;
                            }

                            using (DataSet? ds = DataTableHelper.DataReaderToDataSet(preReader))
                            {
                                var resultTypes = pretreatment.ResultType.Split(",");
                                if (ds == null || resultTypes.Count() != ds.Tables.Count)
                                {
                                    response.ExceptionText = $"Pretreatment - 전처리 쿼리 실행 결과와 {pretreatment.ResultType} 설정 확인 필요";
                                    return;
                                }

                                for (int j = 0; j < ds.Tables.Count; j++)
                                {
                                    string resultType = resultTypes[j].Trim();
                                    DataTable table = ds.Tables[j];

                                    if (resultType == "Row")
                                    {
                                        DataRow rowItem = table.Rows[0];
                                        DataColumnCollection colItems = table.Columns;
                                        foreach (DataColumn item in colItems)
                                        {
                                            PretreatmentAddParameter(databaseProvider, statementMap, dynamicParameters, rowItem, item);

                                            DynamicParameter? dynamicParameter = dynamicObject.Parameters.Where(p => p.ParameterName == item.ColumnName).FirstOrDefault();

                                            if (dynamicParameter == null)
                                            {
                                                DataProviders? dataProvider = null;
                                                if (statementMap.NativeDataClient == true)
                                                {
                                                    dataProvider = databaseProvider;
                                                }

                                                dynamicParameter = new DynamicParameter();
                                                dynamicParameter.ParameterName = item.ColumnName;
                                                dynamicParameter.Length = item.MaxLength;
                                                dynamicParameter.DbType = GetProviderDbType(item, dataProvider);
                                                dynamicParameter.Value = rowItem[item.ColumnName];
                                                dynamicObject.Parameters.Add(dynamicParameter);
                                            }
                                            else
                                            {
                                                dynamicParameter.Value = rowItem[item.ColumnName];
                                            }
                                        }
                                    }
                                    else if (resultType == "List")
                                    {
                                        List<object> parameters = new List<object>();
                                        DataColumnCollection colItems = table.Columns;
                                        foreach (DataColumn item in colItems)
                                        {
                                            DataView dataView = new DataView(table);
                                            DataTable dataTable = dataView.ToTable(true, item.ColumnName);
                                            foreach (DataRow row in dataTable.Rows)
                                            {
                                                parameters.Add(row[0]);
                                            }

                                            if (parameters.Count > 0)
                                            {
                                                if (dynamicParameters != null)
                                                {
                                                    dynamicParameters.Add(item.ColumnName, parameters);
                                                }

                                                DynamicParameter? dynamicParameter = dynamicObject.Parameters.Where(p => p.ParameterName == item.ColumnName).FirstOrDefault();

                                                if (dynamicParameter == null)
                                                {
                                                    DataProviders? dataProvider = null;
                                                    if (statementMap.NativeDataClient == true)
                                                    {
                                                        dataProvider = databaseProvider;
                                                    }

                                                    dynamicParameter = new DynamicParameter();
                                                    dynamicParameter.ParameterName = item.ColumnName;
                                                    dynamicParameter.Length = item.MaxLength;
                                                    dynamicParameter.DbType = GetProviderDbType(item, dataProvider);
                                                    dynamicParameter.Value = parameters;
                                                    dynamicObject.Parameters.Add(dynamicParameter);
                                                }
                                                else
                                                {
                                                    dynamicParameter.Value = parameters;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    SQLID = executeDataID + "_statement";
                    if (ModuleConfiguration.IsTransactionLogging == true && statementMap.TransactionLog == true)
                    {
                        string logData = $"SQLID: {SQLID}, ParseSQL Parameters: {JsonConvert.SerializeObject(dynamicObject)}";
                        if (ModuleConfiguration.IsLogServer == true)
                        {
                            dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "Y", statementMap.ApplicationID, statementMap.ProjectID, statementMap.TransactionID, statementMap.StatementID, logData, "QueryDataClient/ExecuteDynamicSQLText", (string error) =>
                            {
                                logger.Information("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLText");
                            });
                        }
                        else
                        {
                            logger.Information("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLText", request.GlobalID);
                        }
                    }

                    string parseSQL = DatabaseMapper.Find(statementMap, dynamicObject);
                    result.DefinedSQL.Add(SQLID, parseSQL.EncodeBase64());

                    Dictionary<string, object?> parametersDictionary = new Dictionary<string, object?>();
                    if (dynamicParameters is SqlServerDynamicParameters)
                    {
                        parametersDictionary = ((SqlServerDynamicParameters)dynamicParameters).ToParametersDictionary();
                    }
                    else if (dynamicParameters is OracleDynamicParameters)
                    {
                        parametersDictionary = ((OracleDynamicParameters)dynamicParameters).ToParametersDictionary();
                    }
                    else if (dynamicParameters is MySqlDynamicParameters)
                    {
                        parametersDictionary = ((MySqlDynamicParameters)dynamicParameters).ToParametersDictionary();
                    }
                    else if (dynamicParameters is NpgsqlDynamicParameters)
                    {
                        parametersDictionary = ((NpgsqlDynamicParameters)dynamicParameters).ToParametersDictionary();
                    }
                    else
                    {
                        if (dynamicParameters != null)
                        {
                            parametersDictionary = ((DynamicParameters)dynamicParameters).ToParametersDictionary();
                        }
                    }

                    result.Parameters.Add(SQLID, parametersDictionary);

                    ConsoleProfiler consoleProfiler = new ConsoleProfiler(request.RequestID, SQLID, ModuleConfiguration.IsTransactionLogging == true ? ModuleConfiguration.TransactionLogFilePath : null);
                    var connection = new ProfilerDbConnection(databaseFactory.Connection, consoleProfiler);

                    IDataReader? reader = null;

                    try
                    {
                        reader = connection.ExecuteReader(parseSQL, dynamicParameters as SqlMapper.IDynamicParameters, dbTransaction, statementMap.Timeout < 0 ? ModuleConfiguration.DefaultCommandTimeout : statementMap.Timeout);
                    }
                    catch (Exception exception)
                    {
                        string logData = $"ExecuteSQL: {consoleProfiler.ExecuteSQL}, ExceptionText: {exception.ToMessage()}";

                        if (ModuleConfiguration.IsLogServer == true)
                        {
                            dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, logData, "QueryDataClient/ExecuteDynamicSQLText", (string error) =>
                            {
                                logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + logData, "QueryDataClient/ExecuteDynamicSQLText");
                            });
                        }
                        else
                        {
                            logger.Error("[{LogCategory}] [{GlobalID}] " + logData, "QueryDataClient/ExecuteDynamicSQLText", request.GlobalID);
                        }

                        result.ExecuteSQL.Add(SQLID, string.IsNullOrEmpty(consoleProfiler.ExecuteSQL) == true ? "" : consoleProfiler.ExecuteSQL.EncodeBase64());
                        throw;
                    }

                    if (dynamicObject.IgnoreResult == true)
                    {
                        using (DataTable dataTable = new DataTable())
                        using (DataTable? schemaTable = reader?.GetSchemaTable())
                        {
                            if (schemaTable == null)
                            {
                                continue;
                            }

                            DataRow row;

                            string columnName;
                            DataColumn column;
                            int count = schemaTable.Rows.Count;

                            for (int j = 0; j < count; j++)
                            {
                                row = schemaTable.Rows[j];
                                columnName = (string)row["ColumnName"];

                                column = new DataColumn(columnName, (Type)row["DataType"]);
                                dataTable.Columns.Add(column);
                            }

                            object[] values = new object[count];

                            if (reader != null)
                            {
                                try
                                {
                                    dataTable.BeginLoadData();
                                    while (reader.Read())
                                    {
                                        reader.GetValues(values);
                                        dataTable.LoadDataRow(values, true);
                                    }
                                }
                                catch (Exception exception)
                                {
                                    if (reader.IsClosed == false)
                                    {
                                        reader.Close();
                                    }
                                    logger.Error("[{LogCategory}] [{GlobalID}] " + exception.ToMessage(), "QueryDataClient/ExecuteDynamicSQLText", request.GlobalID);
                                    throw;
                                }
                                finally
                                {
                                    dataTable.EndLoadData();
                                    reader.Close();
                                }
                            }

                            if (dataTable.Rows.Count > 0)
                            {
                                dataRow = dataTable.Rows[0];
                            }
                            else
                            {
                                dataRow = null;
                            }
                        }
                    }
                }

                response.ResultJson = result;
                response.Acknowledge = AcknowledgeType.Success;
            }
            catch (Exception exception)
            {
                response.ResultJson = result;
                response.ExceptionText = exception.ToMessage();

                if (ModuleConfiguration.IsLogServer == true)
                {
                    dbClientLoggerClient.ProgramMessageLogging(request.GlobalID, "N", GlobalConfiguration.SystemID, response.ExceptionText, "QueryDataClient/ExecuteDynamicSQLText", (string error) =>
                    {
                        logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + response.ExceptionText, "QueryDataClient/ExecuteDynamicSQLText");
                    });
                }
                else
                {
                    logger.Error("[{LogCategory}] [{GlobalID}] " + response.ExceptionText, "QueryDataClient/ExecuteDynamicSQLText", request.GlobalID);
                }
            }
            finally
            {
                databaseFactory?.RollbackTransaction();
                databaseFactory?.Connection?.Close();
                databaseFactory?.Dispose();
            }
        }

        public string GetGeneratedQuery(DbCommand dbCommand)
        {
            var query = dbCommand.CommandText;
            foreach (DbParameter parameter in dbCommand.Parameters)
            {
                object? parameterValue = parameter.Value;
                string? parameterString = parameterValue == null ? "" : parameterValue.ToString();
                query = query.Replace(parameter.ParameterName, string.IsNullOrEmpty(parameterString) == true ? "" : parameterString);
            }

            return query;
        }

        private dynamic? CreateDynamicParameters(DataProviders databaseProvider, StatementMap statementMap)
        {
            dynamic? dynamicParameters = null;
            if (statementMap.NativeDataClient == true)
            {
                switch (databaseProvider)
                {
                    case DataProviders.SqlServer:
                        dynamicParameters = new SqlServerDynamicParameters();
                        break;
                    case DataProviders.Oracle:
                        dynamicParameters = new OracleDynamicParameters();
                        break;
                    case DataProviders.MySQL:
                        dynamicParameters = new MySqlDynamicParameters();
                        break;
                    case DataProviders.PostgreSQL:
                        dynamicParameters = new NpgsqlDynamicParameters();
                        break;
                    case DataProviders.SQLite:
                        dynamicParameters = new SQLiteDynamicParameters();
                        break;
                }
            }
            else
            {
                dynamicParameters = new DynamicParameters();
            }

            return dynamicParameters;
        }

        private void SetDbParameterMapping(DatabaseFactory databaseFactory, DataProviders databaseProvider, DynamicObject dynamicObject, StatementMap statementMap, dynamic dynamicParameters)
        {
            List<DbParameterMap> dbParameterMaps = statementMap.DbParameters;
            foreach (DbParameterMap dbParameterMap in dbParameterMaps)
            {
                if (dbParameterMap.Direction == "Input")
                {
                    DynamicParameter? dynamicParameter = GetDbParameterMap(dbParameterMap.Name, dynamicObject.Parameters);

                    if (dynamicParameter == null)
                    {
                        continue;
                    }

                    if (statementMap.NativeDataClient == true)
                    {
                        dynamic? dynamicValue = null;
                        dynamic? dynamicDbType = null;
                        switch (databaseProvider)
                        {
                            case DataProviders.SqlServer:
                                dynamicDbType = (SqlDbType)Enum.Parse(typeof(SqlDbType), string.IsNullOrEmpty(dbParameterMap.DbType) == true ? dynamicParameter.DbType : dbParameterMap.DbType);
                                dynamicValue = dynamicParameter.Value;
                                break;
                            case DataProviders.Oracle:
                                dynamicDbType = (OracleDbType)Enum.Parse(typeof(OracleDbType), string.IsNullOrEmpty(dbParameterMap.DbType) == true ? dynamicParameter.DbType : dbParameterMap.DbType);
                                if (dynamicDbType == OracleDbType.Clob)
                                {
                                    OracleClobParameter oracleClobParameter = new OracleClobParameter(dynamicParameter.Value);
                                    if (databaseFactory.Connection != null && databaseFactory.Connection.IsConnectionOpen() == false)
                                    {
                                        databaseFactory.Connection.EnsureOpen();
                                    }
                                    dynamicValue = oracleClobParameter.GetClobValue(databaseFactory.Connection);
                                }
                                else
                                {
                                    dynamicValue = dynamicParameter.Value;
                                }
                                break;
                            case DataProviders.MySQL:
                                dynamicDbType = (MySqlDbType)Enum.Parse(typeof(MySqlDbType), string.IsNullOrEmpty(dbParameterMap.DbType) == true ? dynamicParameter.DbType : dbParameterMap.DbType);
                                dynamicValue = dynamicParameter.Value;
                                break;
                            case DataProviders.PostgreSQL:
                                dynamicDbType = (NpgsqlDbType)Enum.Parse(typeof(NpgsqlDbType), string.IsNullOrEmpty(dbParameterMap.DbType) == true ? dynamicParameter.DbType : dbParameterMap.DbType);
                                dynamicValue = dynamicParameter.Value;
                                break;
                            case DataProviders.SQLite:
                                dynamicDbType = (DbType)Enum.Parse(typeof(DbType), string.IsNullOrEmpty(dbParameterMap.DbType) == true ? dynamicParameter.DbType : dbParameterMap.DbType);
                                dynamicValue = dynamicParameter.Value;
                                break;
                        }

                        dynamicParameters.Add(
                            dynamicParameter.ParameterName,
                            dynamicValue,
                            dynamicDbType,
                            (ParameterDirection)Enum.Parse(typeof(ParameterDirection), dbParameterMap.Direction),
                            dbParameterMap.Length <= 0 ? -1 : dbParameterMap.Length
                        );
                    }
                    else
                    {
                        DbType dynamicDbType = (DbType)Enum.Parse(typeof(DbType), string.IsNullOrEmpty(dbParameterMap.DbType) == true ? dynamicParameter.DbType : dbParameterMap.DbType);

                        dynamicParameters.Add(
                            dynamicParameter.ParameterName,
                            dynamicParameter.Value,
                            dynamicDbType,
                            (ParameterDirection)Enum.Parse(typeof(ParameterDirection), dbParameterMap.Direction),
                            dbParameterMap.Length <= 0 ? -1 : dbParameterMap.Length
                        );
                    }
                }
                else
                {
                    if (statementMap.NativeDataClient == true)
                    {
                        dynamic? dynamicDbType = null;
                        switch (databaseProvider)
                        {
                            case DataProviders.SqlServer:
                                dynamicDbType = (SqlDbType)Enum.Parse(typeof(SqlDbType), dbParameterMap.DbType);
                                break;
                            case DataProviders.Oracle:
                                dynamicDbType = (OracleDbType)Enum.Parse(typeof(OracleDbType), dbParameterMap.DbType);
                                break;
                            case DataProviders.MySQL:
                                dynamicDbType = (MySqlDbType)Enum.Parse(typeof(MySqlDbType), dbParameterMap.DbType);
                                break;
                            case DataProviders.PostgreSQL:
                                dynamicDbType = (NpgsqlDbType)Enum.Parse(typeof(NpgsqlDbType), dbParameterMap.DbType);
                                break;
                            case DataProviders.SQLite:
                                dynamicDbType = (DbType)Enum.Parse(typeof(DbType), dbParameterMap.DbType);
                                break;
                        }

                        dynamicParameters.Add(
                            GetParameterName(dbParameterMap.Name),
                            null,
                            dynamicDbType,
                            (ParameterDirection)Enum.Parse(typeof(ParameterDirection), dbParameterMap.Direction),
                            dbParameterMap.Length <= 0 ? -1 : dbParameterMap.Length
                        );
                    }
                    else
                    {
                        DbType dynamicDbType = (DbType)Enum.Parse(typeof(DbType), dbParameterMap.DbType);

                        dynamicParameters.Add(
                            GetParameterName(dbParameterMap.Name),
                            null,
                            dynamicDbType,
                            (ParameterDirection)Enum.Parse(typeof(ParameterDirection), dbParameterMap.Direction),
                            dbParameterMap.Length <= 0 ? -1 : dbParameterMap.Length
                        );
                    }
                }
            }
        }

        private void PretreatmentAddParameter(DataProviders databaseProvider, StatementMap statementMap, dynamic dynamicParameters, DataRow rowItem, DataColumn item)
        {
            if (statementMap.NativeDataClient == true)
            {
                dynamic? dynamicDbType = null;
                switch (databaseProvider)
                {
                    case DataProviders.SqlServer:
                        dynamicDbType = (SqlDbType)Enum.Parse(typeof(SqlDbType), GetProviderDbType(item, databaseProvider));
                        break;
                    case DataProviders.Oracle:
                        dynamicDbType = (OracleDbType)Enum.Parse(typeof(OracleDbType), GetProviderDbType(item, databaseProvider));
                        break;
                    case DataProviders.MySQL:
                        dynamicDbType = (MySqlDbType)Enum.Parse(typeof(MySqlDbType), GetProviderDbType(item, databaseProvider));
                        break;
                    case DataProviders.PostgreSQL:
                        dynamicDbType = (NpgsqlDbType)Enum.Parse(typeof(NpgsqlDbType), GetProviderDbType(item, databaseProvider));
                        break;
                    case DataProviders.SQLite:
                        dynamicDbType = (DbType)Enum.Parse(typeof(DbType), GetProviderDbType(item, databaseProvider));
                        break;
                }

                dynamicParameters.Add(
                    item.ColumnName,
                    rowItem[item.ColumnName],
                    dynamicDbType,
                    ParameterDirection.Input,
                    item.MaxLength
                );
            }
            else
            {
                DbType dynamicDbType = (DbType)Enum.Parse(typeof(DbType), GetProviderDbType(item));

                dynamicParameters.Add(
                    item.ColumnName,
                    rowItem[item.ColumnName],
                    dynamicDbType,
                    ParameterDirection.Input,
                    item.MaxLength
                );
            }
        }

        private DataSet DecryptDataSet(DataSet dataSet, List<string> decryptColumns)
        {
            try
            {
                foreach (DataRow dr in dataSet.Tables[0].Rows)
                {
                    foreach (DataColumn dc in dataSet.Tables[0].Columns)
                    {
                        if (dc.DataType.ToString() == "System.String")
                        {
                            //if (IsDBNull(dr[dc.Caption]))
                            //{
                            //}
                            //else
                            //{
                            //    dr[dc.Caption] = obj.DecryptData(dr[dc.Caption]);
                            //}
                        }
                    }
                }
            }
            catch (Exception exception)
            {
                string exceptionText = exception.ToMessage();

                if (ModuleConfiguration.IsLogServer == true)
                {
                    dbClientLoggerClient.ProgramMessageLogging("N", GlobalConfiguration.SystemID, exceptionText, "QueryDataClient/DecryptDataSet", (string error) =>
                    {
                        logger.Error("[{LogCategory}] " + "fallback error: " + error + ", " + exceptionText, "QueryDataClient/DecryptDataSet");
                    });
                }
                else
                {
                    logger.Error("[{LogCategory}] " + exceptionText, "QueryDataClient/DecryptDataSet");
                }
            }

            return dataSet;
        }

        private static Tuple<string, DataProviders>? GetConnectionInfomation(string applicationID, string projectID, string dataSourceID)
        {
            string connectionID = $"{applicationID}_{projectID}_{dataSourceID}";
            Tuple<string, DataProviders>? result = null;
            if (string.IsNullOrEmpty(connectionID) == false)
            {
                DataSourceMap dataSourceMap = DatabaseMapper.GetDataSourceMap(connectionID);
                if (dataSourceMap != null)
                {
                    result = new Tuple<string, DataProviders>(dataSourceMap.ConnectionString, dataSourceMap.DataProvider);
                }
            }

            return result;
        }

        public void Dispose()
        {
            if (this.DbConnection != null)
            {
                if (this.DbConnection.State != ConnectionState.Closed)
                {
                    this.DbConnection.Close();
                    this.DbConnection.Dispose();
                    this.DbConnection = null;
                }
            }
        }
    }
}
