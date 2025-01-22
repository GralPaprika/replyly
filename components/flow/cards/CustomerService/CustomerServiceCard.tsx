import { Handle, Position } from 'reactflow';
import { Flex, Box, Text } from '@radix-ui/themes';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import CustomerServiceArcordion from './CustomerServiceArcordion';

import { Sparkles } from 'lucide-react';
import { IconCustomerService } from '@/components/icons/flow';

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
                <CustomerServiceArcordion />

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