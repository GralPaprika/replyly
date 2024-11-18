'use client';
import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOutsideClick } from '@/hooks/use-outside-click';

import { IconChannelWhatsApp, IconChannelFacebook, IconChannelInstagram, IconChannelShopify, IconChannelWoo } from '../icons/channels';
import HeaderChat from './HeaderChat';
import MessageChat from './MessageChat';
import FooterChat from './FooterChat';
import ExpanderCard from './ExpanderCard';

interface ChatHistoryProps {
    id?: string | number;
    name?: string;
    avatar?: string;
    phone?: string;
    conversation?: { sender: string; message: string; timestamp: string; }[];
    channel?: string;
    status?: string;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
    id, name, avatar, phone, conversation = [], channel, status
}) => {
    const [active, setActive] = useState<(typeof cards)[number] | null>(null);
    const ref = useRef<HTMLDivElement>(null);
    const [message, setMessage] = useState('');
    const lastMessage = conversation[conversation.length - 1];
    const [currentConversation, setCurrentConversation] = useState(conversation);
    const messageContainerRef = useRef<HTMLDivElement>(null);
    const lastMessageRef = useRef<HTMLDivElement>(null);


    const statusColorMap: Record<string, 'success' | 'warning' | 'danger'> = {
        active: 'success',
        paused: 'warning',
        clouse: 'danger',
    };

    const statusOptions = [
        { name: 'Activo', uid: 'active' },
        { name: 'Pausa', uid: 'paused' },
        { name: 'Cerrado', uid: 'clouse' },
    ];

    const channelIconMap: Record<string, React.ReactNode> = {
        whatsapp: <IconChannelWhatsApp />,
        facebook: <IconChannelFacebook />,
        instagram: <IconChannelInstagram />,
        shopify: <IconChannelShopify />,
        woocommerce: <IconChannelWoo />,
    };

    const cards = [
        { name: name, avatar: avatar }
    ];

    const sendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                sender: 'store',
                message,
                timestamp: new Date().toISOString(),
            };
            setCurrentConversation(prevConversation => {
                const updatedConversation = [...prevConversation, newMessage];
                return updatedConversation;
            });
            console.log('Message sent:', newMessage);
            setMessage('');
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    };

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setActive(null);
            }
        }

        if (active) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        }

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [active, currentConversation]);

    useOutsideClick(ref, () => setActive(null));

    return (
        <>
            <AnimatePresence>
                {active && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 bg-black/20 h-full w-full z-10'
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {active ? (
                    <div className='fixed inset-0 grid place-items-center z-[100]'>
                        <motion.div
                            layoutId={`card-${active.name}-${id}`}
                            ref={ref}
                            className='w-full flex flex-col justify-between bg-neutral-950/80 backdrop-blur-md rounded-3xl overflow-hidden'
                            style={{ maxWidth: 'calc(70dvw - 1rem)', height: 'calc(85dvh - 2rem)' }}
                        >
                            <motion.div className='p-6 bg-neutral-950' layoutId={`image-${active.name}-${id}`}>
                                <HeaderChat
                                    avatar={avatar || ''}
                                    status={status}
                                    statusColorMap={statusColorMap}
                                    name={name || ''}
                                    phone={phone  || ''}
                                    channel={channel || ''}
                                    channelIconMap={channelIconMap}
                                />
                            </motion.div>
                            <motion.div
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className='h-full flex flex-col gap-4 text-md p-6 noneBar overflow-auto'
                                ref={messageContainerRef}
                            >
                               {currentConversation.map((msg, index) => (
                                    <MessageChat
                                        key={index}
                                        msg={msg}
                                        avatar={avatar || ''}
                                        statusColor={status ? statusColorMap[status] : 'default'}
                                        isLastMessage={index === currentConversation.length - 1}
                                        ref={index === currentConversation.length - 1 ? lastMessageRef : null}
                                    />
                                ))}
                            </motion.div>
                            <motion.div className='p-6 bg-neutral-950'>
                                <FooterChat
                                    sendMessage={sendMessage}
                                    message={message}
                                    setMessage={setMessage}
                                    handleKeyDown={handleKeyDown}
                                />
                            </motion.div>
                        </motion.div>
                    </div>
                ) : null}
            </AnimatePresence>

            <div className='w-full flex justify-between gap-6'>
                {cards.map((card) => (
                    <motion.div
                        layoutId={`card-${card.name}-${id}`}
                        key={`card-${card.name}-${id}`}
                        onClick={() => setActive({ ...card, name: card.name ?? '' })}
                        className='w-full flex justify-between bg-card hover:bg-neutral-900 items-center rounded-xl cursor-pointer p-6 overflow-auto'
                    >
                        <ExpanderCard
                            avatar={avatar || ''}
                            name={name || ''}
                            phone={phone || ''}
                            lastMessage={lastMessage ? lastMessage.message : null}
                            channel={channel || ''}
                            status={status || ''}
                            statusColorMap={statusColorMap}
                            statusOptions={statusOptions}
                            channelIconMap={channelIconMap}
                        />
                    </motion.div>
                ))}
            </div>
        </>
    );
}

export default ChatHistory;
