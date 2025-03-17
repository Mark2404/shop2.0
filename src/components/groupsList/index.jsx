import { Avatar, Card, Row, Col, Spin, Button, Input, List, Modal, Select, message } from "antd";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { delMember, leaveGroup, delGroup } from "../hooks/groupsData";
import { useMember, useMyGroups, useAddMember } from "../hooks/useGroups";
import { useParams } from "react-router-dom";
import "./index.scss";

const GroupsList = () => {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [searchUser, setSearchUser] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { myGroups, isLoadingMyGroups } = useMyGroups();
    const { members, isLoadingMember } = useMember(searchUser);
    const addMemberMutation = useAddMember();
    const removeMemberMutation = useMutation(delMember);
    const { id } = useParams();

    const handleGroupAction = async (value) => {
        if (!selectedGroup?.id) {
            message.error("Group ID required!");
            return;
        }

        try {
            if (value === "leave") {
                await leaveGroup(selectedGroup.id);
                message.success("You have left the group.");
                setSelectedGroup(null);
            } else if (value === "delete" && selectedGroup.owner) {
                await delGroup(selectedGroup.id);
                message.success("Group deleted successfully.");
                setSelectedGroup(null);
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

        console.log("Removing member:", memberId, "from group:", selectedGroup._id);

        try {
            await removeMemberMutation.mutateAsync({ groupId: selectedGroup._id, memberId });
            message.success("Member removed successfully.");
            setSelectedGroup({
                ...selectedGroup,
                members: selectedGroup.members.filter(m => m._id !== memberId)
            });
        } catch (error) {
            console.error("Error removing member:", error);
            message.error(error.message || "Failed to remove member.");
        }
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
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <h3 style={{ textAlign: "center" }}>{selectedGroup.name} - Members</h3>
                            <Select defaultValue="" style={{ width: 150, marginBottom: 10 }} onChange={handleGroupAction}>
                                <Select.Option value="leave">Leave Group</Select.Option>
                                {selectedGroup.owner && <Select.Option value="delete">Delete Group</Select.Option>}
                            </Select>
                        </div>
                        <List
                            className="member-list"
                            dataSource={selectedGroup.members || []}
                            renderItem={(member) => (
                                console.log(member),
                                <List.Item key={member._id} className="users-list" style={{ display: "flex", alignItems: "center" }}>
                                    <Avatar src={member.avatar} style={{ marginRight: "10px" }} />
                                    <span style={{ flexGrow: 1 }}>{member.name}</span>
                                    {selectedGroup.owner && (
                                        <Button danger size="small" onClick={() => handleRemoveMember(member._id)}>
                                            Remove
                                        </Button>
                                    )}
                                </List.Item>
                            )}
                        />

                        <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginTop: "10px", width: "100%" }}>
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
