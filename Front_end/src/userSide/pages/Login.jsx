import { useFormik } from "formik";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Col, Container, Form, FormGroup, Row } from "reactstrap";
import * as Yup from "yup";
import { userLoginApi } from "../../redux/slices/userSlice"; // Đúng đường dẫn Redux
import Helmet from "../components/Helmet/Helmet";
import "../styles/Login.css";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Sử dụng Formik để xử lý form
    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required("Vui lòng nhập email!")
                .email("Email không hợp lệ!"),
            password: Yup.string().required("Vui lòng nhập mật khẩu!"),
        }),
        onSubmit: async (values) => {
            try {
                const response = await dispatch(userLoginApi(values)).unwrap();

                // Kiểm tra phản hồi từ API
                if (response.status === 200) {
                    localStorage.setItem("user", JSON.stringify(response.data[0]));
                    toast.success("Đăng nhập thành công!");
                    navigate("/home");
                    window.location.reload(true);
                } else {
                    toast.error("Đăng nhập thất bại! Kiểm tra lại email hoặc mật khẩu.");
                }
            } catch (error) {
                toast.error("Đăng nhập thất bại! Vui lòng thử lại.");
            }
        },
    });

    return (
        <Helmet title="Đăng nhập">
            <section>
                <Container>
                    <Row>
                        <Col lg="6" className="m-auto text-center">
                            <h3 className="fw-food fs-4" style={{ marginBottom: "20px" }}>
                                Đăng Nhập
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

                                {/* Nút Đăng Nhập */}
                                <button className="buy__btn auth__btn" type="submit">
                                    Đăng nhập
                                </button>

                                {/* Chuyển sang Đăng ký */}
                                <p>
                                    Bạn có muốn đăng ký tài khoản mới không?
                                    <Link to="/signup"> Đăng ký</Link>
                                </p>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </section>
        </Helmet>
    );
};

export default Login;
