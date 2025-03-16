import { Avatar, Card, Row, Col, Spin, Button, Input, List, Modal } from "antd";
import { useState } from "react";
import { useMember, useMyGroups, useAddMember } from "../hooks/useGroups";
import "./index.scss";

const GroupsList = () => {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [searchUser, setSearchUser] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { myGroups, isLoadingMyGroups } = useMyGroups();
    const { members, isLoadingMember } = useMember(searchUser);
    const addMemberMutation = useAddMember();

    const showAddMemberModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSearchUser("");
    };

    return (
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {selectedGroup ? (
                <div style={{ width: "100%", maxWidth: "800px", display: "flex", gap: "20px" }}>
                    <div style={{ flex: 1 }}>
                        <Button type="default" onClick={() => setSelectedGroup(null)} style={{ marginBottom: "10px" }}>
                            ⬅ Back to Groups
                        </Button>
                        <h3 style={{ textAlign: "center" }}>{selectedGroup.name} - Products</h3>
                        <List
                            className="product-list"
                            dataSource={selectedGroup.products || []}
                            renderItem={(product) => (
                                <List.Item key={product.id} className="product-item">
                                    <Card style={{ width: "100%" }}>
                                        <p><strong>{product.name}</strong></p>
                                        <p>Price: {product.price} UZS</p>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ textAlign: "center" }}>{selectedGroup.name} - Members</h3>
                        <List
                            className="member-list"
                            dataSource={selectedGroup.members || []}
                            renderItem={(member) => (
                                <List.Item key={member.id} className="users-list" style={{ display: "flex", alignItems: "center" }}>
                                    <Avatar src={member.avatar} style={{ marginRight: "10px" }} />
                                    <span>{member.name}</span>
                                </List.Item>
                            )}
                        />
                        <Button type="primary" onClick={showAddMemberModal} style={{ marginTop: "10px", width: "100%" }}>
                            Add Member
                        </Button>
                    </div>
                </div>
            ) : (
                <>
                    <h3 style={{ marginBottom: "20px", textAlign: "center" }}>Your Groups</h3>
                    {isLoadingMyGroups ? (
                        <Spin size="large" />
                    ) : (
                        <Row gutter={[16, 16]} style={{ width: "100%" }} justify="center">
                            {myGroups.map((group) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={group.id} style={{ display: "flex", justifyContent: "center" }}>
                                    <Card
                                        hoverable
                                        onClick={() => setSelectedGroup(group)}
                                        title={group.name}
                                        cover={<Avatar size={64} src={group.owner?.avatar} style={{ margin: "10px auto" }} />}
                                        style={{ textAlign: "center", border: "1px solid #ddd", borderRadius: "10px", transition: "all 0.3s", cursor: "pointer", width: "100%", maxWidth: "250px" }}
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

            <Modal title="Add Member" open={isModalOpen} onCancel={handleCancel} footer={null} centered>
                <Input
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    placeholder="Search users"
                    style={{ marginBottom: "10px" }}
                />
                {isLoadingMember ? (
                    <Spin size="large" />
                ) : (
                    <List
                        className="search-member-list"
                        dataSource={members}
                        renderItem={(member) => (
                            <List.Item key={member.id} className="users-list" style={{ display: "flex", alignItems: "center" }}>
                                <Avatar src={member.avatar} style={{ marginRight: "10px" }} />
                                <span style={{ flexGrow: 1 }}>{member.name}</span>
                                <Button
                                    type="primary"
                                    loading={addMemberMutation.isPending}
                                    onClick={async () => {
                                        console.log("Attempting to add member...");
                                        console.log("Group ID:", selectedGroup?.id, "Member ID:", member.id);
                                        try {
                                            const res = await addMemberMutation.mutateAsync({
                                                groupId: selectedGroup.id,
                                                memberId: member.id,
                                            });
                                            console.log("Add member response:", res);
                                            message.success("Member added successfully!");
                                        } catch (error) {
                                            console.error("Error adding member:", error);
                                            message.error(error.response?.data?.message || "Failed to add member.");
                                        }
                                    }}
                                >
                                    Add
                                </Button>
                            </List.Item>
                        )}
                    />
                )}
            </Modal>
        </div>
    );
};

export { GroupsList };
