using Quan_Ly_HomeStay.Models;
using System;
using System.Collections.Generic;

namespace Quan_Ly_HomeStay.Models;

public partial class Role
{
    public Guid Id { get; set; }

    public string? Name { get; set; }

    public DateTime? CreateAt { get; set; }=DateTime.Now;

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
