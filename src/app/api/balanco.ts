import api from "./api";

export async function getBalanco(user_id: number, month: number, year: number) {
    try {
        const response = await api.post(`/balanco`, {
            user_id,
            month,
            year
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar balanço:", error);
        throw error;
    }
}