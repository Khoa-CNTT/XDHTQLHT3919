using Quan_Ly_HomeStay.Models.Vnpay;

namespace Quan_Ly_HomeStay.Services.Vnpay
{
    public interface IVnPayService
    {
        string CreatePaymentUrl(PaymentInformationModel model, HttpContext context);
        PaymentResponseModel PaymentExecute(IQueryCollection collections);

    }
}
