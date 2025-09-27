'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import TextAlign from '@tiptap/extension-text-align';
import StarterKit from '@tiptap/starter-kit';
import { Menubar } from './Menubar';

export function RichTextEditor({
    field,
}: {
    field: { value: string; onChange: (value: string) => void };
}) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],

        editorProps: {
            attributes: {
                class: 'min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none',
            },
        },

        onUpdate: ({ editor }) => {
            field.onChange(JSON.stringify(editor.getJSON()));
        },

        content: field.value ? JSON.parse(field.value) : '<p>Start typing...</p>',
        immediatelyRender: false,
    });

    return (
        <div className="border-input dark:bg-input/30 w-full overflow-hidden rounded-lg border">
            <Menubar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
