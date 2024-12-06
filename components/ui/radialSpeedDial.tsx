'use client'
import { useState } from 'react'
import { Button } from './button'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusIcon } from 'lucide-react'

import { Tooltip } from '@nextui-org/react'

interface SpeedDialAction {
    icon: React.ElementType
    label: string
    onClick?: () => void
}

interface RadialSpeedDialProps {
    actions: SpeedDialAction[]
    radius?: number
}

export const RadialSpeedDial: React.FC<RadialSpeedDialProps> = ({ actions, radius = 90 }) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleDial = () => setIsOpen(!isOpen)

    const getButtonPosition = (index: number, total: number) => {
        const baseAngle = Math.PI / 1.5
        const angleSpread = Math.PI / 1.5
        const progress = index / (total - 1)
        const angle = baseAngle + progress * angleSpread

        return {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
        }
    }

    return (
        <div className='fixed inset-0 flex items-start justify-end pointer-events-none'>
            <div className='relative top-[10rem] right-4 pointer-events-auto'>
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial='closed'
                            animate='open'
                            exit='closed'
                            variants={{
                                open: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
                                closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
                            }}
                            className='absolute top-0 z-50'
                        >
                            {actions.map((action, index) => (
                                <motion.div
                                    key={action.label}
                                    className='absolute'
                                    variants={{
                                        open: (i) => ({
                                            opacity: 1,
                                            scale: 1,
                                            x: getButtonPosition(i, actions.length).x,
                                            y: getButtonPosition(i, actions.length).y,
                                            transition: { type: 'spring', stiffness: 300, damping: 20 }
                                        }),
                                        closed: { opacity: 0, scale: 0, x: 0, y: 0, transition: { duration: 0.2 } }
                                    }}
                                    custom={index}
                                >
                                    <div className='relative group'>
                                        <Tooltip content={action.label} placement='left'>
                                            <Button
                                                size='icon'
                                                variant='secondary'
                                                className='rounded-full bg-neutral-800 shadow-md hover:bg-neutral-700 transition-colors duration-200'
                                                onClick={action.onClick}
                                            >
                                                <action.icon className='h-4 w-4' />
                                                <span className='sr-only'>{action.label}</span>
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <Tooltip content='Agrega una nueva tarjeta al flow' placement='left'>
                    <Button
                        size='icon'
                        variant='default'
                        className={`rounded-full bg-neutral-700 hover:bg-neutral-600 transition-all duration-200 z-10 relative ${isOpen ? 'rotate-45' : ''}`}
                        onClick={toggleDial}
                        aria-label={isOpen ? 'Close menu' : 'Open menu'}
                    >
                        <PlusIcon className='text-white' />
                    </Button>
                </Tooltip>
            </div>
        </div>
  )
}
