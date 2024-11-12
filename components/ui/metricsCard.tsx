'use client';
import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOutsideClick } from '@/hooks/use-outside-click';
import { TestChart } from './testChart';
import { Flex } from '@radix-ui/themes';

// import { BarChartMetrics } from '../charts/barChartMetrics';

const cards = [
    {
        title: 'Mensajes Enviados',
        subTitle: 'Mensual',
        content: () => {
            return (
                <p>
                    <b>Descripción:</b> El total de mensajes enviados por el chatbot dentro de un período de tiempo específico.
                    Este indicador refleja la cantidad de respuestas automatizadas generadas por el sistema en interacciones con
                    los usuarios a lo largo del tiempo.<br />
                    <b>Propósito:</b> La métrica sirve para evaluar la actividad y la eficiencia del chatbot, permitiendo conocer
                    el volumen de interacciones gestionadas. Un alto número de mensajes enviados indica un uso frecuente del chatbot,
                    lo que puede señalar tanto el interés de los usuarios como la capacidad del chatbot para manejar consultas.
                    También es útil para monitorear tendencias de uso y evaluar la necesidad de ajustes en la lógica de respuestas.<br />
                    <b>Ejemplo:</b> Durante el mes actual, el chatbot ha enviado un total de <i>1,200</i> mensajes, mostrando un incremento
                    del 15% respecto al mes anterior.
                </p>
            );
        },
    },
    {
        title: 'Consultas Fuera del Horario de Soporte',
        subTitle: 'Mensual',
        content: () => {
            return (
                <p>
                Babu Maan, a legendary Punjabi singer, is renowned for his soulful
                voice and profound lyrics that resonate deeply with his audience. Born
                in the village of Khant Maanpur in Punjab, India, he has become a
                cultural icon in the Punjabi music industry. <br /> <br /> His songs
                often reflect the struggles and triumphs of everyday life, capturing
                the essence of Punjabi culture and traditions. With a career spanning
                over two decades, Babu Maan has released numerous hit albums and
                singles that have garnered him a massive fan following both in India
                and abroad.
                </p>
            );
        },
    },
    {
        title: 'Conversaciones por Canal',
        subTitle: 'Mensual',
        content: () => {
            return (
                <p>
                Metallica, an iconic American heavy metal band, is renowned for their
                powerful sound and intense performances that resonate deeply with
                their audience. Formed in Los Angeles, California, they have become a
                cultural icon in the heavy metal music industry. <br /> <br /> Their
                songs often reflect themes of aggression, social issues, and personal
                struggles, capturing the essence of the heavy metal genre. With a
                career spanning over four decades, Metallica has released numerous hit
                albums and singles that have garnered them a massive fan following
                both in the United States and abroad.
                </p>
            );
        },
    },
];

export default function MetricsCards() {
    const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(null);
    const ref = useRef<HTMLDivElement>(null);
    const id = useId();

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setActive(null);
            }
        }

        if (active && typeof active === 'object') {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [active]);

    useOutsideClick(ref, () => setActive(null));

    return (
        <>
            <AnimatePresence>
                {active && typeof active === 'object' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 bg-black/20 h-full w-full z-10'
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {active && typeof active === 'object' ? (
                    <div className='fixed inset-0  grid place-items-center z-[100]'>
                        <motion.div
                            layoutId={`card-${active.title}-${id}`}
                            ref={ref}
                            className='w-full flex flex-col dark:bg-neutral-950/90 sm:rounded-3xl overflow-hidden'
                            style={{ maxWidth: 'calc(50dvw - 1rem)', maxHeight: 'calc(auto - 2rem)' }}
                        >
                            <motion.div className='pt-6 bg-neutral-950' layoutId={`image-${active.title}-${id}`}>
                                {/* <BarChartMetrics /> */}
                            </motion.div>
                            <div>
                                <div className='flex justify-between items-start px-4'>
                                    <div>
                                        <motion.h3
                                            layoutId={`title-${active.title}-${id}`}
                                            className='font-bold text-neutral-700 dark:text-neutral-200'
                                        >
                                            {active.title}
                                        </motion.h3>
                                        <motion.p
                                            layoutId={`description-${active.subTitle}-${id}`}
                                            className='text-neutral-600 dark:text-neutral-400'
                                        >
                                            {active.subTitle}
                                        </motion.p>
                                    </div>
                                </div>
                                <div className='pt-4 relative px-4'>
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className='text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400'
                                    >
                                        {typeof active.content === 'function'
                                            ? active.content()
                                            : active.content}
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ) : null }
            </AnimatePresence>

            <ul className='w-full max-h-[5rem] flex justify-between gap-6'>
                {cards.map((card, index) => (
                    <motion.div
                        layoutId={`card-${card.title}-${id}`}
                        key={`card-${card.title}-${id}`}
                        onClick={() => setActive(card)}
                        className='w-[33.3%] flex flex-col md:flex-row justify-between items-center dark:bg-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer p-4'
                    >
                        <Flex width='100%' justify='between' align='center'>
                            <div>
                                <motion.h3
                                    layoutId={`title-${card.title}-${id}`}
                                    className='font-semibold text-md dark:text-neutral-200 md:text-left'
                                >
                                    {card.title}
                                </motion.h3>
                                <motion.p
                                    layoutId={`description-${card.subTitle}-${index}`}
                                    className='dark:text-neutral-400 text-left text-sm'
                                >
                                    {card.subTitle}
                                </motion.p>
                            </div>

                            <motion.div className='flex justify-center' layoutId={`image-${card.title}-${id}`}>
                                <TestChart />
                            </motion.div>
                        </Flex>
                    </motion.div>
                ))}
            </ul>
        </>
    );
}
