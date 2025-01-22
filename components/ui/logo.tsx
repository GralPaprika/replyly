import { Flex, Text } from '@radix-ui/themes';
import IconReplyly from '../icons/IcontReplyly';
import animation from '@/app/styles/logo.module.css';

interface LogoReplylyProps extends React.HTMLAttributes<HTMLDivElement> {
    sizeIcon?: string;
    textSize?: string;
}

export default function LogoReplyly({
    sizeIcon = '3em',
    textSize = '1.6rem',
    ...props
}: LogoReplylyProps) {
    const responsiveSizeIcon = `calc(${sizeIcon} + 1vw)`;
    const responsiveTextSize = `calc(${textSize} + 0.5vw)`;

    return (
        <Flex align='center' gap='1.1rem' {...props}>
            <IconReplyly
                className={animation.animationLoadNova}
                size={responsiveSizeIcon}
            />
            <Text
                className={animation.titleLogo}
                style={{ fontSize: responsiveTextSize }}
            >
                Replyly
            </Text>
        </Flex>
    );
}

