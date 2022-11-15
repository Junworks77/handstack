using Microsoft.Extensions.Configuration;

using HandStack.Core.Extensions;
using HandStack.Web.ApiClient;
using HandStack.Web.Entity;
using HandStack.Web.MessageContract.DataObject;

using Serilog;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;

namespace HandStack.Web.Extensions
{
    public class BusinessApiClient
    {
        private ILogger logger { get; }

        public BusinessApiClient(ILogger logger)
        {
            this.logger = logger;
        }

        public string? OnewayTransactionCommand(string[] transactionCommands, string globalID, string queryID, List<DynamicParameter> dynamicParameters, List<ServiceParameter>? serviceParameters = null)
        {
            string? result = null;
            try
            {
                string applicationID = transactionCommands[0];
                string projectID = transactionCommands[1];
                string transactionID = transactionCommands[2];
                string serviceID = transactionCommands[3];

                using (TransactionClient apiClient = new TransactionClient(logger))
                {
                    TransactionClientObject transactionObject = new TransactionClientObject();
                    transactionObject.SystemID = TransactionConfig.Transaction.SystemID;
                    transactionObject.ProgramID = applicationID;
                    transactionObject.BusinessID = projectID;
                    transactionObject.TransactionID = transactionID;
                    transactionObject.FunctionID = serviceID;
                    transactionObject.ScreenID = "MessageServer";

                    List<ServiceParameter> inputs = new List<ServiceParameter>();
                    inputs.Add("GlobalID", globalID);
                    inputs.Add("QueryID", queryID);

                    if (serviceParameters != null)
                    {
                        foreach (var item in serviceParameters)
                        {
                            inputs.Add(item.prop, item.val);
                        }
                    }

                    foreach (var item in dynamicParameters)
                    {
                        inputs.Add(item.ParameterName, item.Value);
                    }

                    transactionObject.Inputs.Add(inputs);

                    string requestID = "OnewayTransactionCommand" + DateTime.Now.ToString("yyyyMMddhhmmss");
                    var executeResult = apiClient.ExecuteTransactionNone(requestID, GlobalConfiguration.BusinessServerUrl, transactionObject);
                    executeResult.Wait();

                    result = executeResult.Result;
                }
            }
            catch (Exception exception)
            {
                result = exception.ToMessage();
                logger.Error("[{LogCategory}] " + $"GlobalID: {globalID}, {result}", "BusinessApiClient/OnewayTransactionCommand");
            }

            return result;
        }

        public string? OnewayTransactionCommandAsync(string[] transactionCommands, string globalID, string queryID, List<DynamicParameter> dynamicParameters, List<ServiceParameter>? serviceParameters = null)
        {
            string? result = null;
            try
            {
                string applicationID = transactionCommands[0];
                string projectID = transactionCommands[1];
                string transactionID = transactionCommands[2];
                string serviceID = transactionCommands[3];

                using (TransactionClient apiClient = new TransactionClient(logger))
                {
                    TransactionClientObject transactionObject = new TransactionClientObject();
                    transactionObject.SystemID = TransactionConfig.Transaction.SystemID;
                    transactionObject.ProgramID = applicationID;
                    transactionObject.BusinessID = projectID;
                    transactionObject.TransactionID = transactionID;
                    transactionObject.FunctionID = serviceID;
                    transactionObject.ScreenID = "MessageServer";

                    List<ServiceParameter> inputs = new List<ServiceParameter>();
                    inputs.Add("GlobalID", globalID);
                    inputs.Add("QueryID", queryID);

                    if (serviceParameters != null)
                    {
                        foreach (var item in serviceParameters)
                        {
                            inputs.Add(item.prop, item.val);
                        }
                    }

                    foreach (var item in dynamicParameters)
                    {
                        inputs.Add(item.ParameterName, item.Value);
                    }

                    transactionObject.Inputs.Add(inputs);

                    string requestID = "OnewayTransactionCommandAsync" + DateTime.Now.ToString("yyyyMMddhhmmss");
                    Task.Run(async () =>
                    {
                        try
                        {
                            result = await apiClient.ExecuteTransactionNone(requestID, GlobalConfiguration.BusinessServerUrl, transactionObject);
                        }
                        catch (Exception exception)
                        {
                            logger.Error("[{LogCategory}] " + $"GlobalID: {globalID}, {exception.ToMessage()}, None", "BusinessApiClient/OnewayTransactionCommandAsync");
                        }
                    });
                }
            }
            catch (Exception exception)
            {
                result = exception.ToMessage();
                logger.Error("[{LogCategory}] " + $"GlobalID: {globalID}, {result}", "BusinessApiClient/OnewayTransactionCommandAsync");
            }

            return result;
        }

        public string? FallbackTransactionCommand(string[] transactionCommands, string globalID, string queryID, List<DynamicParameter> dynamicParameters)
        {
            string? result = null;
            try
            {
                string applicationID = transactionCommands[0];
                string projectID = transactionCommands[1];
                string transactionID = transactionCommands[2];
                string serviceID = transactionCommands[3];

                using (TransactionClient apiClient = new TransactionClient(logger))
                {
                    TransactionClientObject transactionObject = new TransactionClientObject();
                    transactionObject.SystemID = TransactionConfig.Transaction.SystemID;
                    transactionObject.ProgramID = applicationID;
                    transactionObject.BusinessID = projectID;
                    transactionObject.TransactionID = transactionID;
                    transactionObject.FunctionID = serviceID;
                    transactionObject.ScreenID = "MessageServer";

                    List<ServiceParameter> inputs = new List<ServiceParameter>();
                    inputs.Add("GlobalID", globalID);
                    inputs.Add("QueryID", queryID);

                    foreach (var item in dynamicParameters)
                    {
                        inputs.Add(item.ParameterName, item.Value);
                    }

                    transactionObject.Inputs.Add(inputs);

                    string requestID = "FallbackTransactionCommand" + DateTime.Now.ToString("yyyyMMddhhmmss");
                    Task.Run(async () =>
                    {
                        try
                        {
                            result = await apiClient.ExecuteTransactionNone(requestID, GlobalConfiguration.BusinessServerUrl, transactionObject);
                        }
                        catch (Exception exception)
                        {
                            logger.Error("[{LogCategory}] " + $"GlobalID: {globalID}, {exception.ToMessage()}", "BusinessApiClient/FallbackTransactionNone");
                        }
                    });
                }
            }
            catch (Exception exception)
            {
                result = exception.ToMessage();
                logger.Error("[{LogCategory}] " + $"GlobalID: {globalID}, {result}", "BusinessApiClient/FallbackTransactionCommand");
            }

            return result;
        }
    }
}
