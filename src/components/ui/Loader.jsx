import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = false, text = "Loading..." }) => {
    const containerClasses = fullScreen
        ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm"
        : "flex flex-col items-center justify-center p-8";

    return (
        <div className={containerClasses}>
            <motion.div
                className="relative w-16 h-16 mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
                <span className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-indigo-500 border-r-purple-500 rounded-full opacity-75"></span>
                <span className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-b-pink-500 border-l-blue-500 rounded-full opacity-75 rotate-180"></span>
            </motion.div>
            {text && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    className="text-sm font-medium text-neutral-600 dark:text-neutral-400"
                >
                    {text}
                </motion.p>
            )}
        </div>
    );
};

export default Loader;
