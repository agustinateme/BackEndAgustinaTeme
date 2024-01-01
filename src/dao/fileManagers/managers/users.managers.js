import fs from "fs";

class UsersFS {
    constructor(path) {
        this.path = path;
    }

    getAll = async () => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, "utf-8");
            const result = JSON.parse(data);
            return result;
        } else {
            return [];
        }
    };

    register = async (user) => {
        const users = await this.getAll();
        users.push(user);
        await fs.promises.writeFile(this.path, JSON.stringify(users, null, "\t"));
        return user;
    };

    getByEmail = async (email) => {
        const users = await this.getAll();
        const result = users.find((u) => u.email === email);
        return result;
    };
}

export default UsersFS;