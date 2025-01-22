import React from 'react';
import { IconBaseProps, sizeMap } from '../../iconTypes';

const IconChannelWhatsApp: React.FC<IconBaseProps> = ({
    size = 'md',
    ...props
}) => {
    const sizeValue = sizeMap[size as 'sm' | 'md' | 'lg'] || size;

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            id="fi_3938041"
            width={sizeValue}
            height={sizeValue}
            viewBox="0 0 176 176"
            {...props}
        >
            <g id="Layer_2" data-name="Layer 2">
                <g id="_08.whatsapp" data-name="08.whatsapp">
                    <path
                        id="background"
                        fill="#29a71a"
                        d="M144.52 173a532.6 532.6 0 0 1-113 0A32.07 32.07 0 0 1 3 144.52a532.6 532.6 0 0 1 0-113A32.07 32.07 0 0 1 31.48 3a532.6 532.6 0 0 1 113 0A32.07 32.07 0 0 1 173 31.48a532.6 532.6 0 0 1 0 113A32.07 32.07 0 0 1 144.52 173"
                    ></path>
                    <g id="icon" fill="#fff">
                        <path d="M126.8 49.2a54.57 54.57 0 0 0-87.42 63.13l-5.79 28.11a2.08 2.08 0 0 0 .33 1.63 2.11 2.11 0 0 0 2.24.87l27.55-6.53A54.56 54.56 0 0 0 126.8 49.2m-8.59 68.56a42.74 42.74 0 0 1-49.22 8l-3.84-1.9-16.89 4 .05-.21 3.5-17-1.88-3.71a42.72 42.72 0 0 1 7.86-49.59 42.73 42.73 0 0 1 60.42 0 2 2 0 0 0 .22.22 42.72 42.72 0 0 1-.22 60.19"></path>
                        <path d="M116.71 105.29c-2.07 3.26-5.34 7.25-9.45 8.24-7.2 1.74-18.25.06-32-12.76l-.17-.15C63 89.41 59.86 80.08 60.62 72.68c.42-4.2 3.92-8 6.87-10.48a3.93 3.93 0 0 1 6.15 1.41l4.45 10a3.91 3.91 0 0 1-.49 4l-2.25 2.92a3.87 3.87 0 0 0-.35 4.32c1.26 2.21 4.28 5.46 7.63 8.47 3.76 3.4 7.93 6.51 10.57 7.57a3.82 3.82 0 0 0 4.19-.88l2.61-2.63a4 4 0 0 1 3.9-1l10.57 3a4 4 0 0 1 2.24 5.91"></path>
                    </g>
                </g>
            </g>
        </svg>
    );
};

export default IconChannelWhatsApp;
