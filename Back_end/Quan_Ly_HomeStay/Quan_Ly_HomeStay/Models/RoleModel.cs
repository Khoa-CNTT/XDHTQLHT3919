using System.ComponentModel.DataAnnotations;

namespace Quan_Ly_HomeStay.Models
{
    public class RoleModel
    {
        [Key]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime? CreateAt { get; set; }
        public virtual ICollection<User> Users { get; set; } = new List<User>();
    }
}
