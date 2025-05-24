
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
using Quan_Ly_HomeStay.Services;
using System.Text.RegularExpressions;
using MimeKit;
using System.ComponentModel.DataAnnotations;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Quan_Ly_HomeStay.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext db;
        private readonly IConfiguration _config;
        private readonly EmailService _emailService;

        public UserController(ApplicationDbContext _db, IConfiguration cf, EmailService emailService)
        {
            db = _db;
            _config = cf;
            _emailService = emailService;
        }
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUser()
        {
            if (db.Users == null)
            {
                return NotFound(new { message = "Dữ liệu trống!", status = 404 });
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
                            x.PathImg,
                            nameRole = role.Name
                        };



            return Ok(_data);  // Trả về dữ liệu trực tiếp
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
            // 1. Kiểm tra nếu cả email và số điện thoại đều trống
            if (string.IsNullOrWhiteSpace(user.Email) && string.IsNullOrWhiteSpace(user.Phone))
            {
                return BadRequest(new
                {
                    message = "Vui lòng nhập Email hoặc Số điện thoại!",
                    status = 400
                });
            }

            // 2. Kiểm tra mật khẩu
            if (string.IsNullOrWhiteSpace(user.Password))
            {
                return BadRequest(new
                {
                    message = "Mật khẩu không được để trống!",
                    status = 400
                });
            }

            // 3. Kiểm tra trùng email nếu có
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

            // 4. Kiểm tra trùng số điện thoại nếu có
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

            // 5. Gán các giá trị mặc định
            user.Id = Guid.NewGuid();
            user.CreateAt ??= DateTime.Now;
            user.PathImg ??= "default-avatar.png"; // Avatar mặc định nếu không có

            // 6. Gán vai trò mặc định "Member"
            var role = await db.Roles.FirstOrDefaultAsync(x => x.Name == "Member");
            if (role == null)
            {
                return StatusCode(500, new
                {
                    message = "Không tìm thấy vai trò mặc định 'Member'",
                    status = 500
                });
            }
            user.IdRole = role.Id;

            // 7. Băm mật khẩu
            var passwordHasher = new PasswordHasher<User>();
            user.Password = passwordHasher.HashPassword(user, user.Password);

            // 8. Lưu vào database
            await db.Users.AddAsync(user);
            await db.SaveChangesAsync();

            // 9. Trả kết quả thành công
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
        public async Task<IActionResult> Edit([FromForm] UpdateUserDto model, IFormFile avatar)
        {
            Console.WriteLine($"Nhận được yêu cầu sửa người dùng với Id: {model.Id}");

            var user = await db.Users.FindAsync(model.Id);
            if (user == null)
            {
                return BadRequest(new { message = "Người dùng không tồn tại" });
            }

            // Cập nhật thông tin người dùng
            user.Name = model.Name;
            user.Phone = model.Phone;
            user.Address = model.Address;
            user.Email = model.Email;

            // Xử lý ảnh nếu có upload
            if (avatar != null)
            {
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(avatar.FileName)}";
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", fileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await avatar.CopyToAsync(stream);

                user.PathImg = fileName;  // Lưu tên file ảnh vào DB
            }
            else if (!string.IsNullOrEmpty(model.PathImg))
            {
                // Giữ tên ảnh cũ nếu không upload file mới
                user.PathImg = model.PathImg;
            }

            if (model.IdRole.HasValue)
            {
                var role = await db.Roles.FindAsync(model.IdRole);
                if (role == null)
                {
                    return BadRequest(new { message = $"Vai trò với Id {model.IdRole} không tồn tại" });
                }
                user.IdRole = model.IdRole.Value;
            }

            try
            {
                await db.SaveChangesAsync();
                return Ok(new
                {
                    message = "Sửa thành công!",
                    status = 200,
                    data = user
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lưu thay đổi", error = ex.Message });
            }
        }


        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)

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
        public async Task<ActionResult> Login([FromBody] Login userLogin)
        {
            if (string.IsNullOrWhiteSpace(userLogin.EmailOrPhone) || string.IsNullOrWhiteSpace(userLogin.Password))
            {
                return Ok(new
                {
                    message = "Vui lòng nhập email hoặc số điện thoại và mật khẩu.",
                    status = 400
                });
            }

            var user = await db.Users
                .Where(u => u.Email == userLogin.EmailOrPhone || u.Phone == userLogin.EmailOrPhone)
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return Ok(new
                {
                    message = "Tài khoản không tồn tại",
                    status = 404
                });
            }

            var passwordHasher = new PasswordHasher<User>();
            var result = passwordHasher.VerifyHashedPassword(user, user.Password, userLogin.Password);

            if (result == PasswordVerificationResult.Failed)
            {
                return Ok(new
                {
                    message = "Sai mật khẩu",
                    status = 400
                });
            }

            var claims = new[]
            {
        new Claim(JwtRegisteredClaimNames.Sub, user.Email ?? user.Phone),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        new Claim("id", user.Id.ToString()),
        new Claim("role", db.Roles.FirstOrDefault(r => r.Id == user.IdRole)?.Name ?? "")
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

            return Ok(new
            {
                message = "Đăng nhập thành công",
                status = 200,
                token = tokenString,
                user = new
                {
                    id = user.Id,
                    email = user.Email,
                    name = user.Name,
                    address = user.Address,
                    phone = user.Phone,
                    pathImg = user.PathImg,
                    idRole = user.IdRole,
                    createAt = user.CreateAt,
                    role = db.Roles.FirstOrDefault(r => r.Id == user.IdRole)?.Name
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

            // Sử dụng PasswordHasher để so sánh mật khẩu cũ
            var passwordHasher = new PasswordHasher<User>();
            var result = passwordHasher.VerifyHashedPassword(user, user.Password, changePassword.oldPassword);

            if (result == PasswordVerificationResult.Failed)
            {
                return Ok(new
                {
                    message = "Mật khẩu cũ không đúng!",
                    status = 400
                });
            }

            // Băm mật khẩu mới
            user.Password = passwordHasher.HashPassword(user, changePassword.newPassword); // Băm mật khẩu mới
            db.SaveChanges();

            return Ok(new
            {
                message = "Thay đổi mật khẩu thành công!",
                status = 200
            });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                return BadRequest(new { message = "Email không tồn tại!" });
            }

            // Tạo token cho việc đặt lại mật khẩu
            var token = GeneratePasswordResetToken(user); // Tạo token cho người dùng

            // Tạo URL đặt lại mật khẩu
            var resetPasswordUrl = $"http://localhost:3000/reset-password?token={token}";

            // Gửi email với URL này
            await _emailService.SendEmailAsync(request.Email, "Yêu cầu đặt lại mật khẩu",
                $"Chúng tôi nhận được yêu cầu đặt lại mật khẩu từ bạn. Vui lòng nhấp vào đường dẫn sau để đặt lại mật khẩu: {resetPasswordUrl}");

            return Ok(new { message = "Một email hướng dẫn đặt lại mật khẩu đã được gửi." });
        }




        private string GeneratePasswordResetToken(User user)
        {
            // Step 1: Set expiration time (e.g., 1 hour)
            var expirationTime = DateTime.UtcNow.AddHours(1);

            // Step 2: Create JWT token with expiration and user info (like email)
            var claims = new[]
            {
        new Claim(ClaimTypes.Name, user.Email),
        new Claim("exp", expirationTime.ToString())
    };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("quocdeptrai_12345678901234567890123456789012"));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = expirationTime,
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromQuery] string token, [FromBody] ResetPasswordRequest request)
        {
            if (string.IsNullOrEmpty(token))
            {
                return BadRequest(new { message = "Token không hợp lệ." });
            }

            // Step 1: Validate the token and get user info
            var userEmail = ValidatePasswordResetToken(token);
            if (userEmail == null)
            {
                return BadRequest(new { message = "Token không hợp lệ hoặc đã hết hạn." });
            }

            // Step 2: Find user by email
            var user = await db.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
            if (user == null)
            {
                return BadRequest(new { message = "Người dùng không tồn tại!" });
            }

            // Step 3: Validate the new password
            if (request.NewPassword != request.ConfirmPassword)
            {
                return BadRequest(new { message = "Mật khẩu mới không khớp!" });
            }

            if (request.NewPassword.Length < 6)
            {
                return BadRequest(new { message = "Mật khẩu mới phải có ít nhất 6 ký tự!" });
            }

            // Step 4: Băm và lưu mật khẩu mới
            var passwordHasher = new PasswordHasher<User>();
            user.Password = passwordHasher.HashPassword(user, request.NewPassword);  // Băm mật khẩu mới
            await db.SaveChangesAsync();

            return Ok(new { message = "Mật khẩu đã được thay đổi thành công!" });
        }



        private string ValidatePasswordResetToken(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes("quocdeptrai_12345678901234567890123456789012");
                var parameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true, // Bắt buộc xác thực thời gian hết hạn của token
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                };

                var principal = tokenHandler.ValidateToken(token, parameters, out var validatedToken);

                // Kiểm tra thời gian hết hạn của token
                var expirationClaim = principal?.FindFirst("exp");
                if (expirationClaim != null)
                {
                    var expClaim = principal?.FindFirst("exp");
                    if (expClaim != null)
                    {
                        var expUnix = long.Parse(expClaim.Value);
                        var expirationTime = DateTimeOffset.FromUnixTimeSeconds(expUnix).UtcDateTime;
                        if (expirationTime < DateTime.UtcNow)
                        {
                            return null; // Token hết hạn
                        }
                    }
                }

                var emailClaim = principal?.FindFirst(ClaimTypes.Name)?.Value;
                return emailClaim;
            }
            catch (Exception ex)
            {
                // Log lỗi để tiện tra cứu
                Console.WriteLine($"Token validation failed: {ex.Message}");
                return null;
            }
        }


    }
    public class ResetPasswordRequest
    {
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }
    }
    public class ForgotPasswordRequest
    {
        public string Email { get; set; }
    }

    public class Login
    {
        public string EmailOrPhone { get; set; }
        public string Password { get; set; }
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
        //public string? Password { get; set; }
        public string? Address { get; set; }
        public string? Email { get; set; }
        public string? PathImg { get; set; }
        public Guid? IdRole { get; set; }
    }
    public class RegisterDto : IValidatableObject
    {
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public string? PathImg { get; set; }
        public Guid IdRole { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext context)
        {
            if (string.IsNullOrWhiteSpace(Email) && string.IsNullOrWhiteSpace(Phone))
                yield return new ValidationResult("Vui lòng nhập Email hoặc Số điện thoại!");

            if (!string.IsNullOrWhiteSpace(Email) && !new EmailAddressAttribute().IsValid(Email))
                yield return new ValidationResult("Email không đúng định dạng", new[] { nameof(Email) });

            if (!string.IsNullOrWhiteSpace(Phone) && !Regex.IsMatch(Phone, @"^0\d{9}$"))
                yield return new ValidationResult("Số điện thoại không đúng định dạng");

            if (string.IsNullOrWhiteSpace(Name))
                yield return new ValidationResult("Tên không được để trống");

            if (string.IsNullOrWhiteSpace(Password))
                yield return new ValidationResult("Mật khẩu không được để trống");

            if (IdRole == Guid.Empty)
                yield return new ValidationResult("Vai trò không hợp lệ");
        }
    }


}

