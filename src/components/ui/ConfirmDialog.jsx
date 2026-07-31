'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import { useTodos } from '../../context/TodoContext';

const ConfirmDialog = () => {
    const { confirmDialog, closeConfirmDialog, isDark } = useTodos();
    const { isOpen, title, message, confirmLabel, danger, onConfirm } = confirmDialog;

    const handleConfirm = () => {
        closeConfirmDialog();
        onConfirm?.();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeConfirmDialog}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className={clsx(
                            "relative w-full max-w-sm rounded-[20px] shadow-2xl p-6",
                            isDark ? "bg-[#2b2b2b] border border-[#6C63FF] text-white" : "bg-white text-gray-900"
                        )}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start gap-3 mb-6">
                            <div className={clsx(
                                "p-2 rounded-full shrink-0",
                                danger ? "bg-red-500/15 text-red-500" : "bg-[#6C63FF]/15 text-[#6C63FF]"
                            )}>
                                <AlertTriangle size={20} />
                            </div>
                            <div className="min-w-0">
                                {title && <h3 className="font-bold text-lg mb-1">{title}</h3>}
                                <p className={clsx("text-sm break-words", isDark ? "text-gray-300" : "text-gray-600")}>
                                    {message}
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={closeConfirmDialog}
                                className={clsx(
                                    "px-4 py-2 rounded-xl font-medium text-sm transition-colors",
                                    isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-200"
                                )}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className={clsx(
                                    "px-4 py-2 rounded-xl font-medium text-sm text-white transition-colors",
                                    danger ? "bg-red-600 hover:bg-red-700" : "bg-[#6C63FF] hover:bg-[#7B73FF]"
                                )}
                            >
                                {confirmLabel || 'Confirm'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmDialog;
