namespace API.Helpers
{
    public class LikesParams : Pagination
    {
        public int UserId { get; set; }

        public string Predicate { get; set; }
    }
}