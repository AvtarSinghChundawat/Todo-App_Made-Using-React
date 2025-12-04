import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema({
    userId: {
        type: String, // Changed from ObjectId to String to support UUIDs
        ref: 'User',
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
    },
    completed: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

// Force model recompilation to pick up schema changes
if (mongoose.models.TodoV2) {
    delete mongoose.models.TodoV2;
}

// Use 'TodoV2' to bypass potential caching of 'Todo' model, but map to 'todos' collection
export default mongoose.models.TodoV2 || mongoose.model('TodoV2', TodoSchema, 'todos');
