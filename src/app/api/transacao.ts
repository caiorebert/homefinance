import api from "./api";

export const createTransacao = async (transacao: any) => {
    const response = await api.post("/transacao", transacao);
    return response.data;
}