namespace API.Helpers
{
    public class MessageParams : Pagination
    {
        public string Username { get; set; }

        public string Container { get; set; } = "Unread";
    }
}