using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;

namespace Quan_Ly_HomeStay.Models;

public partial class User
{
    public Guid Id { get; set; }

    public string Email { get; set; } = null!;

    public string? Name { get; set; }

    public string Password { get; set; } = null!;

    public string? Address { get; set; }

    public string? Phone { get; set; }

    public string? PathImg { get; set; }

    public Guid? IdRole { get; set; }

    public DateTime? CreateAt { get; set; }=DateTime.Now;

    [ForeignKey("IdRole")]
    public virtual Role? IdRoleNavigation { get; set; }


    public virtual ICollection<Room> Rooms { get; set; } = new List<Room>();
}
