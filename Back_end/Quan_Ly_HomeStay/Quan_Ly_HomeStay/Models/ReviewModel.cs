using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Quan_Ly_HomeStay.Models
{
    public partial class Review
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string Comment { get; set; }

        [Range(1, 5, ErrorMessage = "Rating phải từ 1 đến 5.")]
        public int Rating { get; set; }

        public DateTime CreateAt { get; set; } = DateTime.Now;

        public Guid? IdUser { get; set; }

        [ForeignKey("IdUser")]
        public virtual User? IdUserNavigation { get; set; }

        public Guid? ParentReviewId { get; set; }

        [ForeignKey("ParentReviewId")]
        public virtual Review? ParentReview { get; set; }

        public virtual ICollection<Review>? Replies { get; set; }
    }
}