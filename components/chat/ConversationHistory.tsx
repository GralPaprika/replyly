'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { Input, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, Chip, Pagination } from '@nextui-org/react';
import { ChevronDown, Search } from 'lucide-react';
import { Flex, Box, Text } from '@radix-ui/themes';

import { users } from '@/data';
import { capitalize } from '@/lib/utils';
import ChatHistory from './ChatHistory';

const statusOptions = [
    { name: 'Activo', uid: 'active' },
    { name: 'Pausa', uid: 'paused' },
    { name: 'Cerrado', uid: 'clouse' }
];

const channelOptions = [
    { name: 'WhatsApp', uid: 'whatsapp' },
    { name: 'Facebook', uid: 'facebook' },
    { name: 'Instagram', uid: 'instagram' },
    { name: 'Shopify', uid: 'shopify' },
    { name: 'Woocommerce', uid: 'woocommerce' }
];

const ConversationHistory: React.FC = () => {
    const [filterValue, setFilterValue] = useState('');
    const initialStatusSelection = new Set(statusOptions.map(status => status.uid));
    const [statusFilter, setStatusFilter] = useState<Set<string>>(initialStatusSelection);

    const initialChannelSelection = new Set(channelOptions.map(channel => channel.uid));
    const [channelsFilter, setChannelsFilter] = useState<Set<string>>(initialChannelSelection);

    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [page, setPage] = useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const filteredItems = useMemo(() => {
        let filteredUsers = [...users];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.name.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }
        if (statusFilter.size > 0) {
            filteredUsers = filteredUsers.filter((user) =>
                statusFilter.has(user.status),
            );
        }
        if (channelsFilter.size > 0) {
            filteredUsers = filteredUsers.filter((user) =>
                channelsFilter.has(user.channel),
            );
        }

        return filteredUsers;
    }, [users, filterValue, statusFilter, channelsFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const onRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = useCallback((value?: string) => {
        setFilterValue(value || '');
        setPage(1);
    }, []);

    const handleChannelSelectionChange = (keys: any) => {
        setChannelsFilter(new Set(Array.from(keys as Set<string>)));
    };

    const handleStatusSelectionChange = (keys: any) => {
        setStatusFilter(new Set(Array.from(keys as Set<string>)));
    };

    const topContent = useMemo(() => {
        return (
            <div className='flex flex-col gap-4 p-4'>
                <div className='flex justify-between gap-3 items-center'>
                    <Input
                        isClearable
                        className='w-full sm:max-w-[44%]'
                        classNames={{
                            label: 'text-black/50',
                            input: 'bg-card text-white placeholder:text-default-700/50',
                            innerWrapper: 'bg-card',
                            inputWrapper: 'shadow-xl bg-card border-neutral-700 backdrop-blur-xl backdrop-saturate-200 group-data-[focus=true]:border-replyly group-data-[hover=true]:border-replyly !cursor-text',
                        }}
                        placeholder='Buscar por nombre...'
                        size='sm'
                        startContent={<Search size='1rem' />}
                        variant='bordered'
                        value={filterValue}
                        onClear={() => setFilterValue('')}
                        onValueChange={onSearchChange}
                    />
                    <div className='flex gap-3'>
                        <Dropdown>
                            <DropdownTrigger className='hidden sm:flex'>
                                <Button className='bg-card' endContent={<ChevronDown size='1rem' />} variant='flat'>
                                    Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode='multiple'
                                onSelectionChange={handleStatusSelectionChange}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className='capitalize'>
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>

                        <Dropdown>
                            <DropdownTrigger className='hidden sm:flex'>
                                <Button className='bg-card' endContent={<ChevronDown size='1rem' />} variant='flat'>
                                    Canal
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                closeOnSelect={false}
                                selectedKeys={channelsFilter}
                                selectionMode='multiple'
                                onSelectionChange={handleChannelSelectionChange}
                            >
                                {channelOptions.map((channel) => (
                                    <DropdownItem key={channel.uid} className='capitalize'>
                                        {capitalize(channel.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>

                        <label className='flex-col items-center text-default-400 text-small'>
                            <div className='text-small'>Total de Conversaciones: {users.length}</div>
                            <div className='flex items-center'>
                                Conversaciones por página:
                                <select
                                    className='bg-transparent outline-none text-small'
                                    onChange={onRowsPerPageChange}
                                >
                                    <option value='15'>15</option>
                                    <option value='30'>30</option>
                                    <option value='45'>45</option>
                                </select>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        );
    }, [filterValue, statusFilter, channelsFilter, users.length, onSearchChange, onRowsPerPageChange]);

    const bottomContent = useMemo(() => {
        return (
            <div className='p-0 flex justify-center items-center'>
                <Pagination
                    isCompact
                    showControls
                    loop
                    color='success'
                    page={page}
                    total={pages}
                    onChange={setPage}
                    size='sm'
                />
            </div>
        );
    }, [page, pages]);

    return (
        <Flex className='w-full h-full' direction='column'>
            <Box>{topContent}</Box>
            <Flex className='text-muted-foreground' width='100%' justify='between' align='center' gap='6' px='8' pb='2'>
                <Text className='min-w-[15rem]'>Usuario</Text>
                <Text className='min-w-[8rem] text-center'>Telefono</Text>
                <Text className='min-w-[15rem] text-center'>Conversation</Text>
                <Text className='min-w-[8rem] text-center'>Canal</Text>
                <Text className='min-w-[8rem] text-right'>Status</Text>
            </Flex>
            <div className='flex flex-col w-full h-full gap-2 p-4 pt-2 noneBar' style={{ maxHeight: 'calc(30dvh - 1rem)', overflow: 'hidden auto' }}>
                {items.map((user) => (
                    <ChatHistory
                        key={user.id}
                        id={user.id}
                        name={user.name}
                        avatar={user.avatar}
                        phone={user.phone}
                        conversation={Array.isArray(user.conversation) ? user.conversation : undefined}
                        channel={user.channel}
                        status={user.status}
                    />
                ))}
            </div>
            <Box className='py-2'>{bottomContent}</Box>
        </Flex>
    );
};

export default ConversationHistory;
