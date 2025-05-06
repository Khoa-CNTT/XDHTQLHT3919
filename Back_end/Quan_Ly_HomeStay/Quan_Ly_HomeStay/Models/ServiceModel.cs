using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Quan_Ly_HomeStay.Models;

public partial class Service
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public string ServiceName { get; set; } = null!;

    public string? Description { get; set; }

    [Required]
    public decimal Price { get; set; }

    public virtual ICollection<BookingDetailService> BookingDetailServices { get; set; } = new List<BookingDetailService>();
}
