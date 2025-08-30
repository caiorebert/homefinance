import api from './api';

export async function getCartoes(user_id: number) {
    try {
        const response = await api.get(`/cartao?user_id=${user_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function createCartao(data: any) {
    try {
        const response = await api.post('/cartao', data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function updateCartao(data: any) {
    try {
        const response = await api.put(`/cartao/${data.id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}