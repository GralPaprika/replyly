'use client'
import * as React from 'react'
import { Box, Flex } from '@radix-ui/themes';
import { Button } from "@nextui-org/react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'

import { IconChartBar, IconChartLine } from '../icons/charts';
import { IconChannelWhatsApp, IconChannelFacebook, IconChannelInstagram, IconChannelShopify, IconChannelWoo } from '../icons/channels';

import { ChartSelectorProps, Channels } from './ChartTypeMap'
import LineChartMetrics from './MetricsLineChart';
import BarChartMetrics from './MetricsBarChart';

type ActiveChartType = 'whatsapp' | 'facebook' | 'instagram' | 'shopify' | 'woocommerce' | 'all';
type TimeRange = 'dailyData' | 'weeklyData' | 'monthlyData';

const chartConfig: ChartConfig = {
    views: {
        label: 'Conversaciones',
    },
    whatsapp: {
        label: 'Whatsapp',
        color: 'hsl(var(--replyly))',
        icon: IconChannelWhatsApp
    },
    facebook: {
        label: 'Facebook',
        color: '#0966ff',
        icon: IconChannelFacebook
    },
    instagram: {
        label: 'Instagram',
        color: '#b93b91',
        icon: IconChannelInstagram
    },
    shopify: {
        label: 'Shopify',
        color: '#184758',
        icon: IconChannelShopify
    },
    woocommerce: {
        label: 'Woocommerce',
        color: '#6c4b9d',
        icon: IconChannelWoo
    },
}

const ChartSelector: React.FC<ChartSelectorProps> = ({ content }) => {
    const [activeChart, setActiveChart] = React.useState<ActiveChartType>('whatsapp');
    const [timeRange, setTimeRange] = React.useState<TimeRange>('dailyData');
    const [activeFilter, setActiveFilter] = React.useState<'dailyData' | 'weeklyData' | 'monthlyData'>('dailyData');
    const [activeChartType, setActiveChartType] = React.useState<'line' | 'bar'>('line');

    const filteredData = React.useMemo(() => {
        const datesSet = new Set<string>();

        Object.keys(content?.channels || {}).forEach(channel => {
            const data = content?.channels[channel as keyof typeof content.channels]?.[timeRange] || [];
            data.forEach(entry => {
                datesSet.add(entry.date);
            });
        });

        const sortedDates = Array.from(datesSet).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        const messagesByDate: { [key: string]: { [key: string]: number } } = {};

        sortedDates.forEach(date => {
            messagesByDate[date] = {
                whatsapp: 0,
                facebook: 0,
                instagram: 0,
                shopify: 0,
                woocommerce: 0,
            };
        });

        Object.keys(content?.channels || {}).forEach(channel => {
            const channelData = content?.channels[channel as keyof typeof content.channels]?.[timeRange] || [];
            channelData.forEach(entry => {
                if (messagesByDate[entry.date]) {
                    messagesByDate[entry.date][channel] += entry.messagesSent;
                }
            });
        });

        return sortedDates.map(date => ({
            date,
            ...messagesByDate[date],
        }));
    }, [activeChart, content, timeRange]);

    const filters: { label: string, type: TimeRange }[] = [
        { label: 'D', type: 'dailyData' },
        { label: 'S', type: 'weeklyData' },
        { label: 'M', type: 'monthlyData' }
    ];

    const handleFilterChange = (filterType: 'dailyData' | 'weeklyData' | 'monthlyData') => {
        setActiveFilter(filterType);
        setTimeRange(filterType);
    };

    const total = React.useMemo(() => {
        if (!content) return { whatsapp: 0, facebook: 0, instagram: 0, shopify: 0, woocommerce: 0 };

        return {
            whatsapp: getTotalMessages('whatsapp'),
            facebook: getTotalMessages('facebook'),
            instagram: getTotalMessages('instagram'),
            shopify: getTotalMessages('shopify'),
            woocommerce: getTotalMessages('woocommerce'),
        };
    }, [content, filteredData]);

    function getTotalMessages(channel: keyof Channels): number {
        if (!content || !content.channels[channel]) return 0;
        return content.channels[channel][timeRange].reduce((total, entry) => total + entry.messagesSent, 0);
    }

    return (
        <Card className='w-full'>
            <CardHeader className='flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row'>
                <div className='flex flex-1 flex-col justify-center gap-1 p-4'>
                    <CardTitle>Conversaciones por Canal</CardTitle>
                    <CardDescription>Últimos 3 meses</CardDescription>
                </div>

                <div className='flex'>
                    {Object.keys(content?.channels || {}).map((key) => {
                        const chart = key as ActiveChartType;
                        return (
                            <button
                                key={chart}
                                data-active={activeChart === chart}
                                className='flex flex-1 flex-col justify-center gap-1 border-t p-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0'
                                onClick={() => setActiveChart(chart)}
                            >
                                <span className='text-xs text-muted-foreground'>
                                    {chart === 'all' ? 'Todos los canales' : chartConfig[chart].label}
                                </span>
                                <span className='text-xs font-bold leading-none'>
                                    {chart === 'all'
                                        ? content && Object.keys(content.channels).length > 1
                                            ? (total.whatsapp + total.facebook + total.instagram + total.shopify + total.woocommerce).toLocaleString()
                                            : null
                                        : total[chart].toLocaleString()}
                                </span>
                            </button>
                        );
                    })}
                    {Object.keys(content?.channels || {}).length > 1 && (
                        <button
                            data-active={activeChart === 'all'}
                            className='flex flex-1 flex-col justify-center gap-1 border-t p-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0'
                            onClick={() => setActiveChart('all')}
                        >
                            <span className='text-xs text-muted-foreground'>Todos los canales</span>
                            <span className='text-xs font-bold leading-none'>
                                {(total.whatsapp + total.facebook + total.instagram + total.shopify + total.woocommerce).toLocaleString()}
                            </span>
                        </button>
                    )}
                </div>
            </CardHeader>

            <CardContent className='p-2'>
                <Box className='relative'>
                    <Flex className='absolute left-0 z-10 gap-1'>
                        <Button
                            className='min-w-4 font-medium p-1.5'
                            size='sm'
                            variant='bordered'
                            color={activeChartType === 'bar' ? 'success' : undefined}
                            onClick={() => setActiveChartType('bar')}
                        >
                            <IconChartBar size='1.25em' color={activeChartType === 'bar' ? 'hsl(var(--replyly))' : undefined} />
                        </Button>
                        <Button
                            className='min-w-4 font-medium p-1.5'
                            size='sm'
                            variant='bordered'
                            color={activeChartType === 'line' ? 'success' : undefined}
                            onClick={() => setActiveChartType('line')}
                        >
                            <IconChartLine size='1.25em' color={activeChartType === 'line' ? 'hsl(var(--replyly))' : undefined} />
                        </Button>
                    </Flex>
                    <Flex className='absolute right-0 z-10 gap-1'>
                        {filters.map(filter => (
                            <Button
                                key={filter.type}
                                className='min-w-4 font-medium p-2'
                                size='sm'
                                variant='bordered'
                                color={activeFilter === filter.type ? 'success' : undefined}
                                onClick={() => handleFilterChange(filter.type)}
                            >
                                {filter.label}
                            </Button>
                        ))}
                    </Flex>
                </Box>

                <ChartContainer
                    config={chartConfig}
                    className='aspect-auto w-full pt-10'
                    style={{ height: 'calc(31dvh - .5rem)' }}
                >
                    {activeChartType === 'line' ? (
                        <LineChartMetrics
                            activeChart={activeChart}
                            content={content}
                            filteredData={filteredData}
                            config={chartConfig}
                        />
                    ) : (
                        <BarChartMetrics
                            activeChart={activeChart}
                            content={content}
                            filteredData={filteredData}
                            config={chartConfig}
                        />
                    )}
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default ChartSelector;
