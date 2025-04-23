using System;
using System.Collections.Generic;

using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;


namespace Quan_Ly_HomeStay.Models;

public partial class BookingDetail
{

    [Key]

    public Guid Id { get; set; }

    public int Quantity { get; set; }

    public decimal Price { get; set; }

    public Guid? IdOrder { get; set; }


    public Guid? IdRoom { get; set; }

    public DateTime? CreateAt { get; set; } = DateTime.Now;

    [ForeignKey("IdOrder")]
    public virtual Booking? IdOrderNavigation { get; set; }

    [ForeignKey("IdRoom")]
    public virtual Room? IdRoomNavigation { get; set; }

}
