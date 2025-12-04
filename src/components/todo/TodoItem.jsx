import { motion } from 'framer-motion';
import { Check, Trash2, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import { useTodos } from '../../context/TodoContext';

import { useState } from 'react';

const TodoItem = ({ todo, index }) => {
    const { isDark, toggleCompleted, deleteTodo, setEditingId, setIsModalOpen, setTodoTitle, setTodoContent, openViewModal } = useTodos();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleEdit = () => {
        setEditingId(todo.id);
        setTodoTitle(todo.title);
        setTodoContent(todo.content);
        setIsModalOpen(true);
    };

    const handleView = () => {
        openViewModal(todo);
    };

    // Helper to determine if content is "long"
    const isContentLong = (html) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const text = tempDiv.textContent || tempDiv.innerText || '';
        // Check if text is long OR if there are many line breaks/paragraphs
        return text.length > 300 || (html.match(/<br>|<\/p>|<li>/g) || []).length > 3;
    };

    const showReadMore = isContentLong(todo.content);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className={clsx(
                "group relative rounded-[13px] flex items-start justify-between gap-4 p-4 transition-all duration-200 bg-black/10",
                index > 0 && "",
                isDark
                    ? (index > 0 ? "border-[#6C63FF]" : "") + " hover:bg-black/30"
                    : (index > 0 ? "border-[#0d00ff]" : "") + " hover:bg-black/20",
                todo.completed && "opacity-60"
            )}
        >
            <div className="flex items-start gap-3 flex-1 min-w-0">
                <button
                    onClick={() => toggleCompleted(todo.id)}
                    className={clsx(
                        "mt-1 flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors cursor-pointer",
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
                            "prose prose-sm max-w-none cursor-pointer transition-all duration-300",
                            isDark ? "prose-invert text-white" : "text-black",
                            todo.completed && "line-through opacity-70",
                            !isExpanded && "line-clamp-3"
                        )}
                        dangerouslySetInnerHTML={{ __html: todo.content }}
                        onClick={handleView}
                    />

                    {/* Read More / Show Less Button */}
                    {showReadMore && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(!isExpanded);
                            }}
                            className={clsx(
                                "flex items-center gap-1 text-xs font-bold mt-2 px-3 py-1.5 rounded-full transition-all focus:outline-none",
                                isDark
                                    ? "bg-white/10 hover:bg-white/20 text-[#6C63FF]"
                                    : "bg-black/5 hover:bg-black/10 text-[#6C63FF]"
                            )}
                        >
                            {isExpanded ? (
                                <>
                                    Show Less <ChevronUp size={14} />
                                </>
                            ) : (
                                <>
                                    Read More <ChevronDown size={14} />
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleEdit}
                    className={clsx(
                        "p-1 rounded cursor-pointer transition-colors group/edit",
                        isDark ? "text-white hover:text-green-400" : "text-black hover:text-green-400"
                    )}
                    title="Edit"
                >
                    <Edit2 size={18} />
                </button>
                <button
                    onClick={() => deleteTodo(todo.id)}
                    className={clsx(
                        "p-1 rounded cursor-pointer transition-colors group/delete",
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
