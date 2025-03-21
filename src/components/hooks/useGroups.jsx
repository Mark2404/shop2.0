import api from "../../utils/API";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";



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

const useGroups = (searchText) => {
    const isSearchEnabled = searchText.length > 2;

    const {
        data: groups = [],
        isLoading,
        isError,
        isFetching
    } = useQuery({
        queryFn: () => searchGroup(searchText),
        queryKey: isSearchEnabled ? ["searchGroup", searchText] : ["allGroups"],
        enabled: isSearchEnabled,
    });

    return {
        groups,
        isLoadingGroups: isSearchEnabled ? isLoading || isFetching : false,
        isErrorGroups: isError
    };
};


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
const leaveGroup = async (groupId) => {
    const { data } = await api.post(`/groups/${groupId}/leave`);
    return data;
};

const useLeaveGroup = () => {
    const queryClient = useQueryClient();
    return useMutation(leaveGroup, {
        onSuccess: () => {
            queryClient.invalidateQueries(["myGroups"]);
        },
    });
};


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

        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Токен отсутствует! Необходимо авторизоваться.");
        }


        const response = await api.post(
            `/groups/${groupId}/members`,
            { memberId },
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": token
                },
            }
        );
        console.log("API Response:", response.data);
        return response.data;
    });
};

export {
    useGroups,
    useMember,
    useMyGroups,
    useLeaveGroup
};
