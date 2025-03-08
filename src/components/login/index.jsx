import React from "react";
import { Navigate, Link } from "react-router-dom";
import { Button, Checkbox, Form, Input, message } from "antd";
import { login } from "../../utils/API";
import "./index.scss";

const onFinish = async (values) => {
    try {
        await login(values);
        message.success({
            content: "Login successful!",
            style: { top: 20, right: 20, position: "absolute" },
        });

        window.location.reload();
    } catch (error) {
        message.error("Invalid username or password.");
    }
};
const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
};
message.config({
    top: 50,
    duration: 3,
    maxCount: 3,
});
const App = () => {

    if (localStorage.getItem("token")) {
        return <Navigate to="/" replace />;
    }

    return (
        <Form className="login-form"
            name="basic"
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                span: 16,
            }}
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                maxWidth: "100%",
                margin: "0 auto",
                backgroundColor: "#f5f5f5",


            }}
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <div className="login-form-inputs">
                <h1>Welcome back</h1>
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

                <div className="login-form-buttons">

                    <p className="login-link" >Don't have an account? <Link to="/register">Sign up</Link></p>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Login
                        </Button>
                    </Form.Item>
                </div>

            </div>


        </Form>
    );
};

export default App;
