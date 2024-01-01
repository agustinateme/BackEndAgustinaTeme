import passport from "passport";
import local from "passport-local";
import {usersModel} from "../dao/mongo/models/users.models.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from "passport-github2";
import configs from '../config/config.js';

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use(
        "register",
        new LocalStrategy(
            {
                passReqToCallback: true,
                usernameField: "email",
            },
            async (req, username, password, done) => {
                try {
                    const { first_name, last_name, age } = req.body;
                    const user = await usersModel.findOne({ email: username });

                    if (user) {
                        return done(null, false, { message: "User already exists" });
                    }

                    const userToSave = {
                        first_name,
                        last_name,
                        email: username,
                        age,
                        password: createHash(password),
                    };

                    const result = await usersModel.create(userToSave);
                    return done(null, result);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
    
    passport.use(
        "login",
        new LocalStrategy(
            {
                usernameField: "email",
            },
            async (username, password, done) => {
                try {
                    const user = await usersModel.findOne({ email: username });

                    if (!user || !isValidPassword(password, user.password)) {
                        return done(null, false, { message: "Invalid email or password" });
                    }

                    return done(null, user); 
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await usersModel.findById(id);
        done(null, user);
    });

    
    passport.use(
        "github",
        new GitHubStrategy(
            {
                clientID: configs.clientID,
                clientSecret: configs.clientSecret,
                callbackURL: "http://localhost:8080/api/sessions/github-callback",
                scope: ["user:email"],
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const email = profile.emails[0].value;
                    const user = await usersModel.findOne({ email });

                    if (!user) {
                        const newUser = {
                            first_name: profile._json.name,
                            last_name: "",
                            age: 18,
                            email,
                            password: "",
                        };

                        const createdUser = await usersModel.create(newUser);

                        if (!createdUser) {
                            return done(null, false, { message: "Failed to create user" });
                        }

                        return done(null, createdUser);
                    } else {
                        return done(null, user);
                    }
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
};

export { initializePassport };