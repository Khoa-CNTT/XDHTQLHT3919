using Microsoft.Extensions.Configuration;
using Quan_Ly_HomeStay.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;

namespace Quan_Ly_HomeStay.Services
{
    public interface IVnpayService
    {
        string CreatePaymentUrl(Booking order, string ipAddr);
        bool ValidateSignature(IDictionary<string, string> queryParams);
    }

    public class VnpayService : IVnpayService
    {
        private readonly IConfiguration _configuration;

        public VnpayService(IConfiguration configuration)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public string CreatePaymentUrl(Booking order, string ipAddr)
        {
            var baseUrl = _configuration["VnPaySettings:BaseUrl"];
            var vnpTmnCode = _configuration["VnPaySettings:TmnCode"];
            var vnpHashSecret = _configuration["VnPaySettings:HashSecret"];
            var returnUrl = _configuration["VnPaySettings:ReturnUrl"];

            var requestData = new SortedDictionary<string, string>
            {
                { "vnp_Version", "2.1.0" },
                { "vnp_Command", "pay" },
                { "vnp_TmnCode", vnpTmnCode },
                { "vnp_Amount", ((int)(order.Total * 100)).ToString() },
                { "vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss") },
                { "vnp_CurrCode", "VND" },
                { "vnp_IpAddr", ipAddr },
                { "vnp_Locale", "vn" },
                { "vnp_OrderInfo", $"Thanh toán đơn hàng {order.IdBooking}" },
                { "vnp_OrderType", "other" },
                { "vnp_ReturnUrl", returnUrl },
                { "vnp_TxnRef", order.IdBooking.ToString() }
            };

            string queryString = string.Join("&", requestData.Select(kvp =>
                $"{WebUtility.UrlEncode(kvp.Key)}={WebUtility.UrlEncode(kvp.Value)}"));

            string secureHash = VnpayUtils.HmacSha512(vnpHashSecret, queryString);
            queryString += $"&vnp_SecureHash={secureHash}";

            return $"{baseUrl}?{queryString}";
        }

        public bool ValidateSignature(IDictionary<string, string> queryParams)
        {
            if (!queryParams.TryGetValue("vnp_SecureHash", out string receivedHash))
                return false;

            var secretKey = _configuration["VnPaySettings:HashSecret"];
            if (string.IsNullOrEmpty(secretKey))
                return false;

            var sortedParams = queryParams
                .Where(kvp => kvp.Key.StartsWith("vnp_") && kvp.Key != "vnp_SecureHash" && kvp.Key != "vnp_SecureHashType")
                .OrderBy(kvp => kvp.Key)
                .Select(kvp => $"{WebUtility.UrlEncode(kvp.Key)}={WebUtility.UrlEncode(kvp.Value)}");

            var rawData = string.Join("&", sortedParams);
            var computedHash = VnpayUtils.HmacSha512(secretKey, rawData).ToUpper();

            return string.Equals(receivedHash.ToUpper(), computedHash, StringComparison.OrdinalIgnoreCase);
        }
    }

    public static class VnpayUtils
    {
        public static string HmacSha512(string key, string data)
        {
            using (var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(key)))
            {
                var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
                return BitConverter.ToString(hash).Replace("-", "").ToLower();
            }
        }
    }
}
