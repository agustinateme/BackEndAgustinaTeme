import { generateTokenOneHour } from "../utils.js";
import { sendEmail } from "./mail.services.js";
import Users from '../dao/dbManagers/user.managers.js';
import UserRepository from "../repositories/user.repository.js"
import { ResetPasswordHTML } from '../utils/custom.html.js'
const userDao = new Users();
const userRepository = new UserRepository(userDao)

const sendPasswordResetEmail = async (email) => {
    try {
        const user = await userRepository.getByEmail(email);
        if (user) {
            const token = generateTokenOneHour(email);
            const resetPasswordLink = `http://localhost:8080/api/reset-password/NewPassword?token=${token}`;
            const emailInvalidCredentials = {
                to: user.email,
                subject: 'Restore password',
                html: ResetPasswordHTML.replace('{{resetPasswordLink}}', resetPasswordLink)
            };
            await sendEmail(emailInvalidCredentials);
            console.log('Password reset email sent to:', user.email);
            return token
        }
    } catch (error) {
        console.error('Error sending recovery email:', error);
        throw error;
    }
};


export { sendPasswordResetEmail };