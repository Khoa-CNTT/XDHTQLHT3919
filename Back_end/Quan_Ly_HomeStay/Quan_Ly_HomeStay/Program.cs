using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json.Serialization;
using Quan_Ly_HomeStay.Data;
using Swashbuckle.AspNetCore.Filters;
using Quan_Ly_HomeStay.Services;
using Quan_Ly_HomeStay.Settings;



var builder = WebApplication.CreateBuilder(args);

// Cấu hình JWT Authentication
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

builder.Services.AddAuthorization();

// Đăng ký các dịch vụ email với tên rõ ràng để tránh xung đột
builder.Services.AddTransient<EmailService>(); // Dịch vụ chính cho thanh toán
builder.Services.AddTransient<EmailService>();
builder.Services.Configure<VnPaySettings>(builder.Configuration.GetSection("VnPaySettings"));
builder.Services.AddScoped<IVnpayService, VnpayService>();


builder.Services.AddSingleton<IConfiguration>(builder.Configuration);

// Đăng ký VnpayService
builder.Services.AddScoped<VnpayService>();

// Cấu hình JSON options để bỏ qua vòng lặp trong các liên kết
builder.Services.AddControllers().AddJsonOptions(x =>
                x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

// Thêm Swagger cho API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    options.OperationFilter<SecurityRequirementsOperationFilter>();
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
            policy.WithOrigins("http://localhost:3000")
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

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseCors("AllowReactApp");
app.UseStaticFiles();

app.MapControllers();

app.Run();