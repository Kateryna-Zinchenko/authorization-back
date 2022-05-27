import {Router} from "express";
import userController from '../controllers/userController.js'
import {body} from 'express-validator'
import authMiddleware from "../middleware/authMiddleware.js";

const router = new Router();

router.post('/signup',
    body('email').isEmail(),
    body('password').isLength({min: 3}),
    userController.signup);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);

export default router;