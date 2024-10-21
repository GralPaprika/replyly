import { Flex, Box, Text } from "@radix-ui/themes";
import { Tooltip } from "@nextui-org/react";

import IconReplyly from "../icons/IcontReplyly";

import animation from '@/app/styles/logo.module.css'


export default function LogoReplyly({ sizeIcon = '3em' }: { sizeIcon?: string }) {
    return (
        <Flex align='center' gap='1.1rem'>
            <IconReplyly className={animation.animationLoadNova} size={sizeIcon}  />
            <Text className={animation.titleLogo}>Replyly</Text>
        </Flex>
    );
}
