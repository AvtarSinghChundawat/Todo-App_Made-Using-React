'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit2, Calendar, Clock } from 'lucide-react';
import clsx from 'clsx';
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/styles/overlayscrollbars.css";
import { useTodos } from '../../context/TodoContext';

const ViewTodoModal = () => {
    const {
        isViewModalOpen,
        closeViewModal,
        viewingTodo,
        openModal,
        isDark
    } = useTodos();

    if (!viewingTodo) return null;

    const handleEdit = () => {
        closeViewModal();
        openModal(viewingTodo.id, viewingTodo.title, viewingTodo.content);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <AnimatePresence>
            {isViewModalOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeViewModal}
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
                        {/* Header */}
                        <div className={clsx(
                            "p-6 flex items-start justify-between border-b shrink-0",
                            isDark ? "border-gray-700" : "border-gray-200"
                        )}>
                            <div className="flex-1 min-w-0 mr-4">
                                <h2 className={clsx(
                                    "text-3xl font-bold break-words leading-tight mb-2",
                                    isDark ? "text-white" : "text-gray-900",
                                    viewingTodo.completed && "line-through opacity-60"
                                )}>
                                    {viewingTodo.title}
                                </h2>
                                <div className={clsx(
                                    "flex items-center gap-2 text-sm",
                                    isDark ? "text-gray-400" : "text-gray-500"
                                )}>
                                    <Calendar size={14} />
                                    <span>Created on {formatDate(viewingTodo.createdAt || new Date().toISOString())}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={handleEdit}
                                    className={clsx(
                                        "p-2 rounded-full transition-colors flex items-center gap-2 px-4",
                                        isDark ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                                    )}
                                >
                                    <Edit2 size={18} />
                                    <span className="font-medium">Edit</span>
                                </button>
                                <button
                                    onClick={closeViewModal}
                                    className={clsx(
                                        "p-2 rounded-full transition-colors",
                                        isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                                    )}
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <OverlayScrollbarsComponent
                            className="flex-1 p-8 overflow-y-auto"
                            options={{
                                scrollbars: {
                                    autoHide: 'leave',
                                    theme: 'os-theme-custom',
                                }
                            }}
                            defer
                        >
                            <div
                                className={clsx(
                                    "prose max-w-none text-lg leading-relaxed",
                                    isDark ? "prose-invert text-gray-200" : "text-gray-800"
                                )}
                                dangerouslySetInnerHTML={{ __html: viewingTodo.content }}
                            />
                        </OverlayScrollbarsComponent>

                        {/* Footer */}
                        <div className={clsx(
                            "p-4 border-t flex justify-end shrink-0",
                            isDark ? "border-gray-700 bg-[#2b2b2b]" : "border-gray-200 bg-gray-50"
                        )}>
                            <button
                                onClick={closeViewModal}
                                className={clsx(
                                    "px-6 py-2 rounded-xl font-medium transition-colors",
                                    isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-200"
                                )}
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ViewTodoModal;
