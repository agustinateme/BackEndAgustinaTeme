import mongoose from 'mongoose';

const usersCollection = 'users';

const ageValidator = (value) => {
    return value > 18;
};

const usersSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        validate: {
            validator: ageValidator,
            message: 'La edad debe ser mayor de 18 años'
        }
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minlength: 8,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts'
    },
    role: {
        type: String,
        required: true,
        default: 'user'
    }
});

export const usersModel = mongoose.model(usersCollection, usersSchema);