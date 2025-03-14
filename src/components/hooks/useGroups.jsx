import api from "../../utils/API";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { message, Modal, Card, List, Avatar } from "antd";
import { useState } from "react";

const fetchGroups = async () => {
    const { data } = await api.get("/groups");
    return data;
};

const fetchGroupById = async (groupId) => {
    if (!groupId) throw new Error("Group ID is required");
    const { data } = await api.get(`/groups/${groupId}`);
    return data;
};

const useGroups = () => {
    return useQuery({
        queryKey: ["groups"],
        queryFn: fetchGroups,
    });
};

const useGroupDetails = (groupId) => {
    return useQuery({
        queryKey: ["group", groupId],
        queryFn: () => fetchGroupById(groupId),
        enabled: !!groupId,
    });
};

const GroupsList = () => {
    const { data: groups = [], isLoading } = useGroups();
    const [selectedGroupId, setSelectedGroupId] = useState(null);
    const { data: selectedGroup } = useGroupDetails(selectedGroupId);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (groupId) => {
        setSelectedGroupId(groupId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedGroupId(null);
    };

    return (
        <div>
            <h3>Your Groups</h3>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="group-cards">
                    {groups.map((group) => (
                        <Card key={group.id} title={group.name} onClick={() => openModal(group.id)}>
                            <p>Owner: {group.owner?.name || "Unknown"}</p>
                            <p>Members: {group.members?.length || 0}</p>
                        </Card>
                    ))}
                </div>
            )}

            <Modal title={selectedGroup?.name} open={isModalOpen} onCancel={closeModal} footer={null}>
                <h4>Owner:</h4>
                {selectedGroup?.owner ? (
                    <List.Item>
                        <Avatar src={selectedGroup.owner.avatar} />
                        <span>{selectedGroup.owner.name}</span>
                    </List.Item>
                ) : (
                    <p>No owner data</p>
                )}

                <h4>Members:</h4>
                <List
                    dataSource={selectedGroup?.members || []}
                    renderItem={(member) => (
                        <List.Item>
                            <Avatar src={member.avatar} />
                            <span>{member.name}</span>
                        </List.Item>
                    )}
                />
            </Modal>
        </div>
    );
};

export { useGroups, useGroupDetails, GroupsList };