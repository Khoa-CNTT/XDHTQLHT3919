using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Quan_Ly_HomeStay.Data;
using Quan_Ly_HomeStay.Models;

namespace Khoa_Luan_Tot_Nghiep.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        public RoleController(ApplicationDbContext db)
        {
            _db = db;
        }

        // Lấy tất cả Role
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<RoleModel>>> GetAllRoles()
        {
            var roles = await _db.Roles.ToListAsync();
            if (roles == null || roles.Count == 0)
            {
                return Ok(new { message = "Không có dữ liệu!", status = 404 });
            }
            return Ok(new { message = "Lấy dữ liệu thành công!", status = 200, data = roles });
        }

        // Lấy Role theo ID
        [HttpGet("{id}")]
        public async Task<ActionResult<RoleModel>> GetRole(Guid id)
        {
            var role = await _db.Roles.FindAsync(id);
            if (role == null)
            {
                return NotFound(new { message = "Không tìm thấy Role!", status = 404 });
            }
            return Ok(new { message = "Lấy dữ liệu thành công!", status = 200, data = role });
        }

        // Thêm Role mới
        [HttpPost("add")]
        public async Task<ActionResult<RoleModel>> AddRole([FromBody] RoleModel role)
        {
            role.Id = Guid.NewGuid();
            role.CreateAt = DateTime.UtcNow;
            _db.Roles.Add(role);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Tạo Role thành công!", status = 200, data = role });
        }

        // Cập nhật Role
        [HttpPut("edit")]
        public async Task<ActionResult> EditRole([FromBody] RoleModel role)
        {
            var existingRole = await _db.Roles.FindAsync(role.Id);
            if (existingRole == null)
            {
                return NotFound(new { message = "Role không tồn tại!", status = 404 });
            }

            existingRole.Name = role.Name;
            existingRole.CreateAt = role.CreateAt;
            await _db.SaveChangesAsync();

            return Ok(new { message = "Cập nhật Role thành công!", status = 200 });
        }

        // Xóa Role
        [HttpDelete("delete/{id}")]
        public async Task<ActionResult> DeleteRole(Guid id)
        {
            var role = await _db.Roles.FindAsync(id);
            if (role == null)
            {
                return NotFound(new { message = "Role không tồn tại!", status = 404 });
            }

            _db.Roles.Remove(role);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Xóa Role thành công!", status = 200 });
        }
    }
}
