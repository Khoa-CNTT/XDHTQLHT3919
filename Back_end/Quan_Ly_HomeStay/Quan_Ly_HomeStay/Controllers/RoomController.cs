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
        public async Task<ActionResult> GetAllRooms()
        {
            if (_db.Rooms == null)
            {
                return NotFound(new { message = "Dữ liệu trống!", status = 404 });
            }

            var rooms = await _db.Rooms
                .OrderByDescending(r => r.CreateAt)
                .Select(room => new
                {
                    room.Id,
                    room.Name,
                    room.Detail,
                    room.Quantity,
                    room.Price,
                    room.Type,
                    room.IdUser,
                    room.CreateAt,
                    room.PathImg,
                    room.IdCategory,
                    categoryName = room.IdCategoryNavigation != null ? room.IdCategoryNavigation.Name : null,
                    categorySlug = room.IdCategoryNavigation != null ? room.IdCategoryNavigation.Slug : null
                })
                .ToListAsync();

            return Ok(new
            {
                message = "Lấy dữ liệu thành công!",
                status = 200,
                data = rooms
            });
        }


        // GET: api/room?id=xxxx
        [HttpGet]
        public async Task<ActionResult> GetRoomById([FromQuery] Guid id)
        {
            var room = await _db.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound(new { message = "Không tìm thấy phòng!", status = 404 });
            }

            var category = await _db.Categories.FindAsync(room.IdCategory);

            return Ok(new
            {
                message = "Lấy dữ liệu thành công!",
                status = 200,
                data = room,
                category
            });
        }

        // POST: api/room/add
        [HttpPost("add")]
        public async Task<ActionResult> AddRoom([FromBody] Room room)
        {
            room.CreateAt = DateTime.Now;
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
        public async Task<ActionResult> EditRoom([FromBody] Room room)
        {
            var existingRoom = await _db.Rooms.FindAsync(room.Id);
            if (existingRoom == null)
            {
                return NotFound(new { message = "Phòng không tồn tại!", status = 404 });
            }

            _db.Entry(existingRoom).CurrentValues.SetValues(room);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Sửa thành công!", status = 200 });
        }

        // DELETE: api/room/delete
        [HttpDelete("delete")]
        public async Task<ActionResult> DeleteRoom([FromBody] Guid id)
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

                return Ok(new { message = "Xóa thành công!", status = 200 });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Xảy ra lỗi khi xóa!", status = 400, error = ex.Message });
            }
        }
    }
}