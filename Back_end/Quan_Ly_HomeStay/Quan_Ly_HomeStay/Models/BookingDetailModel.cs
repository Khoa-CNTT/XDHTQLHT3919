namespace Quan_Ly_HomeStay.Models
{
    public class BookingDetailModel
    {
        public Guid Id { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; } // Số đêm        
        public Guid? IdRoom { get; set; }
        public Guid? IdBooking { get; set; }
        public DateTime? CreateAt { get; set; }
        public virtual RoomModel? IdRoomNavigation { get; set; }
        public virtual BookingModel? IdBookingNavigation { get; set; }
    }
}
