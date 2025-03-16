import api from "../../utils/API";
import { useMutation, useQuery } from "@tanstack/react-query";



const searchGroup = async (searchText) => {
    if (!searchText || searchText.length < 2) return [];
    const { data } = await api.get(`/groups/search?q=${searchText}`);
    return data;
}

const searchMember = async (searchText) => {
    if (!searchText || searchText.length < 2) return [];
    const { data } = await api.get(`/users/search?q=${searchText}`);
    return data;
}



const fetchMyGroups = async () => {
    const { data } = await api.get("/groups");
    return data;
};


const leaveGroup = async (groupId) => {
    if (!groupId) throw new Error("Guruh IDsi kerak");
    const { data } = await api.post(`/groups/${groupId}/leave`);
    return data;
};


const useGroups = (searchText) => {
    const {
        data: groups = [],
        isLoading: isLoadingGroups,
        isError: isErrorGroups,
    } = useQuery({
        queryFn: () => searchGroup(searchText),
        queryKey: searchText.length > 1 ? ["searchGroup", searchText] : ["searchGroup"],
        enabled: searchText.length > 1,
    });
    return { groups, isLoadingGroups, isErrorGroups };
}


const useMember = (searchText) => {
    const {
        data: members = [],
        isLoading: isLoadingMember,
        isError: isErrorMember,
    } = useQuery({
        queryFn: () => searchMember(searchText),
        queryKey: searchText.length > 1 ? ["searchMember", searchText] : ["searchMember"],
        enabled: searchText.length > 1,
    });
    return { members, isLoadingMember, isErrorMember };
}


const useMyGroups = () => {
    const {
        data: myGroups = [],
        isLoading: isLoadingMyGroups,
        refetch
    } = useQuery({
        queryFn: fetchMyGroups,
        queryKey: ["myGroups"],
    });

    return { myGroups, isLoadingMyGroups, refetch };
};
export const useAddMember = () => {
    return useMutation(async ({ groupId, memberId }) => {
        const response = await api.post(`/groups/${groupId}/members`, { memberId });

        console.log("API Response:", response);
        return response.data;
    });
};

export {
    useGroups,
    useMember,

    useMyGroups


};
