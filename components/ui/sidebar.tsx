'use client';
import { cn } from '@/lib/utils';
import Link, { LinkProps } from 'next/link';
import React, { useState, createContext, useContext } from 'react';
import { IconMenu2, IconX } from '@tabler/icons-react';

import { Tooltip } from '@nextui-org/react';

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<'div'>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...props} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) => {
  const { open } = useSidebar();
  return (
    <div
      className={cn(
        'hidden md:flex md:flex-col md:h-full bg-neutral-800 flex-shrink-0',
        open ? 'w-[240px]' : 'w-[80px]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) => {
  const { open, setOpen } = useSidebar();
  return (
    <div
      className={cn(
        'h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full',
        className
      )}
      {...props}
    >
      <div className='flex justify-end z-20 w-full'>
        <IconMenu2
          className='text-neutral-800 dark:text-neutral-200'
          onClick={() => setOpen(!open)}
        />
      </div>
      {open && (
        <div
          className={cn(
            'fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between'
          )}
        >
          <div
            className='absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200'
            onClick={() => setOpen(!open)}
          >
            <IconX />
          </div>
          {children}
        </div>
      )}
    </div>
  );
};

export const SidebarLink = ({
  link,
  className,
  disableTooltip = false,
  tooltipContent = 'Tooltip',
  ...props
}: {
  link: Links;
  className?: string;
  disableTooltip?: boolean;
  tooltipContent?: string;
  onClick?: () => void;
  props?: LinkProps;
}) => {
  const { open } = useSidebar();
  return (
    <Tooltip
      showArrow
      placement='right'
      isDisabled={disableTooltip}
      content={tooltipContent}
      classNames={{
        base: [
          'before:bg-white',  // arrow color
        ],
        content: [
          'py-2 px-4 shadow-xl',
          'text-black bg-gradient-to-br from-white to-neutral-400',
        ],
      }}
    >
      <Link
        href={link.href}
        className={cn(
          'flex items-center justify-start gap-6 group/sidebar py-2',
          className
        )}
        {...props}
      >
        {link.icon}
        {open && (
          <span className='text-neutral-700 dark:text-neutral-200 text-active text-md group-hover/sidebar:translate-x-1 group-hover/sidebar:text-[#00e785] transition duration-150 whitespace-pre'>
            {link.label}
          </span>
        )}
      </Link>
    </Tooltip>
  );
};
