"use client";

import { Button } from "primereact/button";
import { useRef, useState } from "react";
import { signIn } from "next-auth/react";

export default function Home() {
    const menuRight = useRef(null);
    const items = [
        {
          label: "Login",
          icon: "pi pi-user",
        },
        {
          label: "Registre-se",
          icon: "pi pi-user-plus",
        }
    ];
  
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false
    }).then((response) => {
      if (response?.error) {
        alert("Erro ao fazer login: " + response.error);
      } else {
        window.location.href = "/home";
      }
    }).catch((error) => {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao fazer login. Tente novamente.");
    });

  }
    
  return (
    <div>
      <div>
        <div className="flex justify-center py-8">
          <div className="text-3xl font-bold text-blue-600">
            <span className="text-green-500">$</span>
            HomeFinance
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="w-full max-w-md p-6">
            <form className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite seu email"
                  onInput={(event) => setForm({ ...form, email: event.target.value })}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite sua senha"
                  onInput={(event) => setForm({ ...form, password: event.target.value })}
                />
              </div>
              <Button 
                label="Entrar" 
                className="w-full p-3"
                type="submit"
                onClick={handleLogin}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
