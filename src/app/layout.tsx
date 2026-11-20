import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

const siteUrl = "https://nexora-kappa-five-53.vercel.app";
const siteDescription =
  "Multi-tenant project management SaaS: isolated workspaces, roles, invitations and task boards.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Nexora",
  description: siteDescription,
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Nexora",
    title: "Nexora — Project management for teams",
    description: siteDescription,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Nexora dashboard" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexora — Project management for teams",
    description: siteDescription,
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#12151c",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
