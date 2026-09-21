import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/content-server";
import { SiteShell, WhatsAppLink } from "../../site-shell";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { professionals } = await getContent();
  const item = professionals.find((p) => p.slug === slug);
  return item
    ? {
        title: item.name,
        description: `${item.profession} — áreas de atuação e horários na Atos Med.`,
        openGraph: { images: [] },
        twitter: { images: [] },
      }
    : { title: "Profissional" };
}

export default async function ProfessionalDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { professionals } = await getContent();
  const item = professionals.find((p) => p.slug === slug);
  if (!item) notFound();
  const message = `Olá! Gostaria de informações sobre atendimento com ${item.name}.`;
  return (
    <SiteShell>
      <section className="profile-hero">
        <div className="profile-photo">
          <img
            src={item.image || "/logo-atos-med.jpeg"}
            alt={item.imageAlt}
            style={{
              objectPosition: item.imagePosition ?? "center",
            }}
          />
        </div>
        <div className="profile-intro">
          <Link className="back-link" href="/profissionais">
            ← Voltar para profissionais
          </Link>
          <span className="eyebrow">
            <i /> {item.profession}
          </span>
          <h1>{item.name}</h1>
          <p className="register">{item.register}</p>
          <p>{item.bio}</p>
          <div className="tag-list">
            {item.areas.map((area) => (
              <span key={area}>{area}</span>
            ))}
          </div>
          <WhatsAppLink className="button button-primary" message={message}>
            Agendar com este profissional ↗
          </WhatsAppLink>
        </div>
      </section>
      <section className="content-section profile-details">
        <article>
          <h2>Formação acadêmica</h2>
          {item.education.map((text) => (
            <p className="info-line" key={text}>
              {text}
            </p>
          ))}
          <h2>Público atendido</h2>
          <div className="tag-list">
            {item.audiences.map((a) => (
              <span key={a}>{a}</span>
            ))}
          </div>
          <h2>Modalidade</h2>
          <div className="tag-list">
            {item.modality.map((a) => (
              <span key={a}>{a}</span>
            ))}
          </div>
        </article>
        <aside className="schedule-panel">
          <span className="eyebrow light">
            <i /> Horários de atendimento
          </span>
          <h2>Disponibilidade semanal</h2>
          {[
            "Segunda-feira",
            "Terça-feira",
            "Quarta-feira",
            "Quinta-feira",
            "Sexta-feira",
            "Sábado",
            "Domingo",
          ].map((day) => {
            const found = item.schedule.find((s) => s.day === day);
            return (
              <div key={day}>
                <b>{day}</b>
                <span>{found?.hours || "Não atende"}</span>
              </div>
            );
          })}
          <small>
            Os horários podem sofrer alterações. Confirme a disponibilidade pelo
            WhatsApp.
          </small>
        </aside>
      </section>
    </SiteShell>
  );
}
