import React, { useState } from 'react';
import { Flex } from "@radix-ui/themes";
import { Button } from "@nextui-org/react";
import { Textarea } from "../ui/textarea";
import { IconSend } from '@tabler/icons-react';

interface FooterChatProps {
    sendMessage: () => void;
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const FooterChat: React.FC<FooterChatProps> = ({
    sendMessage,
    message,
    setMessage,
    handleKeyDown
}) => {
    return (
        <Flex align='center' justify='between' gap='4'>
            <Textarea
                placeholder='Escribe un mensaje'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
            />

            <Button
                isIconOnly
                variant='bordered'
                aria-label='Send message'
                className={message ? 'border-replyly' : ''}
                isDisabled={!message}
                onClick={sendMessage}
            >
                <IconSend color={message ? '#00e785' : 'currentColor'} />
            </Button>
        </Flex>
    );
};

export default FooterChat;
