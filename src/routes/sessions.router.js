import { Router } from 'express';
import usersModel from '../dao/dbManagers/models/users.models.js';
import express from 'express';
import passport from 'passport';
import { accessRolesEnum } from '../config/enums.js';

const router = express.Router();

router.get('/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({ user: req.user });
    } else {
        res.status(401).json({ message: 'Usuario no autenticado' });
    }
});


/*


const router = Router();




// Configuración de la estrategia local de Passport
passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
                const user = await usersModel.findOne({ email });

                if (!user) {
                    return done(null, false, { message: 'Usuario no encontrado' });
                }

                const isPasswordValid = await bcrypt.compare(password, user.password);

                if (!isPasswordValid) {
                    return done(null, false, { message: 'Contraseña incorrecta' });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);
*/

// Serialización y deserialización del usuario
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await usersModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// Ruta para el inicio de sesión (usando Passport)
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
}), (req, res) => {
    req.session.user = req.user; 
    res.redirect('/products');
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            return res.status(500).send({ status: 'error', message: err.message });
        }
        res.redirect('/');
    });
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
    res.send({ status: 'success', message: 'user registered' });
});

router.get('/github-callback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
});

export default router;