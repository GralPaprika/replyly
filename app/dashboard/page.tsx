'use client';
import React, { useState } from 'react';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { IconArrowLeft, IconSettings } from '@tabler/icons-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cn } from '@/lib/utils';

import IconDashboard from '@/components/icons/IconDashboard';
import IconVirtualAssistant from '@/components/icons/IconVirtualAssistant';
import IconCreditCard from '@/components/icons/IconCreditCard';
import LogoReplyly from '@/components/ui/logo';
import IconReplyly from '@/components/icons/IcontReplyly';

export function SidebarDashboard() {
    const [activeLink, setActiveLink] = useState<string>('Panel');

    const handleLinkClick = (label: string) => {
        setActiveLink(label);
    };

    const links = [
        {
            label: 'Panel',
            href: '#',
            icon: (
                <IconDashboard
                    className="flex-shrink-0"
                    size="1.5em"
                    color={activeLink === 'Panel' ? '#00e785' : '#ffffff'}
                />
            ),
        },
        {
            label: 'Asistente Virtual',
            href: '#',
            icon: (
                <IconVirtualAssistant
                    className="flex-shrink-0"
                    size="1.5em"
                    color={activeLink === 'Asistente Virtual' ? '#00e785' : '#ffffff'}
                />
            ),
        },
        {
            label: 'Suscripcion',
            href: '#',
            icon: (
                <IconCreditCard
                    className="flex-shrink-0"
                    size="1.5em"
                    color={activeLink === 'Suscripcion' ? '#00e785' : '#ffffff'}
                />
          ),
        },
    ];

    const [open, setOpen] = useState(false);
    // const [open, setOpen] = useState(true);
    return (
        <div
            className={cn(
                'flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 overflow-hidden',
                'h-screen'
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className='justify-between'>
                    <div className='flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
                        {open ? <Logo /> : <LogoIcon />}

                        <div className='pl-3 mt-[3.5rem] flex flex-col gap-8'>
                            {links.map((link, idx) => (
                                <SidebarLink
                                    key={idx}
                                    link={link}
                                    onClick={() => handleLinkClick(link.label)}
                                    className={`gruop ${activeLink === link.label ? 'text-[#00e785] activeLink' : ''}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className='pl-3 mb-6'>
                        <SidebarLink
                            link={{
                                label: 'Ajustes',
                                href: '#',
                                icon: (
                                    <IconSettings className='text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0' />
                                ),
                            }}
                        />
                    </div>

                    <div className='pl-3 mb-6'>
                        <SidebarLink
                            link={{
                                label: 'Cerrar Sesion',
                                href: '#',
                                icon: (
                                    <IconArrowLeft className='text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0' />
                                ),
                            }}
                        />
                    </div>

                    <div>
                        <SidebarLink
                            link={{
                                label: 'Vladimir Morfin',
                                href: '#',
                                icon: (
                                    <Image
                                        src='/dashboard/yo.jpeg'
                                        className='h-[2.2em] w-[2.2em] flex-shrink-0 rounded-full'
                                        width={80}
                                        height={80}
                                        alt='Avatar'
                                    />
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>

            <Dashboard />
        </div>
    );
}

export const Logo = () => {
    return (
        <Link
            href='#'
            className='font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20'
        >
            <LogoReplyly />
        </Link>
    );
};

export const LogoIcon = () => {
  return (
    <Link
      href='#'
      className='font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20'
    >
        <IconReplyly />
    </Link>
  );
};

const Dashboard = (): React.JSX.Element => {
    return (
        <div className='flex flex-1'>
            <div className='p-2 md:p-6 rounded-tl-2xl bg-white dark:bg-neutral-900 flex flex-col gap-4 flex-1 w-full h-full'>
                <div className='flex gap-6'>
                    {[...new Array(4)].map((i) => (
                        <div
                            key={'first-array' + i}
                            className='h-20 w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse'
                        ></div>
                    ))}
                </div>
                <div className='flex gap-6 flex-1'>
                    {[...new Array(2)].map((i) => (
                        <div
                            key={'second-array' + i}
                            className='h-full w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse'
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SidebarDashboard;