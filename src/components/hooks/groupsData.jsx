import api from "../../utils/API";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";



export const createGroup = async ({ name, password }) => {
    if (!name || !password) throw new Error("Group name and password required");
    const { data } = await api.post("/groups", { name, password });
    return data;
};


const useDeleteGroup = () => {
    const queryClient = useQueryClient();
    return useMutation(deleteGroup, {
        onSuccess: () => {
            queryClient.invalidateQueries(["myGroups"]);
        },
    });
};
const searchGroup = async (searchText) => {
    if (!searchText || searchText.length < 2) return [];
    const { data } = await api.get(`/groups/search?q=${searchText}`);
    return data;
};

const useGroups = (searchText) => {
    return useQuery({
        queryKey: ["searchGroup", searchText],
        queryFn: () => searchGroup(searchText),
        enabled: searchText.length > 1,
    });
};


const joinGroup = async ({ groupId, password }) => {
    if (!groupId || !password) throw new Error("Group ID and password are required");
    const { data } = await api.post(`/groups/${groupId}/join`, { password });
    return data;
};


const useJoinGroup = () => {
    return useMutation({
        mutationFn: joinGroup,
    });
};
const delMember = async ({ groupId, memberId }) => {
    if (!groupId || !memberId) throw new Error("Group ID and Member ID are required");
    const { data } = await api.delete(`/groups/${groupId}/members/${memberId}`);
    return data;
};

const delGroup = async (groupId) => {
    if (!groupId) throw new Error("Group ID required");
    const { data } = await api.delete(`/groups/${groupId}`);
    return data;
};

const deleteMember = async ({ groupId, memberId }) => {
    if (!groupId || !memberId) throw new Error("Group ID and Member ID are required");
    const { data } = await api.post(`/groups/${groupId}/members/${memberId}`);
    return data;
};
const useDeleteMember = () => {
    const queryClient = useQueryClient();
    return useMutation(deleteMember, {
        onSuccess: () => {
            queryClient.invalidateQueries(["myGroups"]);
        },
    });
};


const leaveGroup = async (groupId) => {
    if (!groupId) throw new Error("Guruh IDsi kerak");
    const { data } = await api.post(`/groups/${groupId}/leave`);
    return data;
};


export { useGroups, useJoinGroup, delMember, delGroup, useDeleteGroup, useDeleteMember, leaveGroup };
