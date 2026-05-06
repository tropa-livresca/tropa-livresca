import {Router} from 'express';
import {registerUser} from '..controllers/authController';

/**
 * Rotas de autenticação e gerenciamento de usuários
 * @module AuthRoutes
 */
const router = Router();

/**
 * POST /register
 * Rota para criação de novos usuários
 * @name RegisterUser
 * @path {POST} /register
 * @auth Nenhuma
 */
router.post('/register', registerUser);

/**
 * O objeto router do Express contendo as definições de rotas do usuário.
 * @type {import('express').Router} 
 */
export default router;