export type Responsive = 'sm' | 'md' | 'lg' | string;

export const sizeMap: Record<'sm' | 'md' | 'lg', string> = {
    sm: '1em',
    md: '2em',
    lg: '3em',
};

export interface IconBaseProps extends React.SVGProps<SVGSVGElement> {
    size?: Responsive;
    color?: string;
}
