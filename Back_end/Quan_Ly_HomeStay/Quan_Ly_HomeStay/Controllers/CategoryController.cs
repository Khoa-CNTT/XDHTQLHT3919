using Quan_Ly_HomeStay.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Quan_Ly_HomeStay.Data;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace Quan_Ly_HomeStay.Controllers
{
    [Route("api/category")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ApplicationDbContext db;

        public CategoryController(ApplicationDbContext _db)
        {
            db = _db;
        }

        // Lấy tất cả danh mục
        [HttpGet("all")]
        public async Task<IActionResult> GetAllCategory()
        {
            var categoriesWithCount = await db.Categories
                .Select(c => new {
                    c.Id,
                    c.Name,
                    Quantity = db.Rooms.Count(r => r.IdCategory == c.Id)
                }).ToListAsync();

            return Ok(new
            {
                message = "Lấy dữ liệu thành công!",
                status = 200,
                data = categoriesWithCount
            });
        }


        // Lấy danh mục theo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(Guid id)
        {
            var category = await db.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound(new
                {
                    message = "Danh mục không tồn tại!",
                    status = 404
                });
            }

            return Ok(new
            {
                message = "Lấy dữ liệu thành công!",
                status = 200,
                data = category
            });
        }

        // Thêm mới danh mục
        [HttpPost("add")]
        public async Task<ActionResult> AddCategory([FromBody] Category category)
        {
            if (category == null)
            {
                return BadRequest(new
                {
                    message = "Dữ liệu không hợp lệ!",
                    status = 400
                });
            }

            var existingCategory = await db.Categories
                                            .Where(x => x.Name == category.Name)
                                            .FirstOrDefaultAsync();

            if (existingCategory != null)
            {
                return Conflict(new
                {
                    message = "Danh mục đã tồn tại!",
                    status = 409
                });
            }

            category.Quantity = 0; // Mặc định 0 phòng khi mới tạo
            await db.Categories.AddAsync(category);
            await db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, new
            {
                message = "Tạo danh mục thành công!",
                status = 201,
                data = category
            });
        }

        // Sửa thông tin danh mục
        [HttpPut("edit")]
        public async Task<ActionResult> Edit([FromBody] Category category)
        {
            var existingCategory = await db.Categories.FindAsync(category.Id);
            if (existingCategory == null)
            {
                return BadRequest(new
                {
                    message = "Danh mục không tồn tại!",
                    status = 400
                });
            }

            // Không cho sửa Quantity trực tiếp
            existingCategory.Name = category.Name;
            existingCategory.CreateAt = category.CreateAt;

            db.Entry(existingCategory).State = EntityState.Modified;
            await db.SaveChangesAsync();

            return Ok(new
            {
                message = "Sửa danh mục thành công!",
                status = 200
            });
        }

        // Xóa danh mục theo ID
        [HttpDelete("delete/{id}")]
        public async Task<ActionResult> Delete([FromRoute] Guid id)
        {
            var category = await db.Categories.Include(c => c.Rooms).FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
            {
                return NotFound(new
                {
                    message = "Danh mục không tồn tại!",
                    status = 404
                });
            }

            // Xóa các phòng liên quan
            db.Rooms.RemoveRange(category.Rooms);

            // Cập nhật lại số lượng
            category.Quantity = 0;

            // Xóa danh mục
            db.Categories.Remove(category);
            await db.SaveChangesAsync();

            return Ok(new
            {
                message = "Danh mục đã được xóa thành công!",
                status = 200
            });
        }

        // Thêm phòng vào danh mục
        [HttpPost("add-room")]
        public async Task<ActionResult> AddRoomToCategory([FromBody] Room room)
        {
            var category = await db.Categories.Include(c => c.Rooms).FirstOrDefaultAsync(c => c.Id == room.IdCategory);
            if (category == null)
            {
                return NotFound(new { message = "Danh mục không tồn tại!", status = 404 });
            }

            await db.Rooms.AddAsync(room);
            await db.SaveChangesAsync();

            // Cập nhật lại số lượng phòng và lưu vào cơ sở dữ liệu
            category.Quantity = category.Rooms.Count + 1; // Tăng thêm 1 phòng vào
            db.Categories.Update(category);
            await db.SaveChangesAsync();

            return Ok(new { message = "Thêm phòng thành công!", status = 200 });
        }


        // (Gợi ý) Xóa phòng riêng lẻ và cập nhật Quantity
        [HttpDelete("delete-room/{roomId}")]
        public async Task<ActionResult> DeleteRoom(Guid roomId)
        {
            var room = await db.Rooms.FindAsync(roomId);
            if (room == null)
            {
                return NotFound(new { message = "Phòng không tồn tại!", status = 404 });
            }

            var category = await db.Categories.FindAsync(room.IdCategory);
            db.Rooms.Remove(room);
            await db.SaveChangesAsync();

            if (category != null)
            {
                // Cập nhật lại số lượng phòng
                category.Quantity = await db.Rooms.CountAsync(r => r.IdCategory == category.Id);
                db.Categories.Update(category);
                await db.SaveChangesAsync();
            }

            return Ok(new { message = "Xóa phòng thành công!", status = 200 });
        }

    }
}