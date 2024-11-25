import { MarkerType } from 'reactflow';

export const initialEdges = [
    {
        id: 'e3-1',
        source: 'linkWhatsapp',
        target: 'welcomeMessage',
        // markerEnd: {
        //     type: MarkerType.ArrowClosed,
        //     width: 20,
        //     height: 20,
        //     color: '#00e785',
        // },
        style: {
            strokeWidth: 2,
            stroke: '#00e785',
        },
    },
    {
        id: 'e3-2',
        source: 'welcomeMessage',
        target: 'CustomerService',
        style: {
            strokeWidth: 2,
            stroke: '#00e785',
        },
    },
];
