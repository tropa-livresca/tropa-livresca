import supabase from '../config/supabase.js';

export const checkAuth = async(req, res, next) =>{
    const token = req.cookies['auth-token'];

    if (!token) {
        return res.status(401).json({error: 'Token de autenticação não fornecido.'});
    }

    try {
        const { data, error } = await supabase.auth.getUser(token);
        if (error) {
            return res.status(401).json({error: 'Token de autenticação inválido.'});
        }
        req.user = data.user;
        next();
    } catch (err) {
        return res.status(500).json({error: 'Erro ao verificar autenticação.'});
    }
}