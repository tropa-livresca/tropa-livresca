import {useContext} from "react";

import {AuthContext} from "../context/auth/Auth";

/**
 * Hook para acessar o contexto de autenticação
 * Permite gerenciar o usuário logado, realizar login, cadastro, verificação de email
 * 
 * @example
 * const {user, signin, signout, confirmsignup} = useAuth();
 * 
 * @returns {import('../context/auth/Auth').AuthContextValue} Retorna o estado e função
 */
const useAuth = () => {
    const context = useContext(AuthContext);

    return context;
}

export default useAuth;
