import { Flex } from "@radix-ui/themes";
import { Button } from "@nextui-org/react";
import { Textarea } from "../ui/textarea";

interface FooterChatProps {
    avatar: string;
    status: string | undefined;
    statusColorMap: { [key: string]: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | undefined };
    name: string;
    phone: string;
    channel: string;
    channelIconMap: { [key: string]: React.ReactNode };
}

const FooterChat: React.FC<FooterChatProps> = ({
    avatar,
    status,
    statusColorMap,
    name,
    phone,
    channel,
    channelIconMap,
}) => {
    return (
        // <Flex align='center' justify='between'>
        //     <Flex gap='5' align='center'>
        //         <Avatar
        //             src={avatar}
        //             isBordered
        //             color={status ? statusColorMap[status] : 'default'}
        //         />
        //         <Flex direction='column' justify='center'>
        //             <Text truncate weight='medium' style={{ maxWidth: '10rem' }}>{name}</Text>
        //             <Text className='text-muted-foreground'>{phone}</Text>
        //         </Flex>
        //     </Flex>
        //     <Flex direction='column' justify='center' align='center'>
        //         {channel && channelIconMap[channel]}
        //         <Text className='capitalize' weight='medium'>{channel}</Text>
        //     </Flex>
        // </Flex>
        <></>
    );
};

export default FooterChat;
