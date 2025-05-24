using Quan_Ly_HomeStay.Models;
using Microsoft.AspNetCore.Mvc;
using Quan_Ly_HomeStay.Data;
using Microsoft.EntityFrameworkCore;

namespace Final.Controllers
{
    [ApiController]
    [Route("api/thongke")]
    public class ThongKeController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public ThongKeController(ApplicationDbContext db)
        {
            _db = db;
        }

        // Thống kê doanh thu theo tháng
        [HttpGet("doanhthu")]
        public async Task<ActionResult> DoanhThu()
        {
            List<decimal> listTotal = new List<decimal>();
            DateTime now = DateTime.Now;
            int year = now.Year;

            for (int i = 1; i <= 12; i++)
            {
                decimal total = await _db.Bookings
                    .Where(b => b.CreateAt.Month == i && b.CreateAt.Year == year && b.Total.HasValue)
                    .SumAsync(b => b.Total ?? 0);

                listTotal.Add(total);
            }

            return Ok(new
            {
                status = 200,
                message = "Thống kê doanh thu theo tháng thành công!",
                data = listTotal
            });
        }

        // Thống kê top 5 phòng được đặt nhiều nhất
        [HttpGet("topphong")]
        public async Task<ActionResult> TopPhong()
        {
            var result = await _db.BookingDetails
                .Where(bd => bd.IdRoom != null)
                .GroupBy(bd => bd.IdRoom)
                .Select(g => new
                {
                    RoomId = g.Key,
                    SoLanDat = g.Count(),
                    TenPhong = g.First().IdRoomNavigation.Name // assuming RoomName exists
                })
                .OrderByDescending(x => x.SoLanDat)
                .Take(5)
                .ToListAsync();

            return Ok(new
            {
                status = 200,
                message = "Top 5 phòng được đặt nhiều nhất",
                data = result
            });
        }

    }
}
