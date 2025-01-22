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
            xmlns="http://www.w3.org/2000/svg"
            xmlSpace="preserve"
            width={sizeValue}
            height={sizeValue}
            viewBox="0 0 25 24"
            {...props}
        >
            <g fill={color} fillRule="evenodd" clipRule="evenodd">
                <path
                    d="M17.85 11a1 1 0 0 1 1-1h.009a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1zm2-7a1 1 0 0 1 1-1h.009a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1zm-9 2a1 1 0 0 1 1-1h.009a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1zm0 5a1 1 0 0 1 1-1h.009a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1zm-2 5a1 1 0 0 1 1-1h.009a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1z"
                    data-original="#000000"
                ></path>
                <path
                    d="M3.85 2.25A.75.75 0 0 1 4.6 3v11c0 1.671.001 2.849.121 3.74.117.87.334 1.355.684 1.705s.834.567 1.704.684c.892.12 2.07.121 3.74.121h11a.75.75 0 0 1 0 1.5H10.795c-1.603 0-2.882 0-3.885-.135-1.036-.14-1.89-.435-2.565-1.11s-.97-1.528-1.11-2.565C3.1 16.937 3.1 15.658 3.1 14.056V3a.75.75 0 0 1 .75-.75"
                    data-original="#000000"
                ></path>
            </g>
        </svg>
    );
};

export default IconChartBar;