namespace HandStack.Web.Entity
{
    public class ApplicationMember
    {
        public ApplicationMember()
        {
            MemberNo = "";
            MemberID = "";
            Email = "";
            MemberName = "";
            PhoneNo = "";
            CertificationType = "";
            MemberType = "";
            JoinDateTime = "";
            AgreeEmail = "";
            AgreeSMS = "";
            AgreePersonalInfo = "";
            AgreeThirdPartyInfo = "";
            SessionKey = "";
            LoginDateTime = DateTime.MinValue;
            Roles = new List<string>();
        }

        public string MemberNo { get; set; }

        public string MemberID { get; set; }

        public string Email { get; set; }

        public string MemberName { get; set; }

        public string PhoneNo { get; set; }

        public string CertificationType { get; set; }

        public string MemberType { get; set; }

        public string JoinDateTime { get; set; }

        public string AgreeEmail { get; set; }

        public string AgreeSMS { get; set; }

        public string AgreePersonalInfo { get; set; }

        public string AgreeThirdPartyInfo { get; set; }

        public string SessionKey { get; set; }

        public DateTime LoginDateTime { get; set; }

        public List<string> Roles { get; set; }
    }
}
