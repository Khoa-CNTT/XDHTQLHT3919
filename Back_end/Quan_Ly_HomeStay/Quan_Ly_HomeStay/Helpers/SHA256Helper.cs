using System.Security.Cryptography;
using System.Text;

namespace Quan_Ly_HomeStay.Helpers
{
    public static class SHA256Helper
    {
        public static string Encrypt(string input)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(input));
                StringBuilder builder = new StringBuilder();
                foreach (byte b in bytes)
                    builder.Append(b.ToString("x2"));
                return builder.ToString();
            }
        }
    }
}
