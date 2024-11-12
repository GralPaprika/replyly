import React, { useRef } from 'react';
import { Flex, Text } from '@radix-ui/themes';
import { Avatar } from '@nextui-org/react';
import AvatarReplyly from '../ui/avatarReplyly';

interface MessageChatProps {
    msg: {
        sender: string;
        message: string;
        timestamp: string;
    };
    avatar: string;
    statusColor: 'success' | 'warning' | 'danger' | 'default';
    isLastMessage: boolean;
}

const MessageChat: React.FC<MessageChatProps> = ({ msg, avatar, statusColor, isLastMessage }) => {
    const lastMessageRef = useRef<HTMLDivElement>(null);

    return (
        <Flex
            gap='3'
            style={{
                flexDirection: msg.sender === 'userConversation' ? 'row' : 'row-reverse'
            }}
            ref={isLastMessage ? lastMessageRef : null}
        >
            {msg.sender === 'userConversation' ? (
                <Avatar
                    src={avatar}
                    isBordered
                    color={statusColor}
                />
            ) : msg.sender === 'agent' ? (
                <AvatarReplyly />
            ) : (
                <Avatar
                    src='/dashboard/yo.jpeg'
                    className='rounded-full border-1 border-replyly'
                />
            )}
            <Flex
                direction='column'
                className='rounded-lg p-2 max-w-[30rem]'
                gap='1'
                style={{
                    alignItems: msg.sender === 'userConversation' ? 'start' : 'end',
                    backgroundColor: msg.sender === 'userConversation' ? '#1f2c33' : '#015c4b'
                }}
            >
                <Text>{msg.message}</Text>
                <Text size='1'>{new Date(msg.timestamp).toLocaleString('es-MX', { hour12: true }).replace(',', '')}</Text>
            </Flex>
        </Flex>
    );
};

export default MessageChat;
