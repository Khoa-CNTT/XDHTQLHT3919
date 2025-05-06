using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Quan_Ly_HomeStay.Models;

public partial class BookingDetailService
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid BookingDetailId { get; set; }
    public Guid ServiceId { get; set; }

    [ForeignKey("BookingDetailId")]
    public virtual BookingDetail BookingDetail { get; set; } = null!;

    [ForeignKey("ServiceId")]
    public virtual Service Service { get; set; } = null!;
}
