using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Quan_Ly_HomeStay.Models;

public partial class BookingDetail
{
    [Key]
    public Guid Id { get; set; }

    public string? Note { get; set; }

    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    public decimal? TotalPrice { get; set; }

    public Guid? IdBooking { get; set; }
    public Guid? IdRoom { get; set; }

    public DateTime? CreateAt { get; set; } = DateTime.Now;

    [ForeignKey("IdBooking")]
    public virtual Booking? IdBookingNavigation { get; set; }

    [ForeignKey("IdRoom")]
    public virtual Room? IdRoomNavigation { get; set; }

    public virtual ICollection<BookingDetailService> BookingDetailServices { get; set; } = new List<BookingDetailService>();
}
