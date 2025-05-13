using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Quan_Ly_HomeStay.Data;
using Quan_Ly_HomeStay.Models;

namespace Quan_Ly_HomeStay.Controllers
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

        [HttpGet("all")]
        public async Task<ActionResult> GetAllBooking()
        {
            try
            {
                var _data = await (from booking in db.Bookings
                                   join user in db.Users on booking.IdUser equals user.Id into users
                                   from user in users.DefaultIfEmpty()
                                   join detail in db.BookingDetails on booking.IdBooking equals detail.IdBooking into details
                                   from detail in details.DefaultIfEmpty()
                                   orderby booking.CreateAt descending
                                   select new
                                   {
                                       booking.IdBooking,
                                       booking.IdUser,
                                       UserEmail = user != null ? user.Email : "Unknown",
                                       booking.Status,
                                       booking.Total,
                                       booking.PaymentMethod,
                                       booking.CreateAt,
                                   }).ToListAsync();



                if (_data == null || !_data.Any())
                {
                    return Ok(new
                    {
                        message = "Không có đơn đặt phòng nào!",
                        status = 404,
                        data = new List<object>()
                    });
                }

                return Ok(new
                {
                    message = "Lấy danh sách đơn đặt phòng thành công!",
                    status = 200,
                    count = _data.Count,
                    data = _data
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Đã xảy ra lỗi khi lấy dữ liệu!",
                    status = 500,
                    error = ex.Message
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetBooking(Guid id)
        {
            if (db.Bookings == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu trống!",
                    status = 404
                });
            }

            var _data = await db.Bookings.FirstOrDefaultAsync(x => x.IdBooking == id);

            if (_data == null)
            {
                return Ok(new
                {
                    message = "Không tìm thấy Booking!",
                    status = 404
                });
            }

            return Ok(new
            {
                message = "Lấy dữ liệu thành công!",
                status = 200,
                data = _data
            });
        }

        [HttpPost("add")]
        public async Task<ActionResult> AddBooking([FromBody] Booking booking)
        {
            booking.IdBooking = Guid.NewGuid();
            booking.CreateAt = DateTime.Now;

            await db.Bookings.AddAsync(booking);
            await db.SaveChangesAsync();

            return Ok(new
            {
                message = "Tạo thành công!",
                status = 200,
                data = booking
            });
        }

        [HttpPut("edit")]
        public async Task<ActionResult> EditBooking([FromBody] Booking booking)
        {
            var _booking = await db.Bookings.FindAsync(booking.IdBooking);
            if (_booking == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu không tồn tại!",
                    status = 404
                });
            }

            db.Entry(_booking).CurrentValues.SetValues(booking);
            await db.SaveChangesAsync();

            return Ok(new
            {
                message = "Cập nhật thành công!",
                status = 200
            });
        }

        [HttpDelete("delete/{id}")]
        public async Task<ActionResult> DeleteBooking(Guid id)
        {
            var _booking = await db.Bookings.FindAsync(id);
            if (_booking == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu không tồn tại!",
                    status = 404
                });
            }

            db.Bookings.Remove(_booking);
            await db.SaveChangesAsync();

            return Ok(new
            {
                message = "Xóa thành công!",
                status = 200
            });
        }

        [HttpGet("user/{idUser}")]
        public async Task<ActionResult> GetAllBookingByUser(Guid idUser)
        {
            if (db.Users == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu trống!",
                    status = 404
                });
            }

            var _data = await db.Bookings
                                .Where(x => x.IdUser == idUser && x.Total != 0)
                                .OrderByDescending(x => x.CreateAt)
                                .ToListAsync();

            return Ok(new
            {
                message = "Lấy dữ liệu thành công!",
                status = 200,
                data = _data
            });
        }
        /*  [HttpGet("details/{idBooking}")]
          public async Task<ActionResult> GetBookingDetailsByBookingId(Guid idBooking)
          {
              try
              {
                  var booking = await db.Bookings
                      .Include(b => b.BookingDetails)
                      .ThenInclude(d => d.IdRoom) // Nếu có liên kết đến Room (phòng)
                      .FirstOrDefaultAsync(b => b.IdBooking == idBooking);

                  if (booking == null)
                  {
                      return NotFound(new
                      {
                          message = "Không tìm thấy đơn đặt phòng!",
                          status = 404
                      });
                  }

                  var detailList = booking.BookingDetails.Select(d => new
                  {
                      d.Id,
                      d.IdBooking,
                      d.IdRoom,
                      d.CheckInDate,
                      d.CheckOutDate,
                      d.TotalPrice,
                      d.Note,
                      d.CreateAt,
                      RoomName = d.IdRoom != null ? d.IdRoom. : "Không rõ"
                  }).ToList();

                  return Ok(new
                  {
                      message = "Lấy chi tiết đơn đặt phòng thành công!",
                      status = 200,
                      count = detailList.Count,
                      data = detailList
                  });
              }
              catch (Exception ex)
              {
                  return StatusCode(500, new
                  {
                      message = "Đã xảy ra lỗi khi lấy dữ liệu!",
                      status = 500,
                      error = ex.Message
                  });
              }
          }*/

    }
}
