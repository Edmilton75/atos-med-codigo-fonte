import type { Metadata } from "next";
import "./globals.css";
import { getContent } from "@/lib/content-server";
import { SettingsProvider } from "./settings-provider";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Atos Med | Saúde Mental e Bem-Estar",
    template: "%s | Atos Med",
  },
  description:
    "Atendimento humanizado e multidisciplinar para promover saúde mental, equilíbrio emocional e qualidade de vida.",
  openGraph: {
    title: "Atos Med | Cuidar da mente também é cuidar da vida",
    description:
      "Saúde mental, bem-estar e cuidado multidisciplinar em um ambiente acolhedor.",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Atos Med — Cuidar da mente também é cuidar da vida",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Atos Med",
    description: "Saúde mental, bem-estar e cuidado multidisciplinar.",
    images: ["/og.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { settings } = await getContent();
  return (
    <html lang="pt-BR">
      <body>
        <SettingsProvider settings={settings}>{children}</SettingsProvider>
      </body>
    </html>
  );
}
