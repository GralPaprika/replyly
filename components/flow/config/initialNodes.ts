export const initialNodes = [
    {
        id: 'CustomerService',
        type: 'custom',
        draggable: true,
        position: { x: 0, y: 0 },
        data: {
            items: [
                'Respuestas desde el comando',
                'Cliente necesita un agente',
                'Reembolso/Devolución',
                'Preguntas sobre su orden',
                'Listos para comprar',
            ],
        },
    },
    {
        id: 'linkWhatsapp',
        type: 'linkWhatsapp',
        position: { x: -1225, y: 320 },
        data: {
            items: [],
        },
    },
    {
        id: 'welcomeMessage',
        type: 'welcomeMessage',
        position: { x: -580, y: -115 },
        data: {
            items: [],
        },
    },
];
