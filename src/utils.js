import { fileURLToPath } from 'url';
import { dirname, join } from "path";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const PRIVATE_KEY_JWT = 'blablabla'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const productPath = join(__dirname, "./files/productos.json");
const cartPath = join(__dirname, "./files/carritos.json");

const createHash = password =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (plainPassword, hashedPassword) =>
    bcrypt.compareSync(plainPassword, hashedPassword);

const generateToken = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY_JWT, { expiresIn: '24h' });
    return token;
}

const authToken = (req, res, next) => {
    //1. validamos que el token llegue en los headers del request
    const authToken = req.headers.authorization;

    if (!authToken)
        return res
            .status(401)
            .send({ status: "error", message: "not authenticated" });

    const token = authToken.split(" ")[1];
    //2. Validar el jwt
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error)
            return res
                .status(401)
                .send({ status: "error", message: "not authenticated" });
        req.user = credentials.user;
        next();
    });
};


export {
    __dirname,
    createHash,
    isValidPassword,
    generateToken,
    authToken,
    productPath,
    cartPath
}