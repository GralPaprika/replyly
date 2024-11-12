import React from 'react';
import { IconBaseProps, sizeMap } from '../../iconTypes';

const IconChartPie: React.FC<IconBaseProps> = ({
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
            fillRule="evenodd"
            viewBox="0 0 24 24"
            {...props}
        >
            <g fill={color}>
                <path
                    d="M19.045 14.834a.75.75 0 0 1 1.463.332c-.986 4.34-4.871 7.584-9.508 7.584-5.381 0-9.75-4.369-9.75-9.75 0-4.637 3.244-8.522 7.584-9.508a.75.75 0 0 1 .332 1.463C5.494 5.789 2.75 9.077 2.75 13A8.254 8.254 0 0 0 11 21.25c3.923 0 7.211-2.744 8.045-6.416"
                    data-original="#000000"
                ></path>
                <path
                    d="M11.25 3.047a1.75 1.75 0 0 1 1.92-1.743l.01.001c4.991.555 8.961 4.525 9.506 9.517l.001.009c.048.489-.113.975-.444 1.339a1.74 1.74 0 0 1-1.287.572c-1.937.008-6.055.008-7.956.008A1.75 1.75 0 0 1 11.25 11zm1.5-.001V11c0 .138.112.25.25.25 1.9 0 6.015 0 7.95-.008h.003a.24.24 0 0 0 .241-.263c-.471-4.291-3.883-7.702-8.177-8.183a.25.25 0 0 0-.267.25"
                    data-original="#000000"
                ></path>
            </g>
        </svg>
    );
};

export default IconChartPie;