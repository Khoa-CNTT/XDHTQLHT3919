using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Quan_Ly_HomeStay.Models
{
    public partial class Review
    {
        [Key]
        public Guid Id { get; set; }

        public string? Comment { get; set; }

        public DateTime? CreateAt { get; set; } = DateTime.Now;

        public Guid? IdUser { get; set; }
        
        [ForeignKey("IdUser")]
        public virtual User? IdUserNavigation { get; set; }

    }
}
