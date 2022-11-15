﻿using System;

using HandStack.Data.SqlFormatter.Core;

namespace HandStack.Data.SqlFormatter.Languages
{
    internal sealed class TSqlFormatter : Formatter
    {
        private static readonly string[] ReservedWords
            =
            {
                "ADD",
                "EXTERNAL",
                "PROCEDURE",
                "ALL",
                "FETCH",
                "PUBLIC",
                "ALTER",
                "FILE",
                "RAISERROR",
                "AND",
                "FILLFACTOR",
                "READ",
                "ANY",
                "FOR",
                "READTEXT",
                "AS",
                "FOREIGN",
                "RECONFIGURE",
                "ASC",
                "FREETEXT",
                "REFERENCES",
                "AUTHORIZATION",
                "FREETEXTTABLE",
                "REPLICATION",
                "BACKUP",
                "FROM",
                "RESTORE",
                "BEGIN",
                "FULL",
                "RESTRICT",
                "BETWEEN",
                "FUNCTION",
                "RETURN",
                "BREAK",
                "GOTO",
                "REVERT",
                "BROWSE",
                "GRANT",
                "REVOKE",
                "BULK",
                "GROUP",
                "RIGHT",
                "BY",
                "HAVING",
                "ROLLBACK",
                "CASCADE",
                "HOLDLOCK",
                "ROWCOUNT",
                "CASE",
                "IDENTITY",
                "ROWGUIDCOL",
                "CHECK",
                "IDENTITY_INSERT",
                "RULE",
                "CHECKPOINT",
                "IDENTITYCOL",
                "SAVE",
                "CLOSE",
                "IF",
                "SCHEMA",
                "CLUSTERED",
                "IN",
                "SECURITYAUDIT",
                "COALESCE",
                "INDEX",
                "SELECT",
                "COLLATE",
                "INNER",
                "SEMANTICKEYPHRASETABLE",
                "COLUMN",
                "INSERT",
                "SEMANTICSIMILARITYDETAILSTABLE",
                "COMMIT",
                "INTERSECT",
                "SEMANTICSIMILARITYTABLE",
                "COMPUTE",
                "INTO",
                "SESSION_USER",
                "CONSTRAINT",
                "IS",
                "SET",
                "CONTAINS",
                "JOIN",
                "SETUSER",
                "CONTAINSTABLE",
                "KEY",
                "SHUTDOWN",
                "CONTINUE",
                "KILL",
                "SOME",
                "CONVERT",
                "LEFT",
                "STATISTICS",
                "CREATE",
                "LIKE",
                "SYSTEM_USER",
                "CROSS",
                "LINENO",
                "TABLE",
                "CURRENT",
                "LOAD",
                "TABLESAMPLE",
                "CURRENT_DATE",
                "MERGE",
                "TEXTSIZE",
                "CURRENT_TIME",
                "NATIONAL",
                "THEN",
                "CURRENT_TIMESTAMP",
                "NOCHECK",
                "TO",
                "CURRENT_USER",
                "NONCLUSTERED",
                "TOP",
                "CURSOR",
                "NOT",
                "TRAN",
                "DATABASE",
                "NULL",
                "TRANSACTION",
                "DBCC",
                "NULLIF",
                "TRIGGER",
                "DEALLOCATE",
                "OF",
                "TRUNCATE",
                "DECLARE",
                "OFF",
                "TRY_CONVERT",
                "DEFAULT",
                "OFFSETS",
                "TSEQUAL",
                "DELETE",
                "ON",
                "UNION",
                "DENY",
                "OPEN",
                "UNIQUE",
                "DESC",
                "OPENDATASOURCE",
                "UNPIVOT",
                "DISK",
                "OPENQUERY",
                "UPDATE",
                "DISTINCT",
                "OPENROWSET",
                "UPDATETEXT",
                "DISTRIBUTED",
                "OPENXML",
                "USE",
                "DOUBLE",
                "OPTION",
                "USER",
                "DROP",
                "OR",
                "VALUES",
                "DUMP",
                "ORDER",
                "VARYING",
                "ELSE",
                "OUTER",
                "VIEW",
                "END",
                "OVER",
                "WAITFOR",
                "ERRLVL",
                "PERCENT",
                "WHEN",
                "ESCAPE",
                "PIVOT",
                "WHERE",
                "EXCEPT",
                "PLAN",
                "WHILE",
                "EXEC",
                "PRECISION",
                "WITH",
                "EXECUTE",
                "PRIMARY",
                "WITHIN GROUP",
                "EXISTS",
                "PRINT",
                "WRITETEXT",
                "EXIT",
                "PROC",
            };

        private static readonly string[] ReservedTopLevelWords
            =
            {
              "ADD",
              "ALTER COLUMN",
              "ALTER TABLE",
              "CASE",
              "DELETE FROM",
              "END",
              "EXCEPT",
              "FROM",
              "GROUP BY",
              "HAVING",
              "INSERT INTO",
              "INSERT",
              "LIMIT",
              "ORDER BY",
              "SELECT",
              "SET CURRENT SCHEMA",
              "SET SCHEMA",
              "SET",
              "UPDATE",
              "VALUES",
              "WHERE",
            };

        private static readonly string[] ReservedTopLevelWordsNoIndent
            =
            {
                "INTERSECT",
                "INTERSECT ALL",
                "MINUS",
                "UNION",
                "UNION ALL"
            };

        private static readonly string[] ReservedNewlineWords
            =
            {
                "AND",
                "ELSE",
                "OR",
                "WHEN",
                "JOIN",
                "INNER JOIN",
                "LEFT JOIN",
                "LEFT OUTER JOIN",
                "RIGHT JOIN",
                "RIGHT OUTER JOIN",
                "FULL JOIN",
                "FULL OUTER JOIN",
                "CROSS JOIN",
                "NATURAL JOIN",
            };

        protected override Tokenizer GetTokenizer()
        {
            return
                new Tokenizer(
                    ReservedWords,
                    ReservedTopLevelWords,
                    ReservedNewlineWords,
                    ReservedTopLevelWordsNoIndent,
                    stringTypes: new[] { "\"\"", "N''", "''", "``", "[]" },
                    openParens: new[] { "(", "CASE" },
                    closeParens: new[] { ")", "END" },
                    indexedPlaceholderTypes: Array.Empty<char>(),
                    namedPlaceholderTypes: new[] { '@' },
                    lineCommentTypes: new[] { "--" },
                    specialWordChars: new[] { "#", "@" },
                    operators: new[]
                    {
                        ">=",
                        "<=",
                        "<>",
                        "!=",
                        "!<",
                        "!>",
                        "+=",
                        "-=",
                        "*=",
                        "/=",
                        "%=",
                        "|=",
                        "&=",
                        "^=",
                        "::"
                    });
        }
    }
}
