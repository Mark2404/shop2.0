import { useState } from "react";

import api from "../../utils/API";

const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const searchUsers = async (query) => {
        if (!query) {
            setUsers([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/api/users/search`, {
                params: { q: query }
            });
            setUsers(response.data);
        } catch (err) {
            setError(err.message || "Ошибка при поиске пользователей");
        } finally {
            setLoading(false);
        }
    };

    return { users, loading, error, searchUsers };
};

export default useUsers;
