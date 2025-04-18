using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Quan_Ly_HomeStay.Models.Vnpay;
using Quan_Ly_HomeStay.Services.Vnpay;

public class PaymentController : Controller
{

    private readonly IVnPayService _vnPayService;
    public PaymentController(IVnPayService vnPayService)
    {

        _vnPayService = vnPayService;
    }

    public IActionResult CreatePaymentUrlVnpay(PaymentInformationModel model)
    {
        var url = _vnPayService.CreatePaymentUrl(model, HttpContext);

        return Redirect(url);
    }
    [HttpGet]
    public IActionResult PaymentCallbackVnpay()
    {
        var response = _vnPayService.PaymentExecute(Request.Query);

        return Json(response);
    }


}
