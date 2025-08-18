import { useState, useRef, useEffect } from 'react';
import close from './assets/close.svg';
import './App.css';
// import './output.css';
import { Todo } from './components/todo.jsx';

function App() {
  const [filter, setFilter] = useState("all"); // default

  // ======= THEME (Dark/Light) =======
  // ======= THEME (Dark/Light) =======
  // ======= THEME (Dark/Light) =======
  // ======= THEME (Dark/Light) =======
  // ======= THEME (Dark/Light) =======
  const [isDark, setIsDark] = useState(() => { // Theme mode, loaded from localStorage on mount
    const savedMode = localStorage.getItem('theme');
    return savedMode ? savedMode === 'dark' : true;
  });

  useEffect(() => { // Set body background color according to theme
    if (isDark) {
      document.body.style.backgroundColor = '#343434';
    } else {
      document.body.style.backgroundColor = '#FEF6C3';
    }
  }, [isDark]);

  useEffect(() => { // Persist theme to localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => { // Set theme from localStorage on mount
    const savedMode = localStorage.getItem('theme');
    if (savedMode) setIsDark(savedMode === 'dark');

    const savedFilter = localStorage.getItem("filter")
    console.log(savedFilter)
    setFilter(savedFilter);
  }, []);

  // ======= MINIMAL MODE =======
  // ======= MINIMAL MODE =======
  // ======= MINIMAL MODE =======
  // ======= MINIMAL MODE =======
  // ======= MINIMAL MODE =======
  const [minimal, setMinimal] = useState(false); // Toggle minimal UI

  useEffect(() => { // Log minimal mode changes (debug)
    console.log(`minimal mode: ${minimal}`);
  }, [minimal]);

  // ======= FULLSCREEN MODE =======
  // ======= FULLSCREEN MODE =======
  // ======= FULLSCREEN MODE =======
  // ======= FULLSCREEN MODE =======
  // ======= FULLSCREEN MODE =======
  const [fullscreenTodo, setFullscreenTodo] = useState(null);
  const [fullscreen, setFullscreen] = useState(false); // Toggle fullscreen mode

  // ======= SEARCH BAR =======
  // ======= SEARCH BAR =======
  // ======= SEARCH BAR =======
  // ======= SEARCH BAR =======
  // ======= SEARCH BAR =======
  const [inputValue, setInputValue] = useState(''); // Value of search input

  const clearInput = () => setInputValue(''); // Clear search bar

  // ======= DROPDOWN FILTER =======
  // ======= DROPDOWN FILTER =======
  // ======= DROPDOWN FILTER =======
  // ======= DROPDOWN FILTER =======
  // ======= DROPDOWN FILTER =======
  const [isOpen, setIsOpen] = useState(false); // Dropdown open/close
  const [selectedOption, setSelectedOption] = useState('ALL'); // Dropdown filter value
  const [buttonHeight, setButtonHeight] = useState(0); // Height for dropdown styling
  const buttonRef = useRef(null); // Ref for dropdown button (height)
  const dropdownRef = useRef(null); // Ref for dropdown (outside click)

  useEffect(() => { // Update dropdown button height for styling
    if (buttonRef.current) setButtonHeight(buttonRef.current.offsetHeight);
  });

  useEffect(() => { // Close dropdown on outside click
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen); // Toggle dropdown open/close
  const toggleImport = () => setImportExport(!importexport);

  const handleOptionClick = (option) => { // Select dropdown option
    setSelectedOption(option);
    setIsOpen(false);
    localStorage.setItem('filter', option)
  };

  const importOptions = ['IMPORT', 'EXPORT']
  const options = ['ALL', 'COMPLETE', 'INCOMPLETE']; // Dropdown options

  // ======= MODAL (Add/Edit Todo) =======
  // ======= MODAL (Add/Edit Todo) =======
  // ======= MODAL (Add/Edit Todo) =======
  // ======= MODAL (Add/Edit Todo) =======
  // ======= MODAL (Add/Edit Todo) =======
  const [isVisible, setIsVisible] = useState(false); // Modal visibility
  const [isEditing, setIsEditing] = useState(false); // Edit mode
  const [currentTodoId, setCurrentTodoId] = useState(null); // Editing todo id
  const inputRef = useRef(null); // Ref for modal input (autofocus)

  useEffect(() => { // Autofocus input when modal opens
    if (isVisible && inputRef.current) inputRef.current.focus();
  }, [isVisible]);

  const handleShowModal = () => setIsVisible(true); // Show modal

  const handleHideModal = () => { // Hide modal and reset edit state
    setIsVisible(false);
    setIsEditing(false);
    setCurrentTodoId(null);
    setTodoTitle('');
    setTodoContent('');
  };

  // ======= TEXTAREA RESIZE (Modal) =======
  // ======= TEXTAREA RESIZE (Modal) =======
  // ======= TEXTAREA RESIZE (Modal) =======
  // ======= TEXTAREA RESIZE (Modal) =======
  // ======= TEXTAREA RESIZE (Modal) =======
  const contentTextareaRef = useRef(null); // Ref for textarea (manual resize)

  // Top resize (up)
  const isResizingUp = useRef(false); // Is resizing up
  const lastMouseYUp = useRef(0); // Last mouse Y for up resize
  const lastHeightUp = useRef(0); // Last height for up resize
  const mouseMovedUp = useRef(false); // Mouse moved flag (up)
  // Bottom resize (down)
  const isResizingDown = useRef(false); // Is resizing down
  const lastMouseYDown = useRef(0); // Last mouse Y for down resize
  const lastHeightDown = useRef(0); // Last height for down resize
  const mouseMovedDown = useRef(false); // Mouse moved flag (down)

  // Up resize handlers
  // Up resize handlers
  // Up resize handlers
  function handleResizeUpMouseDown(e) { // Start up resize
    e.preventDefault();
    isResizingUp.current = true;
    mouseMovedUp.current = false;
    lastMouseYUp.current = e.clientY;
    lastHeightUp.current = contentTextareaRef.current.offsetHeight;
    document.addEventListener('mousemove', handleResizeUpMouseMove);
    document.addEventListener('mouseup', handleResizeUpMouseUp);
  }

  function handleResizeUpMouseMove(e) { // Resize textarea up
    mouseMovedUp.current = true;
    if (!isResizingUp.current) return;
    const diff = e.clientY - lastMouseYUp.current;
    let newHeight = lastHeightUp.current + diff;
    const minHeight = 64;
    const maxHeight = window.innerHeight * 0.4;
    newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
    contentTextareaRef.current.style.height = `${newHeight}px`;
  }

  function handleResizeUpMouseUp() { // End up resize or shrink on click
    if (!mouseMovedUp.current) {
      const textarea = contentTextareaRef.current;
      if (textarea) {
        const minHeight = 64;
        const currentHeight = textarea.offsetHeight;
        textarea.style.height = Math.max(minHeight, currentHeight - 40) + 'px';
      }
    }
    isResizingUp.current = false;
    document.removeEventListener('mousemove', handleResizeUpMouseMove);
    document.removeEventListener('mouseup', handleResizeUpMouseUp);
  }

  // Down resize handlers
  // Down resize handlers
  // Down resize handlers
  function handleResizeDownMouseDown(e) { // Start down resize
    e.preventDefault();
    isResizingDown.current = true;
    mouseMovedDown.current = false;
    lastMouseYDown.current = e.clientY;
    lastHeightDown.current = contentTextareaRef.current.offsetHeight;
    document.addEventListener('mousemove', handleResizeDownMouseMove);
    document.addEventListener('mouseup', handleResizeDownMouseUp);
  }

  function handleResizeDownMouseMove(e) { // Resize textarea down
    mouseMovedDown.current = true;
    if (!isResizingDown.current) return;
    const diff = e.clientY - lastMouseYDown.current;
    let newHeight = lastHeightDown.current + diff;
    const minHeight = 64;
    const maxHeight = window.innerHeight * 0.4;
    newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
    contentTextareaRef.current.style.height = `${newHeight}px`;
  }

  function handleResizeDownMouseUp() { // End down resize or grow on click
    if (!mouseMovedDown.current) {
      const textarea = contentTextareaRef.current;
      if (textarea) {
        const maxHeight = window.innerHeight * 0.4;
        const currentHeight = textarea.offsetHeight;
        textarea.style.height = Math.min(currentHeight + 40, maxHeight) + 'px';
      }
    }
    isResizingDown.current = false;
    document.removeEventListener('mousemove', handleResizeDownMouseMove);
    document.removeEventListener('mouseup', handleResizeDownMouseUp);
  }

  // ======= TODOS STATE & LOGIC =======
  // ======= TODOS STATE & LOGIC =======
  // ======= TODOS STATE & LOGIC =======
  // ======= TODOS STATE & LOGIC =======
  // ======= TODOS STATE & LOGIC =======
  const [todos, setTodos] = useState(() => { // Main todos array, loaded from localStorage or default
    const stored = localStorage.getItem('todos');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    return [{
      id: Date.now(),
      title: "Hey wassup",
      content: "Avtar this side, I made this todo app using vite and react, used tailwind css for styling and of course html, hope you like it :)",
      completed: false
    }];
  });

  useEffect(() => { // Persist todos to localStorage on change
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const [todoTitle, setTodoTitle] = useState(''); // New todo title input
  const [todoContent, setTodoContent] = useState(''); // New todo content input

  // ======= UNDO DELETE LOGIC =======
  // ======= UNDO DELETE LOGIC =======
  // ======= UNDO DELETE LOGIC =======
  const [recentlyDeleted, setRecentlyDeleted] = useState([]); // Stack of deleted todos for undo
  const [showUndo, setShowUndo] = useState(false); // Show undo button
  const undoTimeoutRef = useRef(null); // Ref for undo timeout

  useEffect(() => { // Cleanup undo timeout on unmount
    return () => {
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    };
  }, []);

  // EXPORT/IMPORT
  const [select, setSelect] = useState('IMPORT')
  const [importexport, setImportExport] = useState(false)

  // ======= HANDLERS/FUNCTIONS =======
  // ======= HANDLERS/FUNCTIONS =======
  // ======= HANDLERS/FUNCTIONS =======
  // ======= HANDLERS/FUNCTIONS =======
  // ======= HANDLERS/FUNCTIONS =======

  // handleFullscreen
  const handleFullscreen = (id, title, content) => {
    setFullscreenTodo({ id, title, content });
    setFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setFullscreen(false);
    setFullscreenTodo(null);
  };

  // handleToggle
  const handleToggle = () => setIsDark(!isDark); // Toggle theme

  // handleAddTodo
  const handleAddTodo = () => { // Add or update todo
    if (todoTitle.trim()) {
      if (isEditing) {
        setTodos(todos.map(todo =>
          todo.id === currentTodoId
            ? { ...todo, title: todoTitle, content: todoContent }
            : todo
        ));
        setIsEditing(false);
        setCurrentTodoId(null);
      } else {
        setTodos([...todos, {
          id: Date.now(),
          title: todoTitle,
          content: todoContent,
          completed: false
        }]);
      }
      setTodoTitle('');
      setTodoContent('');
      setIsVisible(false);
    }
  };

  // handleEditClick
  const handleEditClick = (id, title, content) => { // Prepare modal for editing
    setTodoTitle(title);
    setTodoContent(content);
    setCurrentTodoId(id);
    setIsEditing(true);
    setIsVisible(true);
  };

  // handleDeleteTodo
  const handleDeleteTodo = (id) => { // Delete todo and enable undo
    const todoToDelete = todos.find(todo => todo.id === id);
    setTodos(prev => prev.filter(todo => todo.id !== id));
    setRecentlyDeleted(prev => [todoToDelete, ...prev]);
    setShowUndo(true);
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    undoTimeoutRef.current = setTimeout(() => {
      setShowUndo(false);
      setRecentlyDeleted([]);
    }, 5000);
  };

  // handleUndo
  const handleUndo = () => { // Undo last delete
    if (recentlyDeleted.length > 0) {
      const [lastDeleted, ...rest] = recentlyDeleted;
      setTodos(prev => [lastDeleted, ...prev]);
      setRecentlyDeleted(rest);
      if (rest.length > 0) {
        setShowUndo(true);
        if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
        undoTimeoutRef.current = setTimeout(() => {
          setShowUndo(false);
          setRecentlyDeleted([]);
        }, 5000);
      } else {
        setShowUndo(false);
        if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
      }
    }
  };

  // handleToggleCompleted
  const handleToggleCompleted = (id) => { // Toggle completed status
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  // handleLocalStorage
  function handleLocalStorage(selected) {
    console.log('function called', selected)
    if (selected === "EXPORT") {
      setSelect(selected)
      // Get todos from localStorage
      const todos = JSON.parse(localStorage.getItem("todos")) || [];

      // Convert to JSON string
      const dataStr = JSON.stringify(todos, null, 2);

      // Create a blob file
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      // Create a hidden link and click it
      const link = document.createElement("a");
      link.href = url;
      link.download = "todos.json";
      link.click();

      // Cleanup
      URL.revokeObjectURL(url);
    }
    else if (selected === "IMPORT") {
      console.log(selected)
      setSelect(selected)
      // Create file input dynamically
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json";

      input.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedTodos = JSON.parse(e.target.result);
            // Save back to localStorage
            localStorage.setItem("todos", JSON.stringify(importedTodos));
            alert("Todos imported successfully!");
            window.location.reload(); // optional: refresh UI
          } catch (err) {
            alert("Invalid JSON file");
          }
        };
        reader.readAsText(file);
      };

      input.click();
    }
  };


  // ======= FILTERED TODOS =======
  const filteredTodos = todos.filter(todo => { // Filter by dropdown and search
    if (!filter) {
      if (selectedOption === 'COMPLETE' && !todo.completed) return false;
      if (selectedOption === 'INCOMPLETE' && todo.completed) return false;
      const search = inputValue.trim().toLowerCase();
      if (!search) return true;
      return (
        (todo.title && todo.title.toLowerCase().includes(search)) ||
        (todo.content && todo.content.toLowerCase().includes(search))
      );
    } else {
      if (filter === 'COMPLETE' && !todo.completed) return false;
      if (filter === 'INCOMPLETE' && todo.completed) return false;
      const search = inputValue.trim().toLowerCase();
      if (!search) return true;
      return (
        (todo.title && todo.title.toLowerCase().includes(search)) ||
        (todo.content && todo.content.toLowerCase().includes(search))
      );
    }
  });

  // ======= RENDER =======
  // ======= RENDER =======
  // ======= RENDER =======
  // ======= RENDER =======
  // ======= RENDER =======

  return (
    <div className={`wrapper w-screen flex justify-center relative h-full ${isDark ? 'bg-[#343434] text-white' : 'bg-[#FEF6C3] text-black'}`}>
      <div className={`fullscreen ${fullscreen ? 'flex' : 'hidden'} flex-col items-center gap-[20px] absolute top-0 left-0 h-full w-full ${isDark ? 'bg-[#343434] text-white' : 'bg-[#FEF6C3] text-black'} p-5 border border-[#6C63FF] z-[400]`}>
        <div className='border border-[#6C63FF] h-full w-full px-5 pb-[12px] pt-0 flex flex-col rounded-[14px] overflow-y-auto scrollbar-custom relative'>

          {fullscreenTodo && (
            <>
              <h2 className={`sticky top-[0px] pb-[10px] pt-[15px] ${isDark ? 'bg-[#343434]' : 'bg-[#FEF6C3]'} ${isDark ? 'text-blue-300' : 'text-blue-700'} text-[2rem]`} style={{ lineHeight: 'normal', whiteSpace: 'pre-line' }}>{fullscreenTodo.title}</h2>
              <p style={{ lineHeight: 'normal', whiteSpace: 'pre-line' }} className={`text-[1.125rem]`}>{fullscreenTodo.content}</p>
            </>
          )}
        </div>
        <button onClick={handleCloseFullscreen} className={`
    ${isDark
            ? 'bg-white text-black hover:shadow-[0_0_12px_3px_rgba(255,255,255,0.7)]'
            : 'bg-[#6C63FF] text-white hover:shadow-[0_0_12px_3px_rgba(108,99,255,0.7)]'
          }
    transition-shadow cursor-pointer duration-200
    px-[10px] py-[5px] rounded-[20px] w-fit
  `}>Close</button>
      </div>
      <div className="main flex flex-col items-center relative w-[88%] sm:w-[70%]">
        <div className={`w-[90%] flex flex-col items-center sm:w-full`}>
          <header className='flex w-full justify-between items-center py-5'>
            <div className='text-[1.5em] sm:text-[2em]'>TODO APP</div>
            <div className='flex relative justify-between w-fit bg-[#6C63FF] rounded-[7px] hover:bg-[#7B73FF] hover:shadow-[0_0_10px_rgba(124,115,255,0.6)] z-[399]'
            >
              <div className='relative'>
                <button onClick={() => toggleImport()} className={`flex cursor-pointer px-[15px] py-3 gap-3 ${isDark ? 'text-white' : 'text-black'}`}>
                  <span className='capitalize'>{select}</span>
                  <span className='dropdownSvgContainer flex gap-2'>
                    <span></span>
                    <svg fill='white' height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className={`transition-transform duration-300 ${importexport ? 'rotate-180' : 'rotate-0'}`}>
                      <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
                    </svg>
                  </span>
                  {importexport && (
                    <div className={`absolute top-full left-0 mt-1 w-full ${isDark ? 'bg-[#333] text-white' : 'bg-[#FEF6C3] text-black'} rounded-[15px] shadow-lg border border-[#6C63FF] z-10`}>
                      <ul className={`divide-y ${isDark ? 'divide-gray-200' : 'divide-[black]'} overflow-hidden`}>
                        {importOptions.map((selected, index) => (
                          <li
                            key={index}
                            onClick={() => handleLocalStorage(selected)}
                            className={`flex items-center justify-start pr-[12px] pl-[15px] cursor-pointer ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-300'} transition first:rounded-t-[15px] last:rounded-b-[15px] text-[#6C63FF]`}
                            style={{ height: `${buttonHeight}px` }}
                          >
                            {selected}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </header>
          <div className="search w-full flex gap-4">
            <div className={`rounded-[7px] input flex w-full gap-1 items-center border ${isDark ? 'border-white' : 'border-black'} pr-2 pl-2`}>
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" fill={isDark ? 'white' : 'black'} viewBox="0 0 50 50">
                <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path>
              </svg>

              <div className="inputWrapper flex justify-center items-center w-full">
                <input type="search" autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false} name="search" id="searchInput"
                  className={`w-full focus:outline-0 focus:border-0 p-2 ${isDark ? 'dark' : 'light'}}`}
                  placeholder='Search Todo...'
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  style={{
                    WebkitTextFillColor: isDark ? 'white' : 'black',
                  }}
                />
                {inputValue && (
                  <img onClick={clearInput} src={close} alt="" className={`w-[25px] h-[25px] cursor-pointer ${isDark ? 'invert' : ''}`} />
                )}
              </div>
            </div>

            <div className='dropdownBox flex justify-center gap-3.5'>
              <div className='drop dropdown relative' ref={dropdownRef}>
                <button ref={buttonRef} onClick={toggleDropdown} className={`selector ${isDark ? 'text-white' : 'text-black'}`}>
                  <span>{filter ? filter : selectedOption}</span>
                  <span className='dropdownSvgContainer flex gap-2'>
                    <span></span>
                    <svg fill='white' height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                      <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
                    </svg>
                  </span>
                  {isOpen && (
                    <div className={`absolute top-full left-0 mt-1 w-full ${isDark ? 'bg-[#333] text-white' : 'bg-[#FEF6C3] text-black'} rounded-[15px] shadow-lg border border-[#6C63FF] z-10`}>
                      <ul className={`divide-y ${isDark ? 'divide-gray-200' : 'divide-[black]'} overflow-hidden`}>
                        {options.map((option, index) => (
                          <li
                            key={index}
                            onClick={() => {
                              handleOptionClick(option)
                              setFilter(option)
                            }}
                            className={`flex items-center justify-start pr-[12px] pl-[15px] cursor-pointer ${isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-300'} transition first:rounded-t-[15px] last:rounded-b-[15px] text-[#6C63FF]`}
                            style={{ height: `${buttonHeight}px` }}
                          >
                            {option}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </button>
              </div>

              <button onClick={handleToggle} className="mode border-none bg-[#6C63FF] pr-[10px] pl-[10px] rounded-[7px] cursor-pointer hover:shadow-[0_0_10px_rgba(124,115,255,0.6)] hover:bg-[#7B73FF]">
                {isDark ? (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.1576 1.15764C12.1576 0.518299 11.6394 0 11 0C10.3606 0 9.84235 0.518299 9.84235 1.15764V1.73887C9.84235 2.37822 10.3606 2.89651 11 2.89651C11.6394 2.89651 12.1576 2.37822 12.1576 1.73887V1.15764ZM18.7782 4.85893C19.2302 4.40683 19.2302 3.67386 18.7782 3.22177C18.3261 2.76969 17.5931 2.76969 17.141 3.22177L16.73 3.63282C16.2779 4.08492 16.2779 4.81789 16.73 5.26998C17.182 5.72206 17.915 5.72206 18.3671 5.26998L18.7782 4.85893ZM4.85889 3.22184C4.40681 2.76976 3.67383 2.76976 3.22175 3.22184C2.76967 3.67393 2.76967 4.4069 3.22175 4.859L3.63273 5.26998C4.08483 5.72206 4.8178 5.72206 5.26989 5.26998C5.72197 4.81789 5.72197 4.08492 5.26989 3.63282L4.85889 3.22184ZM1.15764 9.84235C0.518299 9.84235 0 10.3606 0 11C0 11.6394 0.518299 12.1576 1.15764 12.1576H1.73884C2.37819 12.1576 2.89648 11.6394 2.89648 11C2.89648 10.3606 2.37819 9.84235 1.73884 9.84235H1.15764ZM20.2611 9.84235C19.6217 9.84235 19.1035 10.3606 19.1035 11C19.1035 11.6394 19.6217 12.1576 20.2611 12.1576H20.8424C21.4817 12.1576 22 11.6394 22 11C22 10.3606 21.4817 9.84235 20.8424 9.84235H20.2611ZM5.26989 18.3672C5.72197 17.9151 5.72197 17.1821 5.26989 16.7301C4.8178 16.2779 4.08483 16.2779 3.63273 16.7301L3.22177 17.141C2.76968 17.5931 2.76968 18.3261 3.22176 18.7782C3.67385 19.2302 4.40682 19.2302 4.85892 18.7782L5.26989 18.3672ZM18.3671 16.7301C17.915 16.2779 17.182 16.2779 16.73 16.7301C16.2779 17.1821 16.2779 17.9151 16.73 18.3672L17.1409 18.7782C17.5931 19.2303 18.326 19.2303 18.7782 18.7782C19.2302 18.3261 19.2302 17.5932 18.7782 17.141L18.3671 16.7301ZM12.1576 20.2611C12.1576 19.6217 11.6394 19.1035 11 19.1035C10.3606 19.1035 9.84235 19.6217 9.84235 20.2611V20.8424C9.84235 21.4817 10.3606 22 11 22C11.6394 22 12.1576 21.4817 12.1576 20.8424V20.2611ZM6.36943 11C6.36943 8.4426 8.4426 6.36943 11 6.36943C13.5573 6.36943 15.6305 8.4426 15.6305 11C15.6305 13.5573 13.5573 15.6305 11 15.6305C8.4426 15.6305 6.36943 13.5573 6.36943 11ZM11 4.05415C7.1639 4.05415 4.05415 7.1639 4.05415 11C4.05415 14.8361 7.1639 17.9458 11 17.9458C14.8361 17.9458 17.9458 14.8361 17.9458 11C17.9458 7.1639 14.8361 4.05415 11 4.05415Z" fill="#F7F7F7"></path>
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.1249 0.548798C11.3387 0.917354 11.321 1.3762 11.0791 1.72705C10.3455 2.79152 9.91599 4.08062 9.91599 5.47334C9.91599 9.12428 12.8757 12.084 16.5266 12.084C17.9194 12.084 19.2085 11.6545 20.2729 10.9208C20.6238 10.6791 21.0826 10.6613 21.4512 10.8751C21.8197 11.089 22.0319 11.4962 21.9961 11.9208C21.5191 17.567 16.7867 22 11.0178 22C4.93282 22 0 17.0672 0 10.9822C0 5.21328 4.43301 0.480873 10.0792 0.00392422C10.5038 -0.0319387 10.911 0.180242 11.1249 0.548798ZM8.17985 2.63461C4.70452 3.81573 2.20355 7.10732 2.20355 10.9822C2.20355 15.8502 6.14981 19.7964 11.0178 19.7964C14.8927 19.7964 18.1843 17.2955 19.3654 13.8202C18.4741 14.1232 17.5191 14.2875 16.5266 14.2875C11.6587 14.2875 7.71244 10.3413 7.71244 5.47334C7.71244 4.48086 7.87682 3.52582 8.17985 2.63461Z" fill="#F7F7F7"></path>
                  </svg>
                )}
              </button>
            </div>
            <button onClick={() => {
              setMinimal(!minimal)
            }} className={`cursor-pointer addTodo relative bg-[#6C63FF] rounded-[10px] flex justify-center items-center hover:shadow-[0_0_10px_rgba(124,115,255,0.6)] hover:bg-[#7B73FF] w-full text-white`} style={{ minHeight: `${buttonHeight}px` }}>
              <span className='h-[24px] flex justify-center items-center'>{`${minimal ? 'Normal View' : 'Seamless View'}`}</span>
            </button>
            <button onClick={handleShowModal} className={`cursor-pointer z-[100] addTodo relative md:absolute md:bottom-[30px] md:right-[10px] bg-[#6C63FF] md:p-3 rounded-[50%] justify-center items-center hover:shadow-[0_0_10px_rgba(124,115,255,0.6)] hover:bg-[#7B73FF] ${minimal ? 'hidden' : 'flex'} md:min-h-auto `} style={{ minHeight: `${buttonHeight}px` }}>
              <svg width="24px" height="24px" viewBox="-1.4 -1.4 22.80 22.80" xmlns="http://www.w3.org/2000/svg" fill="white" stroke="white" stroke-width="1.42"><g id="SVGRepo_bgCarrier" stroke-whiteidth="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="" stroke-whiteidth="0.24"></g><g id="SVGRepo_iconCarrier"> <path fill="white" d="M10,-1.77635684e-15 C10.4232029,-1.69861573e-15 10.7662767,0.343073746 10.7662767,0.766276659 L10.766,9.233 L19.2337233,9.23372334 C19.6569263,9.23372334 20,9.57679709 20,10 C20,10.4232029 19.6569263,10.7662767 19.2337233,10.7662767 L10.766,10.766 L10.7662767,19.2337233 C10.7662767,19.6569263 10.4232029,20 10,20 C9.57679709,20 9.23372334,19.6569263 9.23372334,19.2337233 L9.233,10.766 L0.766276659,10.7662767 C0.343073746,10.7662767 0,10.4232029 0,10 C0,9.57679709 0.343073746,9.23372334 0.766276659,9.23372334 L9.233,9.233 L9.23372334,0.766276659 C9.23372334,0.343073746 9.57679709,-1.85409795e-15 10,-1.77635684e-15 Z"></path> </g></svg>
            </button>
          </div>
        </div>

        <div className={`actualTodoWritingForm todoContent flex flex-col pt-3 items-center fixed top-[0] bg-black/50 left-0 backdrop-blur-sm min-h-screen w-screen z-[400] transition duration-1000 ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
          <div className={`modalBox ${isVisible ? 'visible' : ''} flex flex-col h-screen sm:h-auto max-h-screen items-center gap-3 px-5 py-5 rounded-2xl w-full ${isDark ? 'border-[#6C63FF]' : 'border-[#FEF6C3]'}`}>
            <form onSubmit={(e) => {
              e.preventDefault();
              console.log(inputValue)
              handleAddTodo();
            }} className="w-[100%] sm:w-[70%]">

              <fieldset className={`relative border-[2px] rounded-2xl px-6 pt-8 pb-6 ${isDark ? 'border-[#6C63FF]' : 'border-[#FEF6C3]'}`}>
                <legend className={`absolute -top-4 left-5 rounded-[20px] px-2 text-lg font-semibold ${isDark ? 'bg-[#FEF6C3] text-[#6C63FF]' : 'bg-[#8a84fc] text-[#FEF6C3]'}`}>
                  {isEditing ? 'Edit Todo' : 'New Todo'}
                </legend>

                <label htmlFor="todoTitle" className={`block mb-2 w-fit px-2 rounded-[7px] ${isDark ? 'bg-[#FEF6C3] text-[#6C63FF]' : 'bg-[#8a84fc] text-white'}`}>Title</label>
                <textarea
                  id="todoTitle"
                  ref={inputRef}
                  type="text"
                  required
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  value={todoTitle}
                  onChange={(e) => setTodoTitle(e.target.value)}
                  className={`p-2 w-full rounded-[10px] border-[2px] scrollbar-custom ${isDark ? 'border-[#867fff] bg-transparent text-white placeholder-white' : 'border-black caret-white'} h-[6rem] sm:h-auto sm:max-h-[4.5rem]`}
                  style={{
                    WebkitTextFillColor: isDark ? 'white' : 'white',
                  }}
                  placeholder="Todo title..."
                />

                <label htmlFor="todoContentInput" className={`block mb-2 mt-5 w-fit px-2 rounded-[7px] ${isDark ? 'bg-[#FEF6C3] text-[#6C63FF]' : 'bg-[#8a84fc] text-white'}`}>Todo</label>
                <div className="relative w-full">
                  <textarea
                    id="todoContentInput"
                    ref={contentTextareaRef}
                    type="text"
                    value={todoContent}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    onChange={(e) => setTodoContent(e.target.value)}
                    className={`p-2 mb-10 w-full rounded-[10px] border-[2px] ${isDark ? 'border-[#6C63FF] bg-transparent text-white placeholder-white' : 'border-black caret-white'} resize-none scrollbar-custom h-[30vh] max-h-[40vh] sm:h-[40vh] sm:max-h-[40vh]`}
                    style={{
                      WebkitTextFillColor: isDark ? 'white' : 'white',
                    }}
                    placeholder="Todo details..."
                  />
                  {/* Custom resize icon */}
                  {/* Bottom left: UP arrow (decrease/drag) */}
                  <div
                    onMouseDown={handleResizeUpMouseDown}
                    className="absolute bottom-3 left-2 w-6 h-6 cursor-n-resize flex items-end justify-end z-10"
                    style={{ userSelect: 'none' }}
                    title="Decrease or drag to resize"
                  >
                    <svg width="22" height="22" viewBox="0 0 22 22" className="text-gray-400 pointer-events-none">
                      <rect x="2" y="2" width="18" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
                      {/* Up arrow only */}
                      <path d="M7 13l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  {/* Bottom right: DOWN arrow (increase/drag) */}
                  <div
                    onMouseDown={handleResizeDownMouseDown}
                    className="absolute bottom-3 right-2 w-6 h-6 cursor-s-resize flex items-end justify-end z-10"
                    style={{ userSelect: 'none' }}
                    title="Increase or drag to resize"
                  >
                    <svg width="22" height="22" viewBox="0 0 22 22" className="text-gray-400 pointer-events-none">
                      <rect x="2" y="2" width="18" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
                      {/* Down arrow only */}
                      <path d="M7 9l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div
                    className={`pointer-events-none absolute left-0 bottom-[4px] w-full h-[37px] 
      ${isDark ? 'bg-[#232323]/80' : 'bg-black/55'}  
      backdrop-blur-[1000px] rounded-[10px]`}
                    style={{
                      // Optional: add a border if you want to match the textarea
                      borderBottomLeftRadius: '10px',
                      borderBottomRightRadius: '10px',
                    }}
                  />
                </div>

                <div className="flex justify-between gap-4 mt-6">
                  <button
                    type="button"
                    onClick={handleHideModal}
                    className="w-full py-2 bg-[#6C63FF] hover:bg-[#bbb8f1] hover:text-black rounded-[10px] text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`w-full py-2 bg-[#6C63FF] hover:bg-[#bbb8f1] hover:text-black rounded-[10px] text-white cursor-pointer`}
                  >
                    {isEditing ? 'Save Changes' : 'Add Todo'}
                  </button>

                </div>
              </fieldset>
            </form>
          </div>
        </div>
        {filteredTodos.length > 0 ? (<div className={`todoContainer flex flex-col scrollbar-custom items-center my-5 px-[15px] gap-1 border-2 ${minimal ? 'max-h-[62%]' : 'max-h-[55%]'} md:max-h-[80%] ${minimal ? 'rounded-[15px]' : 'rounded-[20px]'} border-[#6C63FF] w-full overflow-scroll overflow-x-hidden relative before:content-a
        ${isDark ? 'before:bg-[#343434]' : 'before:bg-[#FEF6C3]'}
        before:h-[0.5px]
        before:left-0
        before:pointer-events-none
        before:absolute
        before:top-[0px]
        before:transition-all
        before:duration-500
        before:w-full
        before:rounded-[20px]
        before:z-[50]`}>
          {todos.length > 0 ? (
            filteredTodos.map(todo => (
              <Todo
                key={todo.id}
                id={todo.id}
                isDark={isDark}
                onEdit={handleEditClick}
                title={todo.title}
                content={todo.content}
                completed={todo.completed}
                onToggleCompleted={handleToggleCompleted}
                onDelete={handleDeleteTodo}
                minimal={minimal}
                toggleFullscreen={handleFullscreen}
              />
            ))
          ) : (''
          )}
        </div>) : (
          <div className={`flex flex-col items-center justify-start px-5 py-10 h-[50vh] w-full ${isDark ? 'bg-[#343434]' : 'bg-[#FEF6C3]'}`}>
            <h2 className={`text-center text-[1.5rem] ${isDark ? 'text-white' : 'text-black'}`}>No Todos Found , Add some ☺️</h2>
          </div>
        )}
      </div>
      {showUndo && recentlyDeleted.length > 0 && (
        <button
          onClick={handleUndo}
          className="fixed cursor-pointer hover:bg-[#6bb7ff] bottom-8 left-8 z-50 bg-[#6C63FF] text-white px-6 py-3 rounded-full shadow-lg animate-fade-in"
          style={{ transition: 'opacity 0.3s' }}
        >
          Undo Delete
        </button>
      )}
    </div >
  );
}

export default App;
