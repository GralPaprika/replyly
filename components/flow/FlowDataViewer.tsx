import React, { useState, useEffect } from 'react';
import { ResizableBox } from 'react-resizable';
import Draggable from 'react-draggable';
import { useReactFlow } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import 'react-resizable/css/styles.css';

const FlowDataViewer: React.FC = () => {
    const [flowData, setFlowData] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const reactFlowInstance = useReactFlow();

    useEffect(() => {
        const interval = setInterval(() => {
            if (isVisible) {
                const flowObject = reactFlowInstance.toObject();
                setFlowData(JSON.stringify(flowObject, null, 2));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isVisible, reactFlowInstance]);

    return (
        <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 4 }}>
            <Button onClick={() => setIsVisible(!isVisible)}>
                {isVisible ? 'Hide Flow Data' : 'Show Flow Data'}
            </Button>

            {isVisible && (
                <Draggable handle='.drag-handle'>
                    <ResizableBox
                        width={400}
                        height={300}
                        minConstraints={[300, 200]}
                        maxConstraints={[800, 800]}
                    >
                        <Card className='w-full h-full overflow-hidden bg-transparent'>
                            <CardHeader className='drag-handle cursor-move bg-neutral-700'>
                                <CardTitle>Flow Data (Real-time)</CardTitle>
                            </CardHeader>
                            <CardContent className='h-full bg-neutral-900/10 backdrop-blur-sm overflow-auto p-4 pb-20'>
                                <pre className='text-xs text-[mediumpurple]'>{flowData}</pre>
                            </CardContent>
                        </Card>
                    </ResizableBox>
                </Draggable>
            )}
        </div>
    );
};

export default FlowDataViewer;
