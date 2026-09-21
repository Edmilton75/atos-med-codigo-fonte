import { getContent } from "@/lib/content-server";
import type { Metadata } from "next";
import { SiteShell, WhatsAppLink } from "../site-shell";

export const metadata: Metadata = {
  title: "Sobre a Clínica",
  description: "Conheça o propósito e os valores da Atos Med.",
};

export default async function AboutPage() {
  const { settings } = await getContent();
  const values = settings.values;
  return (
    <SiteShell>
      <section className="page-hero">
        <div className="page-title">
          <span className="eyebrow">
            <i /> Sobre a Atos Med
          </span>
          <h1>{settings.aboutTitle}</h1>
          <p>
            Criamos uma experiência de cuidado integrada, leve e respeitosa para
            pessoas e famílias.
          </p>
        </div>
      </section>
      <section className="content-section story-layout">
        <article>
          <span className="eyebrow">
            <i /> Nossa história
          </span>
          <h2>Uma clínica feita para acolher por inteiro.</h2>
          <p>{settings.aboutText}</p>
          <p>
            Em cada atendimento, o compromisso é respeitar singularidades,
            preservar a ética profissional e favorecer um cuidado integrado.
          </p>
        </article>
        <div className="structure-placeholder">
          {settings.aboutImage ? (
            <img
              src={settings.aboutImage}
              alt="Estrutura da Atos Med"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <>
              <span>Atos Med</span>
              <p>Nosso espaço de acolhimento.</p>
            </>
          )}
        </div>
      </section>
      <section className="purpose-section">
        <div>
          <span className="eyebrow light">
            <i /> Nosso propósito
          </span>
          <h2>
            Promover saúde mental e qualidade de vida com escuta, respeito e
            responsabilidade.
          </h2>
        </div>
        <div className="mission-grid">
          <article>
            <span>01</span>
            <h3>Missão</h3>
            <p>{settings.mission}</p>
          </article>
          <article>
            <span>02</span>
            <h3>Visão</h3>
            <p>{settings.vision}</p>
          </article>
          <article>
            <span>03</span>
            <h3>Valores</h3>
            <div className="tag-list dark">
              {values.map((v) => (
                <em key={v}>{v}</em>
              ))}
            </div>
          </article>
        </div>
      </section>
      <section className="final-cta section">
        <div>
          <h2>Conheça uma forma mais humana de cuidar.</h2>
          <p>Nossa equipe está disponível para apresentar os atendimentos.</p>
        </div>
        <WhatsAppLink className="button button-light">
          Falar com a Atos Med ↗
        </WhatsAppLink>
      </section>
    </SiteShell>
  );
}
