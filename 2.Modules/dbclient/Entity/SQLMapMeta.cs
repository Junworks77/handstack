﻿using System.Collections.Generic;

using dbclient.Extensions;

namespace dbclient.Entity
{
    public class SQLMapMeta
    {
        public List<StatementMap> Statements = new List<StatementMap>();
        public Dictionary<string, string> DefinedSQL = new Dictionary<string, string>();
        public Dictionary<string, string> ExecuteSQL = new Dictionary<string, string>();
        public Dictionary<string, Dictionary<string, object?>> Parameters = new Dictionary<string, Dictionary<string, object?>>();
    }
}
