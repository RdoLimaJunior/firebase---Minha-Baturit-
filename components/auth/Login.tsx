import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

const GoogleIcon = () => (
  <svg className="w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 381.5 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-72.2 72.2C327 113.2 289.6 96 248 96c-88.8 0-160.1 71.1-160.1 160.1s71.3 160.1 160.1 160.1c98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
  </svg>
);

const Login: React.FC = () => {
  const { signInWithGoogle, signInAsGuest, loading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm text-center">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Bras%C3%A3o_de_Baturit%C3%A9_-_CE.svg" 
          alt="Brasão de Baturité" 
          className="h-24 mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold text-slate-800">
          Minha <span className="text-indigo-600">Baturité</span>
        </h1>
        <p className="mt-2 text-slate-600">
          Sua cidade na palma da sua mão. Acesse para continuar.
        </p>

        <div className="mt-8 space-y-3">
          <Button
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full !bg-white !text-slate-700 hover:!bg-slate-50 border border-slate-300 shadow-sm"
            size="lg"
          >
            <div className="flex items-center justify-center">
                <GoogleIcon />
                <span className="ml-3">Entrar com Google</span>
            </div>
          </Button>
          <Button
            onClick={signInAsGuest}
            disabled={loading}
            variant="ghost"
            className="w-full"
            size="lg"
          >
            Continuar como visitante
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;