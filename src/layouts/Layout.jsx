import { useState, useRef, useEffect } from 'react';
import { Search, Plus, Moon, Sun, Download, Upload, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/styles/overlayscrollbars.css";
import { useTodos } from '../context/TodoContext';
import TodoItem from '../components/todo/TodoItem';
import TodoModal from '../components/todo/TodoModal';
import ViewTodoModal from '../components/todo/ViewTodoModal';

const Layout = () => {
    const {
        filteredTodos,
        isDark,
        toggleTheme,
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        openModal,
        importTodos,
        exportTodos,
        undoDelete,
        recentlyDeleted
    } = useTodos();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const fileInputRef = useRef(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            importTodos(file);
        }
    };

    return (
        <div className={clsx(
            "h-screen w-full transition-colors duration-300 flex flex-col items-center p-7 sm:py-4 sm:px-6 lg:px-8 font-['Evo'] overflow-hidden",
            isDark ? "bg-[#343434] text-white" : "bg-[#FEF6C3] text-gray-900"
        )}>
            <div className="w-full max-w-4xl flex flex-col gap-4 h-full">

                {/* Header */}
                <header className="flex items-center justify-between w-full">
                    <h1 className="text-[2em] md:text-[2.5em] tracking-tight">TODO APP</h1>

                    <div className="relative z-30">
                        <button
                            onClick={() => setIsImportOpen(!isImportOpen)}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-2 rounded-[14px] transition-all shadow-lg",
                                isDark ? "bg-[#6C63FF] text-white hover:bg-[#7B73FF]" : "bg-[#6C63FF] text-white hover:bg-[#7B73FF]",
                                "hover:shadow-[0_0_10px_rgba(124,115,255,0.6)]"
                            )}
                        >
                            <span className="uppercase tracking-wider font-bold text-sm">IMPORT</span>
                            <ChevronDown size={18} className={clsx("transition-transform duration-300", isImportOpen && "rotate-180")} />
                        </button>

                        <AnimatePresence>
                            {isImportOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className={clsx(
                                        "absolute right-0 mt-2 w-48 rounded-[15px] shadow-xl border overflow-hidden z-50",
                                        isDark ? "bg-[#333] border-[#6C63FF] text-white" : "bg-[#FEF6C3] border-[#6C63FF] text-black"
                                    )}
                                >
                                    <button
                                        onClick={handleImportClick}
                                        className={clsx(
                                            "w-full px-4 py-2 text-left flex items-center gap-2 transition-colors border-b",
                                            isDark ? "hover:bg-gray-600 border-gray-600" : "hover:bg-gray-300 border-gray-300"
                                        )}
                                    >
                                        <Upload size={16} /> Import JSON
                                    </button>
                                    <button
                                        onClick={exportTodos}
                                        className={clsx(
                                            "w-full px-4 py-2 text-left flex items-center gap-2 transition-colors",
                                            isDark ? "hover:bg-gray-600" : "hover:bg-gray-300"
                                        )}
                                    >
                                        <Download size={16} /> Export JSON
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept=".json"
                                        onChange={handleFileChange}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </header>

                {/* Controls Bar */}
                <div className="flex flex-col md:flex-row gap-3 w-full">
                    {/* Search */}
                    <div className={clsx(
                        "w-full md:flex-1 flex items-center gap-3 px-3 py-1.5 rounded-[14px] border-[1px] transition-all",
                        isDark ? "bg-transparent border-white" : "bg-transparent border-black"
                    )}>
                        <Search size={20} className={isDark ? "text-white" : "text-black"} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search Todo..."
                            className={clsx(
                                "flex-1 bg-transparent border-none outline-none text-base",
                                isDark ? "placeholder-gray-400 text-white" : "placeholder-gray-600 text-black"
                            )}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')}>
                                <X size={18} className={isDark ? "text-white" : "text-black"} />
                            </button>
                        )}
                    </div>

                    {/* Filters & Theme & View */}
                    <div className="flex gap-2 w-full md:w-auto">
                        {/* Filter Dropdown */}
                        <div className="relative z-20 flex-1 md:flex-none">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={clsx(
                                    "h-full px-3 py-1.5 rounded-[14px] flex items-center gap-2 justify-between transition-colors w-full md:w-auto min-w-[110px]",
                                    "bg-[#6C63FF] text-white hover:bg-[#7B73FF] hover:shadow-[0_0_10px_rgba(124,115,255,0.6)]"
                                )}
                            >
                                <span className="font-medium uppercase text-sm">{filter === 'ALL' ? 'All' : filter}</span>
                                <ChevronDown size={18} className={clsx("transition-transform duration-300", isDropdownOpen && "rotate-180")} />
                            </button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className={clsx(
                                            "absolute top-full right-0 mt-2 w-full md:w-40 rounded-[15px] shadow-xl border overflow-hidden",
                                            isDark ? "bg-[#333] border-[#6C63FF] text-white" : "bg-[#FEF6C3] border-[#6C63FF] text-black"
                                        )}
                                    >
                                        {['ALL', 'COMPLETE', 'INCOMPLETE'].map((opt) => (
                                            <button
                                                key={opt}
                                                onClick={() => { setFilter(opt); setIsDropdownOpen(false); }}
                                                className={clsx(
                                                    "w-full px-4 py-2 text-left transition-colors border-b last:border-none text-sm",
                                                    isDark ? "hover:bg-gray-600 border-gray-600" : "hover:bg-gray-300 border-gray-300"
                                                )}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-[14px] bg-[#6C63FF] text-white hover:bg-[#7B73FF] hover:shadow-[0_0_10px_rgba(124,115,255,0.6)] transition-all aspect-square flex items-center justify-center"
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Add Todo Button */}
                        <button
                            onClick={() => openModal()}
                            className="px-4 py-1.5 rounded-[14px] bg-[#6C63FF] text-white font-bold text-xl hover:bg-[#7B73FF] shadow-[0_0_10px_rgba(124,115,255,0.6)] transition-all flex items-center justify-center aspect-square"
                        >
                            <Plus size={24} />
                        </button>
                    </div>
                </div>

                {/* Todo List Container */}
                <div className="relative flex-1 w-full min-h-0">
                    {/* Visual Border Container */}
                    <div className={clsx(
                        "absolute top-0 bottom-0 left-0 right-6 rounded-[20px] border-[2px] pointer-events-none z-10",
                        isDark ? "border-[#6C63FF]" : "border-[#6C63FF]"
                    )} />

                    <OverlayScrollbarsComponent
                        className={clsx(
                            "h-full w-full",
                            isDark ? "bg-transparent" : "bg-transparent"
                        )}
                        options={{
                            scrollbars: {
                                autoHide: 'never',
                                theme: 'os-theme-custom',
                            }
                        }}
                        defer
                    >
                        {filteredTodos.length > 0 ? (
                            <div className="flex flex-col gap-4 pb-20 p-4 pr-10"> {/* Added extra right padding to clear border */}
                                <AnimatePresence mode='popLayout'>
                                    {filteredTodos.map((todo, index) => (
                                        <TodoItem key={todo.id} todo={todo} index={index} />
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className={clsx(
                                "flex flex-col items-center justify-center h-full opacity-50 pr-4",
                                isDark ? "text-gray-400" : "text-gray-500"
                            )}>
                                <p className="text-xl">No todos found</p>
                            </div>
                        )}
                    </OverlayScrollbarsComponent>
                </div>
            </div>

            {/* Undo Toast */}
            <AnimatePresence>
                {recentlyDeleted.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 right-8 z-50"
                    >
                        <button
                            onClick={undoDelete}
                            className="bg-[#6C63FF] text-white px-6 py-3 rounded-xl shadow-lg font-bold hover:bg-[#5a52d5] transition-colors flex items-center gap-2"
                        >
                            Undo Delete ({recentlyDeleted.length})
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <TodoModal />
            <ViewTodoModal />
        </div>
    );
};

export default Layout;
