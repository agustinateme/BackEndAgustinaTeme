import mongoose from 'mongoose';

const ticketsCollection = 'tickets';


const ticketsSchema = new mongoose.Schema({
    code: {
        type: String,
        require: true,
        unique: true
    },
    purchase_datetime: {
        type: String,
        require: true,
        default: Date.now().toLocaleString()
    },
    amount: {
        type: Number,
        require: true
    },
    purchaser: {
        type: String,
        require: true
    }
})

export const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema);
