import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://atos-med.appatosvida.chatgpt.site"),
  title: { default: "Atos Med | Saúde Mental e Bem-Estar", template: "%s | Atos Med" },
  description: "Atendimento humanizado e multidisciplinar para promover saúde mental, equilíbrio emocional e qualidade de vida.",
  openGraph: { title: "Atos Med | Cuidar da mente também é cuidar da vida", description: "Saúde mental, bem-estar e cuidado multidisciplinar em um ambiente acolhedor.", type: "website", locale: "pt_BR", images:[{url:"/og.png",width:1200,height:630,alt:"Atos Med — Cuidar da mente também é cuidar da vida"}] },
  twitter: { card: "summary_large_image", title: "Atos Med", description: "Saúde mental, bem-estar e cuidado multidisciplinar.", images:["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body>{children}</body></html>; }
