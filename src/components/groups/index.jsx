import React, { useState } from "react";
import { Modal, Button, Input, List, Avatar } from "antd";
import "./index.scss";
import { useAuth } from "../AuthContext";
import axios from "axios";

const Index = () => {
    const [groupName, setGroupName] = useState("");
    const [searchUser, setSearchUser] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("");
    const { user } = useAuth();

    const [groups, setGroups] = useState([
        { id: 1, name: "apple" },
        { id: 2, name: "tuf gaming" },
    ]);

    const [groupMembers, setGroupMembers] = useState([
        { id: 1, name: "John Doe", avatar: "https://i.pravatar.cc/40?img=1" },
        { id: 2, name: "Jane Smith", avatar: "https://i.pravatar.cc/40?img=2" },
    ]);

    const openModal = (type) => {
        setModalType(type);
        setIsModalOpen(true);
    };

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
        <div className="container">

            <div className="column">
                <h3>Groups</h3>
                <div className="input-row">
                    <Input
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Enter group name"
                    />
                    <Button type="primary" onClick={() => openModal("group")}>
                        Add
                    </Button>
                </div>

                <List
                    className="group-list"
                    dataSource={groups}
                    renderItem={(group) => (
                        <List.Item>
                            {group.name}
                            <Button type="primary" style={{ marginLeft: "auto" }}>Купить</Button>
                        </List.Item>
                    )}
                />
            </div>

            <div className="column">
                <h3>{user.name}'s group members</h3>
                <div className="input-row">
                    <Input
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                        placeholder="Search users"
                    />
                    <Button type="primary" onClick={() => openModal("user")}>
                        Add
                    </Button>
                </div>

                <List
                    className="member-list"
                    dataSource={groupMembers}
                    renderItem={(member) => (
                        <List.Item>
                            <Avatar src={member.avatar} />
                            <span>{member.name}</span>
                        </List.Item>
                    )}
                />
            </div>

            <Modal
                title={
                    modalType === "user"
                        ? "Добавить участника"
                        : modalType === "group"
                            ? "Добавить группу"
                            : "Добавить товар"
                }
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                className="custom-modal"
            >
                <p>
                    {modalType === "user"
                        ? "Введите данные участника"
                        : modalType === "group"
                            ? "Введите название группы"
                            : "Введите данные товара"}
                </p>
                <Input
                    placeholder={
                        modalType === "user"
                            ? "Имя участника"
                            : modalType === "group"
                                ? "Название группы"
                                : "Название товара"
                    }
                />
                <Button type="primary" style={{ marginTop: 10 }}>
                    {modalType === "user" ? "Добавить участника" : "Добавить"}
                </Button>
            </Modal>
        </div>
    );
};

export default Index;