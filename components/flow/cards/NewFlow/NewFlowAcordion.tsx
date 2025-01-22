import { Box, Text } from '@radix-ui/themes';
import { Divider } from '@nextui-org/react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { IconNote } from '@/components/icons/flow';

const NewFlowAcordion = () => {
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
                        Esta tarjeta te permite crear un nuevo flujo que parte de una acción o situación específica. Está diseñada para guiar al bot y dotarlo de un mejor
                        contexto, lo que le permite reaccionar de manera adecuada a diferentes escenarios. Dependiendo de la situación, el flujo maneja los diferentes
                        caminos posibles, asegurando que el bot pueda ofrecer respuestas precisas y relevantes en cada interacción.
                    </Text>
                    <Divider className='my-2' />
                    <Accordion type='single' collapsible className='w-full text-sm'>
                        <AccordionItem value='indications-1'>
                            <AccordionTrigger>¿Qué hace esta tarjeta?</AccordionTrigger>
                            <AccordionContent className='border-b-1'>
                                Te ayuda a definir flujos de trabajo automáticos que se activan según una acción o situación particular. Esto permite que el bot gestione diferentes escenarios de manera eficiente, adaptándose a las necesidades del cliente y proporcionando respuestas adecuadas a cada contexto.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value='indications-2'>
                            <AccordionTrigger>¿Cómo usarla?</AccordionTrigger>
                            <AccordionContent className='border-b-1'>
                                <ul className='text-xs'>
                                    <li><span className='align-middle text-[6px]'>●</span> <b>Define la acción o situación</b> que iniciará el flujo, como una interacción del cliente o una condición específica.</li>
                                    <li><span className='align-middle text-[6px]'>●</span> <b>Configura los pasos del flujo</b>, estableciendo diferentes rutas que el bot debe seguir dependiendo de las respuestas o necesidades del cliente.</li>
                                    <li><span className='align-middle text-[6px]'>●</span> <b>Personaliza las interacciones del bot</b> que iniciará el flujo, como una interacción del cliente o una condición específica.</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value='indications-3'>
                            <AccordionTrigger>Ejemplo de Mensaje de Bienvenida:</AccordionTrigger>
                            <AccordionContent className='text-xs'>
                                ¡Hola! 👋 Bienvenido a <span className='text-replyly font-bold'>Replyly</span>, tu solución para la automatización de mensajes y gestión inteligente de agendas.<br />
                                Estamos aquí para ayudarte a optimizar tu comunicación y ahorrar tiempo con herramientas impulsadas por inteligencia artificial. Puedes elegir una de estas opciones para empezar:
                                <ul className='text-xs my-2'>
                                    <li><b>Conocer nuestros servicios:</b> Te explicamos cómo nuestras soluciones pueden transformar la forma en que gestionas tus interacciones.</li>
                                    <li><b>Soporte técnico:</b> ¿Tienes dudas o necesitas ayuda? Estamos listos para asistirte.</li>
                                    <li><b>Agendar una reunión:</b>Deja que nuestro sistema AI gestione tu calendario y agende una cita rápidamente.</li>
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
    );
};

export default NewFlowAcordion;
