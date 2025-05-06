using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Quan_Ly_HomeStay.Models;

public partial class Category
{
    [Key]
    public Guid Id { get; set; }

    public string? Name { get; set; }

    public int? Quantity { get; set; }

    public DateTime? CreateAt { get; set; } = DateTime.Now;

    // Mối quan hệ với Room
    public virtual ICollection<Room> Rooms { get; set; } = new List<Room>();

    //public int Quantity => Rooms.Count; 
}