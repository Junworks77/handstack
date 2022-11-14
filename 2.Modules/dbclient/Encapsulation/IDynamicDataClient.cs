using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;

using HandStack.Web.MessageContract.DataObject;
using HandStack.Web.MessageContract.Message;

namespace dbclient.Encapsulation
{
    public interface IDynamicDataClient : IDisposable
    {
        DbConnection? DbConnection { get; }

        IDbConnection? IDbConnection { get; }

        DynamicResult ExecuteConnectionSQLMap(string queryID, List<DynamicParameter> parameters, bool paddingParameter = false);

        DynamicResult ExecuteConnectionSQLMap(DynamicRequest request, DynamicResponse response);

        void ExecuteDynamicSQLMap(DynamicRequest request, DynamicResponse response);

        void ExecuteDynamicSQLMapToScalar(DynamicRequest request, DynamicResponse response);

        void ExecuteDynamicSQLMapToNonQuery(DynamicRequest request, DynamicResponse response);

        void ExecuteDynamicSQLMapToXml(DynamicRequest request, DynamicResponse response);

        void ExecuteCodeHelpSQLMap(DynamicRequest request, DynamicResponse response);

        void ExecuteSchemeOnlySQLMap(DynamicRequest request, DynamicResponse response);

        void ExecuteDynamicSQLText(DynamicRequest request, DynamicResponse response);

        string GetGeneratedQuery(DbCommand dbCommand);
    }
}
