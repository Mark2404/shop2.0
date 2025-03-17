import { Avatar, Card, Row, Col, Spin, Button, Input, List, Modal, Select, message } from "antd";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { delMember, delGroup, leaveGroup } from "../hooks/groupsData";
import { useMember, useMyGroups, useAddMember, useLeaveGroup } from "../hooks/useGroups";

import "./index.scss";

const GroupsList = ({ currentUserId }) => {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [searchUser, setSearchUser] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const leaveGroupMutation = useLeaveGroup();
    const { myGroups, isLoadingMyGroups } = useMyGroups();
    const { members, isLoadingMember } = useMember(searchUser);
    const addMemberMutation = useAddMember();
    const removeMemberMutation = useMutation(delMember, {
        onSuccess: () => {
            queryClient.invalidateQueries(["myGroups"]);
        },
    });

    const handleAddMember = async (userId) => {
        console.log("handleAddMember called with userId:", userId); // Проверка
        if (!selectedGroup?._id || !userId) {
            message.error("Не указан ID группы или пользователя.");
            return;
        }

        try {
            await addMemberMutation.mutateAsync({ groupId: selectedGroup._id, userId });
            message.success("Пользователь добавлен.");
        } catch (error) {
            console.error("Ошибка при добавлении участника:", error);
            message.error(error.response?.data?.message || "Не удалось добавить участника.");
        }
    };

    const handleGroupAction = async (value) => {
        if (!selectedGroup?._id) {
            message.error("Group ID required!");
            return;
        }

        try {
            if (value === "leave") {
                await leaveGroupMutation.mutateAsync(selectedGroup._id);
                message.success("You have left the group.");
                setSelectedGroup(null);
                queryClient.invalidateQueries(["myGroups"]);
            } else if (value === "delete" && selectedGroup.owner?._id === currentUserId) {
                await delGroup(selectedGroup._id);
                message.success("Group deleted successfully.");
                setSelectedGroup(null);
                queryClient.invalidateQueries(["myGroups"]);
            }
        } catch (error) {
            console.error("Error handling group action:", error);
            message.error(error.message || "Failed to process group action.");
        }
    };

    const handleRemoveMember = async (memberId) => {
        if (!selectedGroup?._id || !memberId) {
            message.error("Group ID and Member ID are required!");
            return;
        }

        try {
            await removeMemberMutation.mutateAsync({ groupId: selectedGroup._id, memberId });
            message.success("Member removed successfully.");
            setSelectedGroup((prev) => ({
                ...prev,
                members: prev.members.filter((m) => m._id !== memberId),
            }));
        } catch (error) {
            console.error("Error removing member:", error);
            message.error(error.message || "Failed to remove member.");
        }
    };
    const token = localStorage.getItem("token");

    return (
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            {selectedGroup ? (
                <div style={{ width: "100%", maxWidth: "800px", display: "flex", justifyContent: "space-between", gap: "60px" }}>
                    <div style={{ flex: 1 }}>
                        <Button type="default" onClick={() => setSelectedGroup(null)} style={{ marginBottom: "10px" }}>
                            ⬅ Back to Groups
                        </Button>

                        <h3 style={{ textAlign: "center" }}>{selectedGroup.name} - Products</h3>

                        <List
                            className="product-list"
                            dataSource={selectedGroup.products || []}
                            renderItem={(product) => (
                                <List.Item key={product._id} className="product-item">
                                    <Card style={{ width: "100%" }}>
                                        <p><strong>{product.name}</strong></p>
                                        <p>Price: {product.price} UZS</p>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    </div>

                    <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <h3 style={{ textAlign: "center" }}>{selectedGroup.name} - Members</h3>
                            <Select defaultValue="" style={{ width: 150, marginBottom: 10 }} onChange={handleGroupAction}>
                                <Select.Option value="leave">Leave Group</Select.Option>
                                {selectedGroup.owner?._id === currentUserId && (
                                    <Select.Option value="delete">Delete Group</Select.Option>
                                )}
                            </Select>
                        </div>
                        <List
                            className="member-list"
                            dataSource={selectedGroup.members || []}
                            renderItem={(member) => (

                                <List.Item key={member._id} className="users-list" style={{ display: "flex", alignItems: "center" }}>
                                    <Avatar src={member.avatar} style={{ marginRight: "10px" }} />
                                    <span style={{ flexGrow: 1 }}>{member.name}</span>
                                    {selectedGroup.owner && (
                                        <Button danger size="small" onClick={() => handleRemoveMember(member._id)}>
                                            Delete
                                        </Button>
                                    )}
                                </List.Item>
                            )}
                        />

                        <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginTop: "10px", width: "100%" }}>
                            Add Member
                        </Button>

                        <Modal
                            title="Add Member"
                            visible={isModalOpen}
                            onCancel={() => setIsModalOpen(false)}
                            footer={null}
                        >
                            <Input.Search
                                placeholder="Search user by name"
                                onChange={(e) => setSearchUser(e.target.value)}
                                style={{ marginBottom: "10px" }}
                            />
                            {isLoadingMember ? (
                                <Spin />
                            ) : (
                                <List
                                    dataSource={members}
                                    renderItem={(member) => (
                                        <List.Item key={member._id}>
                                            <Avatar src={member.avatar} style={{ marginRight: "10px" }} />
                                            <span>{member.name}</span>
                                            <Button type="primary" size="small" onClick={() => handleAddMember(member._id)}>
                                                Add
                                            </Button>
                                        </List.Item>
                                    )}
                                />
                            )}
                        </Modal>
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
                                <Col xs={24} sm={12} md={8} lg={6} key={group._id} style={{ display: "flex", justifyContent: "center" }}>
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
                                            width: "100%",
                                            maxWidth: "250px",
                                        }}
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

export { GroupsList };
