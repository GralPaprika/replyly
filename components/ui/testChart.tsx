'use client'
import { Bar, BarChart } from 'recharts'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'

const chartData = [
    { month: 'January', whatsapp: 186, shopify: 155 },
    { month: 'February', whatsapp: 305, shopify: 250 },
    { month: 'March', whatsapp: 237, shopify: 300 },
    { month: 'April', whatsapp: 173, shopify: 120 },
]

const chartConfig = {
    whatsapp: {
        label: 'Whatsapp',
        color: 'hsl(var(--replyly))',
    },
    shopify: {
        label: 'shopify',
        color: '#184758',
    },
} satisfies ChartConfig

export function TestChart() {
    return (
        <ChartContainer config={chartConfig} className='min-h-[4rem] max-h-[4rem] max-w-[4rem]'>
            <BarChart accessibilityLayer data={chartData}>
                <Bar dataKey='whatsapp' fill='var(--color-whatsapp)' radius={1} barSize={6} />
                <Bar dataKey='shopify' fill='var(--color-shopify)' radius={1} barSize={6} />
            </BarChart>
        </ChartContainer>
    )
}
