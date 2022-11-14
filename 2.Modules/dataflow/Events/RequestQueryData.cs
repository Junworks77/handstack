using MediatR;

namespace dataflow.Events
{
    public class RequestQueryData : IRequest<object?>
    {
        public object? Request { get; set; }

        public RequestQueryData(object? request)
        {
            Request = request;
        }
    }
}
