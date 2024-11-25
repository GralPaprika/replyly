import React from 'react';
import { IconBaseProps, sizeMap } from '../../iconTypes';

const IconRightArrow: React.FC<IconBaseProps> = ({
    size = 'md',
    color = '#005c4b',
    ...props
}) => {
    const sizeValue = sizeMap[size as 'sm' | 'md' | 'lg'] || size;

    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            fill={color}
            stroke={color}
            viewBox='0 0 1000 1000'
            width={sizeValue}
            height={sizeValue}
            {...props}
        >
            <path
                id='SVGRepo_iconCarrier'
                d='M342 218q99 56 396 215l16 9q17 12 28 24 15 17 15 32 0 21-29 46-15 12-30 19l-161 87q-173 93-235 128-44 25-81 17-26-6-47-28-10-11-15-20V249l6-8q7-11 16-19 13-11 28-17 19-7 40-5 25 3 53 18z'
            ></path>
        </svg>
    );
};

export default IconRightArrow;
