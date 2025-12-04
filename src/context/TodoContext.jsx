import { createContext, useContext, useState, useEffect, useRef } from 'react';

const TodoContext = createContext();

export const useTodos = () => {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error('useTodos must be used within a TodoProvider');
    }
    return context;
};

export const TodoProvider = ({ children }) => {
    // ======= THEME =======
    const [isDark, setIsDark] = useState(() => {
        const savedMode = localStorage.getItem('theme');
        return savedMode ? savedMode === 'dark' : true;
    });

    useEffect(() => {
        document.body.style.backgroundColor = isDark ? '#343434' : '#FEF6C3';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    // ======= TODOS =======
    const [todos, setTodos] = useState(() => {
        const stored = localStorage.getItem('todos');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            } catch (e) {
                console.error("Failed to parse todos", e);
            }
        }
        return [{
            id: Date.now(),
            title: "Hey wassup",
            content: "<p>Avtar this side, I made this todo app using vite and react, used tailwind css for styling and of course html, hope you like it :)</p>",
            completed: false
        }];
    });

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    // ======= FILTER & SEARCH =======
    const [filter, setFilter] = useState(() => localStorage.getItem('filter') || 'ALL');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        localStorage.setItem('filter', filter);
    }, [filter]);



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

    const saveTodo = () => {
        if (!todoTitle.trim()) return;

        if (editingId) {
            updateTodo(editingId, { title: todoTitle, content: todoContent });
        } else {
            addTodo(todoTitle, todoContent);
        }
        closeModal();
    };

    // ======= UNDO LOGIC =======
    const [recentlyDeleted, setRecentlyDeleted] = useState([]);
    const undoTimeoutRef = useRef(null);

    const addTodo = (title, content) => {
        const newTodo = {
            id: Date.now(),
            title: title || 'Untitled',
            content: content || '',
            completed: false,
            createdAt: new Date().toISOString()
        };
        setTodos(prev => [...prev, newTodo]);
    };

    const updateTodo = (id, updates) => {
        setTodos(prev => prev.map(todo => todo.id === id ? { ...todo, ...updates } : todo));
    };

    const deleteTodo = (id) => {
        const todoToDelete = todos.find(todo => todo.id === id);
        if (!todoToDelete) return;

        setTodos(prev => prev.filter(todo => todo.id !== id));
        setRecentlyDeleted(prev => [todoToDelete, ...prev]);

        if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
        undoTimeoutRef.current = setTimeout(() => {
            setRecentlyDeleted([]);
        }, 5000);
    };

    const undoDelete = () => {
        if (recentlyDeleted.length > 0) {
            const [lastDeleted, ...rest] = recentlyDeleted;
            setTodos(prev => [lastDeleted, ...prev]);
            setRecentlyDeleted(rest);

            if (rest.length > 0) {
                if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
                undoTimeoutRef.current = setTimeout(() => {
                    setRecentlyDeleted([]);
                }, 5000);
            }
        }
    };

    const toggleCompleted = (id) => {
        setTodos(prev => prev.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const importTodos = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedTodos = JSON.parse(e.target.result);
                if (Array.isArray(importedTodos)) {
                    setTodos(importedTodos);
                    alert("Todos imported successfully!");
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

    const filteredTodos = todos.filter(todo => {
        const matchesSearch =
            todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            todo.content.toLowerCase().includes(searchQuery.toLowerCase());

        if (filter === 'COMPLETE') return todo.completed && matchesSearch;
        if (filter === 'INCOMPLETE') return !todo.completed && matchesSearch;
        return matchesSearch;
    });

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
            searchQuery,
            setSearchQuery,
            addTodo,
            updateTodo,
            deleteTodo,
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
            closeViewModal
        }}>
            {children}
        </TodoContext.Provider>
    );
};
