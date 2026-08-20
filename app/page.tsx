import Link from "next/link";
import { SiteShell, WhatsAppLink } from "./site-shell";

const highlights = [
  ["Atendimento humanizado", "Escuta atenta e cuidado respeitoso em cada etapa."],
  ["Equipe multidisciplinar", "Especialidades integradas para um olhar completo sobre você."],
  ["Ambiente acolhedor", "Um espaço leve, seguro e pensado para o seu bem-estar."],
  ["Cuidado personalizado", "Acompanhamento adequado às necessidades de cada pessoa."],
];

const specialties = [
  ["Psicologia", "Acolhimento e acompanhamento para diferentes fases da vida.", "◌"],
  ["Psiquiatria", "Avaliação médica responsável e cuidado integrado em saúde mental.", "+"],
  ["Neuropsicologia", "Compreensão de aspectos cognitivos, emocionais e comportamentais.", "◇"],
  ["Terapia Ocupacional", "Autonomia, participação e qualidade de vida no cotidiano.", "↗"],
  ["Nutrição", "Orientação alimentar individualizada para saúde e bem-estar.", "⌁"],
  ["Desenvolvimento Infantil", "Acompanhamento atento ao desenvolvimento e à família.", "✦"],
];

const faqs = [
  ["Como faço para agendar uma consulta?", "Entre em contato pelo WhatsApp. Nossa equipe irá orientar sobre profissionais, modalidades e disponibilidade."],
  ["A clínica atende crianças e adolescentes?", "Sim. A Atos Med reúne especialidades e profissionais preparados para diferentes fases da vida."],
  ["Existem atendimentos online?", "Alguns profissionais oferecem atendimento online. Consulte a modalidade disponível no perfil ou fale com a recepção."],
  ["Como escolher o profissional mais adequado?", "Nossa recepção pode ajudar a identificar a especialidade mais indicada para sua necessidade, sem realizar diagnóstico pelo atendimento digital."],
];

export default function Home() {
  return (
    <SiteShell>
      <section className="hero">
        <div className="hero-copy reveal">
          <span className="eyebrow"><i /> Saúde mental • bem-estar • qualidade de vida</span>
          <h1>Cuidar da mente também é cuidar da vida.</h1>
          <p>Atendimento humanizado e multidisciplinar para promover equilíbrio emocional, autonomia e qualidade de vida em todas as fases.</p>
          <div className="hero-actions">
            <WhatsAppLink className="button button-primary">Agendar pelo WhatsApp <span>↗</span></WhatsAppLink>
            <Link className="button button-ghost" href="/profissionais">Conheça nossa equipe</Link>
          </div>
          <div className="trust-row"><span><b>✓</b> Cuidado responsável</span><span><b>✓</b> Atendimento acolhedor</span></div>
        </div>
        <div className="hero-visual" aria-label="Identidade visual Atos Med">
          <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
          <div className="logo-stage"><img src="/logo-atos-med.jpeg" alt="Atos Med" /></div>
          
        </div>
      </section>

      <section className="intro section">
        <div className="section-heading"><span className="eyebrow"><i /> Sobre a Atos Med</span><h2>Um espaço pensado para cuidar de você</h2><p>Unimos diferentes áreas do cuidado em um ambiente contemporâneo, tranquilo e humano, respeitando a história e o tempo de cada pessoa.</p></div>
        <div className="highlight-grid">{highlights.map(([title, text], index) => <article className="highlight-card" key={title}><span className="number">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>

      <section className="specialties-preview section">
        <div className="section-heading heading-row"><div><span className="eyebrow light"><i /> Especialidades</span><h2>Cuidado em diferentes áreas</h2></div><Link className="text-link light" href="/especialidades">Ver todas as especialidades <span>→</span></Link></div>
        <div className="specialty-grid">{specialties.map(([title, text, icon]) => <Link href={`/especialidades/${title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(" ", "-")}`} className="specialty-card" key={title}><span className="service-icon">{icon}</span><h3>{title}</h3><p>{text}</p><span className="card-link">Saiba mais <b>→</b></span></Link>)}</div>
      </section>

      <section className="team-teaser section"><div className="team-message"><span className="eyebrow"><i /> Nossa equipe</span><h2>Profissionais que escutam, acolhem e cuidam.</h2><p>Conheça a equipe multidisciplinar da Atos Med, suas áreas de atuação e horários de atendimento.</p><Link href="/profissionais" className="button button-primary">Conhecer profissionais <span>→</span></Link></div><div className="team-art" aria-hidden="true"><span>Atos</span><b>Med</b><i /></div></section>

      <section className="faq section"><div className="section-heading"><span className="eyebrow"><i /> Dúvidas frequentes</span><h2>Informação também acolhe</h2></div><div className="faq-list">{faqs.map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>

      <section className="final-cta section"><div><span className="eyebrow light"><i /> Estamos aqui para ajudar</span><h2>Seu cuidado pode começar com uma conversa.</h2><p>Fale com nossa equipe e encontre o atendimento mais adequado para você.</p></div><WhatsAppLink className="button button-light">Conversar pelo WhatsApp <span>↗</span></WhatsAppLink></section>
    </SiteShell>
  );
}
