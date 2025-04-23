using System.ComponentModel.DataAnnotations;

namespace Quan_Ly_HomeStay.Models
{
    public partial class Service
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string ServiceName { get; set; } = null!;

        public string? Description { get; set; }

        [Required]
        public decimal Price { get; set; }

        public virtual ICollection<UserService> UserServices { get; set; } = new List<UserService>();
    }
}
