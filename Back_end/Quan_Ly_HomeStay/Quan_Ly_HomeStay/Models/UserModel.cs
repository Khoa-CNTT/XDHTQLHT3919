using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;

namespace Quan_Ly_HomeStay.Models;

public partial class User
{
    [Key]
    public Guid Id { get; set; }

    [Required, EmailAddress]
    public string Email { get; set; } = null!;

    public string? Name { get; set; }

    [Required]
    public string Password { get; set; } = null!;

    public string? Address { get; set; }

    public string? Phone { get; set; }

    public string? PathImg { get; set; }

    public Guid? IdRole { get; set; }

    public DateTime? CreateAt { get; set; } = DateTime.Now;

    [ForeignKey("IdRole")]
    public virtual Role? IdRoleNavigation { get; set; }

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
    public virtual ICollection<UserService> UserServices { get; set; } = new List<UserService>();
}
