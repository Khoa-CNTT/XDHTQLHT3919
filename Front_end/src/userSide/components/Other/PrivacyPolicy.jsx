import React from 'react';
import '../../../assets/Style/Others/privacy-policy.css'; // import file CSS

const PrivacyPolicy = () => {
  return (
    <div className="privacy-container">
      <h1>Chính Sách Bảo Mật</h1>
      <p>Cập nhật lần cuối: 25/04/2025</p>

      <h2>1. Thông tin chúng tôi thu thập</h2>
      <ul>
        <li>Họ tên, email, số điện thoại</li>
        <li>Địa chỉ cư trú, hình ảnh (nếu có)</li>
        <li>Dữ liệu khi bạn sử dụng dịch vụ (IP, trình duyệt, v.v.)</li>
      </ul>

      <h2>2. Mục đích sử dụng</h2>
      <p>Chúng tôi sử dụng thông tin để cung cấp và cải thiện dịch vụ, xử lý thanh toán, hỗ trợ khách hàng và gửi thông báo.</p>

      <h2>3. Bảo mật thông tin</h2>
      <p>Thông tin của bạn được bảo mật bằng các biện pháp kỹ thuật và tổ chức phù hợp để ngăn chặn truy cập trái phép.</p>

      <h2>4. Quyền lợi người dùng</h2>
      <p>Bạn có quyền yêu cầu truy cập, chỉnh sửa hoặc xóa dữ liệu cá nhân bất cứ lúc nào.</p>

      <h2>5. Liên hệ</h2>
      <p>Nếu có bất kỳ câu hỏi nào về chính sách bảo mật, xin vui lòng liên hệ chúng tôi qua email: support@homestay.com</p>
    </div>
  );
};

export default PrivacyPolicy;
