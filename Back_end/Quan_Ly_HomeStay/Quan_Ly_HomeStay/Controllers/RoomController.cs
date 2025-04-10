using Quan_Ly_HomeStay.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using Quan_Ly_HomeStay.Data;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Quan_Ly_HomeStay.Controllers
{
    [Route("api/product")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly ApplicationDbContext db;
        public ProductController(ApplicationDbContext _db)
        {
            db = _db;
        }
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Room>>> GetAllProduct()
        {
            if (db.Rooms == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu trống!",
                    status = 404
                });
            }
            var _data = from product in db.Rooms
                        join category in db.Categories on product.IdCategory equals category.Id
                        orderby product.CreateAt descending
                        select new
                        {
                            product.Id,
                            product.Name,
                            product.Price,
                            product.Quantity,
                            product.CreateAt,
                            product.Detail,
                            product.IdUser,
                            product.PathImg,
                            category.Slug,
                            product.Type,
                            product.IdCategory,
                            categoryName = category.Name
                        };
            return Ok(new
            {
                message = "Lấy dữ liệu thành công!",
                status = 200,
                data = _data
            }); ;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Room>>> GetProduct(Guid id)
        {
            if (db.Rooms == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu trống!",
                    status = 404
                });
            }
            var _data = await db.Rooms.Where(x => x.Id == id).FirstOrDefaultAsync();
            if (_data == null)
            {
                return Ok(new
                {
                    message = "Lấy dữ liệu thất bại!",
                    status = 400
                });
            }
            var category = db.Categories.Find(_data.IdCategory);
            return Ok(new
            {
                message = "Lấy dữ liệu thành công!",
                status = 200,
                data = _data,
                category
            });
        }
        [HttpPost("add")]
        public async Task<ActionResult> AddProduct([FromBody] Room product)
        {
            await db.Rooms.AddAsync(product);
            await db.SaveChangesAsync();
            return Ok(new
            {
                message = "Tạo thành công!",
                status = 200,
                data = product
            });
        }
        [HttpPut("edit")]

        public async Task<ActionResult> Edit([FromBody] Room product)
        {
            var _product = await db.Rooms.FindAsync(product.Id);
            if (_product == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu không tồn tại!",
                    status = 400
                });
            }
            db.Entry(await db.Rooms.FirstOrDefaultAsync(x => x.Id == _product.Id)).CurrentValues.SetValues(product);
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
            if (db.Rooms == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu trống!",
                    status = 404
                });
            }
            var _product = await db.Rooms.FindAsync(id);
            if (_product == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu trống!",
                    status = 404
                });
            }
            try
            {
                db.Rooms.Remove(_product);
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

    }
}
