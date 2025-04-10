import { useFormik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Col, Container, Form, FormGroup, Row } from "reactstrap";
import * as Yup from "yup";
import { userSignupApi } from "../../redux/slices/userSlice"; // Đảm bảo đúng đường dẫn Redux
import Helmet from "../components/Helmet/Helmet";
import "../styles/Login.css"; // Sử dụng CSS đăng nhập đã có

const Signup = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Sử dụng Formik để xử lý form
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            confirmPassword: "", // Thêm xác nhận mật khẩu
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required("Vui lòng nhập email!")
                .email("Email không hợp lệ!"),
            password: Yup.string()
                .required("Vui lòng nhập mật khẩu!")
                .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
            confirmPassword: Yup.string()
                .required("Vui lòng xác nhận mật khẩu!")
                .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp!"),
        }),
        onSubmit: async (values) => {
            try {
                const response = await dispatch(userSignupApi(values)).unwrap();

                // Kiểm tra phản hồi từ API
                if (response.status === 201) {
                    toast.success("Đăng ký thành công!");
                    navigate("/login"); // Chuyển hướng đến trang đăng nhập
                } else {
                    toast.error("Đăng ký thất bại! Vui lòng thử lại.");
                }
            } catch (error) {
                toast.error("Đăng ký thất bại! Vui lòng thử lại.");
            }
        },
    });

    return (
        <Helmet title="Đăng ký">
            <section>
                <Container>
                    <Row>
                        <Col lg="6" className="m-auto text-center">
                            <h3 className="fw-food fs-4" style={{ marginBottom: "20px" }}>
                                Đăng Ký
                            </h3>
                            <Form className="auth__form" onSubmit={formik.handleSubmit}>
                                {/* Input Email */}
                                <FormGroup className="form__group">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="Nhập email của bạn"
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <p className="error-text">{formik.errors.email}</p>
                                    )}
                                </FormGroup>

                                {/* Input Password */}
                                <FormGroup className="form__group">
                                    <input
                                        type="password"
                                        name="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="Nhập mật khẩu của bạn"
                                    />
                                    {formik.touched.password && formik.errors.password && (
                                        <p className="error-text">{formik.errors.password}</p>
                                    )}
                                </FormGroup>

                                {/* Input Confirm Password */}
                                <FormGroup className="form__group">
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formik.values.confirmPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        placeholder="Xác nhận mật khẩu"
                                    />
                                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                        <p className="error-text">{formik.errors.confirmPassword}</p>
                                    )}
                                </FormGroup>

                                {/* Nút Đăng Ký */}
                                <button className="buy__btn auth__btn" type="submit">
                                    Đăng ký
                                </button>

                                {/* Chuyển sang Đăng nhập */}
                                <p>
                                    Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                                </p>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </section>
        </Helmet>
    );
};

export default Signup;
