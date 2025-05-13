using Quan_Ly_HomeStay.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Quan_Ly_HomeStay.Data;

namespace Quan_Ly_HomeStay.Controllers
{
    [Route("api/booking/detail")]
    [ApiController]
    public class DetailBookingController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        public DetailBookingController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllDetailBooking()
        {
            var details = await _db.BookingDetails
                .Include(x => x.IdRoomNavigation)  // Đảm bảo bao gồm thông tin phòng
                .Include(x => x.IdBookingNavigation)  // Bao gồm thông tin Booking
                .Include(x => x.BookingDetailServices)  // Bao gồm thông tin dịch vụ liên quan
                .Select(x => new
                {
                    x.Id,
                    x.Note,
                    x.CheckInDate,
                    x.CheckOutDate,
                    x.TotalPrice,
                    x.CreateAt,
                    RoomName = x.IdRoomNavigation.Name,  // Lấy tên phòng từ Room
                    RoomId = x.IdRoomNavigation != null ? x.IdRoomNavigation.Id : Guid.Empty,
                    RoomPrice = x.IdRoomNavigation.Price,  // Lấy giá phòng (nếu cần)
                    RoomStatus = x.IdRoomNavigation.Status,  // Lấy trạng thái phòng (nếu cần)
                    StatusBooking = x.IdBookingNavigation.Status,
                    Booking = x.IdBookingNavigation,  // Lấy thông tin booking                    
                })
                .ToListAsync();

            if (!details.Any())
            {
                return Ok(new { message = "Dữ liệu trống!", status = 404 });
            }

            return Ok(new { message = "Lấy dữ liệu thành công!", status = 200, data = details });
        }


        [HttpPost("add")]
        public async Task<IActionResult> AddDetail([FromBody] BookingDetail detail)
        {
            if (detail == null)
                return BadRequest(new { message = "Dữ liệu không hợp lệ!", status = 400 });

            detail.Id = Guid.NewGuid();
            detail.CreateAt = DateTime.Now;

            await _db.BookingDetails.AddAsync(detail);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Tạo chi tiết đặt phòng thành công!", status = 200, data = detail });
        }

        [HttpPut("edit")]
        public async Task<IActionResult> Edit([FromBody] BookingDetail detail)
        {
            var existing = await _db.BookingDetails.FindAsync(detail.Id);
            if (existing == null)
            {
                return Ok(new { message = "Dữ liệu không tồn tại!", status = 404 });
            }

            _db.Entry(existing).CurrentValues.SetValues(detail);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Cập nhật thành công!", status = 200 });
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var detail = await _db.BookingDetails.FindAsync(id);
            if (detail == null)
            {
                return Ok(new { message = "Không tìm thấy chi tiết đặt phòng!", status = 404 });
            }

            _db.BookingDetails.Remove(detail);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Xóa thành công!", status = 200 });
        }

        [HttpGet("getAllByBooking/{idBooking}")]
        public async Task<IActionResult> GetAllByBooking(Guid idBooking)
        {
            var details = await _db.BookingDetails
                .Where(x => x.Id == idBooking)
                .Include(x => x.IdRoomNavigation)
                .Select(x => new
                {
                    x.Id,
                    x.Note,
                    x.CheckInDate,
                    x.CheckOutDate,
                    x.TotalPrice,
                    x.CreateAt,
                    RoomName = x.IdRoomNavigation != null ? x.IdRoomNavigation.Name : null,
                    RoomImage = x.IdRoomNavigation != null ? x.IdRoomNavigation.PathImg : null
                })
                .ToListAsync();

            return Ok(new { message = "Lấy dữ liệu thành công!", status = 200, data = details });
        }

        // THÊM API cập nhật ngày CheckIn và CheckOut(có thể bỏ)
        [HttpPut("update-dates/{id}")]
        public async Task<IActionResult> UpdateDates(Guid id, [FromBody] UpdateDatesRequest request)
        {
            var detail = await _db.BookingDetails.FindAsync(id);
            if (detail == null)
            {
                return Ok(new { message = "Không tìm thấy chi tiết đặt phòng!", status = 404 });
            }

            detail.CheckInDate = request.CheckInDate;
            detail.CheckOutDate = request.CheckOutDate;
            await _db.SaveChangesAsync();

            return Ok(new { message = "Cập nhật ngày Check-in/Check-out thành công!", status = 200, data = detail });
        }
    }

    // Model Request cho UpdateDates
    public class UpdateDatesRequest
    {
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
    }
}
