import API from "../../utils/API";
import { useQuery } from "@tanstack/react-query";

const searchGroup = async (searchText) => {
    if (!searchText || searchText.length < 2) return [];
    const { data } = await API.get(`/groups/search?q=${searchText}`);
    return data;
}

const useGroups = (searchText) => {
    const {
        data: groups = [],
        isLoading: isLoadingGroups,
        isError: isErrorGroups,
    } = useQuery({
        queryFn: () => searchGroup(searchText),
        queryKey: searchText.length > 1 ? ["search", searchText] : ["search"],
        enabled: searchText.length > 1,
    });

    return { groups, isLoadingGroups, isErrorGroups };
}

export default useGroups;
