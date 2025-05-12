using Microsoft.AspNetCore.Mvc;
using Quan_Ly_HomeStay.Models;
using Microsoft.EntityFrameworkCore;
using Quan_Ly_HomeStay.Data;

namespace Quan_Ly_HomeStay.Controllers
{
    [Route("api/image")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ImagesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Lấy tất cả ảnh
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Image>>> GetImages()
        {
            var images = await _context.Images
                .Select(img => new Image
                {
                    Id = img.Id,
                    Src = img.Src,
                    Alt = img.Alt,
                    CreatedAt = img.CreatedAt
                })
                .ToListAsync();
            return Ok(images);
        }

        // Thêm ảnh mới
        [HttpPost]
        public async Task<ActionResult<Image>> AddImage([FromBody] Image imageModel)
        {
            var image = new Image
            {
                Src = imageModel.Src,
                Alt = imageModel.Alt,
                CreatedAt = DateTime.Now
            };

            _context.Images.Add(image);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetImages", new { id = image.Id }, image);
        }

        // Xóa ảnh
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteImage(int id)
        {
            var image = await _context.Images.FindAsync(id);
            if (image == null)
            {
                return NotFound();
            }

            _context.Images.Remove(image);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Upload ảnh hoặc liên kết ảnh từ URL
        [HttpPost("upload-or-link")]
        public async Task<IActionResult> UploadImageOrLink([FromForm] IFormFile? file, [FromForm] string? imageUrl)
        {
            if (file != null && file.Length > 0)
            {
                // Trường hợp tải lên tệp
                var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }

                var fileName = Path.GetFileName(file.FileName);
                var filePath = Path.Combine(uploadPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var image = new Image
                {
                    Src = $"/images/{fileName}",
                    Alt = fileName,
                    CreatedAt = DateTime.Now
                };

                _context.Images.Add(image);
                await _context.SaveChangesAsync();

                return Ok(new { image.Src });
            }
            else if (!string.IsNullOrEmpty(imageUrl))
            {
                // Trường hợp chỉ gửi đường dẫn ảnh
                var image = new Image
                {
                    Src = imageUrl,
                    Alt = "Image from URL",
                    CreatedAt = DateTime.Now
                };

                _context.Images.Add(image);
                await _context.SaveChangesAsync();

                return Ok(new { image.Src });
            }
            else
            {
                return BadRequest("Vui lòng tải lên một tệp hoặc cung cấp đường dẫn tệp.");
            }
        }
    }
}
