namespace Quan_Ly_HomeStay.Models
{
    public class CategoryModel
    {
        public Guid Id { get; set; }
        public decimal? TotalPrice { get; set; }
        public string? Name { get; set; }
        public DateTime? CreateAt { get; set; } = DateTime.Now;
        public ICollection<RoomModel> Rooms { get; set; } = new List<RoomModel>();
    }
}
