import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono, Newsreader } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import ImpeccableLiveClient from '@/components/theme/ImpeccableLiveClient';

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800']
});

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700']
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700']
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover' as const,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#06080d' }
  ]
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://agentone.ai'),
  title: {
    default: 'Agent One — AI-Powered Document Intelligence & Insight Extraction',
    template: '%s | Agent One'
  },
  description:
    'Agent One is the intelligent AI document-analysis agent that understands your files, extracts critical insights, identifies requirements and action items, and turns documents into actionable knowledge.',
  keywords: [
    'AI Document Intelligence',
    'Document Analysis',
    'PDF Summarization',
    'AI Agent',
    'Contract Review',
    'Insight Extraction'
  ],
  authors: [{ name: 'Agent One Team' }],
  openGraph: {
    title: 'Agent One — AI-Powered Document Intelligence & Insight Extraction',
    description: 'Transform complex documents into structured intelligence and strategic insights with AI.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Agent One'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agent One — AI Document Intelligence',
    description: 'Transform complex documents into structured intelligence and strategic insights with AI.'
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=4', sizes: 'any' },
      { url: '/icon.svg?v=4', type: 'image/svg+xml' },
      { url: '/favicon.svg?v=4', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png?v=4', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png?v=4', type: 'image/png', sizes: '16x16' }
    ],
    shortcut: '/favicon.ico?v=4',
    apple: [
      { url: '/apple-icon.png?v=4', sizes: '180x180', type: 'image/png' },
      { url: '/apple-icon.svg?v=4', type: 'image/svg+xml' }
    ]
  },
  manifest: '/site.webmanifest?v=4'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jakartaSans.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Instrument+Serif:ital@1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://db.onlinewebfonts.com/c/8cb707a9b8a73f8a7403336b861c3074?family=BubbledotICG-FinePos"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':true;if(d)document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');}catch(e){}})();`
          }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <ImpeccableLiveClient />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
