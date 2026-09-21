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
  const { specialties } = await getContent();
  const item = specialties.find((s) => s.slug === slug);
  return item
    ? {
        title: item.name,
        description: item.summary,
        openGraph: {
          title: `${item.name} | Atos Med`,
          description: item.summary,
          images: [],
        },
        twitter: {
          title: `${item.name} | Atos Med`,
          description: item.summary,
          images: [],
        },
      }
    : { title: "Especialidade" };
}

export default async function SpecialtyDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { specialties, professionals } = await getContent();
  const item = specialties.find((s) => s.slug === slug);
  if (!item) notFound();
  const related = professionals
    .filter((p) =>
      p.profession
        .toLowerCase()
        .includes(item.name.toLowerCase().split(" ")[0]),
    )
    .slice(0, 3);
  return (
    <SiteShell>
      <section className="page-hero detail-hero">
        <div className="page-title">
          <Link className="back-link" href="/especialidades">
            ← Todas as especialidades
          </Link>
          <span className="detail-icon">{item.icon}</span>
          <h1>{item.name}</h1>
          <p>{item.intro}</p>
          <WhatsAppLink className="button button-primary">
            Agendar pelo WhatsApp ↗
          </WhatsAppLink>
        </div>
      </section>
      <section className="content-section detail-layout">
        <article className="detail-copy">
          <span className="eyebrow">
            <i /> Sobre o atendimento
          </span>
          <h2>Cuidado responsável e individualizado</h2>
          <p>
            {item.summary} O acompanhamento é planejado de acordo com a
            avaliação do profissional e as necessidades de cada pessoa, sem
            promessas de resultado ou cura.
          </p>
          <h3>Para quem é indicado</h3>
          <p>{item.indicated}</p>
          <h3>Possíveis áreas trabalhadas</h3>
          <div className="tag-list">
            {item.areas.map((area) => (
              <span key={area}>{area}</span>
            ))}
          </div>
        </article>
        <aside className="detail-aside">
          <h3>Profissionais relacionados</h3>
          {related.length ? (
            related.map((p) => (
              <Link key={p.slug} href={`/profissionais/${p.slug}`}>
                <b>{p.name}</b>
                <span>{p.profession}</span>
              </Link>
            ))
          ) : (
            <p>
              Consulte nossa equipe para conhecer os profissionais que realizam
              este atendimento.
            </p>
          )}
          <WhatsAppLink className="text-link">
            Consultar disponibilidade →
          </WhatsAppLink>
        </aside>
      </section>
    </SiteShell>
  );
}
