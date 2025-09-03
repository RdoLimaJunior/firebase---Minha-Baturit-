import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "./firebaseConfig";

// Validate Firebase configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  // Halt app execution and show a clear error message to the developer.
  // This prevents the app from crashing in unpredictable ways due to misconfiguration.
  document.body.innerHTML = `
    <div style="font-family: sans-serif; padding: 2rem; text-align: center; background-color: #FFFBEB; color: #92400E; height: 100vh; display: flex; align-items: center; justify-content: center; box-sizing: border-box;">
      <div>
        <h1 style="font-size: 1.5rem; font-weight: bold;">Erro de Configuração do Firebase</h1>
        <p style="margin-top: 1rem;">As chaves de configuração do Firebase (como apiKey e projectId) não foram encontradas.</p>
        <p style="margin-top: 0.5rem;">Por favor, verifique se as variáveis de ambiente do seu projeto (ex: FIREBASE_API_KEY) estão configuradas corretamente no ambiente de execução.</p>
        <p style="margin-top: 1.5rem; font-size: 0.8rem; color: #B45309;">Esta mensagem é exibida apenas para fins de desenvolvimento.</p>
      </div>
    </div>
  `;
  throw new Error("Firebase configuration is missing or invalid. Please check your environment variables.");
}


// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços do Firebase para serem usados em outros lugares no app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);