'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/styles/overlayscrollbars.css";
import { useTodos } from '../../context/TodoContext';

const RETENTION_DAYS = 30;

const daysLeft = (deletedAt) => {
    const elapsedMs = Date.now() - new Date(deletedAt).getTime();
    const remaining = RETENTION_DAYS - Math.floor(elapsedMs / (24 * 60 * 60 * 1000));
    return Math.max(remaining, 0);
};

const TrashModal = () => {
    const {
        isTrashOpen,
        closeTrash,
        trash,
        restoreFromTrash,
        permanentlyDelete,
        requestConfirm,
        isDark
    } = useTodos();

    return (
        <AnimatePresence>
            {isTrashOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeTrash}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className={clsx(
                            "fixed inset-4 md:inset-10 lg:inset-x-1/4 z-50 rounded-[20px] shadow-2xl overflow-hidden flex flex-col",
                            isDark ? "bg-[#2b2b2b] border border-[#6C63FF]" : "bg-white"
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className={clsx(
                            "p-6 flex items-start justify-between border-b shrink-0",
                            isDark ? "border-gray-700" : "border-gray-200"
                        )}>
                            <div>
                                <h2 className={clsx("text-2xl font-bold", isDark ? "text-white" : "text-gray-900")}>
                                    Trash
                                </h2>
                                <p className={clsx("text-sm mt-1", isDark ? "text-gray-400" : "text-gray-500")}>
                                    Deleted todos are kept for 30 days before being removed for good.
                                </p>
                            </div>
                            <button
                                onClick={closeTrash}
                                className={clsx(
                                    "p-2 rounded-full transition-colors shrink-0",
                                    isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"
                                )}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <OverlayScrollbarsComponent
                            className="flex-1 p-4 overflow-y-auto"
                            options={{ scrollbars: { autoHide: 'leave', theme: 'os-theme-custom' } }}
                            defer
                        >
                            {trash.length === 0 ? (
                                <div className={clsx(
                                    "flex flex-col items-center justify-center h-full py-16 opacity-50 text-center",
                                    isDark ? "text-gray-400" : "text-gray-500"
                                )}>
                                    <Trash2 size={40} className="mb-3" />
                                    <p>Trash is empty</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {trash.map((todo) => (
                                        <div
                                            key={todo.id}
                                            className={clsx(
                                                "flex items-center justify-between gap-4 p-4 rounded-2xl border",
                                                isDark ? "border-gray-700 bg-[#333]" : "border-gray-200 bg-gray-50"
                                            )}
                                        >
                                            <div className="min-w-0">
                                                <p className={clsx(
                                                    "font-semibold truncate",
                                                    isDark ? "text-white" : "text-gray-900"
                                                )}>
                                                    {todo.title}
                                                </p>
                                                <p className={clsx("text-xs mt-1", isDark ? "text-gray-400" : "text-gray-500")}>
                                                    {daysLeft(todo.deletedAt)} day{daysLeft(todo.deletedAt) === 1 ? '' : 's'} left before permanent deletion
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    onClick={() => restoreFromTrash(todo.id)}
                                                    title="Restore"
                                                    className="p-2 rounded-full bg-[#6C63FF] text-white hover:bg-[#7B73FF] transition-colors"
                                                >
                                                    <RotateCcw size={16} />
                                                </button>
                                                <button
                                                    onClick={() => requestConfirm({
                                                        title: 'Delete Forever',
                                                        message: `Permanently delete "${todo.title}"? This cannot be undone.`,
                                                        confirmLabel: 'Delete Forever',
                                                        danger: true,
                                                        onConfirm: () => permanentlyDelete(todo.id),
                                                    })}
                                                    title="Delete forever"
                                                    className={clsx(
                                                        "p-2 rounded-full transition-colors",
                                                        isDark ? "bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white" : "bg-gray-200 hover:bg-red-600 text-gray-600 hover:text-white"
                                                    )}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </OverlayScrollbarsComponent>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default TrashModal;
