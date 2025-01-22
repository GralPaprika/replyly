import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { Content } from '@tiptap/react';
import { Flex, Box } from '@radix-ui/themes';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import MessageEditor from '@/components/messageEditor/MessageEditor';

import { Plus } from 'lucide-react';
import { IconAction } from '@/components/icons/flow';

import MessageReader from '@/components/messageEditor/messageReader';
import { useToast } from '@/hooks/use-toast'

const ActionCard = () => {
    const [showModal, setShowModal] = useState(false);
    const [currentContent, setCurrentContent] = useState<Content | null>(null);
    const [contentBlocks, setContentBlocks] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const savedMessage = localStorage.getItem('savedActionCard');
        if (savedMessage) {
            const parsedMessage = JSON.parse(savedMessage);
            setContentBlocks(parsedMessage.content || []);
        }
    }, []);

    const saveMessage = () => {
        setSaving(true);
        try {
            let updatedBlocks;

            if (editingIndex !== null) {
                updatedBlocks = [...contentBlocks];
                updatedBlocks[editingIndex] = { message: currentContent };
            } else {
                updatedBlocks = [...contentBlocks, { message: currentContent }];
            }

            setContentBlocks(updatedBlocks);
            localStorage.setItem('savedActionCard', JSON.stringify({ content: updatedBlocks }));
            toast({ title: 'Mensaje guardado exitosamente' });
        } catch (error) {
            console.error('Error al guardar:', error);
        } finally {
            setSaving(false);
            setShowModal(false);
            setCurrentContent('');
            setEditingIndex(null);
        }
    };

    const handleEditBlock = (index: number | null) => {
        setEditingIndex(index);
        setCurrentContent(index !== null ? contentBlocks[index].message : '');
        setShowModal(true);
    };

    const handleDeleteBlock = (index: number) => {
        const updatedBlocks = contentBlocks.filter((_, i) => i !== index);
        setContentBlocks(updatedBlocks);
        localStorage.setItem('savedActionCard', JSON.stringify({ content: updatedBlocks }));
        toast({ title: 'Bloque eliminado exitosamente', variant: 'destructive' });
    };

    return (
        <Card className='w-[420px] backdrop-blur-sm bg-white/5'>
            <CardHeader className='bg-[#0099FF] rounded-t-xl p-3'>
            <Handle
                    type='source'
                    position={Position.Right}
                    style={{
                        width: '30%',
                        height: '70px',
                        top: '35px',
                        right: '0',
                        background: 'rgb(4 126 207 / 80%)',
                        border: 'none',
                        borderRadius: '.75rem .75rem 0 .75rem'
                    }}
                />
                <Handle
                    type='target'
                    className='backdrop-blur-lg'
                    position={Position.Left}
                    style={{
                        width: '2.438rem',
                        height: '2.438rem',
                        top: '32px',
                        left: '12px',
                        background: 'rgb(0 0 0 / .0)',
                        border: 'none',
                    }}
                />
                <CardTitle className='text-base font-medium flex items-center gap-2'>
                    <Flex className='w-10 h-10 bg-neutral-100/40 backdrop-blur-lg rounded-full' justify='center' align='center'>
                        <IconAction size='1.5em' color='#FF0072' />
                    </Flex>
                    <b>Accionador de Eventos</b>
                </CardTitle>
            </CardHeader>

            <CardContent className='flex-shrink-0'>
                {contentBlocks.map((block, index) => (
                    <Box
                        key={index}
                        className='bg-neutral-900 rounded-2xl p-4 relative mb-3'
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <MessageReader
                            className={`transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-20' : 'opacity-100'}`}
                            value={block.message}
                        />
                        {hoveredIndex === index && (
                            <Flex className='absolute inset-0 flex items-center justify-center' gap='4'>
                                <Button onClick={() => handleEditBlock(index)} className='bg-white hover:bg-white/90 text-black'>
                                    Modificar
                                </Button>
                                <Button onClick={() => handleDeleteBlock(index)} className='bg-red-500 hover:bg-red-600 text-white'>
                                    Eliminar
                                </Button>
                            </Flex>
                        )}
                        <Handle
                            key={index}
                            type='source'
                            position={Position.Right}
                            id={`contactInfo-${index}`}
                            style={{
                                width: '2rem',
                                height: '2rem',
                                right: '-1rem',
                                background: 'rgb(65 65 65 / 1)',
                                border: 'none',
                            }}
                        />
                    </Box>
                ))}

                <Flex className='text-center mt-6' justify='center' gap='2'>
                    <Button onClick={() => setShowModal(true)} className='justify-center bg-white'>Agrega una acción <Plus /></Button>
                </Flex>
            </CardContent>

            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className='backdrop-blur-2xl bg-neutral-900/60 text-white !rounded-[2rem] border-none p-10'>
                    <DialogHeader>
                        <DialogTitle className='text-lg text-replyly font-bold text-center mb-4'>
                            Información de Contacto
                        </DialogTitle>
                    </DialogHeader>

                    <MessageEditor
                        initialValue={currentContent}
                        onChange={setCurrentContent}
                        placeholder='Escribe aquí tu información de contacto...'
                        className='w-full'
                        editorContentClassName='h-[32rem] max-h-[32rem] p-4 overflow-auto noneBar'
                        editorClassName='focus:outline-none'
                        output='json'
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

export default ActionCard;
