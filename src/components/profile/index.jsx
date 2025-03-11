import React from "react";
import "./index.scss";
import { useAuth } from "../AuthContext";
import { Button, Statistic, Card, Row, Col } from "antd";
import { UserOutlined, DeleteOutlined } from "@ant-design/icons";

import axios from "axios";
const Profile = () => {
    const { user } = useAuth();
    const handleDeleteUser = async () => {
        if (!user || !user.username) {
            console.error("User data is missing!", user);
            alert("User data is unavailable.");
            return;
        }

        try {
            console.log("Deleting user:", user);
            await axios.delete(`/api/users/${user._id}`);
            alert("User deleted successfully!");

        } catch (error) {
            console.error("Error deleting user:", error.response?.data || error.message);
            alert("Failed to delete user.");
        }
    };

    if (!user) return <p className="not-authenticated">Вы не авторизованы</p>;


    return (
        <div className="profile-container">
            <Card className="profile-card">
                <div className="avatar">
                    <img src={`https://i.pravatar.cc/150?u=${user.username}`} alt="User Avatar" />
                </div>
                <p className="join-date">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <div className="user-info">
                    <h2>{user.name}</h2>
                    <p className="username">@{user.username}</p>
                </div>




                <div className="status-badge">Active</div>

                <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={handleDeleteUser}
                    className="delete-btn"
                >
                    Delete User
                </Button>
            </Card>
            <div className="stats">
                <h2>Statistics</h2>
                <Row gutter={16} className="stats-container">
                    <Col span={8}>
                        <Statistic title="Customers" value={24} prefix={<UserOutlined />} />
                    </Col>
                    <Col span={8}>
                        <Statistic title="Products" value={128} />
                    </Col>
                    <Col span={8}>
                        <Statistic title="Sales" value={560} />
                    </Col>
                </Row>
                <p> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aspernatur illo, rem laboriosam illum autem iste, nihil vel, rerum voluptatem qui repellat ipsam. Iste mollitia suscipit asperiores quaerat minus rerum et.cta. Nihil aperiam minima doloremque dolores recusandae a.</p>
            </div>
        </div>


    );
};

export default Profile;
