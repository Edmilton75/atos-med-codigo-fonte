import { getContent } from "@/lib/content-server";
import Link from "next/link";
import { SiteShell, WhatsAppLink } from "./site-shell";

const highlights = [
  [
    "Atendimento humanizado",
    "Escuta atenta e cuidado respeitoso em cada etapa.",
  ],
  [
    "Equipe multidisciplinar",
    "Especialidades integradas para um olhar completo sobre você.",
  ],
  [
    "Ambiente acolhedor",
    "Um espaço leve, seguro e pensado para o seu bem-estar.",
  ],
  [
    "Cuidado personalizado",
    "Acompanhamento adequado às necessidades de cada pessoa.",
  ],
];

export default async function Home() {
  const { settings, specialties: allSpecialties } = await getContent();
  const specialties = allSpecialties.slice(0, 6);
  const faqs = settings.faqs.map((f) => [f.question, f.answer]);
  return (
    <SiteShell>
      <section className="hero">
        <div className="hero-copy reveal">
          <span className="eyebrow">
            <i /> Saúde mental • bem-estar • qualidade de vida
          </span>
          <h1>{settings.heroTitle}</h1>
          <p>{settings.heroText}</p>
          <div className="hero-actions">
            <WhatsAppLink className="button button-primary">
              Agendar pelo WhatsApp <span>↗</span>
            </WhatsAppLink>
            <Link className="button button-ghost" href="/profissionais">
              Conheça nossa equipe
            </Link>
          </div>
          <div className="trust-row">
            <span>
              <b>✓</b> Cuidado responsável
            </span>
            <span>
              <b>✓</b> Atendimento acolhedor
            </span>
          </div>
        </div>
        <div className="hero-visual" aria-label="Identidade visual Atos Med">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="logo-stage">
            <img
              src={settings.heroImage || "/logo-atos-med.jpeg"}
              alt="Atos Med"
            />
          </div>
        </div>
      </section>

      <section className="intro section">
        <div className="section-heading">
          <span className="eyebrow">
            <i /> Sobre a Atos Med
          </span>
          <h2>{settings.introTitle}</h2>
          <p>{settings.introText}</p>
        </div>
        <div className="highlight-grid">
          {highlights.map(([title, text]) => (
            <article className="highlight-card" key={title}>
              {/* <span className="number">0{index + 1}</span> */}
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="specialties-preview section">
        <div className="section-heading heading-row">
          <div>
            <span className="eyebrow light">
              <i /> Especialidades
            </span>
            <h2>Cuidado em diferentes áreas</h2>
          </div>
          <Link className="text-link light" href="/especialidades">
            Ver todas as especialidades <span>→</span>
          </Link>
        </div>
        <div className="specialty-grid">
          {specialties.map(({ name: title, summary: text, icon, slug }) => (
            <Link
              href={`/especialidades/${slug}`}
              className="specialty-card"
              key={title}
            >
              <span className="service-icon">{icon}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <span className="card-link">
                Saiba mais <b>→</b>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="team-teaser section">
        <div className="team-message">
          <span className="eyebrow">
            <i /> Nossa equipe
          </span>
          <h2>Profissionais que escutam, acolhem e cuidam.</h2>
          <p>
            Conheça a equipe multidisciplinar da Atos Med, suas áreas de atuação
            e horários de atendimento.
          </p>
          <Link href="/profissionais" className="button button-primary">
            Conhecer profissionais <span>→</span>
          </Link>
        </div>
        <div className="team-art" aria-hidden="true">
          <span>Atos</span>
          <b>Med</b>
          <i />
        </div>
      </section>

      <section className="faq section">
        <div className="section-heading">
          <span className="eyebrow">
            <i /> Dúvidas frequentes
          </span>
          <h2>Informação também acolhe</h2>
        </div>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => (
            <details key={question} open={index === 0}>
              <summary>
                {question}
                <span>+</span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="final-cta section">
        <div>
          <span className="eyebrow light">
            <i /> Estamos aqui para ajudar
          </span>
          <h2>Seu cuidado pode começar com uma conversa.</h2>
          <p>
            Fale com nossa equipe e encontre o atendimento mais adequado para
            você.
          </p>
        </div>
        <WhatsAppLink className="button button-light">
          Conversar pelo WhatsApp <span>↗</span>
        </WhatsAppLink>
      </section>
    </SiteShell>
  );
}
