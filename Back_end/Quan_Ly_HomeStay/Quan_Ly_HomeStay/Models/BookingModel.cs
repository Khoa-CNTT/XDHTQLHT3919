using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Quan_Ly_HomeStay.Models;

public partial class Booking
{
    [Key]
    public Guid Id { get; set; }

    public string? Status { get; set; } // có 3 trạng thái chưa xác nhận, đang xác nhận, đã xác nhận

    public decimal? Total { get; set; }

    public DateTime CreateAt { get; set; } = DateTime.Now;

    public Guid? IdUser { get; set; }

    [ForeignKey("IdUser")]
    public virtual User? IdUserNavigation { get; set; }

    public virtual ICollection<BookingDetail> BookingDetails { get; set; } = new List<BookingDetail>();
}
