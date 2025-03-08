import React from "react";
import { Button, Form, Input, message } from "antd";
import { Link } from "react-router-dom";
import { register } from "../../utils/API";

const Register = () => {
    if (localStorage.getItem("token")) {
        return <Navigate to="/" replace />;
    }
    const onFinish = async (values) => {
        try {
            await register(values);
            message.success("Registration successful! You can now log in.");
            console.log("Registration Response:", response);
        } catch (error) {
            console.error("Registration Error:", error.response?.data || error.message);
            message.error("Registration failed. Try again.");
        }
    };

    return (
        <Form
            name="register-form"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600, margin: "auto", marginTop: "50px" }}
            onFinish={onFinish}
            autoComplete="off"
        >
            <Form.Item
                label="name"
                name="name"
                rules={[{ required: true, message: "Please enter your name!" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="username"
                name="username"
                rules={[{ required: true, message: "Please enter a valid username" }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter your password!" }]}
            >
                <Input.Password />
            </Form.Item>
            <p>Already have an account? <Link to="/login">Login</Link></p>

            <Form.Item>
                <Button type="primary" htmlType="submit">Register</Button>
            </Form.Item>
        </Form>
    );
};

export default Register;
