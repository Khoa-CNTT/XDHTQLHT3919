using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Quan_Ly_HomeStay.Data;
using Quan_Ly_HomeStay.Models;

namespace Quan_Ly_HomeStay.Controllers
{
    [ApiController]
    [Route("api/review")]
    public class ReviewController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public ReviewController(ApplicationDbContext db)
        {
            _db = db;
        }

        // GET: api/review
        [HttpGet]
        public async Task<IActionResult> GetAllReviews()
        {
            var reviews = await _db.Reviews
                .Include(r => r.IdUserNavigation)
                .OrderByDescending(r => r.CreateAt)
                .ToListAsync();

            return Ok(reviews);
        }

        // POST: api/review
        [HttpPost]
        public async Task<IActionResult> CreateReview([FromBody] Review review)
        {
            if (review == null)
                return BadRequest("Dữ liệu đánh giá không hợp lệ.");

            if (string.IsNullOrWhiteSpace(review.Comment))
                return BadRequest("Bình luận không thể trống.");

            if (review.IdUser == null)
                return BadRequest("ID người dùng không được để trống.");


            review.Id = Guid.NewGuid();
            review.CreateAt = DateTime.Now;

            // Kiểm tra người dùng và phòng có tồn tại không
            var user = await _db.Users.FindAsync(review.IdUser);
            if (user == null)
                return BadRequest("Người dùng không tồn tại.");


            _db.Reviews.Add(review);
            await _db.SaveChangesAsync();

            return Ok(review);
        }

        // DELETE: api/review/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(Guid id)
        {
            var review = await _db.Reviews.FindAsync(id);
            if (review == null) return NotFound("Không tìm thấy đánh giá.");

            _db.Reviews.Remove(review);
            await _db.SaveChangesAsync();

            return Ok("Xóa đánh giá thành công.");
        }
    }
}