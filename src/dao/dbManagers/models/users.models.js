import mongoose from 'mongoose';

const usersCollection = 'users';

const usersSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,
    rol: { type: String, enum: ['user', 'admin'], default: 'user' },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts',
    },
});

const usersModel = mongoose.model(usersCollection, usersSchema);

export default usersModel;