import { Box, Text } from '@radix-ui/themes';
import { Divider } from '@nextui-org/react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { IconNote } from '@/components/icons/flow';

const CustomerServiceArcordion = () => {
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
                        Esta tarjeta te permite configurar el flujo de atención basado en las acciones más comunes que tus clientes podrían solicitar. Define rutas claras
                        para responder de manera eficiente a sus necesidades específicas, como conectar con un agente, gestionar un reembolso, resolver dudas sobre pedidos
                        o guiar a los clientes listos para comprar. Personaliza cada acción para garantizar una experiencia fluida y orientada a resultados.
                    </Text>
                    <Divider className='my-2' />

                    <Accordion type='single' collapsible className='w-full text-sm'>
                        <AccordionItem value='indications-1'>
                            <AccordionTrigger>Identifica las posibles acciones de tus clientes:</AccordionTrigger>
                            <AccordionContent className='border-b-1'>
                                <ul className='text-xs'>
                                    <li><span className='align-middle text-[6px]'>●</span> ¿Necesitan hablar con un agente?</li>
                                    <li><span className='align-middle text-[6px]'>●</span> ¿Solicitan información sobre reembolsos o devoluciones?</li>
                                    <li><span className='align-middle text-[6px]'>●</span> ¿Tienen preguntas sobre su pedido?</li>
                                    <li><span className='align-middle text-[6px]'>●</span> ¿Están interesados en comprar?</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value='indications-2'>
                            <AccordionTrigger>Crea rutas específicas para cada acción:</AccordionTrigger>
                            <AccordionContent className='border-b-1'>
                                <ul className='text-xs'>
                                    <li><span className='align-middle text-[6px]'>●</span> Define las opciones de respuesta más adecuadas para cada acción.</li>
                                    <li><span className='align-middle text-[6px]'>●</span> Configura mensajes claros y opciones accesibles para guiar al cliente.</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value='indications-3'>
                            <AccordionTrigger>Objetivo:</AccordionTrigger>
                            <AccordionContent className='text-xs'>
                                Facilitar que los clientes encuentren la ayuda que necesitan rápidamente, minimizando tiempos de espera y maximizando su satisfacción.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <Divider className='my-2' />
                    <Accordion type='single' collapsible>
                        <AccordionItem value='tip-1'>
                            <AccordionTrigger>Consejo para Configuración:</AccordionTrigger>
                            <AccordionContent>
                            <ul className='text-xs'>
                                <li className='italic'><span className='align-middle text-[6px]'>●</span> "Asegúrate de cubrir todas las posibles necesidades del cliente con acciones predefinidas."</li>
                                <li className='italic'><span className='align-middle text-[6px]'>●</span> "Personaliza los mensajes para que sean claros y den confianza al cliente."</li>
                                <li className='italic'><span className='align-middle text-[6px]'>●</span> "Siempre incluye una opción para que puedan contactar a un agente si no encuentran la respuesta deseada."</li>
                            </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <Divider className='my-2' />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

export default CustomerServiceArcordion;