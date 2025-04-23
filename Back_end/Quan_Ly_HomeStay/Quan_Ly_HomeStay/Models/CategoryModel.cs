using System;
using System.Collections.Generic;

using System.ComponentModel.DataAnnotations;


namespace Quan_Ly_HomeStay.Models;

public partial class Category
{
    [Key]
    public Guid Id { get; set; }

    public int? Quantity { get; set; }

    public string? Name { get; set; }

    public DateTime? CreateAt { get; set; } = DateTime.Now;


    public virtual ICollection<Room> Rooms { get; set; } = new List<Room>();
}
