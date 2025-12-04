import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
    password: {
        type: String,
        select: false, // Don't return password by default
    },
    name: {
        type: String,
    },
    image: {
        type: String,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true, // Allow null/undefined to not conflict
    },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
