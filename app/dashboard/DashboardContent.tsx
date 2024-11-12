import { Box, Flex, Text } from '@radix-ui/themes';
import { Button } from '@nextui-org/react';

import LogoReplyly from '@/components/ui/logo';
import IconEditDocument from '@/components/icons/IconEditDocument';
import IconChoiceMessage from '@/components/icons/IconChoiceMessage';
import IconCheckMessage from '@/components/icons/IconCheckMessage';
import IconMessage from '@/components/icons/IconMessage';
import IconDashboard from '@/components/icons/IconDashboard';

import MetricsCards from '@/components/ui/metricsCard';
import MainChart from '@/components/charts/MainChart';
import MessagesSentMetric from '@/components/charts/MessagesSentMetric';
import RecentConversations from './RecentConversations';

interface DashboardContentProps {
    content?: any | null;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ content }) => {
    const steps = [
        {
            icon: <IconEditDocument color='hsl(var(--replyly))' />,
            title: 'Crea tu primer mensaje: ',
            text: 'Diseña un saludo amigable o una respuesta automática para tus clientes. ¡Puedes configurar mensajes de bienvenida, respuestas frecuentes, e incluso enviar ofertas especiales!'
        },
        {
            icon: <IconChoiceMessage color='hsl(var(--replyly))' />,
            title: 'Personaliza tus respuestas: ',
            text: 'Define reglas y palabras clave para que tu chatbot sepa exactamente cómo responder a cada pregunta de tus clientes. ¡Haz que la conversación fluya de manera natural!'
        },
        {
            icon: <IconCheckMessage color='hsl(var(--replyly))' />,
            title: 'Prueba y ajusta: ',
            text: 'Realiza pruebas en tiempo real para asegurarte de que tu chatbot esté funcionando como deseas. Recuerda que siempre puedes ajustar y mejorar las respuestas para ofrecer la mejor experiencia posible.'
        }
    ];

    // if (!content) return (
    if (content) return ( //quitar
        <Flex
            width='50%'
            direction='column'
            align='center'
            justify='center'
            gap='4'
        >
            <LogoReplyly className='mb-8' sizeIcon='5em' textSize='2.8em' />
            <Text className='text-center' as='div' size='7' weight='bold'>¡Bienvenido a <Text style={{ color: 'hsl(var(--replyly))' }}>Replyly</Text> tu nueva herramienta de atención automatizada!</Text>
            <Text className='text-center' as='div' size='5'>Tu chatbot de WhatsApp está listo para comenzar, pero parece que aún no has configurado ningún mensaje o contenido personalizado. No te preocupes, ¡es fácil y rápido empezar!</Text>

            <Flex direction='column' gap='4' mt='6'>
                {steps.map(({ icon, title, text }, idx) => (
                    <Flex key={idx} align='center' gap='2'>
                        <Box>{icon}</Box>
                        <Text size='3' weight='bold'>
                            {title}
                            <Text size='3' weight='regular'>{text}</Text>
                        </Text>
                    </Flex>
                ))}
            </Flex>
            <Text className='text-center' as='div' size='5'><b>¡Empieza ahora! </b>Haz clic en <b>'Crear Mensaje'</b> para iniciar la configuración de tu contenido y ofrecer a tus clientes una atención automatizada 24/7.</Text>

            <Button
                className='mt-10 scale-125'
                radius='full'
                color='success'
                variant='bordered'
                size='lg'
                startContent={<IconMessage color='hsl(var(--replyly))' />}
            >Crear Mensaje</Button>
        </Flex>
    );

    return (
        <Flex width='100%' direction='column' gap='4' py='0' px='2'>
            <Flex width='100%' align='center'>
                <Flex align='center' gap='2'>
                    <Flex className='bg-neutral-700/50 rounded-lg' align='center' p='2'>
                        <IconDashboard size='1.5em' />
                    </Flex>
                    <Text style={{ color: 'hsl(var(--replyly))' }} size='4' weight='bold'>Panel</Text>
                </Flex>
            </Flex>

            <Box>
                <MetricsCards />
            </Box>

            <Flex gap='4' width='100%' maxHeight='40dvh'>
                <Box className='h-full dark:bg-neutral-800 rounded-xl overflow-hidden' width='67%'>
                    <MainChart />
                </Box>
                <Box className='h-full dark:bg-neutral-800 rounded-xl overflow-hidden' width='33%'>
                    <MessagesSentMetric />
                </Box>
            </Flex>

            <Flex className='h-full dark:bg-neutral-800 rounded-xl overflow-hidden' width='100%'>
                <RecentConversations />
            </Flex>
        </Flex>
    );
};

export default DashboardContent;