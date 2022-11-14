using System.Data;
using System.Data.Common;

using HandStack.Logger.Logging.Module.Database;

namespace HandStack.Logger.Logging.Module
{
    public class DatabaseLoggerModule : LoggerModule
    {
        private readonly string connectionString;
        private readonly string tableName;
        private readonly DatabaseType databaseType;

        public DatabaseLoggerModule(DatabaseType databaseType, string connectionString)
            : this(databaseType, connectionString, "OSSWLog") { }

        public DatabaseLoggerModule(DatabaseType databaseType, string connectionString, string tableName)
        {
            this.databaseType = databaseType;
            this.connectionString = connectionString;
            this.tableName = tableName;
        }

        public override void Initialize()
        {
            CreateTable();
        }

        public override string Name
        {
            get { return DatabaseFactory.GetDatabaseName(databaseType); }
        }

        private DbParameter GetParameter(DbCommand command, string name, object value, DbType type)
        {
            var parameter = command.CreateParameter();
            parameter.DbType = type;
            parameter.ParameterName = (databaseType.Equals(DatabaseType.Oracle) ? ":" : "@") + name;
            parameter.Value = value;
            return parameter;
        }

        private void AddParameter(DbCommand command, string name, object value, DbType type)
        {
            command.Parameters.Add(GetParameter(command, name, value, type));
        }

        public override void Execute(LogData logMessage)
        {
            using (var connection = DatabaseFactory.GetConnection(databaseType, connectionString))
            {
                if (connection != null)
                {
                    connection.Open();
                    var commandText = DatabaseFactory.GetInsertCommand(databaseType, tableName);
                    var sqlCommand = DatabaseFactory.GetCommand(databaseType, commandText, connection);

                    if (sqlCommand != null)
                    {
                        AddParameter(sqlCommand, "Text", logMessage.Text, DbType.String);
                        AddParameter(sqlCommand, "DateTime", logMessage.DateTime, DbType.Date);
                        AddParameter(sqlCommand, "LogLevel", logMessage.Level.ToString(), DbType.String);
                        AddParameter(sqlCommand, "CallingClass", logMessage.CallingClass, DbType.String);
                        AddParameter(sqlCommand, "CallingMethod", logMessage.CallingMethod, DbType.String);

                        sqlCommand.ExecuteNonQuery();
                    }
                }
            }
        }

        private void CreateTable()
        {
            var connection = DatabaseFactory.GetConnection(databaseType, connectionString);
            if (connection != null)
            {
                using (connection)
                {
                    connection.Open();
                    var sqlCommand = DatabaseFactory.GetCommand(databaseType, DatabaseFactory.GetCheckIfShouldCreateTableQuery(databaseType), connection);

                    if (sqlCommand != null)
                    {
                        AddParameter(sqlCommand, "tableName", tableName.ToLower(), DbType.String);

                        var result = sqlCommand.ExecuteScalar();

                        if (result == null)
                        {
                            var commandText = string.Format(DatabaseFactory.GetCreateTableQuery(databaseType), tableName);
                            sqlCommand = DatabaseFactory.GetCommand(databaseType, commandText, connection);
                            if (sqlCommand != null)
                            {
                                sqlCommand.ExecuteMultipleNonQuery();
                            }
                        }
                    }
                }
            }
        }
    }
}
