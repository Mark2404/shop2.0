import axios from "axios";

const API_URL = "https://nt-shopping-list.onrender.com";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`
        localStorage.setItem("token", token);
    } else {
        delete api.defaults.headers.common["Authorization"];
        localStorage.removeItem("token");
    }

};

export const login = async (credentials) => {
    try {
        const response = await api.post("/api/auth", credentials);
        setAuthToken(response.data.token);
        return response.data;
    } catch (error) {
        console.error("Login Error:", error.response?.data || error.message);
        throw error;
    }
};
export const register = async (userData) => {
    try {
        const response = await api.post("/api/users", userData);
        return response.data;
    } catch (error) {
        console.error("Registration Error:", error.response?.data || error.message);
        throw error;
    }
};

export const logout = () => {
    setAuthToken(null);
    window.location.reload();
};
export default api