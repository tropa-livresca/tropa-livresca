import { apiFetch } from '../../../services/api';
import { useState } from 'react';

export function useGoogle() {
  const [carregando, setCarregando] = useState(false);
  const [error, setError] = useState(null);

  const LoginGoogle = async (credentialResponse) => {
    const idToken = credentialResponse.credential;
    
    setCarregando(true);
    setError(null);

    try {
      const response = await apiFetch('/api/v1/clients/auth/signin/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }),
      });

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(resultado.message || 'Erro ao autenticar no servidor');
      }

      console.log('Sessão criada no backend:', resultado.data);
      
    } catch (err) {
      console.error('Erro na rota de autenticação:', err.message);
      setError(err.message);
    } finally {
      setCarregando(false);
    }
  };

  return {
    LoginGoogle,
    carregando,
    error
  };
}
