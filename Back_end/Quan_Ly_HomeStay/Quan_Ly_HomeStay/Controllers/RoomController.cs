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
                    CategoryName = room.IdCategoryNavigation != null ? room.IdCategoryNavigation.Name : null
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
                    Category = room.IdCategoryNavigation == null ? null : new
                    {
                        room.IdCategoryNavigation.Id,
                        room.IdCategoryNavigation.Name
                    }
                }
            });
        }

        // POST: api/room/add
        [HttpPost("add")]
        public async Task<IActionResult> AddRoom([FromBody] Room room)
        {
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
    }
}