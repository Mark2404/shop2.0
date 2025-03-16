import api from "../../utils/API";
import { useMutation, useQuery } from "@tanstack/react-query";





const joinGroupRequest = async ({ groupId, password }) => {
    if (!groupId || !password) throw new Error("Group ID and password are required");
    const { data } = await api.post(`/groups/${groupId}/join`, { password });
    return data;
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

export { useGroups, useJoinGroup };
