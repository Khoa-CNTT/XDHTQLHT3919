using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Quan_Ly_HomeStay.Data;
using Quan_Ly_HomeStay.Models;
using Microsoft.EntityFrameworkCore;

namespace Quan_Ly_HomeStay.Controllers
{
    [Route("api/room")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly ApplicationDbContext db;
        public RoomController(ApplicationDbContext _db)
        {
            db = _db;
        }

        // Lấy danh sách tất cả phòng
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<RoomModel>>> GetAllRooms()
        {
            if (db.Rooms == null)
            {
                return NotFound(new { message = "Dữ liệu trống!", status = 404 });
            }

            var rooms = await db.Rooms
                .Include(r => r.IdUserNavigation)
                .Include(r => r.IdCategoryNavigation)
                .OrderByDescending(r => r.CreateAt)
                .Select(room => new
                {
                    room.Id,
                    room.Title,
                    room.Image,
                    room.RoomNumber,
                    room.Quantity,
                    room.Description,
                    room.PricePerNight,
                    room.CreateAt,
                    room.IdUser,
                    room.IdCategory,
                    CategoryName = room.IdCategoryNavigation.Name
                })
                .ToListAsync();

            return Ok(new { message = "Lấy dữ liệu thành công!", status = 200, data = rooms });
        }

        // Lấy thông tin chi tiết một phòng theo Id
        [HttpGet("{id}")]
        public async Task<ActionResult<RoomModel>> GetRoomById(Guid id)
        {
            var room = await db.Rooms
                .Include(r => r.IdUserNavigation)
                .Include(r => r.IdCategoryNavigation)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (room == null)
            {
                return NotFound(new { message = "Không tìm thấy phòng!", status = 404 });
            }

            return Ok(new { message = "Lấy dữ liệu thành công!", status = 200, data = room });
        }

        // Thêm phòng mới
        [HttpPost("add")]
        public async Task<ActionResult> AddRoom([FromBody] RoomModel room)
        {
            if (room == null)
            {
                return BadRequest(new { message = "Dữ liệu không hợp lệ!", status = 400 });
            }

            room.Id = Guid.NewGuid();
            room.CreateAt = DateTime.UtcNow;

            await db.Rooms.AddAsync(room);
            await db.SaveChangesAsync();

            return Ok(new { message = "Tạo phòng thành công!", status = 200, data = room });
        }

        // Cập nhật thông tin phòng
        [HttpPut("edit")]
        public async Task<ActionResult> UpdateRoom([FromBody] RoomModel room)
        {
            var existingRoom = await db.Rooms.FindAsync(room.Id);
            if (existingRoom == null)
            {
                return NotFound(new { message = "Phòng không tồn tại!", status = 404 });
            }

            db.Entry(existingRoom).CurrentValues.SetValues(room);
            await db.SaveChangesAsync();

            return Ok(new { message = "Cập nhật thành công!", status = 200 });
        }

        // Xóa phòng theo Id
        [HttpDelete("delete/{id}")]
        public async Task<ActionResult> DeleteRoom(Guid id)
        {
            var room = await db.Rooms.FindAsync(id);
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
