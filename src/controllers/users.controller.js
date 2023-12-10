import { register as registerService, login as loginService} from '../services/users.services.js';

const register = async (req, res) => {
    try {
        const user = req.body;

        const result = await registerService(user);

        res.sendSuccessNewResourse(result);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const login = async (req, res) => {
    try {
        const user = req.body;

        const result = await loginService(user);
        
        res.sendSuccess(result);
    } catch (error) {
        res.sendServerError(error.message);
    }
}

export {
    register,
    login
}