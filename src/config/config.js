// Configuración de la aplicación, incluyendo el puerto, la URL de MongoDB, credenciales de administrador, persistencia, claves secretas, etc.
import dotenv from 'dotenv';

dotenv.config();

const configs = {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    persistance: process.env.PERSISTENCE,
    privateKeyJwt: process.env.PRIVATE_KEY_JWT,
    sessionSecret: process.env.SESSION_SECRET,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    userNodemailer: process.env.USER_NODEMAILER,
    passwordNodemailer: process.env.PASSWORD_NODEMAILER,
};

export default configs;