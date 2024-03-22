import configs from "../config/config.js";
import { sendPasswordResetEmail as sendPasswordResetEmailService } from "../services/resetPassword.service.js";
import jwt from "jsonwebtoken";

const sendEmail = async (req, res) => {
    res.render('sendEmail');
}

const sendPassword =  async (req, res) => {
    const token = req.query.token;
    if (!token) {
        return res.status(400).send('Not password reset token');
    }
    try {
        const dToken = jwt.verify(token, configs.privateKeyJwt);
        res.render('PasswordReset');
    } catch (error) {
        console.error('Error al verificar el token:', error);
        return res.render('EmailReset')
    }
}

// Controlador para restablecer la contraseña del usuario
const resetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        await sendPasswordResetEmailService(email)
        res.status(200).send('Password reset email sent successfully');
    } catch (error) {
        console.error('Password reset error:', error);
    }
}



export {
    resetPassword,
    sendEmail,
    sendPassword
}