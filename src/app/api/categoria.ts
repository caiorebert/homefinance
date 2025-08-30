import api from "./api";

export const getCategorias = async () => {
    try {
        const response = await api.get('/categoria');
        return response;
    } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        throw error;
    }
}

export const createCategoria = async (categoria: any) => {
    try {
        const response = await api.post('/categoria', categoria);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar categoria: ", error);
        throw error;
    }
}