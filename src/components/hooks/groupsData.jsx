
import api from "../../utils/API";
import { useMutation, useQuery } from "@tanstack/react-query";

const searchGroup = async (searchText) => {
    if (!searchText || searchText.length < 2) return [];
    const { data } = await api.get(`/groups/search?q=${searchText}`);
    console.log(data, "data");
    return data;
};

const joinGroup = async ({ groupId, password }) => {
    if (!groupId || !password) throw new Error("Group ID and password are required");
    const { data } = await api.post(`/groups/${groupId}/join`, { password });
    return data;
};

const useGroups = (searchText) => {
    return useQuery({
        queryKey: ["searchGroup", searchText],
        queryFn: () => searchGroup(searchText),
        enabled: searchText.length > 1,
    });
};

const useJoinGroup = () => {
    return useMutation(joinGroup);
};

export { useGroups, useJoinGroup };