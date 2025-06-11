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

        public async Task SendAnnouncement(string user, string message, string role)
        {
            if (role.ToLower() == "teacher")
            {
                await Clients.All.SendAsync("ReceiveAnnouncement", user, message);
            }
        }


    }
}
