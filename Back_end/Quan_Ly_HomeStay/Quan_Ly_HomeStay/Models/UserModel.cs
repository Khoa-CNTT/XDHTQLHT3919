using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Quan_Ly_HomeStay.Models
{
    public class UserModel
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string? Image { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string Phone { get; set; }

        public string Address { get; set; }

        public DateTime CreateAt { get; set; } = DateTime.Now;

        [Required]
        public Guid IdRole { get; set; }

        public string? PathImg { get; set; }

        // Quan hệ 1-n với RoleModel
        [ForeignKey("IdRole")]
        public virtual RoleModel? Role { get; set; }

        // Quan hệ 1-n với BookingModel (Sửa lại từ RoomModel)
        public virtual ICollection<RoomModel> Rooms { get; set; } = new List<RoomModel>();

        /* // Quan hệ 1-n với ServiceModel (Dịch vụ mà User đặt)
         public virtual ICollection<ServiceModel> Services { get; set; } = new List<ServiceModel>();

         // Quan hệ 1-n với ReviewModel (User có thể đánh giá)
         public virtual ICollection<ReviewModel> Reviews { get; set; } = new List<ReviewModel>();

         // Quan hệ 1-n với PaymentModel (User có nhiều giao dịch)
         public virtual ICollection<PaymentModel> Payments { get; set; } = new List<PaymentModel>();*/
    }
}
