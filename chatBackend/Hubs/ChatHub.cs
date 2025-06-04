using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace ChatBackend.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message, string role)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message, role);
        }

    }
}
