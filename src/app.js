import express from 'express';
import handlebars from 'express-handlebars';
import { initializePassport } from './config/passport.config.js';
import { __dirname } from './utils.js';
import passport from 'passport';
import sessionsRouter from './routes/sessions.router.js';
import UsersRouter from './routes/users.router.js';
import ProductsRouter from './routes/products.router.js';
import CartsRouter from './routes/carts.router.js';
import ViewsRouter from './routes/views.router.js';

const app = express();

const viewsRouter = new ViewsRouter();
const usersRouter = new UsersRouter();
const cartsRouter = new CartsRouter();
const productsRouter = new ProductsRouter();

// Passport config
initializePassport();
app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

// Serve static files from 'public' directory
app.use(express.static('public'));

app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/users', usersRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(8080, () => console.log('Server running'));
