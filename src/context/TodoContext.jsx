'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo as deleteTodoAction,
    syncLocalTodos,
    toggleTodoCompletion as toggleTodoCompletionAction
} from '../actions';
import Loader from '../components/ui/Loader';

const TodoContext = createContext();

export const useTodos = () => {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error('useTodos must be used within a TodoProvider');
    }
    return context;
};

export const TodoProvider = ({ children }) => {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);

    // ======= THEME =======
    const [isDark, setIsDark] = useState(true); // Default to dark to avoid flash

    useEffect(() => {
        // Initialize theme from local storage or system preference
        const savedMode = localStorage.getItem('theme');
        if (savedMode) {
            setIsDark(savedMode === 'dark');
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            document.body.style.backgroundColor = isDark ? '#171717' : '#FEF6C3'; // Adjusted dark color for Next.js neutral-900 match
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            if (isDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    // ======= TODOS =======
    const [todos, setTodos] = useState([]);

    // Fetch Todos on Mount / Auth Change
    useEffect(() => {
        const initializeTodos = async () => {
            setIsLoading(true);
            console.log("TodoContext: Status changed to:", status);
            if (status === 'authenticated') {
                console.log("TodoContext: User is authenticated:", session?.user);
                // 1. Check for local todos to sync
                const localTodos = JSON.parse(localStorage.getItem('todos') || '[]');
                if (localTodos.length > 0) {
                    console.log("TodoContext: Syncing local todos:", localTodos);
                    await syncLocalTodos(localTodos);
                    localStorage.removeItem('todos'); // Clear after sync
                }

                // 2. Fetch from DB
                console.log("TodoContext: Fetching todos from DB...");
                let dbTodos = await getTodos();
                console.log("TodoContext: Fetched todos:", dbTodos);

                // 3. If no todos in DB, create default welcome todo
                if (dbTodos.length === 0) {
                    console.log("TodoContext: No todos in DB, creating default...");
                    const defaultTodo = await createTodo({
                        title: "Hey wassup",
                        content: "<p>Avtar this side, I made this todo app using Next.js and react, used tailwind css for styling and of course html, hope you like it :)</p>"
                    });
                    dbTodos = [defaultTodo];
                }

                setTodos(dbTodos);
            } else if (status === 'unauthenticated') {
                // Load from LocalStorage
                const stored = localStorage.getItem('todos');
                const hasVisited = localStorage.getItem('has-visited');

                if (stored) {
                    try {
                        const parsed = JSON.parse(stored);
                        if (Array.isArray(parsed)) {
                            setTodos(parsed);
                        } else {
                            setTodos([]);
                        }
                    } catch (e) {
                        console.error("Failed to parse local todos", e);
                        setTodos([]);
                    }
                } else if (!hasVisited) {
                    // Default welcome todo for NEW guests only
                    localStorage.setItem('has-visited', 'true');
                    setTodos([{
                        id: Date.now().toString(),
                        title: "Hey wassup",
                        content: "<p>Avtar this side, I made this todo app using Next.js and react, used tailwind css for styling and of course html, hope you like it :)</p>",
                        completed: false,
                        createdAt: new Date().toISOString()
                    }]);
                } else {
                    // Returning visitor with empty storage -> Empty list
                    setTodos([]);
                }
            }
            setIsLoading(false);
        };

        initializeTodos();
    }, [status]);

    // Save to LocalStorage (Guest Mode Only)
    useEffect(() => {
        if (status === 'unauthenticated' && !isLoading && todos.length > 0) {
            localStorage.setItem('todos', JSON.stringify(todos));
        } else if (status === 'unauthenticated' && !isLoading && todos.length === 0) {
            // Only clear if we are sure it's intentional? 
            // Actually, if the user deletes all todos, we WANT to save [].
            // But if we just loaded and it's empty, we don't want to overwrite if we haven't touched it.
            // Let's rely on the fact that we set default todos if empty on load.
            localStorage.setItem('todos', JSON.stringify(todos));
        }
    }, [todos, status, isLoading]);

    // ======= CRUD OPERATIONS =======

    const addTodo = async (title, content) => {
        const tempId = Date.now().toString();
        const newTodo = {
            id: tempId,
            title: title || 'Untitled',
            content: content || '',
            completed: false,
            createdAt: new Date().toISOString()
        };

        // Optimistic Update
        setTodos(prev => [newTodo, ...prev]);

        if (status === 'authenticated') {
            try {
                const created = await createTodo({ title, content });
                // Replace temp ID with real ID
                setTodos(prev => prev.map(t => t.id === tempId ? created : t));
            } catch (error) {
                console.error("Failed to create todo", error);
                // Revert on failure
                setTodos(prev => prev.filter(t => t.id !== tempId));
            }
        }
    };

    const updateTodoItem = async (id, updates) => {
        // Optimistic Update
        setTodos(prev => prev.map(todo => todo.id === id ? { ...todo, ...updates } : todo));

        if (status === 'authenticated') {
            try {
                await updateTodo(id, updates);
            } catch (error) {
                console.error("Failed to update todo", error);
                // Revert (fetch fresh data or undo) - simplified here
            }
        }
    };

    const deleteTodoItem = async (id) => {
        const todoToDelete = todos.find(todo => todo.id === id);
        if (!todoToDelete) return;

        // Optimistic Update
        setTodos(prev => prev.filter(todo => todo.id !== id));
        setRecentlyDeleted(prev => [todoToDelete, ...prev]);

        // Immediate Delete from DB
        if (status === 'authenticated') {
            try {
                await deleteTodoAction(id);
            } catch (error) {
                console.error("Failed to delete todo", error);
                // Revert if failed
                setTodos(prev => [todoToDelete, ...prev]);
            }
        }

        // Clear from recently deleted after 5 seconds (just for UI)
        setTimeout(() => {
            setRecentlyDeleted(prev => prev.filter(t => t.id !== id));
        }, 5000);
    };

    const undoDelete = async () => {
        if (recentlyDeleted.length > 0) {
            const [lastDeleted, ...rest] = recentlyDeleted;
            setRecentlyDeleted(rest);

            // Optimistic Restore
            setTodos(prev => [lastDeleted, ...prev]);

            if (status === 'authenticated') {
                // Re-create in DB since we deleted it
                try {
                    const restored = await createTodo({
                        title: lastDeleted.title,
                        content: lastDeleted.content
                    });
                    // Update ID
                    setTodos(prev => prev.map(t => t.id === lastDeleted.id ? restored : t));
                } catch (error) {
                    console.error("Failed to restore todo", error);
                    setTodos(prev => prev.filter(t => t.id !== lastDeleted.id));
                }
            }
        }
    };

    const toggleCompleted = async (id) => {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;

        // Optimistic
        setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

        if (status === 'authenticated') {
            await toggleTodoCompletionAction(id);
        }
    };

    // ======= FILTER & SEARCH =======
    const [filter, setFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Persist filter preference
        const savedFilter = localStorage.getItem('filter');
        if (savedFilter) setFilter(savedFilter);
    }, []);

    useEffect(() => {
        localStorage.setItem('filter', filter);
    }, [filter]);

    const filteredTodos = todos.filter(todo => {
        const matchesSearch =
            (todo.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (todo.content?.toLowerCase() || '').includes(searchQuery.toLowerCase());

        if (filter === 'COMPLETE') return todo.completed && matchesSearch;
        if (filter === 'INCOMPLETE') return !todo.completed && matchesSearch;
        return matchesSearch;
    });

    // ======= MODAL & EDITING =======
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [todoTitle, setTodoTitle] = useState('');
    const [todoContent, setTodoContent] = useState('');

    const openModal = (id = null, title = '', content = '') => {
        setEditingId(id);
        setTodoTitle(title);
        setTodoContent(content);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setTodoTitle('');
        setTodoContent('');
    };

    const saveTodo = () => {
        if (!todoTitle.trim()) return;

        if (editingId) {
            updateTodoItem(editingId, { title: todoTitle, content: todoContent });
        } else {
            addTodo(todoTitle, todoContent);
        }
        closeModal();
    };

    // ======= VIEW MODAL =======
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingTodo, setViewingTodo] = useState(null);

    const openViewModal = (todo) => {
        setViewingTodo(todo);
        setIsViewModalOpen(true);
    };

    const closeViewModal = () => {
        setIsViewModalOpen(false);
        setViewingTodo(null);
    };

    // ======= UNDO LOGIC =======
    const [recentlyDeleted, setRecentlyDeleted] = useState([]);
    const undoTimeoutRef = useRef(null);

    // ======= IMPORT/EXPORT =======
    const importTodos = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedTodos = JSON.parse(e.target.result);
                if (Array.isArray(importedTodos)) {
                    // For now, just add them to local state. 
                    // If auth, they should probably be synced or added one by one?
                    // Let's just set them and let the sync logic handle it if they re-login, 
                    // or if auth, we might want to bulk create. 
                    // For simplicity:
                    setTodos(prev => [...prev, ...importedTodos]);
                    alert("Todos imported successfully! (Note: Sync manually if needed)");
                } else {
                    alert("Invalid format: Expected an array of todos");
                }
            } catch (err) {
                alert("Invalid JSON file");
            }
        };
        reader.readAsText(file);
    };

    const exportTodos = () => {
        const dataStr = JSON.stringify(todos, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `todos-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <TodoContext.Provider value={{
            todos,
            filteredTodos,
            isDark,
            toggleTheme,
            filter,
            setFilter,
            searchQuery,
            setSearchQuery,
            addTodo,
            updateTodo: updateTodoItem,
            deleteTodo: deleteTodoItem,
            undoDelete,
            toggleCompleted,
            importTodos,
            exportTodos,
            recentlyDeleted,
            isModalOpen,
            setIsModalOpen,
            editingId,
            setEditingId,
            todoTitle,
            setTodoTitle,
            todoContent,
            setTodoContent,
            openModal,
            closeModal,
            saveTodo,
            isViewModalOpen,
            viewingTodo,
            openViewModal,
            closeViewModal,
            isLoading
        }}>
            {children}
        </TodoContext.Provider>
    );
};
