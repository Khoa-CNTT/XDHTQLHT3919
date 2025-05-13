using Microsoft.AspNetCore.Mvc;
using Quan_Ly_HomeStay.Models;
using Quan_Ly_HomeStay.Services;
using System.Collections.Generic;
using System.Linq;

namespace Quan_Ly_HomeStay.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IVnpayService _vnpayService;

        public PaymentController(IVnpayService vnpayService)
        {
            _vnpayService = vnpayService;
        }

        // ✅ Tạo URL thanh toán
        [HttpPost("create-payment")]
        public IActionResult CreatePaymentUrl([FromBody] Booking booking)
        {
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
            var paymentUrl = _vnpayService.CreatePaymentUrl(booking, ip);
            return Ok(new { url = paymentUrl });
        }

        // ✅ Nhận phản hồi từ VNPay (returnUrl)
        [HttpGet("return-payment")]
        public IActionResult ReturnPayment()
        {
            var queryParams = HttpContext.Request.Query
                .ToDictionary(kvp => kvp.Key, kvp => kvp.Value.ToString());

            var isValidSignature = _vnpayService.ValidateSignature(queryParams);

            if (!isValidSignature)
                return BadRequest(new { message = "Chữ ký không hợp lệ." });

            var responseCode = queryParams.ContainsKey("vnp_ResponseCode") ? queryParams["vnp_ResponseCode"] : null;

            if (responseCode == "00")
            {
                return Ok(new { message = "Thanh toán thành công!", data = queryParams });
            }

            return Ok(new { message = "Thanh toán thất bại hoặc bị hủy.", data = queryParams });
        }
    }
}
