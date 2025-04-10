using System;
using System.Collections.Generic;

namespace Quan_Ly_HomeStay.Models;

public partial class BookingDetail
{
    public Guid Id { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; }

    public Guid? IdOrder { get; set; }

    public Guid? IdProduct { get; set; }

    public DateTime? CreateAt { get; set; }

    public virtual Booking? IdOrderNavigation { get; set; }

    public virtual Room? IdProductNavigation { get; set; }
}
