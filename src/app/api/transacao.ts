import api from "./api";

export const createTransacao = async (transacao: any) => {
    const response = await api.post("/transacao", transacao);
    return response.data;
}

export const updateTransacao = async (transacao: any) => {
    const response = await api.put(`/transacao/${transacao.id}`, transacao);
    return response.data;
}

export const deleteTransacao = async (id: number) => {
    const response = await api.delete(`/transacao/${id}`);
    return response.data;
}