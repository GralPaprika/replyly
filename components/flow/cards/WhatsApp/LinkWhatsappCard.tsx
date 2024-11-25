import React, { useState } from 'react';
import Image from 'next/image';
import { Handle, Position } from 'reactflow';
import { Flex, Box, Text } from '@radix-ui/themes';
import { Divider } from '@nextui-org/react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { QrCode, X } from 'lucide-react';
import { IconChannelWhatsApp } from '@/components/icons/channels';
import { IconCustomerService, IconNote } from '../../../icons/flow';

const LinkWhatsappCard = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleRequestSMSCode = () => {
        console.log('Requesting SMS code for:', phoneNumber);
    };

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
                <CardTitle className='text-base font-medium flex items-center gap-2'>
                    <Flex className='w-10 h-10 bg-neutral-100/40 backdrop-blur-lg rounded-full' justify='center' align='center'>
                        <IconChannelWhatsApp size='1.5em' />
                    </Flex>
                    <b>WhatsApp</b>
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
                <Flex align='center' direction='column' gap='4'>
                    <Input
                        type='tel'
                        placeholder='Ingresa tu número de teléfono'
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className='w-full p-3 bg-[#2C2C2C] text-white border border-white/10 rounded-xl focus:outline-none focus:border-white/20'
                    />
                    <Button
                        onClick={handleRequestSMSCode}
                        className='w-[70%] bg-white hover:bg-white/90 text-black py-2.5 rounded-xl font-medium transition-colors'
                    >
                        Solicita tu código de verificación
                    </Button>
                    <Button
                        onClick={() => setShowModal(true)}
                        className='w-[50%] bg-neutral-900/80 backdrop-blur-sm hover:bg-[#3C3C3C] text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2'
                    >
                        <QrCode />
                        Ver código QR
                    </Button>
                </Flex>
            </CardContent>

            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className='w-[300px] backdrop-blur-2xl bg-white/20 text-white !rounded-[2rem] border-none p-10'>
                    <DialogHeader>
                        <DialogTitle className='text-lg font-bold text-center mb-4'>QR<span className='text-replyly font-bold ml-1'>WhatsApp</span></DialogTitle>
                    </DialogHeader>
                    <div className='flex flex-col items-center'>
                        <Image src='/testQR.png' alt='QR Code' width={150} height={150} className='mx-auto' />
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default LinkWhatsappCard;

