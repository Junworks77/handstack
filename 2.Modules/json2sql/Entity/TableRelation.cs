namespace json2sql.Entity
{
    internal class TableRelation
    {
        public TableRelation()
        {
            Source = "";
            Target = "";
            Order = 0;
        }

        public string Source { get; set; }
        public string Target { get; set; }
        public int Order { get; set; }
    }
}
