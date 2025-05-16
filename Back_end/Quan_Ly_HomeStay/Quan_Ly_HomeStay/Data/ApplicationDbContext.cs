using Microsoft.EntityFrameworkCore;
using Quan_Ly_HomeStay.Models;

namespace Quan_Ly_HomeStay.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // Đăng ký DbSet cho tất cả model
        public DbSet<User> Users { get; set; }
   
        public DbSet<AmenityModel> Amenities { get; set; }
        public DbSet<Image> Images { get; set; }

        public DbSet<Role> Roles { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<BookingDetail> BookingDetails { get; set; }
        public DbSet<BookingDetailService> BookingDetailServices { get; set; } // <--- thiếu BookingDetailService nè
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<UserService> UserServices { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Cấu hình decimal chuẩn (tối ưu tiền tệ)
            modelBuilder.Entity<BookingDetail>()
                .Property(b => b.TotalPrice)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Booking>()
                .Property(b => b.Total)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<Service>()
                .Property(s => s.Price)
                .HasColumnType("decimal(18,2)");

            // Cấu hình quan hệ User - Role (1 Role nhiều User)
            modelBuilder.Entity<User>()
                .HasOne(u => u.IdRoleNavigation)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.IdRole)
                .OnDelete(DeleteBehavior.Restrict);

            // Cấu hình quan hệ User - Service (n-n) qua bảng trung gian UserService
            modelBuilder.Entity<UserService>()
                .HasKey(us => new { us.IdUser, us.IdService });

            modelBuilder.Entity<UserService>()
                .HasOne(us => us.User)
                .WithMany(u => u.UserServices)
                .HasForeignKey(us => us.IdUser);

            // Cấu hình quan hệ Booking - BookingDetail (1 Booking nhiều BookingDetail)
            modelBuilder.Entity<BookingDetail>()
                .HasOne(bd => bd.IdBookingNavigation)
                .WithMany(b => b.BookingDetails)
                .HasForeignKey(bd => bd.IdBooking)
                .OnDelete(DeleteBehavior.Cascade);

            // Cấu hình quan hệ BookingDetail - Room (nhiều BookingDetail cho 1 Room)
            modelBuilder.Entity<BookingDetail>()
                .HasOne(bd => bd.IdRoomNavigation)
                .WithMany(r => r.BookingDetails)
                .HasForeignKey(bd => bd.IdRoom)
                .OnDelete(DeleteBehavior.Restrict);

            // Cấu hình quan hệ BookingDetail - Service (n-n) qua bảng BookingDetailService
            modelBuilder.Entity<BookingDetailService>()
                .HasKey(bds => new { bds.BookingDetailId, bds.ServiceId });

            modelBuilder.Entity<BookingDetailService>()
                .HasOne(bds => bds.BookingDetail)
                .WithMany(bd => bd.BookingDetailServices)
                .HasForeignKey(bds => bds.BookingDetailId);

            modelBuilder.Entity<BookingDetailService>()
                .HasOne(bds => bds.Service)
                .WithMany(s => s.BookingDetailServices)
                .HasForeignKey(bds => bds.ServiceId);
            modelBuilder.Entity<Room>()
                .HasMany(r => r.Amenities)
                .WithMany(a => a.Rooms)
                .UsingEntity<Dictionary<string, object>>(
                         "RoomAmenity",
                     j => j.HasOne<AmenityModel>().WithMany().HasForeignKey("AmenityId"),
                     j => j.HasOne<Room>().WithMany().HasForeignKey("RoomId")
                );
            modelBuilder.Entity<Review>()
     .HasMany(r => r.Replies)
     .WithOne(r => r.ParentReview)
     .HasForeignKey(r => r.ParentReviewId)
     .OnDelete(DeleteBehavior.Restrict);
        }
    }

}
