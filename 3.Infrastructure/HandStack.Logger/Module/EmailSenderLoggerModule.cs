using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Mail;
using System.Text;

using HandStack.Logger.Logging.Formatters;

namespace HandStack.Logger.Logging.Module
{
    public class EmailSenderLoggerModule : LoggerModule
    {
        private readonly SmtpServerConfiguration smtpServerConfiguration;

        public string Sender { get; set; }

        public IList<string> Recipients { get; private set; }

        public bool EnableSsl { get; set; }

        private readonly string subject;
        private readonly ILoggerFormatter loggerFormatter;

        public EmailSenderLoggerModule(SmtpServerConfiguration smtpServerConfiguration)
            : this(smtpServerConfiguration, GenerateSubjectName()) { }

        public EmailSenderLoggerModule(SmtpServerConfiguration smtpServerConfiguration, string subject)
            : this(smtpServerConfiguration, subject, new DefaultLoggerFormatter()) { }

        public EmailSenderLoggerModule(SmtpServerConfiguration smtpServerConfiguration, ILoggerFormatter loggerFormatter)
            : this(smtpServerConfiguration, GenerateSubjectName(), loggerFormatter) { }

        public EmailSenderLoggerModule(SmtpServerConfiguration smtpServerConfiguration, string subject, ILoggerFormatter loggerFormatter)
        {
            Sender = "ack.email.sender";
            this.smtpServerConfiguration = smtpServerConfiguration;
            this.subject = subject;
            this.loggerFormatter = loggerFormatter;

            Recipients = new List<string>();
        }

        public override string Name
        {
            get { return "EmailSenderLoggerModule"; }
        }

        public override void ExceptionLog(Exception exception)
        {
            if (string.IsNullOrEmpty(Sender) || Recipients.Count == 0)
            {
                TraceLogger.Debug.Log("이메일 발신자 또는 수신자 확인 필요");
                return;
            }

            var body = MakeEmailBodyFromLogHistory();
            var client = new SmtpClient(smtpServerConfiguration.Host, smtpServerConfiguration.Port)
            {
                EnableSsl = EnableSsl,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(smtpServerConfiguration.UserName, smtpServerConfiguration.Password)
            };

            foreach (var recipient in Recipients)
            {
                using (var mailMessage = new MailMessage(Sender, recipient, subject, body))
                {
                    client.Send(mailMessage);
                }
            }
        }

        private static string GenerateSubjectName()
        {
            var currentDate = DateTime.Now;
            return string.Format("HandStack.Logger {0} {1}", currentDate.ToShortDateString(), currentDate.ToShortTimeString());
        }

        private string MakeEmailBodyFromLogHistory()
        {
            var stringBuilder = new StringBuilder();
            stringBuilder.AppendLine("logger email module");

            foreach (var logMessage in TraceLogger.Messages)
            {
                stringBuilder.AppendLine(loggerFormatter.ApplyFormat(logMessage));
            }

            return stringBuilder.ToString();
        }
    }

    public class SmtpServerConfiguration
    {
        public string UserName { get; private set; }

        public string Password { get; private set; }

        public string Host { get; private set; }

        public int Port { get; private set; }

        public SmtpServerConfiguration(string userName, string password, string host, int port)
        {
            UserName = userName;
            Password = password;
            Host = host;
            Port = port;
        }
    }
}
