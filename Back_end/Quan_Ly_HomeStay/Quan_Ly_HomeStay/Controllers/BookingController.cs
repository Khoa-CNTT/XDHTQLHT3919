using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Quan_Ly_HomeStay.Data;
using Quan_Ly_HomeStay.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace backend.Controllers
{
    [Route("api/order")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly ApplicationDbContext db;
        public OrderController(ApplicationDbContext _db)
        {
            db = _db;
        }
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Booking>>> GetAllOrder()
        {
            if (db.Users == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu trống!",
                    status = 404
                });
            }
            var _data = from order in db.Bookings
                        join user in db.Users on order.IdUser equals user.Id
                        orderby order.CreateAt descending
                        select new
                        {
                            order.Id,
                            order.IdUser,
                            order.Status,
                            user.Name,
                            order.Total,
                            order.CreateAt,
                        };
            return Ok(new
            {
                message = "Lấy dữ liệu thành công!",
                status = 200,
                data = _data
            }); ;
        }
        [HttpGet]

        public async Task<ActionResult<IEnumerable<Booking>>> GetOrder(Guid id)
        {
            if (db.Bookings == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu trống!",
                    status = 404
                });
            }
            var _data = await db.Bookings.Where(x => x.Id == id).ToListAsync();
            return Ok(new
            {
                message = "Lấy dữ liệu thành công!",
                status = 200,
                data = _data
            }); ;
        }
        [HttpPut("edit")]

        public async Task<ActionResult> Edit([FromBody] Booking order)
        {
            var _order = await db.Bookings.FindAsync(order.Id);
            if (_order == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu không tồn tại!",
                    status = 400
                });
            }
            db.Entry(await db.Users.FirstOrDefaultAsync(x => x.Id == _order.Id)).CurrentValues.SetValues(order);
            await db.SaveChangesAsync();
            return Ok(new
            {
                message = "Sửa thành công!",
                status = 200
            });
        }
        [HttpPost("add")]

        public async Task<ActionResult> AddOrder([FromBody] Booking order)
        {
            await db.Bookings.AddAsync(order);
            await db.SaveChangesAsync();
            var _data = await db.Bookings.Where(x => x.Status == 0).Where(x => x.IdUser == order.IdUser).FirstOrDefaultAsync();
            return Ok(new
            {
                message = "Tạo thành công!",
                status = 200,
                data = _data
            });
        }
        [HttpDelete("delete")]

        public async Task<ActionResult> Delete([FromBody] Guid id)
        {
            if (db.Bookings == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu trống!",
                    status = 404
                });
            }
            var _order = await db.Bookings.FindAsync(id);
            if (_order == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu trống!",
                    status = 404
                });
            }
            try
            {
                db.Bookings.Remove(_order);
                db.SaveChanges();
                return Ok(new
                {
                    message = "Xóa thành công!",
                    status = 200
                });
            }
            catch (Exception e)
            {
                return Ok(new
                {
                    message = "Lỗi rồi!",
                    status = 400,
                    data = e.Message
                });
            }
        }

        [HttpGet("getOrderNotPay")]

        public async Task<ActionResult<Booking>> GetOrderNotPayment(Guid idUser)
        {
            decimal amount = 0;
            var _data = await db.Bookings.Where(x => x.IdUser == idUser).Where(x => x.Status == 0).FirstOrDefaultAsync();
            if (_data == null)
            {
                return Ok(new
                {
                    message = "Không có order nào hết!",
                    status = 400
                });
            }
            var detail = await db.BookingDetails.Where(x => x.IdOrder == _data.Id).ToListAsync();
            if (detail.Count > 0)
            {
                foreach (var item in detail)
                {
                    amount += item.Price * item.Quantity;
                }
            }
            return Ok(new
            {
                message = "Đã có order!",
                status = 200,
                data = _data,
                total = amount
            });
        }
        [HttpGet("confirm")]

        public async Task<ActionResult> Confirm(Guid idUser, int status, int type)
        {
            var _order = await db.Bookings.Where(x => x.IdUser == idUser).Where(x => x.Status == 0).FirstOrDefaultAsync();
            decimal amount = 0;
            if (_order == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu không tồn tại!",
                    status = 400
                });
            }
            var detail = await db.BookingDetails.Where(x => x.IdOrder == _order.Id).ToListAsync();
            if (detail.Count > 0)
            {
                foreach (var item in detail)
                {
                    amount += item.Price * item.Quantity;
                }
            }
            _order.CreateAt = DateTime.Now;
            _order.Total = amount;
            _order.Status = status;
            db.Entry(await db.Bookings.FirstOrDefaultAsync(x => x.Id == _order.Id)).CurrentValues.SetValues(_order);
            await db.SaveChangesAsync();
            return Ok(new
            {
                message = "Sửa thành công!",
                status = 200
            });
        }
        [HttpGet("getAllOrder")]

        public async Task<ActionResult<IEnumerable<Booking>>> GetAllOrderByIdUser(Guid idUser)
        {
            if (db.Users == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu trống!",
                    status = 404
                });
            }
            var _data = await db.Bookings.Where(x => x.IdUser == idUser).Where(x => x.Total != 0).OrderByDescending(x => x.CreateAt).ToListAsync();
            return Ok(new
            {
                message = "Lấy dữ liệu thành công!",
                status = 200,
                data = _data
            }); ;
        }
        [HttpGet("confirmOrder")]

        public async Task<ActionResult> ConfirmOrder(Guid idOrder, int status)
        {
            var _order = await db.Bookings.FindAsync(idOrder);
            if (_order == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu không tồn tại!",
                    status = 400
                });
            }
            _order.Status = status;
            db.Entry(await db.Bookings.FirstOrDefaultAsync(x => x.Id == idOrder)).CurrentValues.SetValues(_order);
            var listProduct = await db.BookingDetails.Where(x => x.IdOrder == idOrder).ToListAsync();
            foreach (var item in listProduct)
            {
                var product = await db.Rooms.FindAsync(item.IdProduct);
                product.Quantity -= item.Quantity;
                db.Entry(await db.Rooms.FirstOrDefaultAsync(x => x.Id == product.Id)).CurrentValues.SetValues(product);
            }
            await db.SaveChangesAsync();
            return Ok(new
            {
                message = "Sửa thành công!",
                status = 200
            });
        }
    }
}
