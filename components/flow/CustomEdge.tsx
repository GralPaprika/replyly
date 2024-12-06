import React, { useState } from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';
import { Trash2 } from 'lucide-react';

const CustomEdge = (props: EdgeProps) => {
    const { id, sourceX, sourceY, targetX, targetY, style, markerEnd, data } = props;
    const [isHovered, setIsHovered] = useState(false);

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    const handleDelete = () => {
        if (data && data.onDelete) {
            data.onDelete(id);
        }
    };

    return (
        <g
            className='custom-edge-group'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <path
                id={id}
                style={style}
                className={`react-flow__edge-path ${isHovered ? 'hovered' : ''}`}
                d={edgePath}
                markerEnd={markerEnd}
            />

            {isHovered && (
                <foreignObject
                    width={40}
                    height={40}
                    x={labelX - 20}
                    y={labelY - 20}
                    className='pointer-events-none'
                >
                    <div
                        className='w-10 h-10 flex items-center justify-center bg-neutral-700/15 backdrop-blur-sm rounded-full cursor-pointer pointer-events-auto hover:scale-125'
                        onClick={handleDelete}
                    >
                        <Trash2 size={20} color='#ef4444' />
                    </div>
                </foreignObject>
            )}
        </g>
    );
};

export default CustomEdge;
