namespace Quan_Ly_HomeStay.Models
{
    public class PaymentRequestModel
    {
        public Guid IdUser { get; set; }
        public decimal Total { get; set; }
        public Guid IdBooking { get; set; }
        public List<Booking> Booking { get; set; }
    }
}
