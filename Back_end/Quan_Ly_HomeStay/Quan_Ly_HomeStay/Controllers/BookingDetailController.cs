using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Quan_Ly_HomeStay.Data;
using Quan_Ly_HomeStay.Models;

namespace Khoa_Luan_Tot_Nghiep.Controllers
{
    [Route("api/bookingdetail")]
    [ApiController]
    public class BookingDetailController : ControllerBase
    {
        private readonly ApplicationDbContext db;
        public BookingDetailController(ApplicationDbContext _db)
        {
            db = _db;
        }

        // Lấy tất cả booking details
        [HttpGet("all")]
        public async Task<ActionResult> GetAllBookingDetails()
        {
            var data = await db.BookingsDetails.ToListAsync();
            if (!data.Any())
            {
                return Ok(new { message = "Dữ liệu trống!", status = 404 });
            }

            return Ok(new { message = "Lấy dữ liệu thành công!", status = 200, data });
        }

        // Lấy booking detail theo ID
        [HttpGet("{id}")]
        public async Task<ActionResult> GetBookingDetail(Guid id)
        {
            var data = await db.BookingsDetails.FindAsync(id);
            if (data == null)
            {
                return Ok(new { message = "Không tìm thấy dữ liệu!", status = 404 });
            }

            return Ok(new { message = "Lấy dữ liệu thành công!", status = 200, data });
        }

        // Thêm booking detail
        [HttpPost("add")]
        public async Task<ActionResult> AddBookingDetail([FromBody] BookingDetailModel detail)
        {
            var existingDetail = await db.BookingsDetails
                .FirstOrDefaultAsync(x => x.IdRoom == detail.IdRoom && x.IdBooking == detail.IdBooking);

            if (existingDetail == null)
            {
                detail.Id = Guid.NewGuid();
                detail.CreateAt = DateTime.UtcNow;
                await db.BookingsDetails.AddAsync(detail);
            }
            else
            {
                existingDetail.Quantity += detail.Quantity;
                db.Entry(existingDetail).CurrentValues.SetValues(existingDetail);
            }

            await db.SaveChangesAsync();
            return Ok(new { message = "Tạo thành công!", status = 200, data = detail });
        }

        // Cập nhật booking detail
        [HttpPut("edit")]
        public async Task<ActionResult> EditBookingDetail([FromBody] BookingDetailModel detail)
        {
            var existingDetail = await db.BookingsDetails.FindAsync(detail.Id);
            if (existingDetail == null)
            {
                return Ok(new { message = "Dữ liệu không tồn tại!", status = 400 });
            }

            db.Entry(existingDetail).CurrentValues.SetValues(detail);
            await db.SaveChangesAsync();

            return Ok(new { message = "Sửa thành công!", status = 200 });
        }

        // Xóa booking detail
        [HttpDelete("delete")]
        public async Task<ActionResult> DeleteBookingDetail([FromBody] Guid id)
        {
            var detail = await db.BookingsDetails.FindAsync(id);
            if (detail == null)
            {
                return Ok(new { message = "Không tìm thấy dữ liệu!", status = 404 });
            }

            db.BookingsDetails.Remove(detail);
            await db.SaveChangesAsync();

            return Ok(new { message = "Xóa thành công!", status = 200 });
        }

        // Lấy danh sách booking detail theo booking ID
        [HttpGet("getAllByBooking")]
        public async Task<ActionResult> GetAllByBooking(Guid idBooking)
        {
            var data = from dt in db.BookingsDetails
                       join rm in db.Rooms on dt.IdRoom equals rm.Id
                       where dt.IdBooking == idBooking
                       select new
                       {
                           dt.Id,
                           dt.Price,
                           dt.Quantity,
                           dt.CreateAt,
                           rm.BookingDetail,
                           rm.IdUser,
                           rm.Title,
                       };

            return Ok(new { message = "Lấy dữ liệu thành công!", status = 200, data });
        }

        // Tăng số lượng đêm
        [HttpPut("increase")]
        public async Task<ActionResult> IncreaseQuantity([FromBody] Guid id)
        {
            var detail = await db.BookingsDetails.FindAsync(id);
            if (detail == null)
            {
                return Ok(new { message = "Dữ liệu không tồn tại!", status = 400 });
            }

            detail.Quantity++;
            db.Entry(detail).CurrentValues.SetValues(detail);
            await db.SaveChangesAsync();

            return Ok(new { message = "Sửa thành công!", status = 200 });
        }

        // Giảm số lượng đêm
        [HttpPut("decrease")]
        public async Task<ActionResult> DecreaseQuantity([FromBody] Guid id)
        {
            var detail = await db.BookingsDetails.FindAsync(id);
            if (detail == null)
            {
                return Ok(new { message = "Dữ liệu không tồn tại!", status = 400 });
            }

            if (detail.Quantity == 1)
            {
                db.BookingsDetails.Remove(detail);
            }
            else
            {
                detail.Quantity--;
                db.Entry(detail).CurrentValues.SetValues(detail);
            }

            await db.SaveChangesAsync();
            return Ok(new { message = "Sửa thành công!", status = 200 });
        }
    }
}
