import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Testimonials = () => {
    const [testimonialsData, setTestimonialsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await axios.get('https://localhost:7193/api/testimonials');
                setTestimonialsData(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <section className="testimonials section-padding">
            <div className="container2">
                <h2 className="section-title">Đánh giá của khách hàng</h2>
                <p className="section-subtitle">Những chia sẻ từ khách hàng đã trải nghiệm</p>
                <div className="testimonials__slider">
                    {testimonialsData.map((testimonial, index) => (
                        <div className="testimonial" key={index}>
                            <div className="testimonial__content">
                                <div className="testimonial__rating">
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                    <i className="fas fa-star"></i>
                                </div>
                                <p className="testimonial__text">"{testimonial.text}"</p>
                                <div className="testimonial__author">
                                    <img src={testimonial.avatar} alt={testimonial.author} />
                                    <div>
                                        <h4>{testimonial.author}</h4>
                                        <p>{testimonial.location}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
