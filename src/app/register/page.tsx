"use client";

import { Button } from "primereact/button";
import { useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { register } from "../api/auth";
import { Toast } from "primereact/toast";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const toast = useRef<Toast>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Todos os campos são obrigatórios.' });
      return;
    }

    register(form.email, form.name, form.password)
      .then(async () => {
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
      })
      .catch((error) => {
        console.error("Erro ao registrar:", error);
        alert("Erro ao registrar. Verifique seus dados e tente novamente.");
      }
    );
  }
    
  return (
    <div>
      <Toast position="top-right" ref={toast}/>
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
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite seu nome"
                  /* @ts-ignore */
                  onInput={(event) => setForm({ ...form, name: event.target.value })}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite seu email"
                  /* @ts-ignore */
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
                  /* @ts-ignore */
                  onInput={(event) => setForm({ ...form, password: event.target.value })}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirme sua senha"
                  /* @ts-ignore */
                  onInput={(event) => setForm({ ...form, confirmPassword: event.target.value })}
                />
              </div>
              <Button 
                className="w-full p-3 text-center bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ width: "100%" }}
                disabled={loading}
                type="submit"
                onClick={handleRegister}
              >
                {loading ? "Carregando..." : "Registrar"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
