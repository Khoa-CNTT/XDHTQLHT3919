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
                .Include(r => r.IdCategoryNavigation)
                .Include(r => r.Amenities) // Thêm dòng này để lấy tiện nghi
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
                    CategoryName = room.IdCategoryNavigation != null ? room.IdCategoryNavigation.Name : "Chưa xác định",
                    Amenities = room.Amenities.Select(a => new { a.Id, a.Name })
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
                .Include(r => r.IdCategoryNavigation)
                .Include(r => r.Amenities)
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
                    CategoryName = room.IdCategoryNavigation != null ? room.IdCategoryNavigation.Name : "Chưa xác định",
                    Amenities = room.Amenities.Select(a => new { a.Id, a.Name }) // Trả về danh sách tiện nghi
                }
            });
        }





        // POST: api/room/add

        [HttpPost("add")]
        public async Task<ActionResult> AddRoom([FromBody] RoomDto roomDto)
        {
            if (string.IsNullOrEmpty(roomDto.Name) || roomDto.Price == 0 || string.IsNullOrEmpty(roomDto.PathImg))
            {
                return BadRequest(new { message = "Vui lòng điền đầy đủ thông tin.", status = 400 });
            }

            var room = new Room
            {
                Id = roomDto.Id == Guid.Empty ? Guid.NewGuid() : roomDto.Id,
                Name = roomDto.Name,
                Detail = roomDto.Detail,
                Note = roomDto.Note,
                Price = roomDto.Price,
                PathImg = roomDto.PathImg,
                Status = "Còn trống",
                CreateAt = DateTime.Now,
                IdUser = roomDto.IdUser,
                IdCategory = roomDto.IdCategory
            };

            var amenities = await _db.Amenities.Where(a => roomDto.AmenityIds.Contains(a.Id)).ToListAsync();
            room.Amenities = amenities;

            await _db.Rooms.AddAsync(room);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Tạo phòng thành công!", status = 200, data = room });
        }


        // PUT: api/room/edit
        [HttpPut("edit")]
        public async Task<IActionResult> EditRoom([FromBody] RoomDto roomDto)
        {
            var room = await _db.Rooms.Include(r => r.Amenities).FirstOrDefaultAsync(r => r.Id == roomDto.Id);
            if (room == null)
            {
                return NotFound(new { message = "Phòng không tồn tại!", status = 404 });
            }

            room.Name = roomDto.Name;
            room.Detail = roomDto.Detail;
            room.Note = roomDto.Note;
            room.Price = roomDto.Price;
            room.PathImg = roomDto.PathImg;
            room.Status = roomDto.Status;
            room.IdUser = roomDto.IdUser;
            room.IdCategory = roomDto.IdCategory;

            // Cập nhật danh sách tiện nghi
            room.Amenities.Clear();
            var amenities = await _db.Amenities.Where(a => roomDto.AmenityIds.Contains(a.Id)).ToListAsync();
            room.Amenities = amenities;

            await _db.SaveChangesAsync();

            return Ok(new { message = "Sửa phòng thành công!", status = 200 });
        }


        // DELETE: api/room/delete/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(Guid id)
        {
            var room = await _db.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound();
            }

            var hasBookings = _db.BookingDetails.Any(b => b.IdRoom == id);
            if (hasBookings)
            {
                return BadRequest(new
                {
                    message = "Không thể xóa phòng này vì đã có đơn đặt phòng liên quan.",
                    status = 400
                });
            }

            _db.Rooms.Remove(room);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Xóa phòng thành công." });
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
    public class RoomDto
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Detail { get; set; }
        public string? Note { get; set; }
        public decimal Price { get; set; }
        public string? PathImg { get; set; }
        public string? Status { get; set; }
        public Guid? IdUser { get; set; }
        public Guid? IdCategory { get; set; }
        public List<Guid> AmenityIds { get; set; } = new();
    }

}