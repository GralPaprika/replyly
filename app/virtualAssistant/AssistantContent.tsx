'use client';
import { useRef } from 'react';
import { Box, Flex } from '@radix-ui/themes';
import { ReactFlowProvider } from 'reactflow';

import Flow from '@/components/flow/Flow';
import { RadialSpeedDial } from '@/components/ui/radialSpeedDial';
import { BotMessageSquare } from 'lucide-react';
import { IconAction, IconFlow } from '@/components/icons/flow';

import FlowDataViewer from '@/components/flow/FlowDataViewer';

export default function AssistantContent() {
    const flowRef = useRef<any>(null);

    const speedDialActions = [
        {
            icon: IconFlow,
            label: 'Tarjeta de Flow',
            onClick: () => flowRef.current?.addNode('newFlowCard'),
        },
        {
            icon: IconAction,
            label: 'Tarjeta de Acción',
            onClick: () => flowRef.current?.addNode('actionCard'),
        },
        {
            icon: BotMessageSquare,
            label: 'Tarjeta de Mensajes',
            onClick: () => flowRef.current?.addNode('contextManagementCard'),
        },
    ];

    return (
        <Flex width="100%" className="relative">
            <Box className="w-full">
                <ReactFlowProvider>
                    <Flow ref={flowRef} />

                    <FlowDataViewer />
                    <RadialSpeedDial actions={speedDialActions} />
                </ReactFlowProvider>
            </Box>
        </Flex>
    );
}
