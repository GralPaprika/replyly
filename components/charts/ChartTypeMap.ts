export interface DataEntry {
    date: string;
    messagesSent: number;
}

export interface ChannelData {
    totalMessagesSent: number;
    dailyData: DataEntry[];
    weeklyData: DataEntry[];
    monthlyData: DataEntry[];
}

export interface Channels {
    whatsapp: ChannelData;
    facebook?: ChannelData;
    instagram?: ChannelData;
    shopify?: ChannelData;
    woocommerce?: ChannelData;
}

export interface ContentData {
    channels: Channels;
}

export interface ChartSelectorProps {
    content?: ContentData | null;
}