import { createTransacao, updateTransacao } from "@/app/api/transacao";
import { error } from "console";
import { useSession } from "next-auth/react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";

type ModalTransacaoProps = {
    id?: number;
    atualizaHome: () => void;
    visible: boolean;
    onClose: () => void;
    user_id?: number;
    transacao?: any;
};


export default function ModalTransacao({ atualizaHome, visible = false, onClose, user_id, transacao }: ModalTransacaoProps) {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const [transacaoForm, setTransacaoForm] = useState({
        id: 0,
        descricao: "",
        valor: 0,
        tipo: "entrada",
        data: new Date().toISOString().split('T')[0],
        user_id: user_id,
        categoria_id: 1
    });

    const handleFormTransacao = (e: any) => {
        setLoading(true);
        e.preventDefault();
        // @ts-ignore
        if (!session?.user.id) {
            console.error("Usuário não autenticado");
            setLoading(false);
            return;
        }
        // @ts-ignore
        setTransacaoForm({ ...transacaoForm, user_id: session?.user.id });
        if (transacao.id) {
            updateTransacao(transacaoForm)
                .then(() => {
                    setLoading(false);
                    onClose();
                    atualizaHome();
                })
                .catch((error) => {
                    setLoading(false);
                    console.error("Erro ao atualizar transação:", error);
                });
        } else {
            createTransacao(transacaoForm)
                .then(() => {
                    setLoading(false);
                    onClose();
                    atualizaHome()
                })
                .catch((error) => {
                    setLoading(false);
                    console.error("Erro ao criar transação:", error);
                });
        }
    }

    const limpaForm = () => {
        setTransacaoForm({
            id: 0,
            descricao: "",
            valor: 0,
            tipo: "entrada",
            data: new Date().toISOString().split('T')[0],
            user_id: user_id,
            categoria_id: 1
        });
    };

    useEffect(() => {
        if (transacao.id) {
            setTransacaoForm({
                ...transacao,
                valor: parseFloat(transacao.valor),
                descricao: transacao.descricao,
                data: transacao.data.split('T')[0],
                tipo: transacao.tipo,
            });
        }
    }, [transacao]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <Dialog
            visible={visible}
            modal
            onHide={() => { onClose(); limpaForm() } }
            content={({ hide }) => (
            <div className="grid grid-rows px-10 py-10 gap-4 w-full" style={{ borderRadius: '12px', backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))' }}>
                <h2 className="text-lg font-semibold mb-4">Adicionar Movimentação</h2>
                <form>
                <div className="mb-4">
                    <label
                    className="block text-sm font-medium mb-2">
                    Descrição
                    </label>
                    <input
                    value={transacaoForm.descricao}
                    /* @ts-ignore */
                    onInput={(e) => setTransacaoForm({ ...transacaoForm, descricao: e.target.value })}
                    type="text" className="p-inputtext p-component w-full" />
                </div>
                <div className="mb-4">
                    <label
                    className="block text-sm font-medium mb-2">
                    Data
                    </label>
                    <input
                    value={transacaoForm.data}
                    /* @ts-ignore */
                    onInput={(e) => setTransacaoForm({ ...transacaoForm, data: e.target.value })}
                    type="date" className="p-inputtext p-component w-full" />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Tipo</label>
                    <select 
                    value={transacaoForm.tipo}
                    className="p-inputtext p-component w-full"
                    onChange={(e) => setTransacaoForm({ ...transacaoForm, tipo: e.target.value })}>
                    <option value="entrada">Entrada</option>
                    <option value="saída">Saída</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Valor</label>
                    <input
                    value={transacaoForm.valor}
                    type="number"
                    className="p-inputtext p-component w-full"
                    /* @ts-ignore */
                    onInput={(e) => setTransacaoForm({ ...transacaoForm, valor: parseFloat(e.target.value) })}
                    />
                </div>
                <div className="flex justify-end">
                    <Button disabled={loading} label="Cancelar" onClick={(e) => hide(e)} className="p-button-text mr-2" />
                    <Button disabled={loading} label={(loading) ? 'Carregando...' : 'Salvar'} onClick={(e) => { handleFormTransacao(e) }} />
                </div>
                </form>
            </div>
            )}
        ></Dialog>
    )
}