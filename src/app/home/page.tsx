"use client";

import { Button } from "primereact/button";
import { useEffect, useRef, useState } from "react";
import { getHomeData } from "../api/home";
import { signOut, useSession } from "next-auth/react";
import ModalTransacao from "./components/modal-transacao";
import { deleteTransacao } from "../api/transacao";
import { Skeleton } from "primereact/skeleton";
import { MenuSidebar, MenuSidebarRef } from "../components/menu-sidebar";
import { ProgressSpinner } from "primereact/progressspinner";


export default function Home() {
  const { data:session, status } = useSession();
  const menuSidebarRef = useRef<MenuSidebarRef>(null);
  const [dadosEscondidos, setDadosEscondidos] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transacaoForm, setTransacaoForm] = useState({
    id: 0,
    descricao: "",
    valor: 0,
    tipo: "entrada",
    data: new Date().toISOString().split('T')[0],
    user_id: 0,
    categoria_id: 1
  });

  const [home, setHome] = useState({
    primeiroNome: null,
    saldoTotal: 0,
    receitas: 0,
    despesas: 0,
    transacoes: []
  });

  const atualizaHome = () => {
    setLoading(true);
    /* @ts-ignore */
    getHomeData(session?.user.id)
        .then((data) => {
          setHome({
            saldoTotal: data.saldoTotal,
            receitas: data.receitas,
            despesas: data.despesas,
            transacoes: data.transacoes,
            primeiroNome: data.primeiroNome || "Usuário"
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erro ao buscar dados da home:", error);
        }
      );
  }

  const handleModalEdicao = (transacao:any) => {
    setTransacaoForm({ 
      ...transacao,
      // @ts-ignore
      user_id: session?.user.id || 0,
      categoria_id: transacao.categoria_id || 1,
      descricao: transacao.descricao || "",
      valor: transacao.valor || 0,
      data: transacao.data || new Date().toISOString().split('T')[0] 
    });
    setModalVisible(true);
  }

  const handleDelete = (id: number) => {
    if (confirm("Você tem certeza que deseja excluir esta transação?")) {
      deleteTransacao(id)
        .then(() => {
          atualizaHome();
        })
        .catch((error) => {
          console.error("Erro ao excluir transação:", error);
        });
    }
  }

  useEffect(() => {
    /* @ts-ignore */
    if (status === "authenticated" && session?.user?.id) {
      atualizaHome();
    }
    /* @ts-ignore */
  }, [status, session?.user?.id]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <ProgressSpinner style={{width: '50px', height: '50px'}} />
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div>
      <div className="min-h-screen bg-white text-black">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-black">Home Finance</h1>
          <Button 
            icon="pi pi-bars" 
            className="p-button-text p-button-rounded"
            /* @ts-ignore */
            onClick={() => menuSidebarRef.current?.setMenuVisible(true)}
          />  
        </div>

        <MenuSidebar visible={menuVisible} ref={menuSidebarRef} />

        {/* Balance Card */}
        <div className="p-4">
          {
            loading ? 
            <Skeleton className="mb-3" width="200px" height="30px" shape="rectangle"/> :
            <h1 className="text-2xl mb-3">Olá { home.primeiroNome }</h1>
          }
          {
            loading ? 
            <Skeleton className="mb-3" width="100%" height="60px" shape="rectangle"/> :
            <div className="grid grid-cols-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="col-span-4">
                <p className="text-sm opacity-90">Saldo Total</p>
                <h2 className="text-3xl font-bold">{ (dadosEscondidos) ? "······" : home.saldoTotal }</h2>
              </div>
              <div className="flex text-right">
                <Button 
                  onClick={() => setDadosEscondidos(!dadosEscondidos)} 
                  className="mt-3"
                >
                  {dadosEscondidos ? <i className="pi pi-eye"></i> : <i className="pi pi-eye-slash"></i>}
                </Button>
              </div>
            </div>
          }
        </div>

         {
          loading ?
          <Skeleton className="mb-3" width="100%" height="50px" shape="rectangle"/> :
          <div className="mb-1 px-4 pb-4">
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
         } 

        {/* Summary Cards */}
        <div className="px-4 pb-4">
          <h3 className="text-lg font-semibold mb-3">Resumo do Mês</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-white">
              {
                loading ? 
                <Skeleton className="mb-3" width="100%" height="30px" shape="rectangle"/> :
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600 text-sm">Receitas</p>
                    <p className="text-green-600 text-xl font-bold">{(dadosEscondidos) ? "······" : home.receitas}</p>
                  </div>
                  <i className="pi pi-arrow-up text-green-500 text-xl"></i>
                </div>
              }
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-white">
              {
                loading ?
                <Skeleton className="mb-3" width="100%" height="30px" shape="rectangle"/> :
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600 text-sm">Despesas</p>
                    <p className={`text-red-600 text-xl font-bold`}>
                      {(dadosEscondidos) ? "······" : home.despesas}
                    </p>
                  </div>
                  <i className="pi pi-arrow-down text-red-500 text-xl"></i>
                </div>
              }
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="px-4 pb-6">
          <h3 className="text-lg font-semibold mb-3">Transações Recentes</h3>
          {
            loading ?
            <Skeleton className="mb-3" width="100%" height="50px" shape="rectangle"/> :  
            <div className="bg-white rounded-lg shadow-sm border border-white">
              {home.transacoes.map((item) => (
                /* @ts-ignore */
                <div key={item.id} className="p-4 border-b last:border-b-0 grid grid-cols-2 border-gray justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className="pi pi-shopping-cart text-blue-600"></i>
                    </div>
                    <div>
                      {/* @ts-ignore */}
                      <p className="font-medium">{item.descricao || 'Sem descrição'}</p>
                      {/* @ts-ignore */}
                      <p className="text-gray-500 text-sm">{item.data}</p>
                    </div>
                  </div>
                  <div>
                    {
                      (dadosEscondidos) ?
                      <p className="text-right text-lg font-bold">······</p> :
                      <div>
                        {/* @ts-ignore */}
                        <p className={`text-right text-lg font-bold ${item.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                          {/* @ts-ignore */}
                          {item.tipo === 'entrada' ? '+' : '-'} R$ {item.valor}
                        </p>
                      </div>
                    }
                    <table style={{ width: '50px', height: '50px', float: 'right' }}>
                      <tbody>
                        <tr>
                          <td>
                            <Button 
                              icon="pi pi-pencil" 
                              className="p-button-text p-button-rounded p-button-secondary"
                              onClick={() => handleModalEdicao(item)} 
                            />
                          </td>
                          <td>
                            <Button
                              /* @ts-ignore */ 
                              onClick={() => handleDelete(item.id)}
                              icon="pi pi-trash" 
                              className="p-button-text p-button-rounded p-button-danger"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      </div>
      <ModalTransacao 
        atualizaHome={atualizaHome}
        transacao={transacaoForm}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        // @ts-ignore
        user_id={ session?.user.id || 0}
        />
    </div>
  );
}
