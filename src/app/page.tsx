"use client";

export default function Home() {
    
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo!</h1>
            <p className="text-gray-600 mb-8">Gerencie suas finanças de forma inteligente</p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Já possui uma conta?{" "}
              <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Logue-se aqui
              </a>
            </p>
          </div>


          <div className="text-center">
            <p className="text-sm text-gray-600">
              Não tem uma conta?{" "}
              <a href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Registre-se aqui
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
