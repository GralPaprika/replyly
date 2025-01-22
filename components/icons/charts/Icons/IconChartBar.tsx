import React from 'react';
import { IconBaseProps, sizeMap } from '../../iconTypes';

const IconChartBar: React.FC<IconBaseProps> = ({
    size = 'md',
    color = '#fff',
    ...props
}) => {
    const sizeValue = sizeMap[size as 'sm' | 'md' | 'lg'] || size;

    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            xmlSpace='preserve'
            width={sizeValue}
            height={sizeValue}
            viewBox='0 0 32 32'
            {...props}
        >
            <path
                fill={color}
                fillRule='evenodd'
                d='M4 3a1 1 0 0 1 1 1v20a2 2 0 0 0 2 2h21a1 1 0 1 1 0 2H7a4 4 0 0 1-4-4V4a1 1 0 0 1 1-1m11 4a1 1 0 0 1 1 1v13a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1m11 4a1 1 0 1 0-2 0v10a1 1 0 1 0 2 0zm-6 3a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1m-9 1a1 1 0 1 0-2 0v6a1 1 0 1 0 2 0z'
                clipRule='evenodd'
                data-original='#000000'
            ></path>
        </svg>
    );
};

export default IconChartBar;
