const IconChoiceMessage = ({ size = '3em', color = '#ffffff', classHoverColor = 'group-hover/dashboard:fill-[#00e785]', ...props }: React.SVGProps<SVGSVGElement> & { size?: string, color?: string, classHoverColor?: string }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            enableBackground="new 0 0 512 512"
            viewBox="0 0 64 64"
            {...props}
        >
            <g
                fill={color}
                className={`transition duration-150 ${classHoverColor}`}
            >
                <path
                    d="M61 7.951H3a1 1 0 00-1 1v11.9a1 1 0 001 1h58a1 1 0 001-1v-11.9a1 1 0 00-1-1zm-57 2h6.214v9.9H4zm56 9.9H12.214v-9.9H60zm1 5.198H3a1 1 0 00-1 1v11.9a1 1 0 001 1h58a1 1 0 001-1v-11.9a1 1 0 00-1-1zm-57 2h6.214v9.9H4zm56 9.9H12.214v-9.9H60zm1 5.198H3a1 1 0 00-1 1v11.9a1 1 0 001 1h58a1 1 0 001-1v-11.9a1 1 0 00-1-1zm-57 2h6.214v9.9H4zm56 9.9H12.214v-9.9H60z"
                    data-original="#000000"
                    ></path>
                <path
                    d="M17.332 15.9h12.824a1 1 0 000-2H17.332a1 1 0 000 2zm17.768 0h15.674a1 1 0 000-2H35.1a1 1 0 000 2zM16.326 33H32a1 1 0 000-2H16.326a1 1 0 000 2zm22.044 0h2.515a1 1 0 000-2H38.37a1 1 0 000 2zM16.913 50.1h20.451a1 1 0 000-2H16.913a1 1 0 000 2zm26.025 0h.88a1 1 0 000-2h-.88a1 1 0 000 2zm5.574 0h1.173a1 1 0 000-2h-1.173a1 1 0 000 2z"
                    data-original="#000000"
                    ></path>
            </g>
        </svg>
    );
}

export default IconChoiceMessage;