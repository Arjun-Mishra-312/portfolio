import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"]
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500", "600"]
});

export const metadata: Metadata = {
  title: "Arjun OS | Arjun Mishra — AI Engineer + HCI Researcher",
  description:
    "Arjun OS portfolio: applied AI engineering, VLM accessibility research, and product-minded full-stack work from Vancouver, BC.",
  keywords: [
    "Arjun Mishra",
    "Arjun OS",
    "HCI/AI Research",
    "Full-Stack Developer",
    "UBC",
    "Machine Learning",
    "LLM",
    "Accessibility",
    "Vancouver",
  ],
  authors: [{ name: "Arjun Mishra" }],
  openGraph: {
    title: "Arjun OS | Arjun Mishra",
    description:
      "Recruiter-focused portfolio presented as Arjun OS — work, experience, research, and AI Island.",
    url: "https://arjunmishra.site",
    siteName: "Arjun OS",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arjun OS | Arjun Mishra",
    description:
      "Recruiter-focused portfolio presented as Arjun OS — work, experience, research, and AI Island.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <Script id="arjun-os-preferences" strategy="beforeInteractive">
          {`(function(){try{var d=document.documentElement;var t=localStorage.getItem('arjun-os-theme');if(t!=='dawn'&&t!=='dusk')t='dusk';d.dataset.arjunTheme=t;d.classList.toggle('dark',t==='dusk');var a={};try{a=JSON.parse(localStorage.getItem('arjun-os-a11y')||'{}')||{}}catch(e){}var systemReduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;var reduceMotion=Boolean(a.reduceMotion||systemReduce);d.dataset.reduceMotion=String(reduceMotion);d.dataset.reduceTransparency=String(Boolean(a.reduceTransparency));d.dataset.highContrast=String(Boolean(a.highContrast));}catch(e){}})();`}
        </Script>
      </head>
      <body className={`${inter.className} ${jetbrainsMono.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
