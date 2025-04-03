using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Quan_Ly_HomeStay.Data;

namespace Khoa_Luan_Tot_Nghiep.Controllers
{
    [ApiController]
    [Route("api/statistical")]
    public class StatisticalController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        public StatisticalController(ApplicationDbContext db)
        {
            _db = db;
        }

        /// <summary>
        /// Thống kê doanh thu theo khoảng thời gian (CheckInDate - CheckOutDate)
        /// </summary>
        [HttpGet("revenue")]
        public async Task<ActionResult> RevenueStatistics(DateTime startDate, DateTime endDate)
        {
            try
            {
                decimal totalRevenue = await _db.Bookings
                    .Where(b => b.CheckInDate >= startDate && b.CheckOutDate <= endDate)
                    .SumAsync(b => b.Total ?? 0); // Sử dụng Total thay vì TotalPrice

                return Ok(new
                {
                    status = 200,
                    message = "Thống kê doanh thu thành công!",
                    totalRevenue = totalRevenue
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    status = 400,
                    message = "Lỗi khi lấy thống kê doanh thu!",
                    error = ex.Message
                });
            }
        }
    }
}
