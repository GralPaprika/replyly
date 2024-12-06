import React, { useState } from 'react';
import Image from 'next/image';
import { Handle, Position } from 'reactflow';
import { Flex } from '@radix-ui/themes';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import WhatsappAcordion from './WhatsappAcordion';

import { QrCode } from 'lucide-react';
import { IconChannelWhatsApp } from '@/components/icons/channels';

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
                <WhatsappAcordion />

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

