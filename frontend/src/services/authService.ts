import apiService from "../utils/apiService";

const login = async(username: string, password: string) => {
    try {
        const data = {username, password};
        const response = await apiService.post('/user/login', data);
        return response;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
}

const register = async(name: string, username: string, password: string) => {
    try {
        const data = {name, username, password};
        const response = await apiService.post('/user/register', data);
        return response;
    } catch (error) {
        console.error('Error during register:', error);
        throw error;
    }
}

export default { login, register }