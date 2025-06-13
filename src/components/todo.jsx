import React, { useState } from 'react';
// import '../output.css';

export const Todo = (props) => {
    // State for edit mode
    const [isEditing, setIsEditing] = useState(false); // Whether this todo is being edited
    const [editTitle, setEditTitle] = useState(props.title || ''); // Title in edit mode
    const [editContent, setEditContent] = useState(props.content || ''); // Content in edit mode

    // Handle edit/save click
    const handleEditClick = () => {
        if (isEditing) {
            if (!editTitle.trim() && !editContent.trim()) {
                // Both empty: delete todo
                props.onDelete(props.id);
            } else {
                // Save edited todo
                props.onEdit(props.id, editTitle, editContent);
            }
        }
        setIsEditing(!isEditing);
    };

    return (
        <div className={`w-[100%] rounded-[0px] shrink-0 border-t ${props.isDark ? 'border-white' : 'border-black'} pt-[15px] p-2 flex justify-between items-center`}>
            <div className="flex gap-3 items-center w-[80%]">
                {/* Checkbox: controls completed status via parent */}
                <label htmlFor={`checkbox-${props.id}`} className="relative flex items-center cursor-pointer group">
                    {/* Visually hidden native checkbox */}
                    <input
                        type="checkbox"
                        id={`checkbox-${props.id}`}
                        checked={props.completed}
                        onChange={() => props.onToggleCompleted(props.id)}
                        className="sr-only peer"
                        name="Title"
                    />
                    {/* Custom checkbox visual */}
                    <span
                        className={`w-6 h-6 flex items-center justify-center rounded border-2 transition-colors duration-200
      ${props.completed ? 'bg-[#6C63FF] border-[#6C63FF]' : (props.isDark ? 'border-gray-400' : 'border-gray-500')}
    `}
                    >
                        {props.completed && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </span>
                </label>

                <div className='flex flex-col gap-2'>
                    {isEditing ? (
                        <>
                            {/* Edit title textarea */}
                            <textarea
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck={false}
                                className={`text-blue-300 scrollbar-custom text-[1.2rem] w-full p-1 rounded ${props.isDark ? 'bg-gray-800' : 'bg-white'}`}
                                value={editTitle}
                                onChange={e => setEditTitle(e.target.value)}
                            />
                            {/* Edit content textarea */}
                            <textarea
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck={false}
                                className={`w-full p-1 rounded scrollbar-custom ${props.isDark ? 'bg-gray-800' : 'bg-white'}`}
                                value={editContent}
                                onChange={e => setEditContent(e.target.value)}
                            />
                        </>
                    ) : (
                        <>
                            {/* Display title, strikethrough if completed */}
                            <div className={`text-[1.2rem] break-words whitespace-normal w-full ${props.completed ? `line-through ${props.isDark ? 'text-gray-200' : 'text-gray-500'}` : `${props.isDark ? 'text-blue-300' : 'text-blue-700'}`}`}
                            >
                                {props.title}
                            </div>
                            {/* Display content, strikethrough if completed */}
                            {props.content && (
                                <div className={`content ${props.completed ? 'line-through text-gray-400' : ''}`}>
                                    {props.content}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <div className='flex gap-3 items-center'>
                {/* Edit/save icon */}
                <div className='group hover:cursor-pointer' onClick={handleEditClick}>
                    {isEditing ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className={`${props.isDark ? 'stroke-white fill-white' : 'stroke-black fill-black'}`} x="0px" y="0px" width="18" height="18" viewBox="0 0 50 50">
                            <path d="M 11 4 C 7.101563 4 4 7.101563 4 11 L 4 39 C 4 42.898438 7.101563 46 11 46 L 39 46 C 42.898438 46 46 42.898438 46 39 L 46 15 L 44 17.3125 L 44 39 C 44 41.800781 41.800781 44 39 44 L 11 44 C 8.199219 44 6 41.800781 6 39 L 6 11 C 6 8.199219 8.199219 6 11 6 L 37.40625 6 L 39 4 Z M 43.25 7.75 L 23.90625 30.5625 L 15.78125 22.96875 L 14.40625 24.4375 L 23.3125 32.71875 L 24.09375 33.4375 L 24.75 32.65625 L 44.75 9.03125 Z"></path>
                        </svg>
                    ) : (
                        <svg className={`${props.isDark ? 'stroke-white' : 'stroke-black'} group-hover:stroke-green-400`} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.67272 5.99106L2 12.6637V16H5.33636L12.0091 9.32736M8.67272 5.99106L11.0654 3.59837L11.0669 3.59695C11.3962 3.26759 11.5612 3.10261 11.7514 3.04082C11.9189 2.98639 12.0993 2.98639 12.2669 3.04082C12.4569 3.10257 12.6217 3.26735 12.9506 3.59625L14.4018 5.04738C14.7321 5.37769 14.8973 5.54292 14.9592 5.73337C15.0136 5.90088 15.0136 6.08133 14.9592 6.24885C14.8974 6.43916 14.7324 6.60414 14.4025 6.93398L14.4018 6.93468L12.0091 9.32736M8.67272 5.99106L12.0091 9.32736"></path></svg>
                    )}
                </div>
                {/* Delete icon */}
                <div className='group hover:cursor-pointer' onClick={() => props.onDelete(props.id)}>
                    <svg width="18" className={`${props.isDark ? 'stroke-white' : 'stroke-black'} group-hover:stroke-red-500`} height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.87414 7.61505C3.80712 6.74386 4.49595 6 5.36971 6H12.63C13.5039 6 14.1927 6.74385 14.1257 7.61505L13.6064 14.365C13.5463 15.1465 12.8946 15.75 12.1108 15.75H5.88894C5.10514 15.75 4.45348 15.1465 4.39336 14.365L3.87414 7.61505Z" />
                        <path d="M14.625 3.75H3.375" />
                        <path d="M7.5 2.25C7.5 1.83579 7.83577 1.5 8.25 1.5H9.75C10.1642 1.5 10.5 1.83579 10.5 2.25V3.75H7.5V2.25Z" />
                        <path d="M10.5 9V12.75" />
                        <path d="M7.5 9V12.75" />
                    </svg>
                </div>
            </div>
        </div>
    );
};
