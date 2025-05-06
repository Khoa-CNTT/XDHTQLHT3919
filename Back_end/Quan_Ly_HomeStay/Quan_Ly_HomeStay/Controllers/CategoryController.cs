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
            var categories = await db.Categories
                .Include(c => c.Rooms) // để tính Quantity
                .ToListAsync();

            var result = categories.Select(c => new
            {
                c.Id,
                c.Name,
                c.CreateAt,
                Quantity = c.Quantity
            });

            return Ok(new
            {
                message = "Lấy dữ liệu thành công!",
                status = 200,
                data = result
            });
        }

        // Lấy danh mục theo ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategory(Guid id)
        {
            var category = await db.Categories
                .Include(c => c.Rooms)
                .FirstOrDefaultAsync(c => c.Id == id);

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
                data = new
                {
                    category.Id,
                    category.Name,
                    category.CreateAt,
                    Quantity = category.Quantity
                }
            });
        }

        // Thêm mới danh mục
        [HttpPost("add")]
        public async Task<IActionResult> AddCategory([FromBody] Category category)
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
                                            .FirstOrDefaultAsync(x => x.Name == category.Name);

            if (existingCategory != null)
            {
                return Conflict(new
                {
                    message = "Danh mục đã tồn tại!",
                    status = 409
                });
            }

            category.Id = Guid.NewGuid();
            category.CreateAt = DateTime.Now;

            await db.Categories.AddAsync(category);
            await db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, new
            {
                message = "Tạo danh mục thành công!",
                status = 201,
                data = new
                {
                    category.Id,
                    category.Name,
                    category.CreateAt,
                    Quantity = category.Quantity
                }
            });
        }

        // Sửa danh mục
        [HttpPut("edit")]
        public async Task<IActionResult> Edit([FromBody] Category category)
        {
            var existingCategory = await db.Categories.FindAsync(category.Id);
            if (existingCategory == null)
            {
                return NotFound(new
                {
                    message = "Danh mục không tồn tại!",
                    status = 404
                });
            }

            existingCategory.Name = category.Name;
            existingCategory.CreateAt = category.CreateAt;

            db.Categories.Update(existingCategory);
            await db.SaveChangesAsync();

            return Ok(new
            {
                message = "Sửa danh mục thành công!",
                status = 200
            });
        }

        // Xóa danh mục
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var category = await db.Categories
                .Include(c => c.Rooms)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (category == null)
            {
                return NotFound(new
                {
                    message = "Danh mục không tồn tại!",
                    status = 404
                });
            }

            db.Rooms.RemoveRange(category.Rooms);
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
        public async Task<IActionResult> AddRoomToCategory([FromBody] Room room)
        {
            var category = await db.Categories.Include(c => c.Rooms)
                                              .FirstOrDefaultAsync(c => c.Id == room.IdCategory);

            if (category == null)
            {
                return NotFound(new { message = "Danh mục không tồn tại!", status = 404 });
            }

            room.Id = Guid.NewGuid();
            await db.Rooms.AddAsync(room);
            await db.SaveChangesAsync();

            return Ok(new
            {
                message = "Thêm phòng thành công!",
                status = 200
            });
        }

        // Xóa phòng riêng lẻ
        [HttpDelete("delete-room/{roomId}")]
        public async Task<IActionResult> DeleteRoom(Guid roomId)
        {
            var room = await db.Rooms.FindAsync(roomId);
            if (room == null)
            {
                return NotFound(new { message = "Phòng không tồn tại!", status = 404 });
            }

            db.Rooms.Remove(room);
            await db.SaveChangesAsync();

            return Ok(new { message = "Xóa phòng thành công!", status = 200 });
        }
    }
}
