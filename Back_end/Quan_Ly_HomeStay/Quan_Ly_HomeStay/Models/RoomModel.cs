using Quan_Ly_HomeStay.Models;
using System;
using System.Collections.Generic;

namespace Quan_Ly_HomeStay.Models;

public partial class Room
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Detail { get; set; }

    public int? Quantity { get; set; }

    public decimal? Price { get; set; }

    public string? Type { get; set; }

    public DateTime? CreateAt { get; set; } = DateTime.Now;

    public Guid? IdUser { get; set; }

    public string? PathImg { get; set; }

    public Guid? IdCategory { get; set; }

    public virtual ICollection<BookingDetail> BookingDetails { get; set; } = new List<BookingDetail>();

    public virtual Category? IdCategoryNavigation { get; set; }

    public virtual User? IdUserNavigation { get; set; }
}
