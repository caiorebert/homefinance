import api from './api';

export const getHomeData = async (user_id: number) => {
    try {
        const response = await api.post('/home', { user_id: user_id });
        return response.data;
    } catch (error) {
        console.error('Error fetching home data:', error);
        throw error;
    }
};