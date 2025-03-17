import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroup } from "../hooks/groupsData";
import { UserOutlined, TeamOutlined, PlusOutlined } from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, Button, theme, Modal, Input, message } from "antd";
import { FaShopify } from "react-icons/fa";
import Header from "../header";
import Profile from "../profile";
import { GroupsList } from "../groupsList";
const { Content, Sider } = Layout;

const getItem = (label, key, icon) => ({ key, icon, label });

const items = [
    getItem("Profile", "1", <UserOutlined />),
    getItem("Groups", "2", <TeamOutlined />),
];

const Home = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState("1");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [groupPassword, setGroupPassword] = useState("");
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        }
    }, [navigate]);

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const createGroupMutation = useMutation({
        mutationFn: createGroup,
        onSuccess: () => {
            message.success("Group created successfully!");
            setIsModalOpen(false);
            setGroupName("");
            setGroupPassword("");
            queryClient.invalidateQueries(["groups"]);
        },
        onError: (error) => {
            console.error("Error creating group:", error);
            message.error("Failed to create group. Please try again.");
        },
    });

    const handleAddGroup = () => {
        setIsModalOpen(true);
    };

    const handleCreateGroup = () => {
        if (!groupName || !groupPassword) {
            message.warning("Please fill in all fields.");
            return;
        }
        createGroupMutation.mutate({ name: groupName, password: groupPassword });
    };

    const renderContent = () => {
        switch (selectedKey) {
            case "1":
                return <Profile />;
            case "2":
                return <GroupsList />
                    ;
            default:
                return <p>Select a menu item</p>;
        }
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", width: "100%", height: "40px", backgroundColor: "#1677FF", marginBottom: "20px" }}>
                    <FaShopify style={{ color: "white", width: "30px", height: "30px" }} />
                </div>
                <Menu
                    theme="dark"
                    defaultSelectedKeys={["1"]}
                    mode="inline"
                    items={items}
                    onClick={(e) => setSelectedKey(e.key)}
                />
                <div style={{ padding: "10px", textAlign: "center" }}>
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAddGroup} style={{ width: "100%" }}>
                        Add Group
                    </Button>
                </div>
            </Sider>
            <Layout>
                <Header></Header>
                <Content style={{ margin: "0 16px" }}>
                    <Breadcrumb style={{ margin: "16px 0" }}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>{selectedKey === "1" ? "Profile" : "Groups"}</Breadcrumb.Item>
                    </Breadcrumb>
                    <div style={{ padding: 24, minHeight: 360, background: colorBgContainer, borderRadius: borderRadiusLG }}>
                        {renderContent()}
                    </div>
                </Content>
            </Layout>
            <Modal
                title="Create Group"
                open={isModalOpen}
                onOk={handleCreateGroup}
                onCancel={() => setIsModalOpen(false)}
            >
                <Input
                    placeholder="Group Name"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    style={{ marginBottom: "10px" }}
                />
                <Input
                    placeholder="Password"
                    type="password"
                    value={groupPassword}
                    onChange={(e) => setGroupPassword(e.target.value)}
                />
            </Modal>
        </Layout>
    );
};

export default Home;
