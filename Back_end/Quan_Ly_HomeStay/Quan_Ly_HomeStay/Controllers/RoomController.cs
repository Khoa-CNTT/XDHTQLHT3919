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

            // Kiểm tra trùng tên phòng (không phân biệt hoa thường)
            var isExist = await _db.Rooms.AnyAsync(r => r.Name.ToLower() == roomDto.Name.Trim().ToLower());
            if (isExist)
            {
                return BadRequest(new { message = "Tên phòng đã tồn tại, vui lòng chọn tên khác.", status = 400 });
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
        public async Task<IActionResult> UploadImage([FromForm] IFormFile file, [FromForm] string folder = "others")
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "Không có tệp được tải lên", status = 400 });
            }

            try
            {
                // Tạo tên file duy nhất
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

                // Tạo đường dẫn thư mục lưu trữ
                var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", folder);

                // Tạo thư mục nếu chưa có
                if (!Directory.Exists(uploadFolder))
                {
                    Directory.CreateDirectory(uploadFolder);
                }

                // Đường dẫn đầy đủ của file
                var filePath = Path.Combine(uploadFolder, fileName);

                // Lưu file vào thư mục
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Đường dẫn để hiển thị file từ client
                var fileUrl = $"/images/{folder}/{fileName}";

                return Ok(new
                {
                    message = "Tải ảnh thành công",
                    status = 200,
                    fileUrl = fileUrl
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Lỗi khi tải ảnh",
                    status = 500,
                    error = ex.Message
                });
            }
        }
        [HttpGet("is-booked")]
        public async Task<IActionResult> IsRoomBooked(Guid roomId, DateTime checkIn, DateTime checkOut)
        {
            // Kiểm tra có booking nào giao thoa với khoảng ngày này không
            var isBooked = await _db.BookingDetails.AnyAsync(b =>
                b.IdRoom == roomId &&
                !(b.CheckOutDate <= checkIn || b.CheckInDate >= checkOut) // Giao thoa ngày
            );
            return Ok(new { isBooked });
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