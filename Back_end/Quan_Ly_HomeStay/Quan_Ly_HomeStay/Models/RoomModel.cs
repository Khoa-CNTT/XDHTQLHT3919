using Quan_Ly_HomeStay.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;


namespace Quan_Ly_HomeStay.Models;

public partial class Room
{

    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]

    public string Name { get; set; } = null!;

    public string? Detail { get; set; }


    public string? Note { get; set; }

    public decimal? Price { get; set; }

    public string? Status { get; set; } // trống, đã đặt, đang bảo trì 


    public DateTime? CreateAt { get; set; } = DateTime.Now;

    public Guid? IdUser { get; set; }

    public string? PathImg { get; set; }

    public Guid? IdCategory { get; set; }

    [ForeignKey("IdCategory")]
    public virtual Category? IdCategoryNavigation { get; set; }

    public virtual ICollection<BookingDetail> BookingDetails { get; set; } = new List<BookingDetail>();
    public virtual ICollection<AmenityModel> Amenities { get; set; } = new List<AmenityModel>();

}