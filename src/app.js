import express from 'express';
import handlebars from 'express-handlebars';
import {initializePassport} from './config/passport.config.js';
import { __dirname } from './utils.js';
import passport from 'passport';
import sessionsRouter from './routes/sessions.router.js';
import UserRouter from './routes/users.router.js';
import ProductsRouter from './routes/products.router.js';
import CartsRouter from './routes/carts.router.js';
import ViewsRouter from './routes/views.router.js';
import loggerRouter from './routes/logger.router.js';
import currentRouter from "./routes/current.router.js"
import errorHandler from "./middlewares/errors/index.js";
import viewsResetPass from './routes/resetPassword.router.js';
import { addLogger } from './utils.js';
import configs from './config/config.js';

const app = express();
initializePassport();
app.use(cookieParser());

//passport
app.use(passport.initialize());
app.use(passport.session());

//express
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

//ROUTES
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', UserRouter());
app.use('/', ViewsRouter());
app.use('/api/products', ProductsRouter());
app.use('/api/carts', CartsRouter());
app.use('/current', currentRouter);
app.use(addLogger);
app.use('/loggerTest', loggerRouter);
app.use('/api/reset', viewsResetPass());
app.use(errorHandler);


app.listen(8080, () => console.log('Server running'));
import cookieParser from 'cookie-parser';


const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Documentacion proyecto backend ecommerce',
      description: 'api de compra de productos.'
    }
  },
  apis: [`${__mainDirname}/Docs/**/*.yaml`]
}
const specs = swaggerJsdoc(swaggerOptions);

app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

try {
  await mongoose.connect(configs.mongoUrl);
  console.log('DB connected');
  app.use(session({
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      ttl: 3600
    }),
    secret: configs.sessionSecret,
    resave: true,
    saveUninitialized: true,
  }));
} catch (error) {
  console.log(error.message);
}

const PORT = configs.port || 8080;

app.listen(PORT, () => console.log(`listen server on port: ${PORT}`));