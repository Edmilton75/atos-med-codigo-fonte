import { getContent } from "@/lib/content-server";
import type { Metadata } from "next";
import { SiteShell, WhatsAppLink } from "../site-shell";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Entre em contato com a Atos Med pelo WhatsApp, Instagram ou formulário.",
};
export default async function ContactPage() {
  const { settings } = await getContent();
  return (
    <SiteShell>
      <section className="page-hero">
        <div className="page-title">
          <span className="eyebrow">
            <i /> Entre em contato
          </span>
          <h1>Estamos prontos para ouvir você.</h1>
          <p>
            Fale com a recepção para conhecer especialidades, profissionais e
            disponibilidade de atendimento.
          </p>
        </div>
      </section>
      <section className="content-section contact-layout">
        <aside className="contact-info">
          <h2>Como prefere conversar?</h2>
          <WhatsAppLink className="contact-method">
            <span>W</span>
            <div>
              <small>WhatsApp</small>
              <strong>Falar com a recepção</strong>
            </div>
            <b>↗</b>
          </WhatsAppLink>
          <a
            className="contact-method"
            href={
              settings.instagram
                ? `https://instagram.com/${settings.instagram.replace(/^@/, "")}`
                : "/contato"
            }
            target="_blank"
            rel="noreferrer"
          >
            <span>◎</span>
            <div>
              <small>Instagram</small>
              <strong>{settings.instagram || "Consulte a recepção"}</strong>
            </div>
            <b>↗</b>
          </a>
          <div className="info-block">
            <small>Telefone</small>
            <strong>{settings.phone}</strong>
            <small>Endereço</small>
            <strong>{settings.address}</strong>
            <small>Funcionamento</small>
            <strong>{settings.hours}</strong>
          </div>
          <div className="map-placeholder">Mapa e localização da clínica</div>
        </aside>
        <div>
          <h2>Envie uma mensagem</h2>
          <p className="form-intro">
            Use o formulário apenas para informações gerais. Não envie dados
            clínicos ou sensíveis.
          </p>
          <ContactForm />
        </div>
      </section>
    </SiteShell>
  );
}
