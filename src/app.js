import express from 'express';
import sessionsRouter from './routes/sessions.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import __dirname from './utils.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');


app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://agustinateme:UhG9PZuj78uc6KEV@basededatosecommerce.qngt7vp.mongodb.net/?retryWrites=true&w=majority',
        ttl: 3600 // 1 hora
    }),
    secret: 'Coder5575Secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, 
        maxAge: 3600000 
    }
}));

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.use('/api/sessions', sessionsRouter);


const startServer = async () => {
    try {
        await mongoose.connect('mongodb+srv://agustinateme:UhG9PZuj78uc6KEV@basededatosecommerce.qngt7vp.mongodb.net/?retryWrites=true&w=majority');
        console.log('DB connected');
        app.listen(8080, () => console.log('Server running'));
    }
    catch (error) {
        console.error('DB connection failed', error.message);
    }
};

startServer();

