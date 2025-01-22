import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { Flex, Box } from '@radix-ui/themes';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import MessageEditor from '@/components/messageEditor/MessageEditor';

import WelcomeMessageAcordion from './WelcomeMessageAcordion';

import { BotMessageSquare} from 'lucide-react';
import MessageReader from '@/components/messageEditor/messageReader';
import { useToast } from "@/hooks/use-toast"

const WelcomeMessageCard = () => {
    const [showModal, setShowModal] = useState(false);

    const [message, setMessage] = useState<any>({});
    const [saving, setSaving] = useState(false);

    const { toast } = useToast()

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

        } catch (error) {
            console.error('Error al guardar el mensaje:', error);
        } finally {
            setSaving(false);
            setShowModal(false);
            toast({
                title: 'Mensaje guardado exitosamente',
            })
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
                <WelcomeMessageAcordion />

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
                        initialValue={message || 'Cargando...'}
                        onChange={handleEditorChange}
                        placeholder='Escribe aquí tu mensaje...'
                        className='w-full'
                        editorContentClassName='h-[32rem] max-h-[32rem] p-4 overflow-auto noneBar'
                        editorClassName='focus:outline-none'
                        output='json'
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
