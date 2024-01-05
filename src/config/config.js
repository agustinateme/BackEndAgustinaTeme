import dotenv from 'dotenv';

dotenv.config();

const configs = {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    privateKeyJwt: process.env.PRIVATE_KEY_JWT,
    sessionSecret: process.env.SESSION_SECRET
};

export default configs;