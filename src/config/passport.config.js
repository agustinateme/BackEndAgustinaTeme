// Configuración de Passport para autenticación local y de GitHub, así como estrategias JWT.
import passport from "passport";
import local from "passport-local";
import GitHubStrategy from 'passport-github2';
import { usersModel } from "../dao/dbManagers/models/users.models.js";
import configs from "./config.js";
import jwt from 'passport-jwt';

const JWTSrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

// Inicialización de Passport
const initializePassport = () => {
    // Configuración de la estrategia de autenticación GitHub
    passport.use('github', new GitHubStrategy({
        
        clientID: configs.clientID,
        clientSecret: configs.clientSecret,
        callbackURL: 'http://localhost:8080/api/sessions/github-callback',
        scope: ['user:email']
    }, async (accessToken, refreshToken, profile, done) => {
        // Lógica para manejar la autenticación con GitHub
        try {
            console.log(profile);
            const email = profile.emails[0].value;
            const user = await usersModel.findOne({ email });

            if (!user) {
                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 18,
                    email,
                    password: ''
                }

                const result = await usersModel.create(newUser);
                return done(null, result);
            } else {
                return done(null, user);
            }
        } catch (error) {
            return done(`Incorrect credentials`)
        }
    }));


    // Serialización y deserialización del usuario
    passport.serializeUser((user, done) => {
        done(null, user._id)
    });

    passport.deserializeUser(async (id, done) => {
        const user = await usersModel.findById(id)
        done(null, user);
    })


    // Configuración de la estrategia de autenticación JWT
    passport.use('jwt', new JWTSrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: configs.privateKeyJwt
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload.user);
        } catch (error) {
            return done(error);
        }
    }))
};


// Función para extraer el token JWT de las cookies de la solicitud
const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['coderCookieToken'];
    }
    return token;
}

// Middleware de autenticación Passport
const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, { session: false }, function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(401).send({ status: 'error', error: info.messages ? info.messages : info.toString() })
            }
            req.user = user;
            next();
        })(req, res, next);
    }
}

export {
    initializePassport,
    passportCall,
    cookieExtractor   
}