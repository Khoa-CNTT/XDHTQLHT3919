import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "../../../assets/Style/home-css/contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });


  return (
    <div className="contact-wrapper">
      <div className="contact-container">
        <h1 className="contact-title">Liên hệ với chúng tôi</h1>

        <div className="contact-info">
          <div className="info-item">
            <FaMapMarkerAlt className="icon" />
            <div className="info-text">
              <h3>Địa chỉ</h3>
              <p>123 Đường ABC, Quận XYZ, Thành phố HCM</p>
            </div>
          </div>
          <div className="info-item">
            <FaPhone className="icon" />
            <div className="info-text">
              <h3>Số điện thoại</h3>
              <p>+84 123 456 789</p>
            </div>
          </div>
          <div className="info-item">
            <FaEnvelope className="icon" />
            <div className="info-text">
              <h3>Email</h3>
              <p>info@homestay.com</p>
            </div>
          </div>
        </div>

        

        <div className="map-container">
          <h2>Vị trí Homestay</h2>
          <div className="map">
          <input
              id="search-input"
              type="text"
              placeholder="Tìm kiếm địa điểm..."
              className="search-input"
            />
            <iframe
              title="homestay-map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.257801383066!2d106.69091151517915!3d10.762622159669594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752eeb239adcb7%3A0x81b2b46c5fbc7e60!2zVGFpIFRvaCwgUGjDoWkgWmFuaCwgVGhhaW5oIENoaXMgY2hhbmcsIFZo4bqvIFZpZXQsIFZpZW0gVGhpY2g!5e0!3m2!1sen!2s!4v1616700000000!5m2!1sen!2s"
              width="100%"
              height="400"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
