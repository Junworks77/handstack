using System.Data.Common;
using System.Data.SqlClient;

using MySql.Data.MySqlClient;

using Oracle.ManagedDataAccess.Client;

namespace HandStack.Logger.Logging.Module.Database
{
    internal static class DatabaseFactory
    {
        internal static DbConnection? GetConnection(DatabaseType databaseType, string connectionString)
        {
            switch (databaseType)
            {
                case DatabaseType.MsSql:
                    return new SqlConnection(connectionString);
                case DatabaseType.Oracle:
                    return new OracleConnection(connectionString);
                case DatabaseType.MySql:
                    return new MySqlConnection(connectionString);
            }

            return null;
        }

        internal static DbCommand? GetCommand(DatabaseType databaseType, string commandText, DbConnection connection)
        {
            switch (databaseType)
            {
                case DatabaseType.MsSql:
                    return new SqlCommand(commandText, connection as SqlConnection);
                case DatabaseType.Oracle:
                    return new OracleCommand(commandText, connection as OracleConnection) { BindByName = true };
                case DatabaseType.MySql:
                    return new MySqlCommand(commandText, connection as MySqlConnection);
            }

            return null;
        }

        internal static string GetDatabaseName(DatabaseType databaseType)
        {
            switch (databaseType)
            {
                case DatabaseType.MsSql:
                    return "MsSqlDatabaseLoggerModule";
                case DatabaseType.Oracle:
                    return "OracleDatabaseLoggerModule";
                case DatabaseType.MySql:
                    return "MySqlDatabaseLoggerModule";
            }

            return string.Empty;
        }

        internal static string GetCreateTableQuery(DatabaseType databaseType)
        {
            switch (databaseType)
            {
                case DatabaseType.MsSql:
                    return @"CREATE TABLE [{0}]
                            (
	                            [Id] int NOT NULL PRIMARY KEY IDENTITY, 
                                [Text] nvarchar(4000) NULL, 
                                [DateTime] datetime NULL, 
                                [LogLevel] nvarchar(10) NULL, 
                                [CallingClass] nvarchar(500) NULL, 
                                [CallingMethod] nvarchar(500) NULL
                            );";
                case DatabaseType.Oracle:
                    return @"CREATE TABLE {0}
                                (
                                 Id int NOT NULL PRIMARY KEY, 
                                   Text varchar2(4000) NULL, 
                                   DateTime date NULL, 
                                   LogLevel varchar2(10) NULL, 
                                   CallingClass varchar2(500) NULL, 
                                   CallingMethod varchar2(500) NULL
                                );
                                CREATE SEQUENCE seq_log nocache;";
                case DatabaseType.MySql:
                    return @"CREATE TABLE {0}
                            (
	                            Id int not null auto_increment,
                                Text varchar(4000) NULL, 
                                DateTime datetime NULL, 
                                LogLevel varchar(10) NULL, 
                                CallingClass varchar(500) NULL, 
                                CallingMethod varchar(500) NULL,
                                PRIMARY KEY (Id)
                            );";
            }

            return string.Empty;
        }

        internal static string GetCheckIfShouldCreateTableQuery(DatabaseType databaseType)
        {
            switch (databaseType)
            {
                case DatabaseType.MsSql:
                    return @"SELECT object_name(object_id) as table_name 
                               FROM sys.objects
                              WHERE type_desc LIKE '%USER_TABLE' 
                                AND lower(object_name(object_id)) like @tableName;";
                case DatabaseType.Oracle:
                    return @"SELECT TABLE_NAME 
                               FROM ALL_TABLES 
                              WHERE LOWER(TABLE_NAME) LIKE :tableName";
                case DatabaseType.MySql:
                    return @"SELECT table_name
                               FROM information_schema.tables
                              WHERE LOWER(table_name) = @tableName;";
            }

            return string.Empty;
        }

        internal static string GetInsertCommand(DatabaseType databaseType, string tableName)
        {
            switch (databaseType)
            {
                case DatabaseType.MsSql:
                    return string.Format(@"INSERT INTO {0} ([Text], [DateTime], [LogLevel], [CallingClass], [CallingMethod]) 
                                           VALUES (@Text, @DateTime, @LogLevel, @CallingClass, @CallingMethod);", tableName);
                case DatabaseType.Oracle:
                    return string.Format(@"INSERT INTO {0} (Id, Text, DateTime, LogLevel, CallingClass, CallingMethod) 
                                           VALUES (seq_log.nextval, :Text, :DateTime, :LogLevel, :CallingClass, :CallingMethod)", tableName);
                case DatabaseType.MySql:
                    return string.Format(@"INSERT INTO {0} (Text, DateTime, LogLevel, CallingClass, CallingMethod) 
                                           VALUES (@Text, @DateTime, @LogLevel, @CallingClass, @CallingMethod);", tableName);
            }

            return string.Empty;
        }
    }
}
