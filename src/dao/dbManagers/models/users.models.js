import mongoose from 'mongoose';

const usersCollection = 'users';

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
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
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
    },
    documents: [
        {
            name: String,
            reference: String,
            status: { type: String, default: "the document is not there" }
        }
    ],
    last_connection: {
        type: Date,
        default: Date.now()
    }
});

export const usersModel = mongoose.model(usersCollection, usersSchema);