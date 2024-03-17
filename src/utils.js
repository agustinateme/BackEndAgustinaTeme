import { fileURLToPath } from 'url';
import { dirname} from 'path';
import path from 'path';
import configs from './config/config.js';
import multer from 'multer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import winston from 'winston';
import { PRIVATE_KEY_JWT } from './config/constants.js';
const ENVIRONMENT = 'production';
let logger;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const generateTokenOneHour = (email) => {
   try {
      const token = jwt.sign({ email }, configs.privateKeyJwt, { expiresIn: '1h' });
      return token;
   } catch (error) {
      console.error('generateToken error:', error);
      throw error;
   }
}

const authorization = (role) => {
    return async (req, res, next) => {
        if (req.user.role !== role) return res.status(403).send({ status: 'error', message: 'not permissions' })
        next();
    }
}

const createHash = password =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (plainPassword, hashedPassword) =>
    bcrypt.compareSync(plainPassword, hashedPassword);

const generateToken = (user) => {
    const token = jwt.sign({ user }, PRIVATE_KEY_JWT, { expiresIn: '24h' });
    return token;
}

const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        department: faker.commerce.department(),
        stock: faker.number.int(1),
        id: faker.database.mongodbObjectId(),
        image: faker.image.url(),
        code: faker.string.alphanumeric(10),
        description: faker.commerce.productDescription(),
    };
};


const customLevelOptions = {
   levels: {
      debug: 5, 
      http: 4, 
      info: 3, 
      warning: 2, 
      error: 1, 
      fatal: 0
   }}

if(ENVIRONMENT === 'production') {
      logger = winston.createLogger({
         levels: customLevelOptions.levels,
         transports: [
            new winston.transports.Console({
               level: 'info'
            }),
            new winston.transports.File({
               filename: 'logs/errors.log',
               level: 'error'
            })
         ]
   });
} else {
      logger = winston.createLogger({
         levels: customLevelOptions.levels,
         transports: [
            new winston.transports.Console({
               level: 'debug'
            })
         ]
   });
}


const addLogger = (req, res, next) => {
   req.logger = logger;
   next();
}

const storage = multer.diskStorage({
   destination: function (req, file, cb) {

      if (file.fieldname === "imagenPerfil") {
         cb(null, path.join(__dirname, "public", "profiles"))
      }

      if (file.fieldname === "imagenProducto") {
         cb(null, path.join(__dirname, "public", "products"))
      }

      if (file.fieldname === "documents") {
         cb(null, path.join(__dirname, "public", "documents"))
      }

   },

   filename: function (req, file, cb) {
      cb(null, file.originalname)
   }
})

const uploader = multer({ storage: storage })

export {
   authorization,
   __dirname,
   createHash,
   isValidPassword,
   generateToken,
   generateProduct,
   addLogger,
   uploader,
   generateTokenOneHour
}