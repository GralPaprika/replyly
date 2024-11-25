'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Flex, Text } from '@radix-ui/themes';

import Flow from "@/components/flow/Flow";
import IconVirtualAssistant from "@/components/icons/IconVirtualAssistant";
import { PanelLeft } from 'lucide-react';

export default function AssistantContent() {
    const [openMenu, setOpenMenu] = useState(false);

    const toggleMenu = () => {
        setOpenMenu((prev) => !prev);
    };

    return (
        <Flex width='100%' className='relative'>
            <motion.div
                initial={{ width: '0' }}
                animate={{ width: openMenu ? '25rem' : '0' }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                className='h-full bg-neutral-900 overflow-hidden rounded-tl-[3rem] relative'
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: openMenu ? 1 : 0 }}
                    transition={{ duration: 0.3, delay: openMenu ? 0.5 : 0 }}
                    className='h-full'
                >
                    <Flex align='center' justify='center' gap='2' pt='4'>
                        <Flex className='bg-neutral-700/50 rounded-lg' p='2'>
                            <IconVirtualAssistant size='1.5em' />
                        </Flex>
                        <Text className='text-replyly' size='4' weight='bold'>Asistente Virtual</Text>
                    </Flex>
                </motion.div>
            </motion.div>

            <Box className='w-full'>
                <PanelLeft className='fixed top-4 z-10 cursor-pointer ml-2' size='3rem' onClick={toggleMenu} />
                <Flow />
            </Box>
        </Flex>
    );
};
