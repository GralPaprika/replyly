import { Flex } from '@radix-ui/themes';
import IconReplyly from '../icons/IcontReplyly';

export default function AvatarReplyly() {
    return (
        <Flex justify='center' align='center' width='3rem' height='3rem' className='bg-zinc-900 rounded-full border-1 border-replyly'>
            <IconReplyly size='2em' />
        </Flex>
    );
}