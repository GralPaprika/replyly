import { Handle, Position } from 'reactflow';
import { Flex, Box, Text } from '@radix-ui/themes';
import { Divider } from '@nextui-org/react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { Sparkles } from 'lucide-react';
import { IconCustomerService, IconNote } from '../../../icons/flow';

interface CustomerServiceCardProps {
    data: {
        items: string[];
    };
}

const CustomerServiceCard: React.FC<CustomerServiceCardProps> = ({ data }) => {
    return (
        <Card className='w-[400px] backdrop-blur-sm bg-white/5'>
            <CardHeader className='bg-green-500 rounded-t-xl p-3'>
                <Handle
                    type='target'
                    className='backdrop-blur-lg'
                    position={Position.Left}
                    style={{
                        width: '1.5rem',
                        height: '1.5rem',
                        top: '35px',
                        left: '20px',
                        background: 'rgb(0 0 0 / .0)',
                        border: 'none',
                    }}
                />
                <CardTitle className='text-base font-medium flex items-center gap-2'>
                    <Flex className='w-10 h-10 bg-neutral-100/40 backdrop-blur-lg rounded-full' justify='center' align='center'>
                        <IconCustomerService color='#4f46e5' size='1.5em' />
                    </Flex>
                    <b>Servicio al Cliente</b>
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

                <div className='bg-neutral-900/80 backdrop-blur-sm rounded-md p-4 space-y-2 mb-4'>
                    <div className='flex items-center gap-2 text-sm text-white'>
                        <div className='w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center'>
                            <Sparkles className='w-3 h-3 text-white' />
                        </div>
                        <Text className='font-semibold'>Prompt <span className='font-normal'>540/12000</span> Tokens</Text>
                    </div>
                    <Box className='text-center'>
                        <Button className='w-[50%] justify-center bg-white mx-auto'>Configuración</Button>
                    </Box>
                </div>

                <div className='space-y-2'>
                    {data.items.map((item, index) => (
                        <div key={index} className='flex items-center justify-between text-sm text-white p-2 hover:bg-neutral-900 rounded-md'>
                            <span>{item}</span>
                            <div className='relative'>
                                <Handle
                                    type='source'
                                    position={Position.Right}
                                    id={`handle-${index}`}
                                    style={{ width: '20px', height: '20px', right: '0', background: '#636363', border: 'none' }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default CustomerServiceCard;