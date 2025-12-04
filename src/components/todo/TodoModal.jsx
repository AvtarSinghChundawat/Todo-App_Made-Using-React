import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import clsx from 'clsx';
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/styles/overlayscrollbars.css";
import { useTodos } from '../../context/TodoContext';
import RichTextEditor from '../editor/RichTextEditor';

const TodoModal = () => {
    const {
        isModalOpen,
        closeModal,
        saveTodo,
        todoTitle,
        setTodoTitle,
        todoContent,
        setTodoContent,
        editingId,
        isDark
    } = useTodos();

    return (
        <AnimatePresence>
            {isModalOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className={clsx(
                            "fixed inset-4 md:inset-10 z-50 rounded-[20px] shadow-2xl overflow-hidden flex flex-col",
                            isDark ? "bg-[#2b2b2b] border border-[#6C63FF]" : "bg-white"
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={clsx(
                            "p-6 flex items-center justify-between border-b",
                            isDark ? "border-gray-700" : "border-gray-200"
                        )}>
                            <h2 className={clsx("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                                {editingId ? 'Edit Todo' : 'New Todo'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className={clsx(
                                    "p-2 rounded-full transition-colors",
                                    isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                                )}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <OverlayScrollbarsComponent
                            className="p-6 flex-1 overflow-y-auto flex flex-col gap-6"
                            options={{
                                scrollbars: {
                                    autoHide: 'leave',
                                    theme: isDark ? 'os-theme-light' : 'os-theme-dark',
                                }
                            }}
                            defer
                        >
                            <div>
                                <label className={clsx("block text-sm font-medium mb-2 opacity-70", isDark ? "text-gray-300" : "text-gray-700")}>
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={todoTitle}
                                    onChange={(e) => setTodoTitle(e.target.value)}
                                    placeholder="What needs to be done?"
                                    className={clsx(
                                        "w-full p-4 rounded-xl text-xl font-semibold bg-transparent border-2 focus:border-[#6C63FF] outline-none transition-colors",
                                        isDark
                                            ? "border-gray-600 text-white placeholder-gray-500"
                                            : "border-gray-300 text-gray-900 placeholder-gray-400"
                                    )}
                                    autoFocus
                                />
                            </div>

                            <div className="flex-1 flex mt-3 flex-col min-h-[300px]">
                                <label className={clsx("block text-sm font-medium mb-2 opacity-70", isDark ? "text-gray-300" : "text-gray-700")}>
                                    Description
                                </label>
                                <div className="flex-1 overflow-hidden flex flex-col">
                                    <RichTextEditor
                                        content={todoContent}
                                        onChange={setTodoContent}
                                        isDark={isDark}
                                    />
                                </div>
                            </div>
                        </OverlayScrollbarsComponent>

                        <div className={clsx(
                            "p-6 border-t flex justify-end gap-4",
                            isDark ? "border-gray-700 bg-[#2b2b2b]" : "border-gray-200 bg-gray-50"
                        )}>
                            <button
                                onClick={closeModal}
                                className={clsx(
                                    "px-6 py-3 rounded-xl font-medium transition-colors",
                                    isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-200"
                                )}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveTodo}
                                disabled={!todoTitle.trim()}
                                className="px-8 py-3 bg-[#6C63FF] hover:bg-[#5a52d5] text-white rounded-xl font-bold shadow-lg shadow-[#6C63FF]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {editingId ? 'Save Changes' : 'Create Todo'}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default TodoModal;
