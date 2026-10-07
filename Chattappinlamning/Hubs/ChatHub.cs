using Microsoft.AspNetCore.SignalR;

namespace Chattappinlamning.Hubs
{
    public class ChatHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var username = httpContext?.Request.Query["username"].ToString();

            if (string.IsNullOrWhiteSpace(username))
            {
                Context.Abort();
                return;
            }

            Context.Items["username"] = username;

            await base.OnConnectedAsync();
        }

        public async Task SendMessage(string message)
        {
            var username = Context.Items["username"]?.ToString();

            if (string.IsNullOrWhiteSpace(username))
            {
                return;
            }

            if (string.IsNullOrWhiteSpace(message))
            {
                return;
            }

            await Clients.All.SendAsync("ReceiveMessage", username, message);
        }
    }
}