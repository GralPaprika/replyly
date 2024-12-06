import { Box, Text } from '@radix-ui/themes';
import { Divider } from '@nextui-org/react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { IconNote } from '@/components/icons/flow';

const ContactInfoAcordion = () => {
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
                        Esta tarjeta te permite gestionar y mostrar información clave sobre tu negocio. Agrega detalles como la dirección, teléfono de contacto, correo
                        electrónico y datos adicionales de tus diferentes sedes. Esto ayudará a tus clientes a ubicarte y contactarte fácilmente.
                    </Text>
                    <Divider className='my-2' />
                    <Accordion type='single' collapsible className='w-full text-sm'>
                        <AccordionItem value='indications-1'>
                            <AccordionTrigger>¿Qué hace esta tarjeta?</AccordionTrigger>
                            <AccordionContent className='border-b-1'>
                                Permite centralizar la información básica del negocio o múltiples sedes para que los clientes accedan fácilmente a datos importantes, como la ubicación o formas de contacto.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value='indications-2'>
                            <AccordionTrigger>¿Cómo usarla?</AccordionTrigger>
                            <AccordionContent className='border-b-1'>
                                <ul className='text-xs'>
                                    <li><span className='align-middle text-[6px]'>●</span> Completa los siguientes campos según tu configuración:</li>
                                    <ul className='text-xs pl-4'>
                                        <li><span className='align-middle text-[8px]'>✓</span> Dirección y/o Ubicacion del establecimiento.</li>
                                        <li><span className='align-middle text-[8px]'>✓</span> Teléfono de contacto.</li>
                                        <li><span className='align-middle text-[8px]'>✓</span> Correo electrónico. (opcional).</li>
                                        <li><span className='align-middle text-[8px]'>✓</span> Horarios de atención.</li>
                                    </ul>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value='indications-3'>
                            <AccordionTrigger>Ejemplo de Información en la Tarjeta:</AccordionTrigger>
                            <AccordionContent className='text-xs'>
                                <ul className='text-xs'>
                                    <li className='mb-1'><span className='align-middle text-[6px]'>●</span> Sede Principal:</li>
                                    <ul className='text-xs border-l-2 border-white pl-2 ml-3'>
                                        <li><span className='align-middle text-[8px]'>✓</span> Dirección: Av. Principal 123, Ciudad.</li>
                                        <li><span className='align-middle text-[8px]'>✓</span> Teléfono: +1 (555) 123-4567</li>
                                        <li><span className='align-middle text-[8px]'>✓</span> Correo: contacto@tuempresa.com</li>
                                        <li><span className='align-middle text-[8px]'>✓</span> Horario: Lunes a Viernes, 9:00 AM - 6:00 PM.</li>
                                    </ul>
                                    <Divider className='w-[95%] my-2 mx-auto' />
                                    <li className='mb-1'><span className='align-middle text-[6px]'>●</span> Sede Secundaria:</li>
                                    <ul className='text-xs border-l-2 border-white pl-2 ml-3'>
                                        <li><span className='align-middle text-[8px]'>✓</span> Dirección: Av. Secundaria 123, Ciudad.</li>
                                        <li><span className='align-middle text-[8px]'>✓</span> Teléfono: +1 (555) 987-6543</li>
                                        <li><span className='align-middle text-[8px]'>✓</span> Horario: Sábados y Domingos, 10:00 AM - 4:00 PM.</li>
                                    </ul>
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
                                <li className='italic'><span className='align-middle text-[6px]'>●</span> "Asegúrate de que la información esté siempre actualizada para evitar confusiones con tus clientes."</li>
                                <li className='italic'><span className='align-middle text-[6px]'>●</span> "Incluye detalles claros y relevantes, como referencias específicas si la ubicación es difícil de encontrar."</li>
                                <li className='italic'><span className='align-middle text-[6px]'>●</span> "Si tienes múltiples sedes, organiza la información de manera que sea fácil de leer."</li>
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

export default ContactInfoAcordion;
