using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Quan_Ly_HomeStay.Data;
using Quan_Ly_HomeStay.Models;

namespace Quan_Ly_HomeStay.Controllers
{
    [Route("api/amenity")]
    [ApiController]
    public class AmenityController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AmenityController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/amenity
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var amenities = await _context.Amenities.ToListAsync();
            return Ok(amenities);
        }

        // POST: api/amenity
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] AmenityModel amenity)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            amenity.Id = Guid.NewGuid();
            _context.Amenities.Add(amenity);
            await _context.SaveChangesAsync();

            return Ok(amenity);
        }

        // PUT: api/amenity/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] AmenityModel updated)
        {
            var amenity = await _context.Amenities.FindAsync(id);
            if (amenity == null) return NotFound();

            amenity.Name = updated.Name;
            await _context.SaveChangesAsync();

            return Ok(amenity);
        }

        // DELETE: api/amenity/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var amenity = await _context.Amenities.FindAsync(id);
            if (amenity == null) return NotFound();

            _context.Amenities.Remove(amenity);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa thành công" });
        }
    }
}
