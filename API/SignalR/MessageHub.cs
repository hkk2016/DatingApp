using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class MessageHub : Hub
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

         
        private readonly IHubContext<PesenceHub> _presenceHub;
        private readonly PresenceTracker _tracker;

        public MessageHub(
         IUnitOfWork unitOfWork,
         IMapper mapper,
         IHubContext<PesenceHub> presenceHub,
         PresenceTracker tracker)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _presenceHub = presenceHub;
            _tracker = tracker;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var otherUser =  httpContext.Request.Query["user"].ToString();
            var groupName = GetGroupName(Context.User.GetUserName(),otherUser);
            await Groups.AddToGroupAsync(Context.ConnectionId,groupName);

            var group = await AddTogroup(groupName);
            await Clients.Group(groupName).SendAsync("UpdatedGroup",group);

            var messages = await _unitOfWork.MessageRepository.GetMessageThread(Context.User.GetUserName(),otherUser);

            if(_unitOfWork.HasChanges()) await _unitOfWork.Complete();

            await Clients.Caller.SendAsync("ReceiveMessageThread",messages);
        }

        public override async Task OnDisconnectedAsync(Exception exception )
        {
           var group = await RemoveFormMessageGroup();
           await Clients.Group(group.Name).SendAsync("UpdatedGroup",group);
            await base.OnDisconnectedAsync(exception);
        }
        
        public async Task SendMessage(CreateMessageDTO createMessageDTO )
        {
             var userName = Context.User.GetUserName();

            if (userName == createMessageDTO.RecipientUsername.ToLower()) 
                throw new HubException("You cannot send message to yourself");

            var sender = await _unitOfWork.UserRepository.GetUserByUsernameAsync(userName);
            var recipent = await _unitOfWork.UserRepository.GetUserByUsernameAsync(createMessageDTO.RecipientUsername);

            if (recipent == null) throw new HubException("Not Found Uuser");

            var message = new Message
            {
                Sender = sender,
                Recipient = recipent,
                SenderUserName = sender.UserName,
                RecipientUsername = recipent.UserName,
                Content = createMessageDTO.Content
            };
             var groupName = GetGroupName(sender.UserName,recipent.UserName);
             var group = await _unitOfWork.MessageRepository.GetMessageGroup(groupName);

             if(group.Connections.Any(x =>x.Username == recipent.UserName))
             {
                 message.DateRead = DateTime.UtcNow;
             }
             else
             {
                 var connections = await _tracker.GetConnectionsForUser(recipent.UserName);
                 if(connections !=null)
                 {
                     await _presenceHub.Clients.Clients(connections).SendAsync("NewMessageReceived",
                     new { username = sender.UserName , knownAs = sender.KnownAs});
                 }
             }
            _unitOfWork.MessageRepository.AddMessage(message);

            if (await _unitOfWork.Complete())
            {
            
                await Clients.Group(groupName).SendAsync("NewMessage",_mapper.Map<MessageDTO>(message));

            }
            
        }
        private string GetGroupName(string caller,string other)
        {
            var stringCompare = string.CompareOrdinal(caller,other) < 0;

            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        }

        private async Task<Group> RemoveFormMessageGroup()
        {
            var group = await _unitOfWork.MessageRepository.GetGroupForConnection(Context.ConnectionId);
            var connection = group.Connections.FirstOrDefault(x =>x.ConnectionId == Context.ConnectionId);
            _unitOfWork.MessageRepository.RemoveConnection(connection);
           if( await _unitOfWork.Complete()) return group;

           throw new HubException("Failed to remove group");
        }
        private async Task<Group> AddTogroup(string groupName)
        {
            var group = await _unitOfWork.MessageRepository.GetMessageGroup(groupName);
            var connection = new Connection(Context.ConnectionId,Context.User.GetUserName());

            if(group == null)
            {
                group = new Group(groupName);
                _unitOfWork.MessageRepository.AddGroup(group);
            }

            group.Connections.Add(connection);

            if(await _unitOfWork.Complete()) return group;

            throw new HubException("Failed to Join Group");

        }

    }
}