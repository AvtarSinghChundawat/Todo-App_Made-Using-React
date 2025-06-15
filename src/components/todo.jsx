import React, { useState } from 'react';
// PROPS from App.jsx:
// props.todo:        The todo object { id, title, content, completed } from App.jsx's todos state
// props.isDark:      Theme mode from App.jsx (isDark state)
// props.onEdit:      handleEditClick from App.jsx (opens modal for editing this todo)
// props.onDelete:    handleDeleteTodo from App.jsx (deletes this todo)
// props.onToggleCompleted: handleToggleCompleted from App.jsx (toggles completed status)
// props.minimal:     Minimal mode from App.jsx (minimal state)

export const Todo = (props) => {
    return (
        <div
            className={`w-[100%] rounded-[0px] shrink-0 border-t-2 rounded-[3px] 
                ${props.isDark ? 'border-[#6C63FF]' : 'border-[#0d00ff]'} 
                ${props.minimal ? 'pt-[11px]' : 'pt-[15px]'} py-2 
                ${props.minimal ? 'px-0' : 'px-2'} 
                flex justify-between items-start`
            }
        >
            <div className={`flex gap-3 ${props.minimal ? 'w-full' : 'w-[76%]'}`}>
                {/* Checkbox: controls completed status via parent */}
                <label
                    htmlFor={`checkbox-${props.id}`}
                    className={`relative flex cursor-pointer group ${props.minimal ? 'hidden' : 'false'}`}
                >
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
                            <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        )}
                    </span>
                </label>

                <div className='flex flex-col gap-1 w-full'>
                    {/* Display title, strikethrough if completed */}
                    <div
                        onClick={() => props.toggleFullscreen(props.id, props.title, props.content)} className={`cursor-pointer text-[1.3rem] break-words whitespace-normal relative top-[-2.7px] w-full 
                            ${props.completed
                                ? `line-through ${props.isDark ? 'text-gray-200' : 'text-gray-500'}`
                                : `${props.isDark ? 'text-blue-300' : 'text-blue-700'}`
                            }`
                        }
                        style={{ lineHeight: 'normal', whiteSpace: 'pre-line' }}
                    >
                        {props.title}
                    </div>
                    {/* Display content, strikethrough if completed */}
                    {props.content && (
                        <div
                            onClick={() => props.toggleFullscreen(props.id, props.title, props.content)} className={`cursor-pointer content ${props.completed ? 'line-through text-gray-400' : ''}`}
                            style={{ whiteSpace: 'pre-line' }}
                        >
                            {props.content}
                        </div>
                    )}
                </div>
            </div>

            <div className={`flex gap-3 ${props.minimal ? 'hidden' : 'false'}`}>
                {/* Edit/save icon */}
                <div
                    className='group hover:cursor-pointer'
                    onClick={() => props.onEdit(props.id, props.title, props.content)}
                >
                    <svg
                        className={`${props.isDark ? 'stroke-white' : 'stroke-black'} group-hover:stroke-green-400`}
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M8.67272 5.99106L2 12.6637V16H5.33636L12.0091 9.32736M8.67272 5.99106L11.0654 3.59837L11.0669 3.59695C11.3962 3.26759 11.5612 3.10261 11.7514 3.04082C11.9189 2.98639 12.0993 2.98639 12.2669 3.04082C12.4569 3.10257 12.6217 3.26735 12.9506 3.59625L14.4018 5.04738C14.7321 5.37769 14.8973 5.54292 14.9592 5.73337C15.0136 5.90088 15.0136 6.08133 14.9592 6.24885C14.8974 6.43916 14.7324 6.60414 14.4025 6.93398L14.4018 6.93468L12.0091 9.32736M8.67272 5.99106L12.0091 9.32736"></path>
                    </svg>
                </div>
                {/* Delete icon */}
                <div
                    className='group hover:cursor-pointer'
                    onClick={() => props.onDelete(props.id)}
                >
                    <svg
                        width="18"
                        className={`${props.isDark ? 'stroke-white' : 'stroke-black'} group-hover:stroke-red-500`}
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
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

