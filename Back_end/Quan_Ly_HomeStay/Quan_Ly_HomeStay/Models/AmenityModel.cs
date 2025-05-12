using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Quan_Ly_HomeStay.Models
{
    public class AmenityModel
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string Name { get; set; } = null!;

        public string? Description { get; set; }

        // Mối quan hệ ngược lại (một tiện nghi có thể có nhiều phòng)
        public virtual ICollection<Room> Rooms { get; set; } = new List<Room>();
    }
}