import { Router } from 'express';
import usersModel from '../dao/dbManagers/models/users.models.js';
import { CartsModel } from '../dao/dbManagers/models/carts.models.js';

const router = Router();

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(422).send({ status: 'error', message: 'incomplete values' });
        }

        const exists = await usersModel.findOne({ email });

        if (exists) {
            return res.status(400).send({ status: 'error', message: 'user already exists' });
        }

        await usersModel.create({
            first_name,
            last_name,
            email,
            age,
            password
        })

        res.status(201).send({ status: 'success', message: 'user registered' });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await usersModel.findOne({ email, password }).populate('cart');

        if (user) {
            // Usuario autenticado
            if (!user.cart) {
                // Si no hay carrito, crea uno nuevo
                const cart = await CartsModel.create({ userId: user._id, products: [] });
                // Asigna el ID del carrito al usuario
                user.cart = cart._id;
                await user.save();
            }

            // Almacena el ID del carrito en la sesión
            req.session.cartId = user.cart._id;
            req.session.user = { id: user._id, name: `${user.first_name} ${user.last_name}` };

            res.status(200).json({ status: 'success', message: 'Login successful', cartId: user.cart._id });
        } else {
            // Autenticación fallida
            res.status(401).json({ success: false, message: 'Authentication failed' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});



router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) return res.status(500).send({ status: 'error', message: error.message });
        res.redirect('/');
    })
})

export default router;