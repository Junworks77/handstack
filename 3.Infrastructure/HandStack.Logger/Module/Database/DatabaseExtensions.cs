using System;
using System.Data;

namespace HandStack.Logger.Logging.Module.Database
{
    internal static class DatabaseExtensions
    {
        internal static void ExecuteMultipleNonQuery(this IDbCommand dbCommand)
        {
            var sqlStatementArray = dbCommand.CommandText.Split(";", StringSplitOptions.RemoveEmptyEntries);

            foreach (string sqlStatement in sqlStatementArray)
            {
                dbCommand.CommandText = sqlStatement;
                dbCommand.ExecuteNonQuery();
            }
        }
    }
}
