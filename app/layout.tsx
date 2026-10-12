import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "./portfolio.css";

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
  title: "Arjun OS | Arjun Mishra — Software Engineer + HCI/AI Researcher",
  description:
    "Meet Arjun Mishra: software engineer and HCI/AI researcher in Vancouver. Explore Roadpack, Mune, BuildStory, production AI at IFS Copperleaf, and accessibility research at UBC.",
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
  icons: {
    icon: [
      { url: "/favicon-16x16.png?v=2", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png?v=2", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png?v=2", sizes: "48x48", type: "image/png" },
    ],
    apple: { url: "/apple-icon.png?v=2", sizes: "180x180", type: "image/png" },
  },
  openGraph: {
    title: "Arjun OS | Arjun Mishra",
    description:
      "Production AI, accessibility research, and things that ship. Explore Roadpack, Mune, BuildStory, and Arjun's work at IFS Copperleaf and UBC.",
    url: "https://arjunmishra.site",
    siteName: "Arjun OS",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arjun OS | Arjun Mishra",
    description:
      "Production AI, accessibility research, and things that ship. Explore Roadpack, Mune, BuildStory, and Arjun's work at IFS Copperleaf and UBC.",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
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
