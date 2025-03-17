import React, { useState } from "react";
import { RxExit } from "react-icons/rx";
import { Modal, Input, Button, message, Spin } from "antd";
import { logout } from "../../utils/API";
import { useGroups, useJoinGroup } from "../hooks/groupsData";
import "./index.scss";

const Header = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [password, setPassword] = useState("");
    const { data: groups = [], isLoading: isGroupsLoading, isError: isGroupsError } = useGroups(searchTerm);
    const { mutate: joinGroup, isLoading: isJoinLoading, isError: isJoinError, error: joinError } = useJoinGroup();
    const handleJoin = () => {
        if (!selectedGroup?._id) {
            message.error("Group ID is missing!");
            return;
        }
        if (!password) {
            message.warning("Please enter a password.");
            return;
        }

        joinGroup(
            { groupId: selectedGroup._id, password },
            {
                onSuccess: () => {
                    message.success(`Successfully joined ${selectedGroup.name}!`);
                    setPassword("");
                    setSelectedGroup(null);
                    setIsModalOpen(false);
                },
                onError: (err) => {
                    message.error(err.response?.data?.error || "Failed to join the group.");
                },
            }
        );
    };


    const openJoinModal = (group) => {
        setSelectedGroup(group);
        setIsModalOpen(true);
    };

    return (
        <div className="header">
            <header>
                <h1>Useful Product List</h1>
                <div>
                    <Input
                        placeholder="Search groups..."
                        className="input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        allowClear
                    />
                    {isGroupsLoading ? (
                        <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>

                        </div>


                    ) : isGroupsError ? (
                        <p className="error">Error loading groups</p>
                    ) : Array.isArray(groups) && groups.length > 0 ? (
                        <ul className="groups-list">
                            {groups.map((group) => (
                                <li key={group._id}>
                                    <div className="group">
                                        <h4>{group.name}</h4>

                                        <Button
                                            type="primary"
                                            style={{ marginTop: 10 }}
                                            onClick={() => openJoinModal(group)}
                                        >
                                            Join
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : searchTerm.trim() ? (
                        <p className="no-results">No groups found</p>
                    ) : null}
                </div>

                <div className="exit-box" onClick={logout}>
                    <p>Log out</p>
                    <RxExit className="exit-icon" />
                </div>
            </header>

            <Modal
                title={`Join ${selectedGroup?.name}`}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                className="custom-modal"
            >
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                    }}
                    placeholder="Enter group password"
                />
                <Button
                    type="primary"
                    style={{
                        backgroundColor: "green",
                        color: "white",
                        width: "100%",
                        marginTop: "10px",
                    }}
                    onClick={handleJoin}
                    disabled={isJoinLoading}
                >
                    {isJoinLoading ? "Joining..." : "Join"}
                </Button>
                {isJoinError && <p className="error">{joinError?.message || "Failed to join"}</p>}
            </Modal>
        </div>
    );
};

export default Header;
