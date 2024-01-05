import mongoose from 'mongoose';

const messagesCollection = 'messages';

const messagesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

export const MessagesModel = mongoose.model(messagesCollection, messagesSchema);
