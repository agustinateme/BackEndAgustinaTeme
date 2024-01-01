import { Router } from "express";
import { Users } from "../dao/factory.js";
import { register, login} from "../controllers/users.controller.js";
import UsersRepository from "../repositories/users.repository.js";

const router = Router();
const usersDao = new Users();
const usersRepository = new UsersRepository(usersDao);


router.post("/register", register);
router.post("/login", login);
router.get("/", async (req, res) => {
    const data = await usersRepository.getUsers();
    res.json(data);
});
router.post("/", async (req, res) => {
    const { first_name, last_name, email, age, password, cart, role } = req.body;
    const data = await usersRepository.createUser({
        role,
        first_name,
        last_name,
        age,
        email,
        password,
        cart,   
    });

    res.json(data);
});

export default router;