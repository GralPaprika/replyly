import { Flex, Box, Text } from '@radix-ui/themes'
import { Spinner } from '@nextui-org/react'

import LogoReplyly from '@/components/ui/logo'

import ConversationHistory from '@/components/chat/ConversationHistory'

interface RecentConversationsProps {
    content?: any | null;
}

const RecentConversations: React.FC<RecentConversationsProps> = ({ content }) => {
    if (content) return (
        <Flex width='100%' direction='column' align='center' justify='center' p='6'>
            <LogoReplyly className='mb-4' sizeIcon='5em' textSize='2.8em' />
            <Text className='text-center' as='div' size='5' weight='medium' mb='6'>
                Estamos preparando tus últimas conversaciones... <br />
                <span className='text-sm text-replyly'>Esto tomará solo un momento...</span>
            </Text>
            <Spinner color='success' />
        </Flex>
    );

    return (
        <>
            <ConversationHistory />
        </>
    )
}

export default RecentConversations
