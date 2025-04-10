namespace Quan_Ly_HomeStay.Models
{
    public class Review
    {
        public Guid Id { get; set; }
        public string AccountID { get; set; }
        public string HomestayID { get; set; }
        public int Rating { get; set; } // 1-5 (sao)
        public string? Comment { get; set; }
        public DateTime ReviewDate { get; set; }
    }
}
