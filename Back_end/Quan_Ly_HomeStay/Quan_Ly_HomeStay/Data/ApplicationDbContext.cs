using Quan_Ly_HomeStay.Models;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace Quan_Ly_HomeStay.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<RoomModel> Rooms { get; set; }
        public DbSet<RoleModel> Roles { get; set; }
        public DbSet<BookingModel> Bookings { get; set; }
        public DbSet<BookingDetailModel> BookingsDetails { get; set; }
        public DbSet<ReviewModel> Reviews { get; set; }
        public DbSet<CategoryModel> Categories { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BookingDetailModel>()
                .Property(b => b.Price)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<BookingModel>()
                .Property(b => b.Total)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<CategoryModel>()
                .Property(c => c.TotalPrice)
                .HasColumnType("decimal(18,2)");
        }


    }
}
