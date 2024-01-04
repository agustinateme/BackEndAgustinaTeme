import express from 'express';
import handlebars from 'express-handlebars';
import {initializePassport} from './config/passport.config.js';
import { __dirname } from './utils.js';
import passport from 'passport';
import sessionsRouter from './routes/sessions.router.js';
import UsersRouter from './routes/users.router.js';
import ProductsRouter from './routes/products.router.js';
import CartsRouter from './routes/carts.router.js';
import ViewsRouter from './routes/views.router.js';

const app = express();
const server = app.listen(8080, () => console.log('Listening on PORT 8080'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Passport config
initializePassport();
app.use(passport.initialize());



app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use('/api/sessions', sessionsRouter);

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/users', usersRouter);
