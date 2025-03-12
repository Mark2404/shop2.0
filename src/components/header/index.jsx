import React, { useState } from 'react';
import { RxExit } from "react-icons/rx";
import { Modal, Input, Button, Spin } from 'antd';
import { logout } from '../../utils/API';
import useGroups from '../hooks/useGroups';
import './index.scss';

const Header = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { groups, isLoadingGroups } = useGroups(searchTerm);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [password, setPassword] = useState("");

    const openJoinModal = (group) => {
        setSelectedGroup(group);
        setIsModalOpen(true);
    };

    const handleJoinGroup = () => {
        console.log(`Joining group: ${selectedGroup.name} with password: ${password}`);
        setIsModalOpen(false);
        setPassword("");
    };

    return (
        <div className="header">
            <header>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h1>Useful Product List</h1>
                </div>

                <label>
                    <Input
                        placeholder="Search..."
                        className="input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        allowClear
                    />
                    {searchTerm.length > 0 && (
                        <div className="search-results">
                            {groups.length > 0 && !isLoadingGroups && <h3>Groups</h3>}
                            <ul>
                                {isLoadingGroups ? (
                                    <Spin className="loading" />
                                ) : groups.length > 0 ? (
                                    groups?.map((group, index) => (
                                        <li key={group.id || index + 1}>
                                            <div className="group">
                                                <div className="group-info">
                                                    <h4>{group.name}</h4>
                                                    <span>{new Date(group.createdAt).toISOString().slice(0, 19).replace('T', ' ')}</span>
                                                </div>
                                                <p>Created By: <span>{group.owner.name}</span></p>
                                            </div>
                                            <Button type="primary" className="join-btn" onClick={() => openJoinModal(group)}>
                                                Join
                                            </Button>
                                        </li>
                                    ))
                                ) : (
                                    <p className="no-results">No groups found</p>
                                )}
                            </ul>
                        </div>
                    )}
                </label>

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
                <p>Enter group password:</p>
                <Input.Password
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="primary" style={{ marginTop: 10 }} onClick={handleJoinGroup}>
                    Join Group
                </Button>
            </Modal>
        </div>
    );
};

export default Header;
