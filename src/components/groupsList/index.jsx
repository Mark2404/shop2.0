import api from "../../utils/API";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Card, Row, Col, Spin, Button, Input, List } from "antd";
import { useState } from "react";

const fetchGroups = async () => {
    const { data } = await api.get("/groups");
    return data;
};

const useGroups = () => {
    return useQuery({
        queryKey: ["groups"],
        queryFn: fetchGroups,
    });
};

const GroupsList = () => {
    const { data: groups = [], isLoading } = useGroups();
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupName, setGroupName] = useState("");
    const [searchUser, setSearchUser] = useState("");

    return (
        <div style={{ padding: "20px" }}>
            {selectedGroup ? (
                <div className="container">
                    <Button type="default" onClick={() => setSelectedGroup(null)} style={{ marginBottom: "10px" }}>
                        ⬅ Back to Groups
                    </Button>

                    <div className="column">
                        <h3>Groups</h3>
                        <div className="input-row">
                            <Input
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                placeholder="Enter group name"
                            />
                            <Button type="primary">Add</Button>
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
                        <h3>{selectedGroup.name} - Members</h3>
                        <div className="input-row">
                            <Input
                                value={searchUser}
                                onChange={(e) => setSearchUser(e.target.value)}
                                placeholder="Search users"
                            />
                            <Button type="primary">Add</Button>
                        </div>

                        <List
                            className="member-list"
                            dataSource={selectedGroup.members}
                            renderItem={(member) => (
                                <List.Item className="users-list">
                                    <Avatar src={member.avatar} />
                                    <span>{member.name}</span>
                                    <Button type="primary">Add</Button>
                                </List.Item>
                            )}
                        />
                    </div>
                </div>
            ) : (
                <>
                    <h3 style={{ marginBottom: "20px" }}>Your Groups</h3>
                    {isLoading ? (
                        <Spin size="large" />
                    ) : (
                        <Row gutter={[16, 16]}>
                            {groups.map((group) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={group.id}>
                                    <Card
                                        hoverable
                                        onClick={() => setSelectedGroup(group)}
                                        title={group.name}
                                        cover={<Avatar size={64} src={group.owner?.avatar} style={{ margin: "10px auto" }} />}
                                        style={{
                                            textAlign: "center",
                                            border: "1px solid #ddd",
                                            borderRadius: "10px",
                                            transition: "all 0.3s",
                                            cursor: "pointer",
                                        }}
                                        bodyStyle={{ padding: "10px" }}
                                    >
                                        <p><strong>Owner:</strong> {group.owner?.name || "Unknown"}</p>
                                        <p><strong>Members:</strong> {group.members?.length || 0}</p>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </>
            )}
        </div>
    );
};

export { useGroups, GroupsList };
