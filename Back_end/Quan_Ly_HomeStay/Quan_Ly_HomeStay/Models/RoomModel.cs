namespace Quan_Ly_HomeStay.Models
{
    public class RoomModel
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Image { get; set; }
        public string RoomNumber { get; set; }
        public int? Quantity { get; set; }
        public string Description { get; set; }
        public int PricePerNight { get; set; }
        public DateTime? CreateAt { get; set; }
        public Guid IdUser { get; set; }
        public Guid IdCategory { get; set; }
        /*public List<string> Amenities { get; set; }*/ // Ví dụ: Wifi, Điều hòa... 
        /*public virtual ICollection<ReviewModel> Reviews { get; set; }*/
        public virtual UserModel? IdUserNavigation { get; set; }
        public virtual ICollection<BookingDetailModel> BookingDetail { get; set; } = new List<BookingDetailModel>();
        public CategoryModel? IdCategoryNavigation { get; set; }
    }
}
