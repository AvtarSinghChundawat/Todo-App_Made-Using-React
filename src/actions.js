'use server';

import { auth } from './auth';
import dbConnect from './lib/db';
import Todo from './models/Todo';
import Note from './models/Note';
import { revalidatePath } from 'next/cache';

// ======= TODOS =======

export async function getTodos() {
    const session = await auth();
    if (!session?.user?.email) {
        console.log("getTodos: No session user email");
        return [];
    }

    console.log("getTodos: Fetching todos for email:", session.user.email);

    await dbConnect();
    const todos = await Todo.find({ userEmail: session.user.email }).sort({ createdAt: -1 });

    // Convert _id to string to avoid serialization issues
    return todos.map(todo => ({
        ...todo.toObject(),
        id: todo._id.toString(),
        _id: todo._id.toString(),
        userId: todo.userId.toString(),
        userEmail: todo.userEmail,
        createdAt: todo.createdAt.toISOString(),
        updatedAt: todo.updatedAt.toISOString(),
    }));
}

export async function createTodo(data) {
    const session = await auth();
    if (!session?.user?.email) throw new Error('Unauthorized');

    await dbConnect();
    await dbConnect();
    console.log("Creating todo for user (email):", session.user.email);
    console.log("Full Session User Object:", JSON.stringify(session.user, null, 2));
    console.log("Todo Data:", data);

    // Verify Schema
    console.log("Todo Model Schema Paths:", Object.keys(Todo.schema.paths));

    if (!session.user.email) {
        console.error("CRITICAL ERROR: Session user email is missing!");
        throw new Error("User email is required");
    }

    try {
        const newTodo = await Todo.create({
            userId: session.user.id || 'unknown', // Keep for reference
            userEmail: session.user.email,
            title: data.title,
            content: data.content,
            completed: false,
        });
        console.log("Todo created successfully:", newTodo._id);
        console.log("Saved Todo Object:", newTodo.toObject()); // Verify userEmail is present

        revalidatePath('/dashboard');
        return {
            ...newTodo.toObject(),
            id: newTodo._id.toString(),
            _id: newTodo._id.toString(),
            userId: newTodo.userId.toString(),
            userEmail: newTodo.userEmail,
            createdAt: newTodo.createdAt.toISOString(),
            updatedAt: newTodo.updatedAt.toISOString(),
        };
    } catch (error) {
        console.error("Error creating todo:", error);
        throw error;
    }
}

export async function updateTodo(id, updates) {
    const session = await auth();
    if (!session?.user?.email) throw new Error('Unauthorized');

    await dbConnect();
    const updatedTodo = await Todo.findOneAndUpdate(
        { _id: id, userEmail: session.user.email },
        updates,
        { new: true }
    );

    revalidatePath('/dashboard');
    if (!updatedTodo) return null;

    return {
        ...updatedTodo.toObject(),
        id: updatedTodo._id.toString(),
        _id: updatedTodo._id.toString(),
        userId: updatedTodo.userId.toString(),
        userEmail: updatedTodo.userEmail,
        createdAt: updatedTodo.createdAt.toISOString(),
        updatedAt: updatedTodo.updatedAt.toISOString(),
    };
}

export async function deleteTodo(id) {
    const session = await auth();
    if (!session?.user?.email) throw new Error('Unauthorized');

    await dbConnect();
    await Todo.findOneAndDelete({ _id: id, userEmail: session.user.email });
    revalidatePath('/dashboard');
}

export async function toggleTodoCompletion(id) {
    const session = await auth();
    if (!session?.user?.email) throw new Error('Unauthorized');

    await dbConnect();
    const todo = await Todo.findOne({ _id: id, userEmail: session.user.email });
    if (todo) {
        todo.completed = !todo.completed;
        await todo.save();
        revalidatePath('/dashboard');
    }
}

// ======= NOTES =======
// (Assuming similar structure for Notes, implementing basic CRUD)

export async function getNotes() {
    const session = await auth();
    if (!session?.user) return [];

    await dbConnect();
    const notes = await Note.find({ userId: session.user.id }).sort({ createdAt: -1 });

    return notes.map(note => ({
        ...note.toObject(),
        id: note._id.toString(),
        _id: note._id.toString(),
        userId: note.userId.toString(),
        createdAt: note.createdAt.toISOString(),
        updatedAt: note.updatedAt.toISOString(),
    }));
}

export async function createNote(data) {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');

    await dbConnect();
    const newNote = await Note.create({
        userId: session.user.id,
        title: data.title,
        content: data.content,
    });

    revalidatePath('/dashboard');
    return {
        ...newNote.toObject(),
        id: newNote._id.toString(),
        _id: newNote._id.toString(),
        userId: newNote.userId.toString(),
        createdAt: newNote.createdAt.toISOString(),
        updatedAt: newNote.updatedAt.toISOString(),
    };
}

export async function deleteNote(id) {
    const session = await auth();
    if (!session?.user) throw new Error('Unauthorized');

    await dbConnect();
    await Note.findOneAndDelete({ _id: id, userId: session.user.id });
    revalidatePath('/dashboard');
}

// ======= SYNC =======

export async function syncLocalTodos(localTodos) {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized' };

    await dbConnect();

    // Fetch existing todos to prevent duplicates
    const existingTodos = await Todo.find({
        userEmail: session.user.email,
        title: { $in: localTodos.map(t => t.title) }
    });

    const existingTitles = new Set(existingTodos.map(t => t.title));

    const operations = localTodos
        .filter(todo => !existingTitles.has(todo.title)) // Filter out duplicates by title
        .map(todo => ({
            insertOne: {
                document: {
                    userId: session.user.id,
                    userEmail: session.user.email,
                    title: todo.title,
                    content: todo.content,
                    completed: todo.completed,
                    createdAt: todo.createdAt || new Date(),
                }
            }
        }));

    if (operations.length > 0) {
        await Todo.bulkWrite(operations);
    }

    revalidatePath('/dashboard');
    return { success: true };
}
