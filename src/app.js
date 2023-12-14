import express from 'express';
import handlebars from 'express-handlebars';
import initializePassport from './config/passport.js';
import mongoose from 'mongoose';
import { __dirname } from './utils.js';
import passport from 'passport';
// import sessionsRouter from './routes/sessions.router.js';
import UsersRouter from './routes/users.router.js';
import ProductsRouter from './routes/products.router.js';
import CartsRouter from './routes/carts.router.js';
import ViewsRouter from './routes/views.router.js';

import './dao/dbConfig.js';

const app = express();

const viewsRouter = new ViewsRouter();
const usersRouter = new UsersRouter();
const cartsRouter = new CartsRouter();
const productsRouter = new ProductsRouter();

//Passport config
initializePassport();
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use('/api/sessions', sessionsRouter);

app.use('/', viewsRouter.getRouter());
app.use('/api/products', productsRouter.getRouter());
app.use('/api/carts', cartsRouter.getRouter());
app.use('/api/users', usersRouter.getRouter());

/* YA LO TENGO  EN DBCONFIG.JS
try {
    await mongoose.connect('mongodb+srv://agustinateme:UhG9PZuj78uc6KEV@basededatosecommerce.qngt7vp.mongodb.net/?retryWrites=true&w=majority');
    console.log('DB connected');
}
catch (error) {
    console.log(error.message);
}*/
    
app.listen(8080, () => console.log('Server running'));