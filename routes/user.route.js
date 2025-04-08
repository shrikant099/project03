import express from 'express';
import { login, logout, registerUser, resetPassword, sendMailForgetPass, verifyOtp } from '../controller/user.controller.js';
const authRoutes = express.Router();

authRoutes.post('/register', registerUser);
authRoutes.post("/login", login);
authRoutes.post("/logout" , logout);
authRoutes.post("/send-mail" , sendMailForgetPass);
authRoutes.post("/verify-otp" , verifyOtp);
authRoutes.put("/reset-password/:id" , resetPassword);

export {
    authRoutes
}