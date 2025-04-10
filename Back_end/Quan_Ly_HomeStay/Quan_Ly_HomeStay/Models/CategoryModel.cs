using System;
using System.Collections.Generic;

namespace Quan_Ly_HomeStay.Models;

public partial class Category
{
    public Guid Id { get; set; }

    public string? Slug { get; set; }

    public string? Name { get; set; }

    public DateTime? CreateAt { get; set; }

    public virtual ICollection<Room> Rooms { get; set; } = new List<Room>();
}
