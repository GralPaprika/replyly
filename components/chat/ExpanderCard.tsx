import { Flex, Text } from '@radix-ui/themes';
import { Avatar, Chip } from '@nextui-org/react';

interface ExpanderCardProps {
    avatar: string;
    name: string;
    phone: string;
    lastMessage: string | null;
    channel: string;
    status: string;
    statusColorMap: Record<string, 'success' | 'warning' | 'danger' | 'default'>;
    statusOptions: { name: string; uid: string }[];
    channelIconMap: Record<string, React.ReactNode>;
}

const ExpanderCard: React.FC<ExpanderCardProps> = ({
    avatar,
    name,
    phone,
    lastMessage,
    channel,
    status,
    statusColorMap,
    statusOptions,
    channelIconMap,
}) => {
    return (
        <Flex width='100%' justify='between' align='center' gap='6'>
            <Flex minWidth='15rem' gap='4' align='center' direction='row'>
                <Avatar src={avatar} isBordered color={status ? statusColorMap[status] : 'default'} />
                <Text truncate weight='medium' style={{ maxWidth: '10rem' }}>
                    {name}
                </Text>
            </Flex>

            <Flex minWidth='8rem' gap='4' justify='center' align='center'>
                <Text className='text-muted-foreground'>{phone}</Text>
            </Flex>

            <Flex minWidth='15rem' maxWidth='15rem' align='center'>
                <Text truncate weight='medium'>{lastMessage ? lastMessage : 'No hay mensajes'}</Text>
            </Flex>

            <Flex minWidth='8rem' gap='2' align='center'>
                {channel && channelIconMap[channel]}
                <Text className='text-muted-foreground capitalize'>{channel}</Text>
            </Flex>

            <Flex minWidth='8rem' gap='2' align='center' justify='end'>
                <Chip color={status ? statusColorMap[status] : 'default'} size='sm' variant='flat'>
                    <Text>{statusOptions.find(option => option.uid === status)?.name}</Text>
                </Chip>
            </Flex>
        </Flex>
    );
};

export default ExpanderCard;
