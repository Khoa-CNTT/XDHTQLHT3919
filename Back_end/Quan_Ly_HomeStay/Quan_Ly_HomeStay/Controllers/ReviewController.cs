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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAllReviews()
        {
            var reviews = await _db.Reviews
                .Include(r => r.IdUserNavigation)
                .Include(r => r.Replies)
                    .ThenInclude(reply => reply.IdUserNavigation)
                .Where(r => r.ParentReviewId == null)
                .OrderByDescending(r => r.CreateAt)
                .Select(r => new {
                    r.Id,
                    r.Comment,
                    r.Rating,
                    r.CreateAt,
                    IdUser = r.IdUser,
                    UserName = r.IdUserNavigation.Name,
                    AvatarUrl = r.IdUserNavigation.PathImg,
                    Replies = r.Replies.Select(reply => new {
                        reply.Id,
                        reply.Comment,
                        reply.CreateAt,
                        reply.IdUser,
                        UserName = reply.IdUserNavigation.Name,
                        AvatarUrl = reply.IdUserNavigation.PathImg
                    })
                })
                .ToListAsync();

            return Ok(reviews);
        }


        [HttpPost]
        public async Task<ActionResult<Review>> CreateReview([FromBody] Review review)
        {
            if (review == null)
                return BadRequest("Dữ liệu gửi lên không hợp lệ.");

            if (string.IsNullOrWhiteSpace(review.Comment))
                return BadRequest("Bình luận không thể trống.");

            if (review.Rating < 1 || review.Rating > 5)
                return BadRequest("Rating phải từ 1 đến 5.");

            if (review.IdUser == null)
                return BadRequest("ID người dùng không được để trống.");

            var user = await _db.Users.FindAsync(review.IdUser);
            if (user == null)
                return BadRequest("Người dùng không tồn tại.");

            review.Id = Guid.NewGuid();
            review.CreateAt = DateTime.Now;
            review.ParentReviewId = null;


            _db.Reviews.Add(review);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllReviews), new { id = review.Id }, review);
        }

        [HttpPost("reply/{reviewId}")]
        public async Task<ActionResult<Review>> ReplyToReview(Guid reviewId, [FromBody] Review reply)
        {
            if (reply == null)
                return BadRequest("Dữ liệu gửi lên không hợp lệ.");
            if (string.IsNullOrWhiteSpace(reply.Comment))
                return BadRequest("Bình luận trả lời không hợp lệ.");

            if (reply.IdUser == null)
                return BadRequest("ID người dùng không được để trống.");

            var parentReview = await _db.Reviews.FindAsync(reviewId);
            if (parentReview == null)
                return NotFound("Đánh giá gốc không tồn tại.");

            var user = await _db.Users.FindAsync(reply.IdUser);
            if (user == null)
                return BadRequest("Người dùng không tồn tại.");

            reply.Id = Guid.NewGuid();
            reply.CreateAt = DateTime.Now;
            reply.ParentReviewId = reviewId;


            _db.Reviews.Add(reply);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllReviews), new { id = reply.Id }, reply);
        }


        [HttpPut("{id}")]
        public async Task<ActionResult<Review>> UpdateReview(Guid id, [FromBody] Review updatedReview)
        {
            if (updatedReview == null)
                return BadRequest("Dữ liệu gửi lên không hợp lệ.");

            if (string.IsNullOrWhiteSpace(updatedReview.Comment))
                return BadRequest("Bình luận không thể trống.");

            if (updatedReview.Rating < 1 || updatedReview.Rating > 5)
                return BadRequest("Rating phải từ 1 đến 5.");

            var review = await _db.Reviews.FindAsync(id);
            if (review == null)
                return NotFound("Không tìm thấy đánh giá.");

            review.Comment = updatedReview.Comment;
            review.Rating = updatedReview.Rating;

            await _db.SaveChangesAsync();

            return Ok(review);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(Guid id)
        {
            var review = await _db.Reviews
                .Include(r => r.Replies)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (review == null)
                return NotFound("Không tìm thấy đánh giá.");

            if (review.Replies != null && review.Replies.Any())
            {
                _db.Reviews.RemoveRange(review.Replies);
            }

            _db.Reviews.Remove(review);
            await _db.SaveChangesAsync();

            return Ok("Xóa đánh giá thành công.");
        }
    }
}