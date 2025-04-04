using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Quan_Ly_HomeStay.Data;
using Quan_Ly_HomeStay.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace Khoa_Luan_Tot_Nghiep.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
     /*   POST – Create: Tạo dữ liệu mới
GET – Read: Lấy dữ liệu về
PUT – Update: Cập nhật dữ liệu
DELETE – Delete: Xóa dữ liệu*/

        private readonly ApplicationDbContext _db;

        public UserController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("all")]
        public async Task<ActionResult> GetAllUsers()
        {
            var users = await _db.Users.Include(u => u.Role).ToListAsync();
            return Ok(new { status = 200, message = "Lấy dữ liệu thành công!", data = users });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetUser(Guid id)
        {
            var user = await _db.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == id);
            if (user == null) return NotFound(new { message = "Người dùng không tồn tại!", status = 404 });
            return Ok(new { status = 200, message = "Lấy dữ liệu thành công!", data = user });
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] UserModel user)
        {
            if (await _db.Users.AnyAsync(u => u.Email == user.Email))
                return BadRequest(new { message = "Email đã tồn tại!", status = 400 });

            user.Password = HashPassword(user.Password);
            user.IdRole = _db.Roles.FirstOrDefault(r => r.Name == "Guest")?.Id ?? user.IdRole;

            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            return Ok(new { status = 200, message = "Đăng ký thành công!", data = user });
        }

        [HttpPut("edit")]
        public async Task<ActionResult> Edit([FromBody] UserModel user)
        {
            var existingUser = await _db.Users.FindAsync(user.Id);
            if (existingUser == null) return NotFound(new { message = "Người dùng không tồn tại!", status = 404 });

            _db.Entry(existingUser).CurrentValues.SetValues(user);
            await _db.SaveChangesAsync();
            return Ok(new { status = 200, message = "Sửa thành công!", data = user });
        }

        [HttpDelete("delete/{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "Người dùng không tồn tại!", status = 404 });

            _db.Users.Remove(user);
            await _db.SaveChangesAsync();
            return Ok(new { status = 200, message = "Xóa thành công!" });
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] Login user)
        {
            var existingUser = await _db.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email == user.Email);
            if (existingUser == null || !VerifyPassword(user.Password, existingUser.Password))
                return BadRequest(new { message = "Sai email hoặc mật khẩu!", status = 400 });

            return Ok(new { status = 200, message = "Đăng nhập thành công!", data = existingUser });
        }

        [HttpPost("changepass")]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePassword model)
        {
            var user = await _db.Users.FindAsync(model.IdUser);
            if (user == null) return NotFound(new { message = "Người dùng không tồn tại!", status = 404 });

            if (!VerifyPassword(model.OldPassword, user.Password))
                return BadRequest(new { message = "Mật khẩu cũ không đúng!", status = 400 });

            user.Password = HashPassword(model.NewPassword);
            await _db.SaveChangesAsync();
            return Ok(new { status = 200, message = "Thay đổi mật khẩu thành công!" });
        }

        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            return Convert.ToBase64String(sha256.ComputeHash(Encoding.UTF8.GetBytes(password)));
        }

        private static bool VerifyPassword(string inputPassword, string hashedPassword)
        {
            return HashPassword(inputPassword) == hashedPassword;
        }
    }

    public class Login
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class ChangePassword
    {
        public Guid IdUser { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
