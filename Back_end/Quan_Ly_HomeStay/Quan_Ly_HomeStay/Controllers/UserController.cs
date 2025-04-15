
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Quan_Ly_HomeStay.Data;
using Quan_Ly_HomeStay.Helpers;
using Quan_Ly_HomeStay.Models;
using System.IdentityModel.Tokens.Jwt;
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
            // Kiểm tra đầu vào bắt buộc
            if (string.IsNullOrWhiteSpace(user.Email) || string.IsNullOrWhiteSpace(user.Password))
            {
                return BadRequest(new
                {
                    message = "Email và mật khẩu không được để trống!",
                    status = 400
                });
            }
            // Kiểm tra email đã tồn tại chưa
            var existingUser = await db.Users.FirstOrDefaultAsync(x => x.Email == user.Email);
            if (existingUser != null)
            {
                return BadRequest(new
                {
                    message = "Email đã tồn tại!",
                    status = 400
                });
            }
            user.Password = SHA256Helper.Encrypt(user.Password);
            
            user.Id = Guid.NewGuid();
            
            user.CreateAt ??= DateTime.Now;
            
            user.PathImg ??= "default-avatar.png"; 
            
            var role = await db.Roles.FirstOrDefaultAsync(x => x.Name == "Member");
            if (role == null)
            {
                return StatusCode(500, new { message = "Không tìm thấy vai trò mặc định 'Member'" });
            }
            user.IdRole = role.Id;

            // Lưu user vào database
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
                    user.PathImg,
                    user.CreateAt,
                    Role = role.Name
                }
            });
        }

        [HttpPut("edit")]

        public async Task<ActionResult> Edit([FromBody] User user)
        {
            var _user = await db.Users.FindAsync(user.Id);
            if (_user == null)
            {
                return Ok(new
                {
                    message = "Dữ liệu không tồn tại!",
                    status = 400
                });
            }
            db.Entry(await db.Users.FirstOrDefaultAsync(x => x.Id == _user.Id)).CurrentValues.SetValues(user);
            var __user = (from nv in db.Users
                          where nv.Id == user.Id
                          select new
                          {
                              nv.Id,
                              nv.Password,
                              nv.Email,
                              nv.IdRole,
                              nv.PathImg,
                              nv.Address,
                              nv.Name,
                              nv.CreateAt,
                              nv.Phone,
                              role = db.Roles.Where(x => x.Id == nv.IdRole).FirstOrDefault().Name
                          }).ToList();
            await db.SaveChangesAsync();
            return Ok(new
            {
                message = "Sửa thành công!",
                status = 200,
                data = __user
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
            var userData = (from nv in db.Users
                            where nv.Email == user.email
                            select new
                            {
                                nv.Id,
                                nv.Password,
                                nv.Email,
                                nv.PathImg,
                                nv.IdRole,
                                nv.Address,
                                nv.Name,
                                nv.CreateAt,
                                nv.Phone,
                                role = db.Roles.FirstOrDefault(x => x.Id == nv.IdRole).Name
                            }).FirstOrDefault();

            if (userData == null)
            {
                return Ok(new
                {
                    message = "Tài khoản không tồn tại",
                    status = 404
                });
            }

            string encryptedPassword = SHA256Helper.Encrypt(user.password);

            if (encryptedPassword != userData.Password)
            {
                return Ok(new
                {
                    message = "Sai mật khẩu",
                    status = 400
                });
            }

            return Ok(new
            {
                message = "Thành công",
                status = 200,
                data = userData
            });
        }


        [HttpGet("info")]
        public ActionResult GetDataFromToken()
        {
            var authHeader = HttpContext.Request.Headers["Authorization"].ToString();

            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                return Ok(new
                {
                    message = "Token không hợp lệ!",
                    status = 400
                });
            }

            string _token = authHeader.Split(' ')[1];

            var handler = new JwtSecurityTokenHandler();
            var tokenData = handler.ReadJwtToken(_token);

            string email = tokenData.Claims.FirstOrDefault(c => c.Type == "emailaddress")?.Value;

            if (string.IsNullOrEmpty(email))
            {
                return Ok(new
                {
                    message = "Không tìm thấy email trong token!",
                    status = 400
                });
            }

            var user = db.Users.FirstOrDefault(x => x.Email == email);
            if (user == null)
            {
                return Ok(new
                {
                    message = "Người dùng không tồn tại!",
                    status = 404
                });
            }

            var role = db.Roles.Find(user.IdRole);

            return Ok(new
            {
                message = "Lấy dữ liệu thành công!",
                status = 200,
                data = user,
                role = role?.Name
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
                    status = 200
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
            db.Entry(db.Users.FirstOrDefault(x => x.Id == user.Id)).CurrentValues.SetValues(user);
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

}

