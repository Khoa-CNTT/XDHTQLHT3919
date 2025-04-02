namespace Quan_Ly_HomeStay.Models
{
    public class PaymentModel
    {
        public Guid ID { get; set; }
        public string BookingID { get; set; }
        public string PaymentMethod { get; set; } // Tiền mặt, Chuyển khoản, Online
        public DateTime PaymentDate { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; } // Đã thanh toán, Đang xử lý...
    }
}
