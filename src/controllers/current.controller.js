import UserDto from "../DTOs/user.dto.js"

const ShowUserInfo = async (req, res) => {
    try {
        if (req.user) {
            const userDto = new UserDto(req.user);
            res.send({ status: "success", user: userDto });
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
        req.logger.error(error.message);
    }
};


export {
    ShowUserInfo
}