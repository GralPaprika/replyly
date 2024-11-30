import React, { useState, useEffect } from 'react';
import { JSONContent } from '@tiptap/react';
import MessageReader from './messageReader';
import { IconRightArrow } from '../icons/flow';

/**
 * Props for the MessagePreview component.
 *
 * @typedef {Object} MessagePreviewProps
 * @property {JSONContent} message - The message content to display in the preview.
 */
interface MessagePreviewProps {
    message: JSONContent;
}

/**
 * MessagePreview component renders a preview of a message with dynamic visibility and local time.
 *
 * @component
 * @param {MessagePreviewProps} props - Component properties
 * @returns {JSX.Element} Rendered MessagePreview component with content and local time
 *
 * @example
 * <MessagePreview message={messageJsonContent} />
 */
const MessagePreview: React.FC<MessagePreviewProps> = ({ message }) => {
    const [visible, setVisible] = useState(false);
    const [currentTime, setCurrentTime] = useState<string>('');

    /**
     * Determines if the message contains text content.
     *
     * @param {any} content - The content of the message.
     * @returns {boolean} True if the content is not empty and contains text, otherwise false.
     */
    const hasTextContent = (content: any): boolean => {
        if (Array.isArray(content)) {
            return content.some((item) => item.type === 'paragraph' && item.content && item.content.length > 0);
        }
        return false;
    };

    useEffect(() => {
        const isVisible = hasTextContent(message?.content || []);
        setVisible(isVisible);

        /**
         * Formats the current date to 12-hour format with AM/PM.
         *
         * @param {Date} date - The current date object.
         * @returns {string} Formatted time in 12-hour format.
         */
        const formatTime = (date: Date) => {
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12;
            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
            return `${formattedHours}:${formattedMinutes} ${ampm}`;
        };

        const intervalId = setInterval(() => {
            const currentDate = new Date();
            setCurrentTime(formatTime(currentDate));
        }, 1000);

        return () => clearInterval(intervalId);
    }, [message]);

    return (
        <div
            className={`fixed -translate-x-[120%] w-96 transition-all duration-300 ease-in-out ${
                visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{ top: 'var(--preview-top, 2.7rem)' }}
        >
            <div className="w-70 bg-[#005c4b] text-white p-3 rounded-lg relative shadow-md">
                <IconRightArrow className="absolute right-0 top-[-5px] transform translate-x-[19px]" />
                <div className="max-h-[56dvh] overflow-y-auto noneBar">
                    <MessageReader value={message} />
                </div>
                <div className="text-right text-xs text-[#ffffff9c] mt-1">{currentTime}</div>
            </div>
        </div>
    );
};

export default MessagePreview;
