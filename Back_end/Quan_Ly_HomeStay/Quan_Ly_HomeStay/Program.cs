using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json.Serialization;
using Quan_Ly_HomeStay.Data;
using Swashbuckle.AspNetCore.Filters; // Thêm namespace của DbContext

var builder = WebApplication.CreateBuilder(args);

// Cấu hình JWT Authentication
builder.Services.AddAuthentication("Bearer") // Thêm "Bearer" vào để chỉ định sử dụng Bearer token
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true, // Kiểm tra tính hợp lệ của khóa ký
            ValidateAudience = false, // Không cần kiểm tra Audience
            ValidateIssuer = false, // Không cần kiểm tra Issuer
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                builder.Configuration.GetSection("AppSettings:Token").Value!)) // Khóa bí mật từ appsettings.json
        };
    });

// Cấu hình JSON options để bỏ qua vòng lặp trong các liên kết
builder.Services.AddControllers().AddJsonOptions(x =>
    x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles); // Tránh vòng lặp trong đối tượng liên kết

// Thêm Swagger cho API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        BearerFormat = "JWT", // Định dạng token là JWT
        Description = "Enter 'Bearer' followed by your token"
    });
    options.OperationFilter<SecurityRequirementsOperationFilter>(); // Áp dụng filter Swagger để yêu cầu Authorization Header
});

// Cấu hình DbContext với SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.EnableRetryOnFailure())
);

// Thêm CORS để cho phép kết nối từ React App (localhost:3000)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000") // Cho phép React truy cập
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Cấu hình văn hóa mặc định cho ứng dụng
var cultureInfo = new System.Globalization.CultureInfo("en-US");
System.Globalization.CultureInfo.DefaultThreadCurrentCulture = cultureInfo;
System.Globalization.CultureInfo.DefaultThreadCurrentUICulture = cultureInfo;

// Thiết lập middleware cho Swagger (nếu đang phát triển)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection(); // Bắt buộc sử dụng HTTPS

app.UseAuthentication(); // Kích hoạt Authentication
app.UseAuthorization(); // Kích hoạt Authorization

// Cấu hình CORS
app.UseCors("AllowReactApp");

// Bản đồ các controller
app.MapControllers();

app.Run();
