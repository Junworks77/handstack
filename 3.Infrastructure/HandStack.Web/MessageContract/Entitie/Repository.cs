using System.Data;

using HandStack.Core.DataModel;
using HandStack.Core.DataModel.Rules;
using HandStack.Core.ExtensionMethod;

namespace HandStack.Web.MessageContract.Entitie
{
    public class Repository : EntityObject, IDataBinding
    {
        public Repository()
        {
            RepositoryID = "";
            RepositoryName = "";
            PhysicalPath = "";
            IsVirtualPath = false;
            IsAutoPath = false;
            PolicyPath = "";
            IsMultiUpload = false;
            UseCompress = false;
            UploadExtensions = "";
            UploadCount = 0;
            UploadSizeLimit = 0;
            PolicyException = "";
            RedirectUrl = "";
            UseYN = false;
            Description = "";
            CreatePersonID = "";
            CreateDate = DateTime.Now;

            AddRule(new RequiredRule("RepositoryID", "필수항목 확인 필요"));
        }

        public string RepositoryID { get; set; }

        public string RepositoryName { get; set; }

        public string PhysicalPath { get; set; }

        public bool IsVirtualPath { get; set; }

        public bool IsAutoPath { get; set; }

        public string PolicyPath { get; set; }

        public bool IsMultiUpload { get; set; }

        public bool UseCompress { get; set; }

        public string UploadExtensions { get; set; }

        public short UploadCount { get; set; }

        public int UploadSizeLimit { get; set; }

        public string PolicyException { get; set; }

        public string RedirectUrl { get; set; }

        public bool UseYN { get; set; }

        public string Description { get; set; }

        public string CreatePersonID { get; set; }

        public DateTime CreateDate { get; set; }

        public dynamic BindingData(IDataReader dataReader)
        {
            return dataReader.ToObjectList<Repository>();
        }

        public Repository? GetRepository(IDataReader dataReader)
        {
            return dataReader.ToObjectList<Repository>()?.FirstOrDefault();
        }
    }

}
