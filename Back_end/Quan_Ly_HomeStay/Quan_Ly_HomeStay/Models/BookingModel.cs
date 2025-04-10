using System;
using System.Collections.Generic;

namespace Quan_Ly_HomeStay.Models;

public partial class Booking
{
    public Guid Id { get; set; }

    public int? Status { get; set; }

    public decimal? Total { get; set; }

    public DateTime CreateAt { get; set; }

    public Guid? IdUser { get; set; }

    public virtual ICollection<BookingDetail> BookingDetails { get; set; } = new List<BookingDetail>();
}
