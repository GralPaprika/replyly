import React from 'react';
import { IconBaseProps, sizeMap } from '../../iconTypes';

const IconFlow: React.FC<IconBaseProps> = ({
    size = 'md',
    color = '#fff',
    ...props
}) => {
    const sizeValue = sizeMap[size as 'sm' | 'md' | 'lg'] || size;

    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            transform='rotate(270)'
            width={sizeValue}
            height={sizeValue}
            viewBox='0 0 24 24'
            {...props}
        >
            <path
                id='SVGRepo_iconCarrier'
                fill={color}
                fillRule='evenodd'
                d='M20 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-3-1c0-1.306.835-2.418 2-2.83V16a3 3 0 0 0-3-3 4.98 4.98 0 0 1-3-1v4.17a3.001 3.001 0 1 1-2 0V12c-.836.628-1.874 1-3 1a3 3 0 0 0-3 3v.17a3.001 3.001 0 1 1-2 0V16a5 5 0 0 1 5-5 3 3 0 0 0 3-3v-.17a3.001 3.001 0 1 1 2 0V8a3 3 0 0 0 3 3 5 5 0 0 1 5 5v.17A3.001 3.001 0 1 1 17 19M12 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2M4 18a1 1 0 1 0 0 2 1 1 0 0 0 0-2m9 1a1 1 0 1 1-2 0 1 1 0 0 1 2 0'
                clipRule='evenodd'
            ></path>
        </svg>
    );
};

export default IconFlow;
