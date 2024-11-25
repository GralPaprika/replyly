import React, { useState } from 'react';
import { Content, JSONContent } from '@tiptap/react';
import { MinimalTiptapEditor } from '../minimal-tiptap';
import { jsonToMessageWhatsapp } from '@/lib/jsonToMessageWhatsapp';

import MessagePreview from './MessagePreview';

interface MessageEditorProps {
  initialValue?: Content;
  onChange?: (value: Content) => void;
  placeholder?: string;
  className?: string;
  editorContentClassName?: string;
  editorClassName?: string;
  autofocus?: boolean;
  editable?: boolean;
  output?: 'html' | 'json' | 'text';
  showJson?: boolean;
  showMarkdown?: boolean;
  showPreviewMessage?: boolean;
}

const MessageEditor: React.FC<MessageEditorProps> = ({
  initialValue = '',
  onChange,
  placeholder = 'Type your content here...',
  className = '',
  editorContentClassName = '',
  editorClassName = '',
  autofocus = true,
  editable = true,
  output = 'json',
  showJson = false,
  showMarkdown = false,
  showPreviewMessage = false,
}) => {
  const [value, setValue] = useState<Content>(initialValue);
  const [markdown, setMarkdown] = useState<string>('');

  const handleChange = (newValue: Content) => {
    setValue(newValue);

    try {
      if (
        newValue &&
        typeof newValue !== 'string' &&
        !Array.isArray(newValue) &&
        Array.isArray(newValue.content)
      ) {
        const validContent = newValue.content.map((item: any) => ({
          ...item,
          type: item.type || 'defaultType',
        }));
        const convertedMessage = jsonToMessageWhatsapp(validContent);
        setMarkdown(convertedMessage);
      } else {
        setMarkdown('');
      }

      if (onChange) {
        onChange(newValue);
      }
    } catch (error) {
      console.error('Error during conversion:', error);
    }
  };

  return (
    <div className="relative">
      <MinimalTiptapEditor
        value={value}
        onChange={handleChange}
        className={className}
        editorContentClassName={editorContentClassName}
        output={output}
        placeholder={placeholder}
        autofocus={autofocus}
        editable={editable}
        editorClassName={editorClassName}
      />

      {showPreviewMessage && value && <MessagePreview message={value as JSONContent} />}

      {showJson && (
        <div className="w-full max-w-lg h-[48rem] fixed top-0 left-[105%] backdrop-blur-3xl bg-[#0f0f0fe0] shadow-lg rounded-2xl p-4 overflow-y-scroll z-50">
          <h4 className="font-bold mb-2">JSON Output:</h4>
          <pre className="text-sm text-[mediumpurple]">
            {JSON.stringify(value, null, 2)}
          </pre>
        </div>
      )}

      {showMarkdown && (
        <div className="w-full max-w-lg h-[48rem] fixed top-0 right-[105%] backdrop-blur-3xl bg-[#0f0f0fe0] shadow-lg rounded-2xl p-4 overflow-y-scroll z-50">
          <h4 className="font-bold mb-2">Markdown Output:</h4>
          <pre className="text-sm text-[mediumpurple]">{markdown}</pre>
        </div>
      )}
    </div>
  );
};

export default MessageEditor;
