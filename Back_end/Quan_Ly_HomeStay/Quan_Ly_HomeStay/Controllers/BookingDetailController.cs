using Quan_Ly_HomeStay.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Quan_Ly_HomeStay.Data;

namespace Quan_Ly_HomeStay.Controllers
{
    [Route("api/order/detail")]
    [ApiController]
    public class DetailOrderController : ControllerBase
    {
        private readonly ApplicationDbContext db;
        public DetailOrderController(ApplicationDbContext _db)
        {
            db = _db;
        }
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<BookingDetail>>> GetAllDetailOrder()
        {
            if (db.BookingDetails == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu trống!",
                    status = 404
                });
            }
            var _data = await db.BookingDetails.ToListAsync();
            return Ok(new
            {
                message = "Lấy dữ liệu thành công!",
                status = 200,
                data = _data
            }); ;
        }
        [HttpGet]

        public async Task<ActionResult<IEnumerable<BookingDetail>>> GetDetailOrder(Guid id)
        {
            if (db.BookingDetails == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu trống!",
                    status = 404
                });
            }
            var _data = await db.BookingDetails.Where(x => x.Id == id).ToListAsync();
            return Ok(new
            {
                message = "Lấy dữ liệu thành công!",
                status = 200,
                data = _data
            }); ;
        }
        [HttpPost("add")]

        public async Task<ActionResult> AddDetail([FromBody] BookingDetail detail)
        {

            var _detail = await db.BookingDetails.Where(x => x.IdProduct == detail.IdProduct).Where(x => x.IdOrder == detail.IdOrder).FirstOrDefaultAsync();
            if (_detail == null)
            {
                await db.BookingDetails.AddAsync(detail);
            }
            else
            {
                _detail.Quantity += detail.Quantity;
                db.Entry(await db.BookingDetails.FirstOrDefaultAsync(x => x.Id == _detail.Id)).CurrentValues.SetValues(_detail);
            }
            await db.SaveChangesAsync();
            return Ok(new
            {
                message = "Tạo thành công!",
                status = 200,
                data = detail
            });
        }
        [HttpPut("edit")]

        public async Task<ActionResult> Edit([FromBody] BookingDetail detail)
        {
            var _detail = await db.BookingDetails.FindAsync(detail.Id);
            if (_detail == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu không tồn tại!",
                    status = 400
                });
            }
            db.Entry(await db.BookingDetails.FirstOrDefaultAsync(x => x.Id == _detail.Id)).CurrentValues.SetValues(detail);
            await db.SaveChangesAsync();
            return Ok(new
            {
                message = "Sửa thành công!",
                status = 200
            });
        }
        [HttpDelete("delete")]

        public async Task<ActionResult> Delete([FromBody] Guid id)
        {
            if (db.BookingDetails == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu trống!",
                    status = 404
                });
            }
            var _detail = await db.BookingDetails.FindAsync(id);
            if (_detail == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu trống!",
                    status = 404
                });
            }
            try
            {
                db.BookingDetails.Remove(_detail);
                await db.SaveChangesAsync();
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

        [HttpGet("getAllByOrder")]

        public async Task<ActionResult<IEnumerable<BookingDetail>>> GetAllByOrder(Guid idOrder)
        {
            var _data = from dt in db.BookingDetails
                        join pr in db.Rooms on dt.IdProduct equals pr.Id
                        where dt.IdOrder == idOrder
                        select new
                        {
                            dt.Id,
                            dt.Price,
                            dt.Quantity,
                            dt.CreateAt,
                            pr.Detail,
                            pr.IdUser,
                            pr.PathImg,
                            pr.Name,
                        };
            //var _data = await db.Detailorders.Where(x => x.IdOrder == idOrder).ToListAsync();
            return Ok(new
            {
                message = "Lấy dữ liệu thành công!",
                status = 200,
                data = _data
            });
        }


        [HttpPut("increase")]

        public async Task<ActionResult> Increase([FromBody] Guid id)
        {
            var _detail = await db.BookingDetails.FindAsync(id);
            if (_detail == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu không tồn tại!",
                    status = 400
                });
            }
            _detail.Quantity = _detail.Quantity + 1;
            db.Entry(await db.BookingDetails.FirstOrDefaultAsync(x => x.Id == _detail.Id)).CurrentValues.SetValues(_detail);
            await db.SaveChangesAsync();
            return Ok(new
            {
                message = "Sửa thành công!",
                status = 200
            });
        }
        [HttpPut("decrease")]

        public async Task<ActionResult> Decrease([FromBody] Guid id)
        {
            var _detail = await db.BookingDetails.FindAsync(id);
            if (_detail == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu không tồn tại!",
                    status = 400
                });
            }
            if (_detail.Quantity == 1)
            {
                db.BookingDetails.Remove(_detail);
                await db.SaveChangesAsync();
                return Ok(new
                {
                    status = 200
                });
            }
            _detail.Quantity = _detail.Quantity - 1;
            db.Entry(await db.BookingDetails.FirstOrDefaultAsync(x => x.Id == _detail.Id)).CurrentValues.SetValues(_detail);
            await db.SaveChangesAsync();
            return Ok(new
            {
                message = "Sửa thành công!",
                status = 200
            });
        }
    }
}
