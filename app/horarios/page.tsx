import type { Metadata } from "next";
import { getContent } from "@/lib/content-server";
import { SiteShell, WhatsAppLink } from "../site-shell";
import { ScheduleList } from "./schedule-list";

export const metadata: Metadata = {
  title: "Horários de Atendimento",
  description: "Consulte os dias e horários de atendimento da equipe Atos Med.",
};
export default async function SchedulePage() {
  const { professionals, settings } = await getContent();
  return (
    <SiteShell>
      <section className="page-hero schedule-hero">
        <div className="page-title">
          <span className="eyebrow">
            <i /> Horários de atendimento
          </span>
          <h1>Encontre o melhor momento para o seu cuidado.</h1>
          <p>
            Funcionamento: {settings.hours}. Selecione uma especialidade para
            consultar os profissionais.
          </p>
          <WhatsAppLink className="button button-primary">
            Consultar disponibilidade ↗
          </WhatsAppLink>
        </div>
      </section>
      <section className="content-section">
        <div className="notice">
          ◷{" "}
          <span>
            Os horários podem sofrer alterações. Consulte nossa equipe pelo
            WhatsApp para confirmar a disponibilidade.
          </span>
        </div>
        <ScheduleList items={professionals} />
      </section>
    </SiteShell>
  );
}
