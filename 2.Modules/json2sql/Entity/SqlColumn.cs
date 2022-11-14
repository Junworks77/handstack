namespace json2sql.Entity
{
    internal class SqlColumn
    {
        public SqlColumn()
        {
            Name = "";
            Value = "";
            Type = "";
        }

        public string Name { get; set; }
        public string Value { get; set; }
        public string Type { get; set; }
    }
}
