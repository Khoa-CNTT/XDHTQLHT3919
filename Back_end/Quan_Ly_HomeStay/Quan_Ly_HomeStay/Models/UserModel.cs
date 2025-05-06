using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Quan_Ly_HomeStay.Models;

public partial class User
{
    [Key]
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    // Email KHÔNG bắt buộc, nhưng nếu có thì phải đúng định dạng
    [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
    public string? Email { get; set; }

    public string? Name { get; set; }

    // Mật khẩu là bắt buộc
    [Required(ErrorMessage = "Mật khẩu không được để trống")]
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