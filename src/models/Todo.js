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
    deletedAt: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

// MongoDB only expires documents where this field holds an actual Date -
// active todos keep deletedAt: null and are never touched. The moment a
// todo is soft-deleted (deletedAt set to now), Mongo's background TTL
// monitor removes it ~30 days later on its own, no cron job required.
TodoSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

// Force model recompilation to pick up schema changes
if (mongoose.models.TodoV2) {
    delete mongoose.models.TodoV2;
}

// Use 'TodoV2' to bypass potential caching of 'Todo' model, but map to 'todos' collection
export default mongoose.models.TodoV2 || mongoose.model('TodoV2', TodoSchema, 'todos');
