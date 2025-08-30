"use client";

import { Button } from "primereact/button";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Skeleton } from "primereact/skeleton";
import { MenuSidebar, MenuSidebarRef } from "../components/menu-sidebar";
import { Carousel } from "primereact/carousel";
import ModalCartao from "./components/modal-cartao";


export default function Home() {
  const { data:session, status } = useSession();
  const [menuVisible, setMenuVisible] = useState(false);
  const menuSidebarRef = useRef<MenuSidebarRef>(null);
  const [modalCartaoVisible, setModalCartaoVisible] = useState(false);

  const cartoes:any[] = [];

  const templateCartao = (cartao: any) => {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg p-6 w-72 h-40 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold">{cartao.nome}</h2>
          <p className="text-sm">{cartao.numero}</p>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs">Validade</p>
            <p className="text-sm">{cartao.validade}</p>
          </div>
          <div>
            <p className="text-xs">Titular</p>
            <p className="text-sm">{cartao.titular}</p>
          </div>
          <div>
            <p className="text-xs">Saldo</p>
            <p className="text-sm">{cartao.saldo}</p>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="min-h-screen bg-white text-black">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-black">Seus cartões</h1>
          <Button 
            icon="pi pi-bars" 
            className="p-button-text p-button-rounded"
            /* @ts-ignore */
            onClick={() => menuSidebarRef.current?.setMenuVisible(true)}
          />  
        </div>

        <MenuSidebar visible={menuVisible} ref={menuSidebarRef} />
        
        <div className="mt-4">
          {
            (cartoes.length === 0) ?
            <div>
              <div className="flex justify-center p-4">
                <div
                  style={{cursor: 'pointer'}}
                  className="bg-gray-100 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg shadow-sm p-6 w-72 h-40 flex flex-col justify-center items-center"
                  onClick={() => setModalCartaoVisible(true)}
                  >
                  <i className="pi pi-credit-card text-4xl mb-2"></i>
                  <p className="text-lg font-medium">Nenhum cartão cadastrado</p>
                  <p className="text-sm text-center">Adicione seu primeiro cartão para começar</p>
                </div>
              </div>
            </div>
            :
            <Carousel value={cartoes} numVisible={1} numScroll={1} className="custom-carousel"
              itemTemplate={templateCartao} />
          }
        </div>

        <div className="mt-4">
          <h6 className="ml-2">Lançamentos</h6>
          {
            (cartoes.length > 0) ?
            [1,2,3,4,5].map((item) => (
              <div key={item} className="p-4 border-b border-gray-200">
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold">Compra Supermercado</p>
                    <p className="text-sm text-gray-500">Cartão de Crédito</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-500">- R$ 150,00</p>
                    <p className="text-sm text-gray-500">12/06/2024</p>
                  </div>
                </div>
              </div>
            ))
            :
            <div className="p-4">
              <p className="text-gray-500">Adicione um cartão para ver suas movimentações</p>
            </div>
          }
        </div>
      </div>
      <ModalCartao 
        visible={modalCartaoVisible}
        onClose={() => setModalCartaoVisible(false)}
        // @ts-ignore
        user_id={session?.user?.id}
      />
    </div>
  );
}
