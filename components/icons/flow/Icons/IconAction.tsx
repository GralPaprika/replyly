import React from 'react';
import { IconBaseProps, sizeMap } from '../../iconTypes';

const IconAction: React.FC<IconBaseProps> = ({
    size = 'md',
    color = '#fff',
    ...props
}) => {
    const sizeValue = sizeMap[size as 'sm' | 'md' | 'lg'] || size;

    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            xmlSpace='preserve'
            id='Capa_1'
            width={sizeValue}
            height={sizeValue}
            fill={color}
            version='1.1'
            viewBox='0 0 398.528 398.528'
            {...props}
        >
            <path
                id='SVGRepo_iconCarrier'
                fill={color}
                d='M315.232 9.015C311.883 3.276 305.681 0 298.244 0h-91.308c-10.9 0-22.224 7.113-26.93 16.924L83.17 218.041c-3.162 6.56-2.967 13.518.471 19.037 3.463 5.568 9.592 8.811 16.859 8.966l71.662.902-51.877 129.675c-1.276 3.235-3.959 10.014.821 16.981 2.089 3.056 5.674 4.926 9.364 4.926h.837c6.999 0 11.217-5.308 13.241-7.868l167.628-210.49c7.153-8.966 4.202-17.013 3.121-19.354-1.122-2.243-5.625-9.592-17.046-9.592h-53.34l69.8-122.985c3.659-6.487 3.862-13.51.521-19.224'
            ></path>
        </svg>
    );
};

export default IconAction;
