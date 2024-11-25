import React, { useEffect, useState } from 'react';
import { EditorContent, useEditor, JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

/**
 * Props for the MessageReader component.
 *
 * @typedef {Object} MessageReaderProps
 * @property {() => Promise<JSONContent>} [fetchContent] - Optional callback function to fetch content.
 * @property {JSONContent} [initialValue] - Optional initial JSON content to display.
 * @property {JSONContent} [value] - Optional dynamic content to display (overrides initialValue).
 */
interface MessageReaderProps {
    fetchContent?: () => Promise<JSONContent>;
    initialValue?: JSONContent;
    value?: JSONContent;
}

/**
 * MessageReader - A read-only component to render JSON content using Tiptap.
 *
 * This component either fetches content via `fetchContent` or uses the provided `initialValue` or `value`.
 * Editing is disabled, making it suitable for viewing purposes only.
 *
 * @component
 * @param {MessageReaderProps} props - Component props.
 * @returns {JSX.Element} Component displaying rendered JSON content.
 *
 * @example
 * <MessageReader fetchContent={async () => await myCustomFetch()} />
 * <MessageReader initialValue={myJsonContent} />
 * <MessageReader value={myUpdatedJsonContent} />
 */
const MessageReader: React.FC<MessageReaderProps> = ({ fetchContent, initialValue, value }) => {
    const [jsonContent, setJsonContent] = useState<JSONContent | null>(initialValue || value || null);

    const editor = useEditor({
        extensions: [StarterKit],
        content: jsonContent || '',
        editable: false,
    });

    useEffect(() => {
        const loadContent = async () => {
            if (fetchContent) {
                try {
                    const content = await fetchContent();
                    setJsonContent(content);
                } catch (error) {
                    console.error('Error loading JSON content:', error);
                }
            }
        };

        if (fetchContent) {
            loadContent();
        }
    }, [fetchContent]);

    useEffect(() => {
        if (value !== undefined && value !== jsonContent) {
            setJsonContent(value);
        }
    }, [value, jsonContent]);

    useEffect(() => {
        if (editor && jsonContent) {
            editor.commands.setContent(jsonContent);
        }
    }, [editor, jsonContent]);

    if (!jsonContent) {
        return null;
    }

    return (
        <>
            {editor && <EditorContent editor={editor} />}
        </>
    );
};

export default MessageReader;
