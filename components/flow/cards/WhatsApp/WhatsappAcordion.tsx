import { Box, Text } from '@radix-ui/themes';
import { Divider } from '@nextui-org/react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { IconNote } from '@/components/icons/flow';

const WhatsappAcordion = () => {
    return (
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
                        Esta tarjeta te permite conectar tu cuenta de WhatsApp con la plataforma para gestionar de manera eficiente los mensajes enviados y recibidos.
                        Configura tu conexión de forma rápida y segura utilizando un código SMS o escaneando un código QR. Con esta integración, podrás automatizar
                        respuestas, monitorear conversaciones y mejorar la atención al cliente directamente desde WhatsApp.
                    </Text>
                    <Divider className='my-2' />

                    <Accordion type='single' collapsible className='w-full text-sm'>
                        <AccordionItem value='indications-1'>
                            <AccordionTrigger>¿Qué hace esta tarjeta?</AccordionTrigger>
                            <AccordionContent className='border-b-1'>
                                Conecta tu cuenta de <span className='text-replyly font-bold'>WhatsApp</span> a <span className='text-replyly font-bold'>Replyly</span> permitiendo sincronizar los mensajes en tiempo real para una gestión centralizada.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value='indications-2'>
                            <AccordionTrigger>¿Cómo usarla?</AccordionTrigger>
                            <AccordionContent className='border-b-1'>
                                <ul className='text-xs'>
                                    <li><span className='align-middle text-[6px]'>●</span> <b>Opción 1:</b> Ingresa tu número de teléfono asociado y valida la conexión con el código SMS.</li>
                                    <li><span className='align-middle text-[6px]'>●</span> <b>Opción 2:</b> Escanea el código QR proporcionado para sincronizar tu cuenta de <span className='text-replyly font-bold'>WhatsApp</span> con la plataforma.</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value='indications-3'>
                            <AccordionTrigger>Beneficios:</AccordionTrigger>
                            <AccordionContent className='text-xs'>
                                <ul className='text-xs'>
                                    <li><span className='align-middle text-[6px]'>●</span> Responde automáticamente a los clientes a través de <span className='text-replyly font-bold'>WhatsApp</span>.</li>
                                    <li><span className='align-middle text-[6px]'>●</span> Centraliza la gestión de mensajes en un solo lugar.</li>
                                    <li><span className='align-middle text-[6px]'>●</span> Mejora la velocidad y eficiencia de tus interacciones.</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <Divider className='my-2' />
                    <Accordion type='single' collapsible>
                        <AccordionItem value='tip-1'>
                            <AccordionTrigger>Consejo para Configuración:</AccordionTrigger>
                            <AccordionContent>
                            <ul className='text-xs'>
                                <li className='italic'><span className='align-middle text-[6px]'>●</span> "Asegúrate de tener acceso al dispositivo vinculado a tu cuenta de <span className='text-replyly font-bold'>WhatsApp</span> al momento de la conexión."</li>
                                <li className='italic'><span className='align-middle text-[6px]'>●</span> "Verifica que tu número esté correctamente configurado para evitar interrupciones en el servicio."</li>
                            </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <Divider className='my-2' />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};

export default WhatsappAcordion;
