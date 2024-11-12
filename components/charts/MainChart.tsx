import { Flex, Text } from '@radix-ui/themes';
import { Spinner } from '@nextui-org/react';

import LogoReplyly from '@/components/ui/logo';
import ChartSelector from './ChartSelector';

import testData from './data5.json';

interface MainChartProps {
    content?: any | null;
}

const MainChart: React.FC<MainChartProps> = ({ content }) => {
    const cotentData = testData

    if (content) return (
        <Flex
            width='100%'
            minHeight='40dvh'
            direction='column'
            align='center'
            justify='center'
            p='6'
        >
            <LogoReplyly className='mb-4' sizeIcon='5em' textSize='2.8em' />
            <Text className='text-center' as='div' size='5' weight='medium' mb='6'>
                Estamos recopilando tus métricas...<br />
                <span className='text-sm text-replyly'>Esto tomará solo un momento...</span>
            </Text>
            <Spinner color='success' size='lg' />
        </Flex>
    );

    return (
        <Flex width='100%' minHeight='40dvh'>
            <ChartSelector content={cotentData} />
        </Flex>
    );
};

export default MainChart;
