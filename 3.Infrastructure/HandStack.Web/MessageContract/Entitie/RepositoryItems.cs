using System;
using System.Data;
using System.Linq;

using HandStack.Core.DataModel;
using HandStack.Core.DataModel.Rules;
using HandStack.Core.ExtensionMethod;

namespace HandStack.Web.MessageContract.Entitie
{
    public class RepositoryItems : EntityObject, IDataBinding
    {
        public RepositoryItems()
        {
            ItemID = "";
            FileName = "";
            Sequence = 0;
            ItemSummery = "";
            AbsolutePath = "";
            RelativePath = "";
            Extension = "";
            Size = 0;
            RepositoryID = "";
            DependencyID = "";
            CustomID1 = "";
            CustomID2 = "";
            CustomID3 = "";
            PolicyPath = "";
            CreatePersonID = "";
            CreateDate = DateTime.Now;

            AddRule(new RequiredRule("RepositoryItemsID", "필수항목 확인 필요"));
        }

        public string ItemID { get; set; }

        public string FileName { get; set; }

        public int Sequence { get; set; }

        public string ItemSummery { get; set; }

        public string AbsolutePath { get; set; }

        public string RelativePath { get; set; }

        public string Extension { get; set; }

        public int Size { get; set; }

        public string RepositoryID { get; set; }

        public string DependencyID { get; set; }

        public string CustomID1 { get; set; }

        public string CustomID2 { get; set; }

        public string CustomID3 { get; set; }

        public string PolicyPath { get; set; }

        public string CreatePersonID { get; set; }

        public DateTime CreateDate { get; set; }

        public dynamic BindingData(IDataReader dataReader)
        {
            return dataReader.ToObjectList<RepositoryItems>();
        }

        public RepositoryItems? GetRepositoryItems(IDataReader dataReader)
        {
            return dataReader.ToObjectList<RepositoryItems>()?.FirstOrDefault();
        }
    }
}
