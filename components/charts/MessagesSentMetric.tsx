'use client'
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts'
import { Flex, Box, Text } from '@radix-ui/themes'
import { Spinner } from '@nextui-org/react'

import LogoReplyly from '@/components/ui/logo'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const chartData = [{ month: 'Febrero', monthlyMessageLimit: 0, messageSent: 104699, overMessage: 54699}]

const chartConfig = {
    monthlyMessageLimit: {
        label: 'Mensajes Restantes del Mes',
        color: '#0d0f14',
    },
    messageSent: {
        label: 'Mensajes Enviados del Mes',
        color: 'hsl(var(--replyly))',
    },
    overMessage: {
        label: 'Mensajes Excedentes del Mes',
        color: '#980f0f',
    },
} satisfies ChartConfig

interface MessagesSentMetricProps {
    content?: any | null;
}

const MessagesSentMetric: React.FC<MessagesSentMetricProps> = ({ content }) => {
    if (content) return (
        <Flex width='100%' height='100%' direction='column' align='center' justify='center' p='2'>
            <LogoReplyly className='mb-4' sizeIcon='5em' textSize='2.8em' />
            <Text className='text-center' as='div' size='3' weight='medium' mb='6'>
                Estamos recopilando tus mensajes enviados... <br />
                <div className='text-sm text-replyly mt-2'>Esto tomará solo un momento...</div>
            </Text>
            <Spinner color='success' />
        </Flex>
    );

    return (
        <Card className='flex flex-col'>
            <CardHeader className='items-center p-4 pb-0'>
                <CardTitle>Mensajes Enviados</CardTitle>
                <CardDescription>Febrero - 2024</CardDescription>
            </CardHeader>

            <CardContent className='flex-1 p-0 pt-[3rem] relative'>
                <ChartContainer
                    config={chartConfig}
                    className='aspect-auto w-full'
                    style={{ height: 'calc(30dvh - 1rem)' }}
                >
                    <RadialBarChart
                        data={chartData}
                        endAngle={180}
                        innerRadius={110}
                        outerRadius={170}
                    >
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle'>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) - 16}
                                                    className='fill-foreground text-2xl font-bold'
                                                >
                                                    {chartData[0].messageSent.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 4}
                                                    className='fill-muted-foreground'
                                                >
                                                    Mensajes Enviados
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>

                        <RadialBar dataKey='monthlyMessageLimit' stackId='a' cornerRadius={0} fill='var(--color-monthlyMessageLimit)' className='stroke-transparent stroke-5' />
                        <RadialBar dataKey='messageSent' fill='var(--color-messageSent)' stackId='a' cornerRadius={5} className='stroke-transparent stroke-5' />
                        <RadialBar dataKey='overMessage' fill='var(--color-overMessage)' stackId='b' cornerRadius={5} className='stroke-transparent stroke-5' />
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>

            <CardFooter className='flex-col gap-2 mt-[-3.5rem]'>
                <Flex gap='2' align='center'>
                    <Box width='15px' height='15px' className='rounded-sm' style={{ backgroundColor: '#0d0f14' }} />
                    <div className='text-muted-foreground text-[12px]'>50,000 Mensajes Mensuales</div>
                </Flex>
                <Flex gap='4'>
                    <Flex gap='2' align='center'>
                        <Box width='15px' height='15px' className='rounded-sm' style={{ backgroundColor: 'hsl(var(--replyly))' }} />
                        <div className='text-muted-foreground text-[12px]'>{chartData[0].messageSent.toLocaleString()} Mensajes Enviados</div>
                    </Flex>
                    <Flex gap='2' align='center'>
                        <Box width='15px' height='15px' className='rounded-sm' style={{ backgroundColor: '#980f0f' }} />
                        <div className='text-muted-foreground text-[12px]'>{chartData[0].overMessage.toLocaleString()} Mensajes Excedentes del Mes</div>
                    </Flex>
                </Flex>
            </CardFooter>
        </Card>
    )
}

export default MessagesSentMetric
