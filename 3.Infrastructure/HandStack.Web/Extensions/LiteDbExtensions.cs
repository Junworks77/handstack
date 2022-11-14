using LiteDB;

using Newtonsoft.Json.Linq;

namespace HandStack.Web.Extensions
{
    public static class LiteDbExtensions
    {
        public static JToken? ToJToken(this BsonValue self)
        {
            switch (self.Type)
            {
                case BsonType.Array:
                    return self.AsArray.ToJArray();
                case BsonType.Binary:
                    return self.AsBinary;
                case BsonType.Boolean:
                    return self.AsBoolean;
                case BsonType.DateTime:
                    return self.AsDateTime;
                case BsonType.Decimal:
                    return self.AsDecimal;
                case BsonType.Document:
                    return self.AsDocument.ToJObject();
                case BsonType.Double:
                    return self.AsDouble;
                case BsonType.Guid:
                    return self.AsGuid;
                case BsonType.Int32:
                    return self.AsInt32;
                case BsonType.Int64:
                    return self.AsInt64;
                case BsonType.MaxValue:
                    return self.AsDouble;
                case BsonType.MinValue:
                    return self.AsDouble;
                case BsonType.Null:
                    return null;
                case BsonType.ObjectId:
                    return JObject.FromObject(self.AsObjectId);
                case BsonType.String:
                    return self.AsString;
            }
            return null;
        }

        /// <code>
        /// var ja = new JArray { "Hello World!", 77, true, 0.17, new DateTime(2020, 04, 15, 21, 38, 25), null };
        /// Assert.AreEqual(ja.ToString(), ja.ToBsonArray().ToJArray().ToString());
        /// </code>
        public static JArray ToJArray(this BsonArray self)
        {
            var ja = new object[self.Count];
            for (int i = 0; i < self.Count; i++)
            {
#pragma warning disable CS8601
                ja[i] = self[i].ToJToken();
#pragma warning restore CS8601
            }
            return new JArray(ja);
        }

        /// <code>
        /// var jo = new JObject { ["aString"] = "Hello World!", ["anInt"] = 77, ["aBool"] = true, ["aDouble"] = 0.17, ["aDate"] = new DateTime(2020, 04, 15, 21, 38, 25), ["aNull"] = null };
        /// Assert.AreEqual(jo.ToString(), jo.ToBsonDocument().ToJObject().ToString());
        /// </code>
        public static JObject ToJObject(this BsonDocument self)
        {
            var jo = new JObject();
            foreach (var key in self.Keys)
            {
                jo[key] = self[key].ToJToken();
            }
            return jo;
        }

        public static BsonValue? ToBsonValue(this JToken self)
        {
            switch (self.Type)
            {
                case JTokenType.Array:
                    return self.Value<JArray>()?.ToBsonArray();
                case JTokenType.Boolean:
                    return new BsonValue(self.Value<bool>());
                case JTokenType.Bytes:
                    return new BsonValue(self.Value<byte[]>());
                case JTokenType.Comment:
                    return BsonValue.Null;
                case JTokenType.Constructor:
                    return BsonValue.Null;
                case JTokenType.Date:
                    return new BsonValue(self.Value<DateTime>());
                case JTokenType.Float:
                    return new BsonValue(self.Value<double>());
                case JTokenType.Guid:
                    return new BsonValue(self.Value<Guid>());
                case JTokenType.Integer:
                    return new BsonValue(self.Value<Int64>());
                case JTokenType.None:
                    return BsonValue.Null;
                case JTokenType.Null:
                    return BsonValue.Null;
                case JTokenType.Object:
                    return self.Value<JObject>()?.ToBsonDocument();
                case JTokenType.Property:
                    return BsonValue.Null;
                case JTokenType.Raw:
                    return BsonValue.Null;
                case JTokenType.String:
                    return new BsonValue(self.Value<string>());
                case JTokenType.TimeSpan:
                    return new BsonValue(self.Value<TimeSpan>().Ticks);
                case JTokenType.Undefined:
                    return BsonValue.Null;
                case JTokenType.Uri:
                    return new BsonValue(self.Value<Uri>()?.ToString());
            }
            return null;
        }

        public static BsonArray ToBsonArray(this JArray self)
        {
            var ba = new BsonValue?[self.Count];
            for (int i = 0; i < self.Count; i++)
            {
                ba[i] = self[i]?.ToBsonValue();
            }
            return new BsonArray(ba);
        }

        /// <code>
        /// var test = db.GetCollection("test");
        /// var jo = new JObject { ["_id"] = "jo", ["aString"] = "Hello World!", ["anInt"] = 77, ["aBool"] = true, ["aDouble"] = 0.17, ["aNull"] = null };
        /// test.Insert(jo.ToBsonDocument());
        /// </code>
        public static BsonDocument ToBsonDocument(this JObject self)
        {
            var doc = new BsonDocument();
            foreach (var pair in self)
            {
                doc[pair.Key] = pair.Value?.ToBsonValue();
            }
            return doc;
        }
    }
}
