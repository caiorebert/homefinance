"use client";

import { Button } from "primereact/button";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Skeleton } from "primereact/skeleton";
import { MenuSidebar, MenuSidebarRef } from "../components/menu-sidebar";
import { ProgressSpinner } from "primereact/progressspinner";
import { Accordion, AccordionTab } from "primereact/accordion";
import { getBalanco } from "../api/balanco";


export default function Home() {
  const { data:session, status } = useSession();
  const menuSidebarRef = useRef<MenuSidebarRef>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [balanco, setBalanco] = useState({});

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      { /* @ts-ignore */ }
      getBalanco(session?.user.id, new Date().getMonth() + 1, new Date().getFullYear())
        .then((data) => {
          setBalanco(data);
        }
      ).catch((error) => {
        console.error("Erro ao buscar balanço:", error);
      }
      );
    }
  }, [status]);

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
          <h1 className="text-xl font-bold text-black">Balanço</h1>
          <Button 
            icon="pi pi-bars" 
            className="p-button-text p-button-rounded"
            /* @ts-ignore */
            onClick={() => menuSidebarRef.current?.setMenuVisible(true)}
          />  
        </div>

        <MenuSidebar visible={menuVisible} ref={menuSidebarRef} />

        <div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <h2 className="text-lg font-bold mb-4 col-span-2">Resumo do mês</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 shadow-sm col-span-2 md:col-span-1 mb-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-green-800 text-sm font-medium uppercase tracking-wide">
                    Valor em Conta
                  </h3>
                  <p className="text-2xl font-bold text-green-900 mt-2">
                    { /* @ts-ignore */ }
                    {balanco?.conta?.saldo ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balanco.conta.saldo) : 'R$ 0,00'}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <i className="pi pi-wallet text-green-600 text-2xl"></i>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <i className="pi pi-arrow-up text-green-600 text-sm mr-1"></i>
                <span className="text-green-600 text-sm font-medium">
                  +5.2% em relação ao mês anterior
                </span>
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm col-span-2 md:col-span-1 mb-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-red-800 text-sm font-medium uppercase tracking-wide">
                    Gastos do Mês
                  </h3>
                  <p className="text-2xl font-bold text-red-900 mt-2">
                    { /* @ts-ignore */ }
                    { balanco?.gastos }
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <i className="pi pi-credit-card text-red-600 text-2xl"></i>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <i className="pi pi-arrow-up text-red-600 text-sm mr-1"></i>
                <span className="text-red-600 text-sm font-medium">
                  +12.5% em relação ao mês anterior
                </span>
              </div>
            </div>
            <div className="col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-sm">
              <h6>Resumo líquido</h6>
              <p className="text-lg font-bold text-blue-900 mt-2">
                { /* @ts-ignore */ }
                { balanco.saldo }
              </p>
              <h6>Principais lançamentos do mês:</h6>
              <div className="mt-2 space-y-2">
                {
                  /*@ts-ignore*/
                  Array.isArray(balanco?.lancamentos) ?
                  /*@ts-ignore*/
                  balanco?.lancamentos?.map((lancamento: any) => (
                    <div key={lancamento.id} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                      <div>
                        <p className="font-medium">{ lancamento.descricao || "Sem descrição" }</p>
                        <p className="text-sm text-gray-500">{ lancamento.data } - { lancamento.categoria }</p>
                      </div>
                      <div className={ lancamento.tipo === 'entrada' ? "text-green-600 font-bold" : "text-red-600 font-bold" }>
                        { lancamento.tipo === 'entrada' ? '+' : '-' } { new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lancamento.valor) }
                      </div>
                    </div>
                  ))
                  :
                  null
                }
              </div>
            </div>
          </div>
          {/* <div className="p-4">
            <h6>Resumo líquido:</h6>
            <Accordion activeIndex={0} className="grid grid-cols-1 gap-2">
              {
                [1,2,3].map((item) => (
                  <AccordionTab header={accordionHeaderTemplate} key={item}>
                    <div>
                      <p className="font-bold">Balanço do Mês</p>
                      <p className="text-sm text-gray-500">Junho 2024</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
                        <h4 className="text-green-800 text-sm font-medium uppercase tracking-wide">
                          Entradas
                        </h4>
                        <p className="text-lg font-bold text-green-900 mt-2">
                          R$ 3.500,00
                        </p>
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
                        <h4 className="text-red-800 text-sm font-medium uppercase tracking-wide">
                          Saídas
                        </h4>
                        <p className="text-lg font-bold text-red-900 mt-2">
                          R$ 2.900,00
                        </p>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm col-span-2">
                        <h4 className="text-blue-800 text-sm font-medium uppercase tracking-wide">
                          Total Líquido
                        </h4>
                        <p className="text-lg font-bold text-blue-900 mt-2">
                          R$ 600,00
                        </p>
                      </div>
                    </div>
                  </AccordionTab>
                ))
              }
            </Accordion>
          </div> */}
        </div>
      </div>
    </div>
  );
}
