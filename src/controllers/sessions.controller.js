import passport from "passport";
import SessionsService from "../services/sessions.services.js";

const sessionController = {

    async login(req, res, next) {
        passport.authenticate("login", { failureRedirect: "/fail-login" })(
            req,
            res,
            next
        );
    },

    async loginCallback(req, res) {
        if (!req.user) {
            return res
                .status(401)
                .send({ status: "error", message: "usuario y/o contraseña incorrecta" });
        }
        req.session.user = {
            name: `${req.user.first_name} ${req.user.last_name}`,
            email: req.user.email,
            age: req.user.age,
        };
        res.send({ status: "success", message: "inicio de sesión correcto" });
    },

    failLogin(req, res) {
        res.status(500).send({ status: "error", message: "no se pudo iniciar sesion" });
    },

    logout(req, res) {
        req.session.destroy((error) => {
            if (error) {
                return res
                    .status(500)
                    .send({ status: "error", message: error.message });
            }
            res.redirect("/login");
        });
    },

    async register(req, res, next) {
        passport.authenticate("register", {
            failureRedirect: "/fail-register",
        })(req, res, next);
    },

    async registerCallback(req, res) {
        res.status(201).send({ status: "success", message: "usuario registrado" });
    },

    failRegister(req, res) {
        res.status(500).send({ status: "error", message: "register fail" });
    },

    

    github: passport.authenticate("github", { scope: ["user:email"] }),

    async githubCallback(req, res, next) {
        passport.authenticate("github", async (err, user, info) => {
            if (err) {
                return res
                    .status(500)
                    .json({
                        message: "Error authenticating with GitHub",
                        error: err.message,
                    });
            }
            if (!user) {
                return res
                    .status(401)
                    .json({ message: "No se pudo autenticar con github" });
            }

            req.login(user, async (loginErr) => {
                if (loginErr) {
                    return res
                        .status(500)
                        .json({ message: "error", error: loginErr.message });
                }

                req.session.user = {
                    name: `${user.first_name} ${user.last_name}`,
                    email: user.email,
                    age: user.age,
                };

                return res.redirect("/home");
            });
        })(req, res, next);
    },

    githubCallbackFail(req, res) {
        res.status(401).json({ message: "No se pudo autenticar con github" });
    },

    async getCurrentUser(req, res) {
        try {
            const user = await SessionsService.getCurrentUser(req);
            return res.status(200).json({ user });
        } catch (error) {
            return res
                .status(500)
                .json({
                    message: "error",
                    error: error.message,
                });
        }
    },
};

export default sessionController;