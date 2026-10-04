import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer, ContactBubble } from '@/components/site/chrome';

export const metadata: Metadata = {
  title: { default: 'SavannaCode | Software & AI Engineering in Kenya', template: '%s | SavannaCode' },
  description: 'Software development, AI engineering, project guidance, and practical mentorship. Based in Kenya. Building worldwide.',
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased"><a className="skip-link" href="#main">Skip to content</a><Header />{children}<Footer /><ContactBubble /></body>
    </html>
  );
}
