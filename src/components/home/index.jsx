import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../profile";
import Groups from "../groups";
import { UserOutlined, TeamOutlined, FileOutlined } from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";

const { Header, Content, Footer, Sider } = Layout;

const getItem = (label, key, icon) => ({ key, icon, label });

const items = [
    getItem("Profile", "1", <UserOutlined />),
    getItem("Groups", "2", <TeamOutlined />),
    getItem("Files", "3", <FileOutlined />),
];

const Home = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedKey, setSelectedKey] = useState("1");
    const navigate = useNavigate();


    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/login");
        }
    }, [navigate]);

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const renderContent = () => {
        switch (selectedKey) {
            case "1":
                return <Profile />;
            case "2":
                return <Groups />;
            default:
                return <p>Select a menu item</p>;
        }
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    defaultSelectedKeys={["1"]}
                    mode="inline"
                    items={items}
                    onClick={(e) => setSelectedKey(e.key)}
                />
            </Sider>
            <Layout>
                {/* custom header */}
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
        </Layout>
    );
};

export default Home;
