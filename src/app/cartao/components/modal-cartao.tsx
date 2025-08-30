
import { getCategorias } from "@/app/api/categoria";
import { createCartao, updateCartao } from "@/app/api/cartao";
import { useSession } from "next-auth/react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";

type ModalCartaoProps = {
    id?: number;
    visible: boolean;
    onClose: () => void;
    user_id?: number;
};


export default function ModalCartao({ visible = false, onClose, user_id }: ModalCartaoProps) {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const [cartaoForm, setCartaoForm] = useState({
        id: 0,
        user_id: user_id,
        nome: "",
        saldo: "",
        limite: ""
    });
    const [categorias, setCategorias] = useState([]);

    const handleFormCartao = (e: any) => {
        setLoading(true);
        e.preventDefault();
        // @ts-ignore
        if (!session?.user.id) {
            console.error("Usuário não autenticado");
            setLoading(false);
            return;
        }

        if (cartaoForm.id) {
            updateCartao(cartaoForm)
                .then(() => {
                    limpaForm();
                    setLoading(false);
                    onClose();
                })
                .catch((error) => {
                    setLoading(false);
                    console.error("Erro ao atualizar cartão:", error);
                });
        } else {
            createCartao(cartaoForm)
                .then(() => {
                    limpaForm();
                    setLoading(false);
                    onClose();
                })
                .catch((error) => {
                    setLoading(false);
                    console.error("Erro ao criar cartão:", error);
                });
        }
    }

    const limpaForm = () => {
        setCartaoForm({
            id: 0,
            user_id: user_id,
            nome: "",
            limite: "",
            saldo: ""
        });
    };

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <Dialog
            visible={visible}
            modal
            onHide={() => { onClose(); limpaForm() } }
            content={({ hide }) => (
            <div className="grid grid-rows w-96 p-5" style={{ borderRadius: '12px', backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))' }}>
                <h2 className="text-lg font-semibold mb-4">Adicionar Cartão</h2>
                <form className="w-full">
                    <div className="mb-4">
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="nome">
                            Nome
                        </label>
                        <input
                            className="shadow bg-white text-black appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="nome"
                            type="text"
                            placeholder="Nome do cartão"
                            value={cartaoForm.nome}
                            onChange={(e) => setCartaoForm({ ...cartaoForm, nome: e.target.value })}
                        />
                        <label className="block text-white text-sm font-bold mb-2 mt-4" htmlFor="limite">
                            Limite
                        </label>
                        <input
                            className="shadow bg-white text-black appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="limite"
                            type="number"
                            placeholder="Limite do cartão"
                            value={cartaoForm.limite}
                            onChange={(e) => setCartaoForm({ ...cartaoForm, limite: e.target.value })}
                        />
                        <label className="block text-white text-sm font-bold mb-2 mt-4" htmlFor="saldo">
                            Saldo Utilizado
                        </label>
                        <input
                            className="shadow bg-white text-black appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="saldo"
                            type="number"
                            placeholder="Saldo utilizado"
                            value={cartaoForm.saldo}
                            onChange={(e) => setCartaoForm({ ...cartaoForm, saldo: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2">
                        <Button disabled={loading} label="Cancelar" onClick={(e) => hide(e)} className="mr-5" severity="secondary" />
                        <Button disabled={loading} label={(loading) ? 'Carregando...' : 'Salvar'} onClick={(e) => { handleFormCartao(e) }} />
                    </div>
                </form>
            </div>
            )}
        ></Dialog>
    )
}