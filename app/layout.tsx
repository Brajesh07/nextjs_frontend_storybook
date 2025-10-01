import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "AI Storybook Generator | Create Personalized Children's Stories",
  description:
    "Create magical, personalized storybooks for children with AI-generated stories and custom character illustrations. Transform your child into the hero of their own adventure!",
  keywords:
    "AI storybook, personalized children stories, character generation, PDF storybook, kids books",
  authors: [{ name: "Storybook Team" }],
  openGraph: {
    title: "AI Storybook Generator",
    description: "Create magical, personalized storybooks for children with AI",
    images: ["/og-image.jpg"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Storybook Generator",
    description: "Create magical, personalized storybooks for children with AI",
    images: ["/og-image.jpg"],
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${nunito.variable}`}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
