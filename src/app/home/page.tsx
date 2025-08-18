"use client";

import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { useEffect, useRef, useState } from "react";
import { getHomeData } from "../api/home";
import { signOut, useSession } from "next-auth/react";
import { Dialog } from "primereact/dialog";
import { createTransacao } from "../api/transacao";

export default function Home() {
  const { data:session, status } = useSession();
  const menuRight = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [transacaoForm, setTransacaoForm] = useState({
    descricao: "",
    valor: 0,
    tipo: "entrada",
    data: new Date().toISOString().split('T')[0],
    user_id: 0,
    categoria_id: 1
  });
    const items = [
        {
          label: "Login",
          icon: "pi pi-user",
        },
        {
          label: "Registre-se",
          icon: "pi pi-user-plus",
        },
        {
          label: "Sair",
          icon: "pi pi-sign-out",
          command: () => {
            signOut({ callbackUrl: '/' });
          }
        }
    ];

  const [home, setHome] = useState({
    saldoTotal: 0,
    receitas: 0,
    despesas: 0,
    transacoes: []
  });

  const handleFormTransacao = (e: any) => {
    e.preventDefault();
    console.log(session);
    
    createTransacao(transacaoForm)
      .then(() => {
        setModalVisible(false);
        atualizaHome();
      })
      .catch((error) => {
        console.error("Erro ao criar transação:", error);
      });
  }

  const atualizaHome = () => {
    getHomeData(session?.user.id)
        .then((data) => {
          setTransacaoForm({
            ...transacaoForm,
            user_id: session?.user.id,
          });
          setHome({
            saldoTotal: data.saldoTotal,
            receitas: data.receitas,
            despesas: data.despesas,
            transacoes: data.transacoes
          });
        })
        .catch((error) => {
          console.error("Erro ao buscar dados da home:", error);
        }
      );
  }

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      atualizaHome();
    }
  }, [status, session?.user?.id]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    )
  } 
  
  return (
    <div>
      <div className="min-h-screen bg-black">
        {/* Header */}
        <div className="bg-black shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Home Finance</h1>
          <Button 
            icon="pi pi-bars" 
            className="p-button-text p-button-rounded"
            onClick={(event) => menuRight.current?.toggle(event)}
          />
          <Menu model={items} popup ref={menuRight} />
        </div>

        {/* Balance Card */}
        <div className="p-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
            <p className="text-sm opacity-90">Saldo Total</p>
            <h2 className="text-3xl font-bold">{ home.saldoTotal }</h2>
            <p className="text-sm opacity-90 mt-1">+5,2% este mês</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 pb-4">
          <h3 className="text-lg font-semibold mb-3">Ações Rápidas</h3>
          <div className="grid grid-cols-1">
            <Button 
              label="Adicionar Movimentação"
              onClick={() => setModalVisible(true)} 
              icon="pi pi-plus" 
              className="p-button-secondary p-3"
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="px-4 pb-4">
          <h3 className="text-lg font-semibold mb-3">Resumo do Mês</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600 text-sm">Receitas</p>
                  <p className="text-green-600 text-xl font-bold">{home.receitas}</p>
                </div>
                <i className="pi pi-arrow-up text-green-500 text-xl"></i>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-600 text-sm">Despesas</p>
                  <p className="text-red-600 text-xl font-bold">{home.despesas}</p>
                </div>
                <i className="pi pi-arrow-down text-red-500 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="px-4 pb-6">
          <h3 className="text-lg font-semibold mb-3">Transações Recentes</h3>
          <div className="bg-black rounded-lg shadow-sm border">
            {home.transacoes.map((item) => (
              <div key={item.id} className="p-4 border-b last:border-b-0 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="pi pi-shopping-cart text-blue-600"></i>
                  </div>
                  <div>
                    <p className="font-medium">{item.descricao || 'Sem descrição'}</p>
                    <p className="text-gray-500 text-sm">{item.data}</p>
                  </div>
                </div>
                <p className={`text-lg font-bold ${item.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                  {item.tipo === 'entrada' ? '+' : '-'} R$ {item.valor}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Dialog
        visible={modalVisible}
        modal
        onHide={() => { setModalVisible(false); }}
        content={({ hide }) => (
          <div className="flex px-8 py-5 gap-4" style={{ borderRadius: '12px', backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))' }}>
            <h2 className="text-lg font-semibold mb-4">Adicionar Movimentação</h2>
            <form>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2">
                  Descrição
                </label>
                <input
                  onInput={(e) => setTransacaoForm({ ...transacaoForm, descricao: e.target.value })}
                  type="text" className="p-inputtext p-component w-full" />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium mb-2">
                  Data
                </label>
                <input
                  onInput={(e) => setTransacaoForm({ ...transacaoForm, data: e.target.value })}
                  type="date" className="p-inputtext p-component w-full" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Tipo</label>
                <select 
                  className="p-inputtext p-component w-full"
                  onChange={(e) => setTransacaoForm({ ...transacaoForm, tipo: e.target.value })}>
                  <option value="entrada">Entrada</option>
                  <option value="saída">Saída</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Valor</label>
                <input
                  type="number"
                  className="p-inputtext p-component w-full"
                  onInput={(e) => setTransacaoForm({ ...transacaoForm, valor: parseFloat(e.target.value) })}
                  />
              </div>
              <div className="flex justify-end">
                <Button label="Cancelar" onClick={(e) => hide(e)} className="p-button-text mr-2" />
                <Button label="Salvar" onClick={(e) => { handleFormTransacao(e) }} />
              </div>
            </form>
          </div>
        )}
    ></Dialog>
    </div>
  );
}
