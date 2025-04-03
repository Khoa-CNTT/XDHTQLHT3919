using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Quan_Ly_HomeStay.Data;
using Quan_Ly_HomeStay.Models;

namespace Khoa_Luan_Tot_Nghiep.Controllers
{
    [Route("api/booking")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly ApplicationDbContext db;
        public BookingController(ApplicationDbContext _db)
        {
            db = _db;
        }

        // Lấy danh sách tất cả booking
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<BookingModel>>> GetAllBookings()
        {
            if (db.Bookings == null)
            {
                return Ok(new { message = "Dữ liệu trống!", status = 404 });
            }

            var _data = from booking in db.Bookings
                        join user in db.Users on booking.IdUser equals user.Id
                        orderby booking.CheckInDate descending
                        select new
                        {
                            booking.Id,
                            booking.IdUser,
                            booking.Status,
                            user.Name,
                            booking.Total,
                            booking.CheckInDate,
                            booking.CheckOutDate
                        };

            return Ok(new { message = "Lấy dữ liệu thành công!", status = 200, data = _data });
        }

        // Lấy booking theo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<BookingModel>> GetBooking(Guid id)
        {
            if (db.Bookings == null)
            {
                return Ok(new { message = "Dữ liệu trống!", status = 404 });
            }

            var _data = await db.Bookings.Where(x => x.Id == id).ToListAsync();
            return Ok(new { message = "Lấy dữ liệu thành công!", status = 200, data = _data });
        }

        // Chỉnh sửa booking
        [HttpPut("edit")]
        public async Task<ActionResult> Edit([FromBody] BookingModel booking)
        {
            var _booking = await db.Bookings.FindAsync(booking.Id);
            if (_booking == null)
            {
                return Ok(new { message = "Dữ liệu không tồn tại!", status = 400 });
            }

            db.Entry(_booking).CurrentValues.SetValues(booking);
            await db.SaveChangesAsync();

            return Ok(new { message = "Sửa thành công!", status = 200 });
        }

        // Thêm mới booking
        [HttpPost("add")]
        public async Task<ActionResult> AddBooking([FromBody] BookingModel booking)
        {
            await db.Bookings.AddAsync(booking);
            await db.SaveChangesAsync();

            var _data = await db.Bookings
                .Where(x => x.Status == 0 && x.IdUser == booking.IdUser)
                .FirstOrDefaultAsync();

            return Ok(new { message = "Tạo thành công!", status = 200, data = _data });
        }

        // Xóa booking
        [HttpDelete("delete")]
        public async Task<ActionResult> Delete([FromBody] Guid id)
        {
            if (db.Bookings == null)
            {
                return Ok(new { message = "Dữ liệu trống!", status = 404 });
            }

            var _booking = await db.Bookings.FindAsync(id);
            if (_booking == null)
            {
                return Ok(new { message = "Dữ liệu trống!", status = 404 });
            }

            try
            {
                db.Bookings.Remove(_booking);
                await db.SaveChangesAsync();
                return Ok(new { message = "Xóa thành công!", status = 200 });
            }
            catch (Exception e)
            {
                return Ok(new { message = "Lỗi rồi!", status = 400, data = e.Message });
            }
        }

        // Lấy Booking chưa thanh toán
        [HttpGet("getBookingNotPay")]
        public async Task<ActionResult<BookingModel>> GetBookingNotPayment(Guid idUser)
        {
            decimal amount = 0;
            var _data = await db.Bookings
                .Where(x => x.IdUser == idUser && x.Status == 0)
                .FirstOrDefaultAsync();

            if (_data == null)
            {
                return Ok(new { message = "Không có booking nào hết!", status = 400 });
            }

            var detail = await db.BookingsDetails
                .Where(x => x.IdBooking == _data.Id)
                .ToListAsync();

            foreach (var item in detail)
            {
                amount += item.Price * item.Quantity;
            }

            return Ok(new { message = "Đã có booking!", status = 200, data = _data, total = amount });
        }

        // Xác nhận booking
        [HttpGet("confirm")]
        public async Task<ActionResult> Confirm(Guid idUser, int status)
        {
            var _booking = await db.Bookings
                .Where(x => x.IdUser == idUser && x.Status == 0)
                .FirstOrDefaultAsync();

            if (_booking == null)
            {
                return Ok(new { message = "Dữ liệu không tồn tại!", status = 400 });
            }

            decimal amount = 0;
            var detail = await db.BookingsDetails
                .Where(x => x.IdBooking == _booking.Id)
                .ToListAsync();

            foreach (var item in detail)
            {
                amount += item.Price * item.Quantity;
            }

            _booking.Total = amount;
            _booking.Status = status;
            _booking.CheckInDate = DateTime.Now;

            db.Entry(_booking).CurrentValues.SetValues(_booking);
            await db.SaveChangesAsync();

            return Ok(new { message = "Xác nhận thành công!", status = 200 });
        }

        // Lấy tất cả Booking theo UserID
        [HttpGet("getAllBooking")]
        public async Task<ActionResult<IEnumerable<BookingModel>>> GetAllBookingByUser(Guid idUser)
        {
            if (db.Users == null)
            {
                return Ok(new { message = "Dữ liệu trống!", status = 404 });
            }

            var _data = await db.Bookings
                .Where(x => x.IdUser == idUser && x.Total != 0)
                .OrderByDescending(x => x.CheckInDate)
                .ToListAsync();

            return Ok(new { message = "Lấy dữ liệu thành công!", status = 200, data = _data });
        }

        // Xác nhận Booking theo ID
        [HttpGet("confirmBooking")]
        public async Task<ActionResult> ConfirmBooking(Guid idBooking, int status)
        {
            var _booking = await db.Bookings.FindAsync(idBooking);
            if (_booking == null)
            {
                return Ok(new { message = "Dữ liệu không tồn tại!", status = 400 });
            }

            _booking.Status = status;
            db.Entry(_booking).CurrentValues.SetValues(_booking);

            // Cập nhật số lượng phòng sau khi booking được xác nhận
            var bookingDetails = await db.BookingsDetails
                .Where(x => x.IdBooking == idBooking)
                .ToListAsync();

            foreach (var item in bookingDetails)
            {
                var room = await db.Rooms.FindAsync(item.IdBooking);
                if (room != null)
                {
                    room.Quantity -= item.Quantity;
                    db.Entry(room).CurrentValues.SetValues(room);
                }
            }
            await db.SaveChangesAsync();
            return Ok(new { message = "Xác nhận thành công!", status = 200 });
        }
    }
}
