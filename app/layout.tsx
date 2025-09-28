import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
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
  title: "Arjun Mishra | AI Research Assistant & Full-Stack Developer",
  description: "Undergraduate Research Assistant at UBC SOCIUS Lab specializing in AI/LLM systems, full-stack development, and HCI research. Winner of Hack the North 2024 and youCode 2025.",
  keywords: [
    "Arjun Mishra",
    "HCI/AI Research",
    "Full-Stack Developer", 
    "UBC",
    "Machine Learning",
    "LLM",
    "React",
    "Python",
    "Computer Science",
    "Hack the North Winner",
    "SOCIUS Lab"
  ],
  authors: [{ name: "Arjun Mishra" }],
  openGraph: {
    title: "Arjun Mishra | AI Research Assistant & Full-Stack Developer",
    description: "Undergraduate Research Assistant at UBC SOCIUS Lab specializing in AI/LLM systems, full-stack development, and HCI research.",
    url: "https://arjunmishra.site",
    siteName: "Arjun Mishra Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arjun Mishra | AI Research Assistant & Full-Stack Developer",
    description: "Undergraduate Research Assistant at UBC SOCIUS Lab specializing in AI/LLM systems, full-stack development, and HCI research.",
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.ico" />
      </head>
      <body className={`${inter.className} ${jetbrainsMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
