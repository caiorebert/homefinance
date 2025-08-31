import { signOut, useSession } from "next-auth/react";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { forwardRef, useEffect, useState, useImperativeHandle } from "react";

export type MenuSidebarRef = {
    setMenuVisible: (visible: boolean) => void;
}

export type Props = {
    visible: boolean;
};

export const MenuSidebar = forwardRef<MenuSidebarRef, Props>(({ visible = false }, ref) => {
    const { data:session, status } = useSession();
    const [menuVisible, setMenuVisible] = useState(visible);

    const defaultImage =
        "https://ui-avatars.com/api/?name=" +
        // @ts-ignore
        encodeURIComponent(session?.user?.name) +
        "&background=cccccc&color=555555&size=256";

    useImperativeHandle(ref, () => ({
        setMenuVisible: (visible: boolean) => {
            setMenuVisible(visible);
        }
    }));

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex">
            <Sidebar 
                visible={menuVisible} 
                onHide={() => setMenuVisible(false)} 
                position="right"
                className="w-72 bg-gray-900 text-gray-200 border-none"
                showCloseIcon={false}
            >
                {/* Logo */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="logo" className="w-8 h-8" />
                        <span className="text-xl font-bold text-cyan-400">Home Finance</span>
                    </div>
                    <Button 
                        icon="pi pi-times" 
                        className="p-button-rounded p-button-text text-gray-400 hover:text-black"
                        onClick={() => setMenuVisible(false)}
                    />
                </div>

                {/* FAVORITES */}
                <h4 className="text-gray-400 text-xs font-bold mb-2">SERVIÇOS</h4>
                    <ul className="space-y-3 mb-6">
                        <li
                            className="flex items-center gap-3 hover:text-black cursor-pointer"
                            onClick={() => { window.location.href = '/home'; }}>
                            {
                                window.location.pathname === '/home' ? 
                                <i className="pi pi-home" style={{color: 'var(--primary-color)'}}></i> 
                                : 
                                <i className="pi pi-home"></i>
                            } 
                            {
                                window.location.pathname === '/home' ?
                                <span className="font-bold" style={{color: 'var(--primary-color)'}}>Início</span>
                                :
                                <span>Início</span>
                            }
                        </li>
                        <li
                            className="flex items-center gap-3 hover:text-black cursor-pointer"
                            onClick={() => { window.location.href = '/cartao'; }} 
                            >
                            {
                                window.location.pathname === '/cartao' ? 
                                <i className="pi pi-credit-card" style={{color: 'var(--primary-color)'}}></i> 
                                : 
                                <i className="pi pi-credit-card"></i>
                            } 
                            {
                                window.location.pathname === '/cartao' ?
                                <span className="font-bold" style={{color: 'var(--primary-color)'}}>Cartões</span>
                                :
                                <span>Cartões</span>
                            }
                        </li>
                        <li className="flex items-center gap-3 hover:text-black cursor-pointer">
                            <i className="pi pi-chart-line"></i> Investimentos
                        </li>
                        <li
                            className="flex items-center gap-3 hover:text-black cursor-pointer"
                            onClick={() => { window.location.href = '/balanco'; }}>
                            <i className="pi pi-chart-bar"></i> Balanço
                        </li>
                        <li 
                            className="flex items-center gap-3 hover:text-black cursor-pointer"
                            onClick={() => { window.location.href = '/fixos'; }}>
                            <i className="pi pi-list"></i> Transacoes Fixas
                        </li>
                        <li className="flex items-center gap-3 hover:text-black cursor-pointer">
                            <i className="pi pi-cog"></i> Configurações
                        </li>
                    </ul>

                {/* APPLICATION */}
                {/* <h4 className="text-gray-400 text-xs font-bold mb-2">APPLICATION</h4>
                <ul className="space-y-3">
                    <li className="flex items-center gap-3 hover:text-black cursor-pointer">
                        <i className="pi pi-folder"></i> Projects
                    </li>
                    <li className="flex items-center gap-3 hover:text-black cursor-pointer">
                        <i className="pi pi-chart-bar"></i> Performance
                    </li>
                </ul> */}

                {/* User Profile */}
                <div className="absolute bottom-4 left-0 w-full px-4">
                    <div className="grid grid-cols-4">
                        <div className="flex items-center gap-3 col-span-3"> 
                            <Avatar image={defaultImage} shape="circle" />
                            <span className="font-medium">{ session?.user?.name }</span>
                        </div>
                        <div className="text-right">
                            <Button
                                icon="pi pi-sign-out"
                                style={{ float: 'right' }}
                                className="p-button-rounded p-button-text text-gray-400 hover:text-black ml-auto"
                                onClick={() => {
                                    signOut();
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Sidebar>
        </div>
    );
});

export default MenuSidebar;