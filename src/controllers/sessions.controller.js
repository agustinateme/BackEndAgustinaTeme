import {
    Register as RegisterService,
    Login as LoginService
} from "../services/sessions.services.js";


const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const accessToken = await LoginService(email, password)
        res.cookie('coderCookieToken', accessToken, { maxAge: 60 * 60 * 1000, httpOnly: true }).send({ status: 'success', message: 'login success' })
    } catch (error) {
        res.status(500).send({ error: error.message });
        req.logger.error(error.message);
    }
}

const Logout = (req, res) => {
    req.session.destroy(error => {
        if (error) return res.status(500).send({ status: 'error', message: error.message });
        res.redirect('/login');
    })
}

const Register = async (req, res) => {
    try {
        const { first_name, last_name, age, role, email, password } = req.body;
        const userToSave = await RegisterService(first_name, last_name, age, role, email, password)

        res.status(201).send({ status: 'success', payload: userToSave });
    } catch (error) {
        res.status(500).send({ error: error.message });
        req.logger.error(error.message);
    }
}

const mailOptions = {
    from: 'Coder Tests <agustinateme2@gmail.com>',
    to: email,
    subject: "Restablecer contraseña",
    html: `
            <div>
            <h1>Restablecer contraseña</h1>
            <p>Ingrese en el siguiente enlace: 
            <a href="http://localhost:8080/api/sessions/restore/${token}">Haga click aquí</a>
            </p>
            </div>
            `
}

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Correo enviado", info.response);
        res.status(200).json({ message: "Se envió enlace para restablecer la contraseña a su correo electrónico." })
    }
})

    } catch (error) {
    res.status(500).send("Error al enviar correo y restablecer contraseña.")
}
}

const Github = async (req, res) => {
    res.send({ status: 'success', message: 'user registered' });
}

const Github_callback = async (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
}

export {
    Login,
    Logout,
    Register,
    Github,
    Github_callback
}