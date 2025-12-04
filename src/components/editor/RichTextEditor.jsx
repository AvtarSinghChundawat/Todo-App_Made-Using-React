import { useEditor, EditorContent } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Strikethrough, List, ListOrdered, Heading1, Heading2, Code } from 'lucide-react';
import clsx from 'clsx';
import './editor.css';

const SmartEditor = Extension.create({
    name: 'smartEditor',
    addKeyboardShortcuts() {
        const handlePair = (open, close) => {
            return () => {
                this.editor.commands.insertContent(open + close);
                this.editor.commands.setTextSelection(this.editor.state.selection.anchor - 1);
                return true;
            };
        };

        const handleBackspace = () => {
            const { selection, doc } = this.editor.state;
            const { empty, anchor } = selection;
            if (!empty) return false;

            const before = doc.textBetween(anchor - 1, anchor);
            const after = doc.textBetween(anchor, anchor + 1);
            const pairs = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" };

            if (pairs[before] === after) {
                return this.editor.commands.deleteRange({ from: anchor - 1, to: anchor + 1 });
            }
            return false;
        };

        const handleEnter = () => {
            const { selection, doc } = this.editor.state;
            const { empty, anchor } = selection;
            if (!empty) return false;

            const before = doc.textBetween(anchor - 1, anchor);
            const after = doc.textBetween(anchor, anchor + 1);

            // Smart Enter between brackets
            if ((before === '{' && after === '}') || (before === '(' && after === ')') || (before === '[' && after === ']')) {
                return this.editor.chain()
                    .insertContent('\n  \n')
                    .setTextSelection(anchor + 3)
                    .run();
            }

            // Smart Indentation in Code Block
            if (this.editor.isActive('codeBlock')) {
                const pos = this.editor.state.selection.$head;
                const lineStart = pos.before();
                const lineText = doc.textBetween(lineStart, pos.pos, '\n');
                // Find the last newline to get the current line content
                const lastNewLineIndex = lineText.lastIndexOf('\n');
                const currentLine = lastNewLineIndex === -1 ? lineText : lineText.substring(lastNewLineIndex + 1);

                const match = currentLine.match(/^(\s+)/);
                const indentation = match ? match[1] : '';

                return this.editor.chain()
                    .insertContent('\n' + indentation)
                    .run();
            }

            return false;
        };

        const handleTab = () => {
            // Insert 2 spaces on Tab
            this.editor.commands.insertContent('  ');
            return true;
        };

        const handleTagClose = () => {
            // We let the '>' be inserted first, then check
            // But keyboard shortcuts prevent default if we return true.
            // So we manually insert '>' then check.
            this.editor.commands.insertContent('>');

            const { state } = this.editor;
            const { selection } = state;
            const { anchor } = selection;

            // Get text before cursor
            const textBefore = state.doc.textBetween(Math.max(0, anchor - 20), anchor);
            const match = textBefore.match(/<([a-zA-Z0-9]+)>$/);

            if (match) {
                const tagName = match[1];
                // Don't auto-close void tags
                const voidTags = ['br', 'hr', 'img', 'input', 'link', 'meta'];
                if (!voidTags.includes(tagName)) {
                    this.editor.commands.insertContent(`</${tagName}>`);
                    this.editor.commands.setTextSelection(anchor);
                }
            }
            return true;
        };

        return {
            '(': handlePair('(', ')'),
            '[': handlePair('[', ']'),
            '{': handlePair('{', '}'),
            '"': handlePair('"', '"'),
            "'": handlePair("'", "'"),
            'Backspace': handleBackspace,
            'Backspace': handleBackspace,
            'Enter': handleEnter,
            'Tab': handleTab,
            '>': handleTagClose
        };
    },
});

const MenuBar = ({ editor, isDark }) => {
    if (!editor) {
        return null;
    }

    const buttons = [
        {
            icon: <Bold size={18} />,
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: editor.isActive('bold'),
            title: 'Bold',
        },
        {
            icon: <Italic size={18} />,
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: editor.isActive('italic'),
            title: 'Italic',
        },
        {
            icon: <Strikethrough size={18} />,
            action: () => editor.chain().focus().toggleStrike().run(),
            isActive: editor.isActive('strike'),
            title: 'Strike',
        },
        {
            icon: <Heading1 size={18} />,
            action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: editor.isActive('heading', { level: 1 }),
            title: 'Heading 1',
        },
        {
            icon: <Heading2 size={18} />,
            action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: editor.isActive('heading', { level: 2 }),
            title: 'Heading 2',
        },
        {
            icon: <List size={18} />,
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: editor.isActive('bulletList'),
            title: 'Bullet List',
        },
        {
            icon: <ListOrdered size={18} />,
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: editor.isActive('orderedList'),
            title: 'Ordered List',
        },
        {
            icon: <Code size={18} />,
            action: () => editor.chain().focus().toggleCodeBlock().run(),
            isActive: editor.isActive('codeBlock'),
            title: 'Code Block',
        },
    ];

    return (
        <div className={clsx(
            "flex flex-wrap gap-1 p-2 border-b mb-2 sticky top-0 z-10",
            isDark ? "border-gray-700 bg-[#343434]" : "border-gray-300 bg-[#FEF6C3]"
        )}>
            {buttons.map((btn, index) => (
                <button
                    key={index}
                    onClick={(e) => { e.preventDefault(); btn.action(); }}
                    title={btn.title}
                    className={clsx(
                        "p-1.5 rounded transition-colors",
                        btn.isActive
                            ? (isDark ? "bg-[#6C63FF] text-white" : "bg-[#6C63FF] text-white")
                            : (isDark ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-200")
                    )}
                >
                    {btn.icon}
                </button>
            ))}
        </div>
    );
};

const RichTextEditor = ({ content, onChange, isDark, editable = true }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Write something amazing...',
            }),
            SmartEditor,
        ],
        content: content,
        editable: editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: clsx(
                    'prose max-w-none focus:outline-none min-h-[150px] p-4',
                    isDark ? 'prose-invert text-white' : 'text-black'
                ),
            },
        },
    });

    return (
        <div className={clsx(
            "rounded-lg border overflow-hidden flex flex-col h-full",
            isDark ? "border-[#6C63FF] bg-[#2b2b2b]" : "border-black bg-white"
        )}>
            {editable && <MenuBar editor={editor} isDark={isDark} />}
            <div className="flex-1 overflow-y-auto scrollbar-custom">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};

export default RichTextEditor;
