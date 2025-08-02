import React from 'react';
import './globals.css';

export const metadata = {
  title: 'SuperSal AI - Enterprise AI Platform',
  description: 'Revolutionary AI platform for enterprise automation and intelligence',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <title>SuperSal AI Platform</title>
        <script src="/supersal-buttons.js" async></script>
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}
