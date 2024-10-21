import type { Metadata } from 'next';
import { Plus_Jakarta_Sans as PlusJakartaSansFont } from "next/font/google";

import "@radix-ui/themes/styles.css";
import './styles/globals.css';

import { Providers } from '@/components/Providers';

const plusJakartaSans = PlusJakartaSansFont({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Replyly - Atiende a tus clientes 24/7 Siempre en linea',
  description: 'Estar disponible las 24 horas, los 7 días de la semana, ya no tiene que ser una carga para tu equipo. Con Replyly, tienes la tranquilidad de saber que tus clientes siempre serán atendidos de manera eficiente, mientras te enfocas en hacer crecer tu negocio. Ofrece una atención continua y elimina las barreras del tiempo. El control es tuyo, y la disponibilidad también. ¡No más esperas, no más limitaciones! Estás donde tus clientes necesitan que estés: siempre.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={plusJakartaSans.className}
        // style={{ overflow: 'hidden' }}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
