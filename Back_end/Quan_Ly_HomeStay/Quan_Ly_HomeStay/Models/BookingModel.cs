namespace Quan_Ly_HomeStay.Models
{
    public class BookingModel
    {
        public Guid Id { get; set; }
        public int? Status { get; set; }
        public decimal? Total { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public string? Note { get; set; }
        public Guid? IdUser { get; set; }
        public virtual ICollection<BookingDetailModel> BookingDetails { get; set; } = new List<BookingDetailModel>();
    }
}
