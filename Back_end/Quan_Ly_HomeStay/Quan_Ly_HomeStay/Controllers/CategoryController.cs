using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Quan_Ly_HomeStay.Data;
using Quan_Ly_HomeStay.Models;
using Microsoft.EntityFrameworkCore;

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
        public async Task<ActionResult> GetAllCategories()
        {
            var data = await db.Categories.ToListAsync();
            if (!data.Any())
            {
                return Ok(new { message = "Dữ liệu trống!", status = 404 });
            }

            return Ok(new { message = "Lấy dữ liệu thành công!", status = 200, data });
        }

        // Lấy danh mục theo ID
        [HttpGet("{id}")]
        public async Task<ActionResult> GetCategoryById(Guid id)
        {
            var data = await db.Categories.FindAsync(id);
            if (data == null)
            {
                return Ok(new { message = "Không tìm thấy danh mục!", status = 404 });
            }

            return Ok(new { message = "Lấy dữ liệu thành công!", status = 200, data });
        }

        // Thêm danh mục mới
        [HttpPost("add")]
        public async Task<ActionResult> AddCategory([FromBody] CategoryModel category)
        {
            var existingCategory = await db.Categories.FirstOrDefaultAsync(x => x.Name == category.Name);
            if (existingCategory != null)
            {
                return Ok(new { message = "Danh mục đã tồn tại!", status = 400 });
            }

            category.Id = Guid.NewGuid();
            category.CreateAt = DateTime.UtcNow;
            await db.Categories.AddAsync(category);
            await db.SaveChangesAsync();

            return Ok(new { message = "Tạo danh mục thành công!", status = 200, data = category });
        }

        // Cập nhật danh mục
        [HttpPut("edit")]
        public async Task<ActionResult> EditCategory([FromBody] CategoryModel category)
        {
            var existingCategory = await db.Categories.FindAsync(category.Id);
            if (existingCategory == null)
            {
                return Ok(new { message = "Dữ liệu không tồn tại!", status = 400 });
            }

            db.Entry(existingCategory).CurrentValues.SetValues(category);
            await db.SaveChangesAsync();

            return Ok(new { message = "Sửa thành công!", status = 200 });
        }

        // Xóa danh mục
        [HttpDelete("delete")]
        public async Task<ActionResult> DeleteCategory([FromBody] Guid id)
        {
            var category = await db.Categories.FindAsync(id);
            if (category == null)
            {
                return Ok(new { message = "Không tìm thấy danh mục!", status = 404 });
            }

            db.Categories.Remove(category);
            await db.SaveChangesAsync();

            return Ok(new { message = "Xóa thành công!", status = 200 });
        }
    }
}
