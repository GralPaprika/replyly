'use client'
import * as React from 'react'

import { NextUIProvider } from '@nextui-org/react';
import {ThemeProvider as NextThemesProvider} from 'next-themes';
import { TooltipProvider } from './ui/tooltip';

import { GlobalProvider } from '@/app/context/GlobalContext'

import { Theme } from '@radix-ui/themes';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children, ...props }: ProvidersProps) {
  return (
    <Theme appearance='dark' {...props}>
      <NextUIProvider>
        <NextThemesProvider attribute='class'
          defaultTheme='dark'
        >
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </NextThemesProvider>
      </NextUIProvider>
    </Theme>
  )
}
