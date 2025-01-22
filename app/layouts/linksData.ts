import IconDashboard from "@/components/icons/IconDashboard";
import IconVirtualAssistant from "@/components/icons/IconVirtualAssistant";
import IconCreditCard from "@/components/icons/IconCreditCard";
import IconProfileSetting from '@/components/icons/IconProfileSetting';
import IconLogOut from '@/components/icons/IconLogOut';

export const pincipalLinks = [
    {
        label: 'Panel',
        href: '/dashboard',
        icon: IconDashboard
    },
    {
        label: 'Asistente Virtual',
        href: '/virtualAssistant',
        icon: IconVirtualAssistant
    },
    {
        label: 'Suscripción',
        href: '#',
        icon: IconCreditCard
    },
];

export const secondaryLinks = [
    {
        label: 'Ajustes',
        href: '#',
        icon: IconProfileSetting,
        tooltipContent: 'Ajustes',
        className: 'group ml-2 flex-shrink-0',
    },
    {
        label: 'Cerrar Sesión',
        href: '#',
        icon: IconLogOut,
        tooltipContent: 'Cerrar Sesión',
        className: 'logout/sidebar flex-shrink-0',
    }
];
