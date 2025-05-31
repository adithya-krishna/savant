import type { Metadata } from 'next';
import { DM_Sans, Lora, IBM_Plex_Mono } from 'next/font/google';
import '@/app/globals.css';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

const DMSans = DM_Sans({
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  subsets: ['latin'],
});

const loraSerif = Lora({
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  subsets: ['latin'],
});

const IBMMono = IBM_Plex_Mono({
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Savant: Client resource management',
  description: 'Client resource management dashboard',
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${DMSans.variable} ${loraSerif.variable} ${IBMMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex flex-1 flex-col h-full">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
