
using Quan_Ly_HomeStay.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Quan_Ly_HomeStay.Data;

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
        [HttpGet("doanhthu")]
        public async Task<ActionResult> DoanhThu()
        {
            List<decimal> listTotal = new List<decimal>();
            DateTime day = DateTime.Now;
            int year = day.Year;
            for (int i = 1; i <= 12; i++)
            {
                decimal total = 0;
                total = Convert.ToDecimal((from order in _db.Bookings
                                           where order.CreateAt.Month == i
                                           where order.CreateAt.Year == year
                                           select order.Total).Sum());
                listTotal.Add(total);
            }
            decimal min = 0;
            decimal max = ((listTotal.Max()) * 120) / 100;
            return Ok(new
            {
                status = 200,
                message = "Thống kê doanh thu thành công!",
                data = listTotal
            });
        }
    }
}
