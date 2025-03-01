import type React from "react"
import "@/app/globals.css"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/AuthContext"
import { InstallPWA } from "@/components/install-pwa"
import { CacheBuster } from "@/components/cache-buster"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: "Pochacco Social",
  description: "A cozy social media app for friends",
  generator: 'v0.dev',
  manifest: '/manifest.json',
  metadataBase: new URL('https://sm-bp4u.onrender.com'),
  icons: {
    apple: '/icons/icon-192x192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black',
    title: 'Pochacco Social',
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="Pochacco Social" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', async function() {
                  try {
                    // Unregister existing service workers first
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    for (let registration of registrations) {
                      await registration.unregister();
                    }

                    // Clear caches
                    const cacheKeys = await caches.keys();
                    await Promise.all(
                      cacheKeys.map(key => caches.delete(key))
                    );

                    // Register new service worker
                    const registration = await navigator.serviceWorker.register('/sw.js');
                    console.log('ServiceWorker registration successful');
                    
                    // Force update check
                    registration.update();
                    
                    registration.addEventListener('updatefound', () => {
                      const newWorker = registration.installing;
                      if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Force reload when new version is available
                            window.location.reload();
                          }
                        });
                      }
                    });

                    // Handle controller changes
                    navigator.serviceWorker.addEventListener('controllerchange', () => {
                      window.location.reload();
                    });
                  } catch (error) {
                    console.error('ServiceWorker registration failed:', error);
                  }
                });
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <InstallPWA />
            <CacheBuster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import './globals.css'