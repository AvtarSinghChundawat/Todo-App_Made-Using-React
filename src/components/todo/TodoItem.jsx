import { motion } from 'framer-motion';
import { Check, Trash2, Edit2 } from 'lucide-react';
import clsx from 'clsx';
import { useTodos } from '../../context/TodoContext';

const TodoItem = ({ todo, index }) => {
    const { isDark, toggleCompleted, deleteTodo, setEditingId, setIsModalOpen, setTodoTitle, setTodoContent, openViewModal } = useTodos();

    const handleEdit = () => {
        setEditingId(todo.id);
        setTodoTitle(todo.title);
        setTodoContent(todo.content);
        setIsModalOpen(true);
    };

    const handleView = () => {
        openViewModal(todo);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className={clsx(
                "group relative flex items-start justify-between gap-4 py-3 px-2 transition-all duration-200",
                index > 0 && "border-t-2 mt-[-2px]",
                isDark
                    ? (index > 0 ? "border-[#6C63FF]" : "") + " hover:bg-white/5"
                    : (index > 0 ? "border-[#0d00ff]" : "") + " hover:bg-black/5",
                todo.completed && "opacity-60"
            )}
        >
            <div className="flex items-start gap-3 flex-1 min-w-0">
                <button
                    onClick={() => toggleCompleted(todo.id)}
                    className={clsx(
                        "mt-1 flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors",
                        todo.completed
                            ? "bg-[#6C63FF] border-[#6C63FF]"
                            : (isDark ? "border-gray-400 hover:border-[#6C63FF]" : "border-gray-500 hover:border-[#6C63FF]")
                    )}
                >
                    {todo.completed && <Check size={14} className="text-white" />}
                </button>

                <div className="flex-1 min-w-0 overflow-hidden">
                    <h3 className={clsx(
                        "text-[1.3rem] mb-1 break-words whitespace-normal leading-normal transition-all cursor-pointer",
                        todo.completed
                            ? (isDark ? "line-through text-gray-200" : "line-through text-gray-500")
                            : (isDark ? "text-blue-300" : "text-blue-700")
                    )}
                        onClick={handleView}
                    >
                        {todo.title}
                    </h3>

                    {/* Render HTML content safely */}
                    <div
                        className={clsx(
                            "prose prose-sm max-w-none line-clamp-3 cursor-pointer",
                            isDark ? "prose-invert text-white" : "text-black",
                            todo.completed && "line-through opacity-70"
                        )}
                        dangerouslySetInnerHTML={{ __html: todo.content }}
                        onClick={handleView}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleEdit}
                    className={clsx(
                        "p-1 rounded transition-colors group/edit",
                        isDark ? "text-white hover:text-green-400" : "text-black hover:text-green-400"
                    )}
                    title="Edit"
                >
                    <Edit2 size={18} />
                </button>
                <button
                    onClick={() => deleteTodo(todo.id)}
                    className={clsx(
                        "p-1 rounded transition-colors group/delete",
                        isDark ? "text-white hover:text-red-500" : "text-black hover:text-red-500"
                    )}
                    title="Delete"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </motion.div>
    );
};

export default TodoItem;
