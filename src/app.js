import express from 'express';
import handlebars from 'express-handlebars';
import {initializePassport} from './config/passport.config.js';
import { __dirname } from './utils.js';
import passport from 'passport';
import sessionsRouter from './routes/sessions.router.js';
import ProductsRouter from './routes/products.router.js';
import CartsRouter from './routes/carts.router.js';
import ViewsRouter from './routes/views.router.js';
import session from 'express-session';
import currentRouter from "./routes/current.router.js"

const app = express();

// Crear una instancia del ViewsRouter
const viewsRouter = new ViewsRouter();

const productsRouter = new ProductsRouter();
const cartsRouter = new CartsRouter();
// Inicializar las rutas usando el método init() del ViewsRouter
viewsRouter.init();

cartsRouter.init();
productsRouter.init();
//Passport config

app.use(session({
  secret: 'your-secret-key', // Esta clave debería ser única y segura en un entorno de producción
  resave: false,
  saveUninitialized: false
}));
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');


app.use('/api/sessions', sessionsRouter);

app.use('/', viewsRouter.getRouter());
app.use('/api/products', productsRouter.getRouter());
app.use('/api/carts', cartsRouter.getRouter());
app.use('/current', currentRouter);



app.listen(8080, () => console.log('Server running'));
import './dao/dbConfig.js';