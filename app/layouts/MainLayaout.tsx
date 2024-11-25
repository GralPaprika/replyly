'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { Flex } from '@radix-ui/themes';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { pincipalLinks, secondaryLinks } from './linksData';

import IconReplyly from '@/components/icons/IcontReplyly';

interface MainLayoutProps {
    children: React.ReactNode;
    moreClass?: string;
}

export default function MainLayout({ children, moreClass }: MainLayoutProps) {
    const pathname = usePathname();

    return (
        <div
            className={cn(
                'flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 overflow-hidden',
                'h-screen'
            )}
        >
            <Sidebar>
                <Flex className='h-full p-0' direction='column' justify='between' align='center'>
                    <SidebarBody className='justify-between'>
                        <div className='flex flex-col flex-1 items-center overflow-y-auto overflow-x-hidden pt-4'>
                            <LogoIcon />
                            <div className='flex flex-col items-center gap-8 mt-[3.5rem] '>
                                {pincipalLinks.map((link) => (
                                    <SidebarLink
                                        key={link.href}
                                        link={{
                                            label: link.label,
                                            href: link.href,
                                            icon: (
                                                <link.icon
                                                    size='1.5em'
                                                    color={pathname === link.href ? 'hsl(var(--replyly))' : '#ffffff'}
                                                />
                                            ),
                                        }}
                                        className={cn({ activeLink: pathname === link.href })}
                                        tooltipContent={link.label}
                                    />
                                ))}
                            </div>
                        </div>

                        <Flex className='bg-[#1c1c1c] gap-8 py-4' direction='column' align='center'>
                            {secondaryLinks.map((link) => (
                                <SidebarLink
                                    key={link.label}
                                    className={link.className}
                                    link={{
                                        label: link.label,
                                        href: link.href,
                                        icon: <link.icon />,
                                    }}
                                    tooltipContent={link.tooltipContent}
                                />
                            ))}

                            <SidebarLink
                                disableTooltip
                                link={{
                                    label: 'Vladimir Morfin',
                                    href: '#',
                                    icon: (
                                        <Image
                                            src='/dashboard/yo.jpeg'
                                            className='h-[2.2em] w-[2.2em] scale-150 flex-shrink-0 rounded-full'
                                            width={80}
                                            height={80}
                                            alt='Avatar'
                                        />
                                    ),
                                }}
                            />
                        </Flex>
                    </SidebarBody>
                </Flex>
            </Sidebar>

            <Flex
                className={cn(
                    'w-full h-full bg-neutral-900 shadow-none rounded-tl-[3rem]',
                    moreClass
                )}
                justify='center'
            >
                {children}
            </Flex>
        </div>
    );
}

export const LogoIcon = () => (
    <Link
        href='/dashboard'
        className='font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20'
    >
        <IconReplyly size='calc(3em + 1vw)' />
    </Link>
);
