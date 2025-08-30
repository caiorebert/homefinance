"use client";

import { Button } from "primereact/button";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Skeleton } from "primereact/skeleton";
import { MenuSidebar, MenuSidebarRef } from "../components/menu-sidebar";
import { ProgressSpinner } from "primereact/progressspinner";
import { Accordion, AccordionTab } from "primereact/accordion";
import { getBalanco } from "../api/balanco";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { getTransacoesFixas } from "../api/transacao";


export default function Home() {
  const { data:session, status } = useSession();
  const menuSidebarRef = useRef<MenuSidebarRef>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [balanco, setBalanco] = useState({});

  const [showAddModal, setShowAddModal] = useState(false);	
  const [gastosFixos, setGastosFixos] = useState([]);
  const [novoGasto, setNovoGasto] = useState<any>({
    descricao: "",
    categoria: "",
    valor: 0
  });

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      /*@ts-ignore*/
      getTransacoesFixas(session?.conta.id)
        .then((data) => {
          console.log(data);
          setGastosFixos(data);
        }
      ).catch((error) => {
        console.error("Erro ao buscar gastos fixos:", error);
      }
      );
    }
  }, [status]);

  const handleSalvarGasto = () => {
    /*@ts-ignore*/
    setGastosFixos([...gastosFixos, novoGasto]);
    setNovoGasto({descricao: "", categoria: "", valor: 0});
    setShowAddModal(false);
  }

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
            {/* Gastos Fixos */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Gastos Fixos</h2>
                <Button 
                  label="Adicionar" 
                  icon="pi pi-plus" 
                  className="p-button-sm"
                  onClick={() => setShowAddModal(true)}
                />
              </div>
              
              <div className="space-y-2">
                {gastosFixos.length > 0 ? (
                  gastosFixos.map((gasto, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        { /*@ts-ignore*/}
                        <span className="font-medium">{gasto.descricao}</span>
                        { /*@ts-ignore*/}
                        <p className="text-sm text-gray-600">{gasto.categoria}</p>
                      </div>
                      { /*@ts-ignore*/}
                      <span className={`font-semibold ${(gasto.tipo == "entrada") ? 'text-green-600' : 'text-red-600'}`}>
                        { /*@ts-ignore*/}
                        R$ {gasto.valor}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Nenhum gasto fixo cadastrado</p>
                )}
              </div>
            </div>

            {/* Modal para adicionar gasto fixo */}
            <Dialog 
              header="Adicionar Gasto Fixo" 
              visible={showAddModal} 
              onHide={() => setShowAddModal(false)}
              style={{ width: '400px' }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Descrição</label>
                  <InputText 
                    value={novoGasto.descricao}
                    onChange={(e) => setNovoGasto({...novoGasto, descricao: e.target.value})}
                    className="w-full"
                    placeholder="Ex: Aluguel"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Categoria</label>
                  <InputText 
                    value={novoGasto.categoria}
                    onChange={(e) => setNovoGasto({...novoGasto, categoria: e.target.value})}
                    className="w-full"
                    placeholder="Ex: Moradia"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Valor</label>
                  <InputNumber 
                    value={novoGasto.valor}
                    onValueChange={(e) => setNovoGasto({...novoGasto, valor: e.value || 0})}
                    mode="currency" 
                    currency="BRL" 
                    locale="pt-BR"
                    className="w-full"
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    label="Cancelar" 
                    className="p-button-text"
                    onClick={() => setShowAddModal(false)}
                  />
                  <Button 
                    label="Salvar" 
                    onClick={handleSalvarGasto}
                    disabled={!novoGasto.descricao || !novoGasto.valor}
                  />
                </div>
              </div>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
