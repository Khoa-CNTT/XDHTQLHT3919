
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Quan_Ly_HomeStay.Data;
using Quan_Ly_HomeStay.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Quan_Ly_HomeStay.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext db;
        private readonly IConfiguration _config;

        public UserController(ApplicationDbContext _db, IConfiguration cf)
        {
            db = _db;
            _config = cf;
        }
        [HttpGet("all")]

        public async Task<ActionResult<IEnumerable<User>>> GetAllUser()
        {
            if (db.Users == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu trống!",
                    status = 404
                });
            }
            var _data = from x in db.Users
                        join role in db.Roles on x.IdRole equals role.Id
                        select new
                        {
                            x.Id,
                            x.Name,
                            x.Email,
                            x.Password,
                            x.Phone,
                            x.Address,
                            x.CreateAt,
                            x.IdRole,
                            x.PathImg,
                            nameRole = role.Name,
                        };
            //var _data = await db.Users.Select(x => new
            //{
            //    x.Id,
            //    x.Name,
            //    x.Email,
            //    x.Password,
            //    x.Phone,
            //    x.Address,
            //    x.CreateAt,
            //    x.IdRole,
            //    x.PathImg

            //}).ToListAsync();
            return Ok(new
            {
                message = "Lấy dữ liệu thành công!",
                status = 200,
                data = _data
            }); ;
        }
        [HttpGet]

        public async Task<ActionResult<IEnumerable<User>>> GetUser(Guid id)
        {
            if (db.Users == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu trống!",
                    status = 404
                });
            }
            var _data = await db.Users.Where(x => x.Id == id).ToListAsync();
            return Ok(new
            {
                message = "Lấy dữ liệu thành công!",
                status = 200,
                data = _data
            }); ;
        }
        [HttpPost("register")]
        public async Task<ActionResult> AddUser([FromBody] User user)
        {
            // Kiểm tra nếu cả email và phone đều trống
            if (string.IsNullOrWhiteSpace(user.Email) && string.IsNullOrWhiteSpace(user.Phone))
            {
                return BadRequest(new
                {
                    message = "Vui lòng nhập Email hoặc Số điện thoại!",
                    status = 400
                });
            }

            if (string.IsNullOrWhiteSpace(user.Password))
            {
                return BadRequest(new
                {
                    message = "Mật khẩu không được để trống!",
                    status = 400
                });
            }

            // Kiểm tra email đã tồn tại nếu có nhập
            if (!string.IsNullOrWhiteSpace(user.Email))
            {
                var existingEmail = await db.Users.FirstOrDefaultAsync(x => x.Email == user.Email);
                if (existingEmail != null)
                {
                    return BadRequest(new
                    {
                        message = "Email đã tồn tại!",
                        status = 400
                    });
                }
            }

            // Kiểm tra phone đã tồn tại nếu có nhập
            if (!string.IsNullOrWhiteSpace(user.Phone))
            {
                var existingPhone = await db.Users.FirstOrDefaultAsync(x => x.Phone == user.Phone);
                if (existingPhone != null)
                {
                    return BadRequest(new
                    {
                        message = "Số điện thoại đã tồn tại!",
                        status = 400
                    });
                }
            }

            // Gán ID, ngày tạo, avatar mặc định
            user.Id = Guid.NewGuid();
            user.CreateAt ??= DateTime.Now;
            user.PathImg ??= "default-avatar.png";

            // Gán vai trò mặc định là "Customer"
            var role = await db.Roles.FirstOrDefaultAsync(x => x.Name == "Customer");
            if (role == null)
            {
                return StatusCode(500, new { message = "Không tìm thấy vai trò mặc định 'Customer'" });
            }
            user.IdRole = role.Id;

            // Lưu user
            await db.Users.AddAsync(user);
            await db.SaveChangesAsync();

            return Ok(new
            {
                message = "Tạo tài khoản thành công!",
                status = 200,
                data = new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    user.Phone,
                    user.PathImg,
                    user.CreateAt,
                    Role = role.Name
                }
            });
        }


        [HttpPut("edit")]
        public async Task<IActionResult> Edit([FromBody] UpdateUserDto model)
        {
            var user = await db.Users.FindAsync(model.Id);
            if (user == null)
            {
                return BadRequest(new { message = "Người dùng không tồn tại" });
            }

            user.Name = model.Name;
            user.Phone = model.Phone;
            user.Address = model.Address;
            user.Email = model.Email;
            user.PathImg = model.PathImg;

            await db.SaveChangesAsync();

            return Ok(new
            {
                message = "Sửa thành công!",
                status = 200,
                data = user
            });
        }



        [HttpDelete("delete")]

        public async Task<ActionResult> Delete([FromBody] Guid id)
        {
            if (db.Users == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu trống!",
                    status = 404
                });
            }
            var _user = await db.Users.FindAsync(id);
            if (_user == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu trống!",
                    status = 404
                });
            }
            try
            {
                db.Users.Remove(_user);
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
        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] Login user)
        {
            var _user = await db.Users
                .Where(u => u.Email == user.email)
                .FirstOrDefaultAsync();

            if (_user == null)
            {
                return Ok(new
                {
                    message = "Tài khoản không tồn tại",
                    status = 404
                });
            }

            // So sánh mật khẩu (sử dụng hash password nếu có)
            if (user.password != _user.Password)
            {
                return Ok(new
                {
                    message = "Sai mật khẩu",
                    status = 400
                });
            }

            // Tạo JWT token
            var claims = new[]
            {
        new Claim(JwtRegisteredClaimNames.Sub, _user.Email),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new Claim("id", _user.Id.ToString()),
        new Claim("role", db.Roles.FirstOrDefault(r => r.Id == _user.IdRole)?.Name)
    };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(60),
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            // Trả về toàn bộ thông tin người dùng và token
            return Ok(new
            {
                message = "Đăng nhập thành công",
                status = 200,
                token = tokenString,
                user = new
                {
                    id = _user.Id,
                    email = _user.Email,
                    name = _user.Name,
                    address = _user.Address,
                    phone = _user.Phone,
                    pathImg = _user.PathImg,
                    idRole = _user.IdRole,
                    createAt = _user.CreateAt,
                    role = db.Roles.FirstOrDefault(r => r.Id == _user.IdRole)?.Name
                }
            });
        }


        [HttpGet("info")]
        public ActionResult GetDataFromToken(string token)
        {
            if (token == "undefined")
            {
                return Ok(new
                {
                    message = "Dữ liệu trống!",
                    status = 400
                });
            }
            string _token = token.Split(' ')[1];
            if (_token == null)
            {
                return Ok(new
                {
                    message = "Token không đúng!",
                    status = 400
                });
            }
            var handle = new JwtSecurityTokenHandler();
            string email = Regex.Match(JsonSerializer.Serialize(handle.ReadJwtToken(_token)), "emailaddress\",\"Value\":\"(.*?)\",").Groups[1].Value;
            var sinhvien = db.Users.Where(x => x.Email == email).FirstOrDefault();
            if (sinhvien == null)
            {
                return Ok(new
                {
                    message = "Người dùng không tồn tại!",
                    status = 404
                });
            }
            var role = db.Roles.Find(sinhvien.IdRole);
            return Ok(new
            {
                message = "Lấy dữ liệu thành công!",
                status = 200,
                data = sinhvien,
                role = role.Name
            });
        }
        [HttpPost("changepass")]
        public ActionResult ChangePassword([FromBody] ChangePassword changePassword)
        {
            var user = db.Users.Find(changePassword.idUser);
            if (user == null)
            {
                return Ok(new
                {
                    message = "Người dùng không tồn tại!",
                    status = 404
                });
            }
            if (changePassword.oldPassword != user.Password)
            {
                return Ok(new
                {
                    message = "Mật khẩu cũ không đúng!",
                    status = 400
                });
            }

            user.Password = changePassword.newPassword;
            db.SaveChanges();
            return Ok(new
            {
                message = "Thay đổi mật khẩu thành công!",
                status = 200
            });
        }


    }

    public class Login
    {
        public string email { get; set; }
        public string password { get; set; }
    }
    public class ChangePassword
    {
        public Guid idUser { get; set; }
        public string oldPassword { get; set; }
        public string newPassword { get; set; }
    }
    public class UpdateUserDto
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? Email { get; set; }
        public string? PathImg { get; set; }
    }

}

