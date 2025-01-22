import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, } from '@/components/ui/chart'
import { Channels, ContentData } from './ChartTypeMap'

interface BarChartMetricsProps {
    config: any;
    filteredData: any;
    activeChart: string;
    content?: ContentData | null;
}

const BarChartMetrics: React.FC<BarChartMetricsProps> = ({ config, filteredData, activeChart, content }) => {
    return (
        <ChartContainer
            config={config}
            className='aspect-auto h-full w-full'
        >
            <BarChart
                accessibilityLayer
                data={filteredData}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey='date'
                    tickLine={false}
                    axisLine={false}
                    tickMargin={2}
                    minTickGap={32}
                    tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('es-MX', {
                            month: 'short',
                            day: 'numeric',
                        });
                    }}
                />
                <ChartTooltip
                    content={<ChartTooltipContent
                        className='w-auto'
                        nameKey='views'
                        labelFormatter={(value) => {
                            return new Date(value).toLocaleDateString('es-MX', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            });
                        }}
                    />}
                />
                <ChartLegend className='p-0 mt-[-.25rem]' content={<ChartLegendContent />} />

                {['whatsapp', 'facebook', 'instagram', 'shopify', 'woocommerce'].map(channel => (
                    (activeChart === channel || activeChart === 'all') && content?.channels?.[channel as keyof Channels] && (
                        <Bar
                            key={channel}
                            dataKey={channel}
                            fill={config[channel].color}
                            radius={4}
                            strokeWidth={0}
                        />
                    )
                ))}
            </BarChart>
        </ChartContainer>
    )
}

export default BarChartMetrics
