using Quan_Ly_HomeStay.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Quan_Ly_HomeStay.Data;

namespace Quan_Ly_HomeStay.Controllers
{
    [Route("api/room")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public RoomController(ApplicationDbContext db)
        {
            _db = db;
        }

        // GET: api/room/all
        [HttpGet("all")]
        public async Task<IActionResult> GetAllRooms()
        {
            var rooms = await _db.Rooms
                .Include(r => r.IdCategoryNavigation)  // Đảm bảo Category được include
                .OrderByDescending(r => r.CreateAt)
                .Select(room => new
                {
                    room.Id,
                    room.Name,
                    room.Detail,
                    room.Note,
                    room.Price,
                    room.Status,
                    room.PathImg,
                    room.CreateAt,
                    room.IdUser,
                    room.IdCategory,
                    // Lấy tên loại phòng từ IdCategoryNavigation
                    CategoryName = room.IdCategoryNavigation != null ? room.IdCategoryNavigation.Name : "Chưa xác định"
                })
                .ToListAsync();

            return Ok(new
            {
                message = "Lấy dữ liệu thành công!",
                status = 200,
                data = rooms
            });
        }


        // GET: api/room/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoomById(Guid id)
        {
            var room = await _db.Rooms
                .Include(r => r.IdCategoryNavigation)  // Đảm bảo Category được include
                .FirstOrDefaultAsync(r => r.Id == id);

            if (room == null)
            {
                return NotFound(new { message = "Không tìm thấy phòng!", status = 404 });
            }

            return Ok(new
            {
                message = "Lấy dữ liệu thành công!",
                status = 200,
                data = new
                {
                    room.Id,
                    room.Name,
                    room.Price,
                    room.Note,
                    room.PathImg,
                    room.Status,
                    room.Detail,
                    room.CreateAt,
                    // Trả về tên loại phòng từ IdCategoryNavigation
                    CategoryName = room.IdCategoryNavigation != null ? room.IdCategoryNavigation.Name : "Chưa xác định"
                }
            });
        }



        // POST: api/room/add
       
        [HttpPost("add")]
        public async Task<ActionResult> AddRoom([FromBody] Room room)
        {
            if (string.IsNullOrEmpty(room.Name) || room.Price == null || string.IsNullOrEmpty(room.PathImg))
            {
                return BadRequest(new
                {
                    message = "Vui lòng điền đầy đủ thông tin bắt buộc.",
                    status = 400
                });
            }

            if (room.Id == Guid.Empty)
            {
                room.Id = Guid.NewGuid();
            }

            room.CreateAt = DateTime.Now;
            room.Status = "Còn trống"; 

            await _db.Rooms.AddAsync(room);
            await _db.SaveChangesAsync();

            return Ok(new
            {
                message = "Tạo phòng thành công!",
                status = 200,
                data = room
            });
        }

        // PUT: api/room/edit
        [HttpPut("edit")]
        public async Task<IActionResult> EditRoom([FromBody] Room room)
        {
            var existingRoom = await _db.Rooms.FindAsync(room.Id);
            if (existingRoom == null)
            {
                return NotFound(new { message = "Phòng không tồn tại!", status = 404 });
            }

            _db.Entry(existingRoom).CurrentValues.SetValues(room);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Sửa phòng thành công!", status = 200 });
        }

        // DELETE: api/room/delete/{id}
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteRoom(Guid id)
        {
            var room = await _db.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound(new { message = "Không tìm thấy phòng!", status = 404 });
            }

            try
            {
                _db.Rooms.Remove(room);
                await _db.SaveChangesAsync();

                return Ok(new { message = "Xóa phòng thành công!", status = 200 });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Xảy ra lỗi khi xóa!", status = 400, error = ex.Message });
            }
        }
        [HttpPost("upload")]
        public async Task<ActionResult> UploadImage([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "Không có tệp được tải lên", status = 400 });
            }

            // Đường dẫn lưu ảnh
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "rooms", file.FileName);

            try
            {
                // Kiểm tra nếu thư mục không tồn tại, tạo mới
                var directoryPath = Path.GetDirectoryName(filePath);
                if (!Directory.Exists(directoryPath))
                {
                    Directory.CreateDirectory(directoryPath);
                }

                // Lưu tệp vào thư mục
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var fileUrl = $"/images/rooms/{file.FileName}"; // Đường dẫn ảnh
                return Ok(new { message = "Tải ảnh thành công", status = 200, fileUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi tải ảnh", status = 500, error = ex.Message });
            }
        }
    }
}