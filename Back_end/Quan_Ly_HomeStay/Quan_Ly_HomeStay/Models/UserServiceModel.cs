using Quan_Ly_HomeStay.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Quan_Ly_HomeStay.Models;
public partial class UserService
{
    public Guid IdUser { get; set; }
    public Guid IdService { get; set; }

    public DateTime? CreateAt { get; set; } = DateTime.Now;

    [ForeignKey("IdUser")]
    public virtual User? User { get; set; }

    [ForeignKey("IdService")]
    public virtual Service? Service { get; set; }
}

