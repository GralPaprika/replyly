import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { Flex, Box, Text } from '@radix-ui/themes';
import { Divider } from '@nextui-org/react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import MessageEditor from '@/components/messageEditor/MessageEditor';

import { BotMessageSquare} from 'lucide-react';
import { IconNote } from '../../../icons/flow';

import MessageReader from '@/components/messageEditor/messageReader';

const WelcomeMessageCard = () => {
    const [showModal, setShowModal] = useState(false);

    const [message, setMessage] = useState<any>({});
    const [saving, setSaving] = useState(false);

    const handleEditorChange = (content: any) => {
        setMessage(content);
    };

    const fetchMessageContent = async () => {
        try {
            const response = await fetch('/testTiptap.json');
            if (!response.ok) {
                throw new Error('No se pudo cargar el contenido del JSON');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al cargar el archivo JSON:', error);
            return null;
        }
    };

    const saveMessage = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/saveJson', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: message }),
            });

            if (!response.ok) {
                throw new Error('Error al guardar el mensaje');
            }

            alert('Mensaje guardado exitosamente');
        } catch (error) {
            console.error('Error al guardar el mensaje:', error);
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        const loadMessage = async () => {
            const content = await fetchMessageContent();
            if (content) {
                setMessage(content);
            }
        };
        loadMessage();
    }, []);

    return (
        <Card className='w-[400px] backdrop-blur-sm bg-white/5'>
            <CardHeader className='bg-green-500 rounded-t-xl p-3'>
                <Handle
                    type='source'
                    position={Position.Right}
                    style={{
                        width: '1.5rem',
                        height: '1.5rem',
                        top: '40px',
                        right: '10px',
                        background: 'rgb(0 0 0 / .0)',
                        border: 'none',
                    }}
                />
                <Handle
                    type='target'
                    className='backdrop-blur-lg'
                    position={Position.Left}
                    style={{
                        width: '1.5rem',
                        height: '1.5rem',
                        top: '35px',
                        left: '20px',
                        background: 'rgb(0 0 0 / 0)',
                        border: 'none',
                    }}
                />
                <CardTitle className='text-base font-medium flex items-center gap-2'>
                    <Flex className='w-10 h-10 bg-neutral-100/40 backdrop-blur-lg rounded-full' justify='center' align='center'>
                        <BotMessageSquare size='1.5em' color='#3b03ff' />
                    </Flex>
                    <b>Mensaje de Bienvenida</b>
                </CardTitle>
            </CardHeader>

            <CardContent className='flex-shrink-0'>
                <Accordion type='single' collapsible className='w-full flex-shrink-0'>
                    <AccordionItem className='group py-4' value='desc-1'>
                        <AccordionTrigger
                            className='[&[data-state=open]>svg>g]:stroke-replyly [&[data-state=open]]:text-replyly group-hover:text-replyly group-hover:[&>svg>g]:stroke-replyly'
                            icon={<IconNote />}
                        >
                            <Box><i>Nota:</i> Descripción de la Tarjeta</Box>
                        </AccordionTrigger>
                        <AccordionContent>
                            <Divider className='my-2' />
                            <Text className='text-xs'>
                                Esta tarjeta te permite configurar un mensaje de bienvenida personalizado que el bot enviará automáticamente al cliente al iniciar la conversación.
                                Usa este mensaje para generar una excelente primera impresión, proporcionar información útil o guiar al cliente hacia el siguiente paso en su interacción.
                            </Text>
                            <Divider className='my-2' />
                            <Accordion type='single' collapsible className='w-full text-sm'>
                                <AccordionItem value='indications-1'>
                                    <AccordionTrigger>¿Qué hace esta tarjeta?</AccordionTrigger>
                                    <AccordionContent className='border-b-1'>
                                        Crea un mensaje inicial que se enviará automáticamente cuando un cliente inicie contacto, ayudando a establecer un tono positivo y profesional desde el principio.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value='indications-2'>
                                    <AccordionTrigger>¿Cómo usarla?</AccordionTrigger>
                                    <AccordionContent className='border-b-1'>
                                        <ul className='text-xs'>
                                            <li><span className='align-middle text-[6px]'>●</span> Redacta un mensaje breve, amigable y claro.</li>
                                            <li>
                                                <span className='align-middle text-[6px]'>●</span> Puedes incluir:
                                                <ul className='text-xs pl-4'>
                                                    <li><span className='align-middle text-[8px]'>✓</span> Un saludo personalizado.</li>
                                                    <li><span className='align-middle text-[8px]'>✓</span> Información inicial, como horarios de atención.</li>
                                                    <li><span className='align-middle text-[8px]'>✓</span> Opciones rápidas para que el cliente seleccione su necesidad (opcional).</li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value='indications-3'>
                                    <AccordionTrigger>Ejemplo de Mensaje de Bienvenida:</AccordionTrigger>
                                    <AccordionContent className='text-xs'>
                                        ¡Hola! 👋 Bienvenido a <span className='text-replyly font-bold'>Replyly</span>, tu solución para la automatización de mensajes y gestión inteligente de agendas.<br />
                                        Estamos aquí para ayudarte a optimizar tu comunicación y ahorrar tiempo con herramientas impulsadas por inteligencia artificial. Puedes elegir una de estas opciones para empezar:
                                        <ul className='text-xs my-2'>
                                            <li>1️⃣ <b>Conocer nuestros servicios:</b> Te explicamos cómo nuestras soluciones pueden transformar la forma en que gestionas tus interacciones.</li>
                                            <li>2️⃣ <b>Soporte técnico:</b> ¿Tienes dudas o necesitas ayuda? Estamos listos para asistirte.</li>
                                            <li>3️⃣ <b>Agendar una reunión:</b>Deja que nuestro sistema AI gestione tu calendario y agende una cita rápidamente.</li>
                                        </ul>
                                        Si necesitas algo más, simplemente escríbenos y nuestro sistema AI se encargará de asistirte o redirigirte a un especialista humano. ¡Estamos aquí para hacer tu vida más fácil! 🚀
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            <Divider className='my-2' />
                            <Accordion type='single' collapsible>
                                <AccordionItem value='tip-1'>
                                    <AccordionTrigger>Consejo para Configuración:</AccordionTrigger>
                                    <AccordionContent>
                                    <ul className='text-xs'>
                                        <li className='italic'><span className='align-middle text-[6px]'>●</span> "Mantén el mensaje breve, amigable y fácil de entender."</li>
                                        <li className='italic'><span className='align-middle text-[6px]'>●</span> "Utiliza un tono alineado con la identidad de tu marca."</li>
                                        <li className='italic'><span className='align-middle text-[6px]'>●</span> "Si añades opciones rápidas, asegúrate de que los siguientes pasos estén configurados correctamente en el flujo."</li>
                                    </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            <Divider className='my-2' />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Box className='bg-neutral-900 rounded-2xl p-4'>
                    <MessageReader fetchContent={fetchMessageContent} />
                </Box>
                <Box className='text-center mt-6'>
                    <Button onClick={() => setShowModal(true)} className='w-[50%] justify-center bg-white mx-auto'>Modificar</Button>
                </Box>
            </CardContent>

            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent
                    className='backdrop-blur-2xl bg-neutral-900/60 text-white !rounded-[2rem] border-none p-10'
                    style={{ width: '60%', maxHeight: '80dvh' }}
                >
                    <DialogHeader>
                        <DialogTitle className='text-lg text-replyly font-bold text-center mb-4'>Mensaje de Bienvenida</DialogTitle>
                    </DialogHeader>

                    <MessageEditor
                        initialValue={message || "Cargando..."}
                        onChange={handleEditorChange}
                        placeholder="Escribe aquí tu mensaje..."
                        className="w-full"
                        editorContentClassName="h-[32rem] max-h-[32rem] p-4 overflow-auto noneBar"
                        editorClassName="focus:outline-none"
                        output="json"
                        // showJson
                        // showMarkdown
                        showPreviewMessage
                    />

                    <Box className='text-center mt-6'>
                        <Button onClick={saveMessage} className='justify-center bg-white mx-auto'>
                            {saving ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default WelcomeMessageCard;
