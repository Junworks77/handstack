using System.Collections.Generic;

namespace HandStack.Web.MessageContract.DataObject
{
    public partial class BearerToken
    {
        public BearerToken()
        {
            TokenID = "";
            IssuerName = "";
            Claim = new Claim();
            Addtional = null;
        }

        public string TokenID { get; set; }

        public string IssuerName { get; set; }

        public Claim Claim { get; set; }

        public dynamic? Addtional { get; set; }
    }

    public partial class Claim
    {
        public Claim()
        {
            AllowApplications = new List<string>();
            AllowProjects = new List<string>();
            CertificateTokenID = "";
            CertificatePinKey = "";
            Roles = new List<string>();
        }

        public List<string> AllowApplications { get; set; }

        public List<string> AllowProjects { get; set; }

        public string CertificateTokenID { get; set; }

        public string CertificatePinKey { get; set; }

        public List<string> Roles { get; set; }
    }
}
