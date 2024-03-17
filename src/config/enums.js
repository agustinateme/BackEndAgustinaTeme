// Define enumeraciones para estrategias de Passport y roles de acceso.
const passportStrategiesEnum = {
    NOTHING: 'na',
    JWT: 'jwt'
};

const accessRolesEnum = {
    ADMIN: 'ADMIN',
    USER: 'USER',
    PUBLIC: 'PUBLIC',
    PREMIUM: 'PREMIUM'
};

export {
    passportStrategiesEnum,
    accessRolesEnum
}