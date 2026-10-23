import type { Metadata, Viewport } from 'next';
import { Inter, IBM_Plex_Mono, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeContext';
import { AuthProvider } from '@/lib/auth-context';
import { ToastProvider } from '@/components/enterprise/EnterpriseToast';
import { AuthModal } from '@/components/auth/AuthModal';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '600', '700'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#03173B' },
    { media: '(prefers-color-scheme: light)', color: '#F7F9FC' },
  ],
};

export const metadata: Metadata = {
  title: 'Pulse: Engineering Engagement & Wellbeing Diagnostics',
  description:
    'Quarterly engineering engagement diagnostic and operational health platform. Anonymous by design.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/brand/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ibmPlexMono.variable} ${sourceSerif.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-theme-bg text-theme-primary selection:bg-accent selection:text-white font-sans antialiased">
        {/* Skip to main content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 z-50 bg-accent text-white px-3 py-1.5 font-mono text-xs uppercase tracking-wider rounded-control shadow-lg"
        >
          Skip to main content
        </a>
        {/* Stale Service Worker Cleanup */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(regs) {
                  for (var i = 0; i < regs.length; i++) {
                    regs[i].unregister();
                  }
                });
              }
            `,
          }}
        />
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <AuthModal />
              {children}
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
