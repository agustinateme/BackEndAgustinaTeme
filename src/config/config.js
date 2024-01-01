import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

// Variables de entorno con valores predeterminados
const configs = {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    persistence: process.env.PERSISTENCE,
};

// Conexión a la base de datos MongoDB usando Mongoose
await mongoose.connect(configs.mongoUrl);

mongoose.connection.on("connected", () => {
    console.log("Conectado a MongoDB");
});

export default configs;
