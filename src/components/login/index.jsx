import React from "react";
import { Navigate, Link } from "react-router-dom"; // Import Navigate
import { Button, Checkbox, Form, Input, message } from "antd";
import { login } from "../../utils/API";

const onFinish = async (values) => {
    try {
        await login(values);
        message.success("Login successful!");
        window.location.reload();
    } catch (error) {
        message.error("Invalid username or password.");
    }
};
const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
};
const App = () => {

    if (localStorage.getItem("token")) {
        return <Navigate to="/" replace />;
    }

    return (
        <Form
            name="basic"
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                span: 16,
            }}
            style={{
                maxWidth: 600,
                margin: "auto",
                marginTop: "50px",
            }}
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item
                label="Username"
                name="username"
                rules={[
                    {
                        required: true,
                        message: "Please input your username!",
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[
                    {
                        required: true,
                        message: "Please input your password!",
                    },
                ]}
            >
                <Input.Password />
            </Form.Item>
            <Link to="/register">Don't have an account? </Link>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Login
                </Button>
            </Form.Item>
        </Form>
    );
};

export default App;
