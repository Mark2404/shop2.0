import { useState, useEffect } from "react";
import axios from "axios";
import api from "../../utils/API";

const useGroups = (query) => {
    const [groups, setGroups] = useState([]);
    const [isLoadingGroups, setIsLoadingGroups] = useState(false);
    const [isErrorGroups, setIsErrorGroups] = useState(null);

    useEffect(() => {
        if (!query) {
            setGroups([]);
            return;
        }

        const fetchGroups = async () => {
            setIsLoadingGroups(true);
            setIsErrorGroups(null);

            try {
                const response = await api.get(`/groups/search?q=${query}`);
                setGroups(response.data);
            } catch (error) {
                setIsErrorGroups(error);
            } finally {
                setIsLoadingGroups(false);
            }
        };

        const delayDebounceFn = setTimeout(fetchGroups, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    return { groups, isLoadingGroups, isErrorGroups };
};

export default useGroups;