using System.ComponentModel.DataAnnotations;

namespace Quan_Ly_HomeStay.Models
{
    public class Service
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string ServiceName { get; set; }

        public string Description { get; set; }

        [Required]
        public decimal Price { get; set; }

        // Quan hệ n-n với BookingModel (Một dịch vụ có thể xuất hiện trong nhiều đơn đặt)
        /* public virtual ICollection<BookingModel> Bookings { get; set; } = new List<BookingModel>();

         // Quan hệ n-n với UserModel (Người dùng có thể đặt nhiều dịch vụ)
         public virtual ICollection<User> Users { get; set; } = new List<User>();

         // Quan hệ 1-n với PaymentModel (Dịch vụ có thể được thanh toán trong nhiều giao dịch)
         public virtual ICollection<PaymentModel> Payments { get; set; } = new List<PaymentModel>();*/
    }
}
