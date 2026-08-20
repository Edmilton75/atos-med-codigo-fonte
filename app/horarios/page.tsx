import type { Metadata } from "next";
import { professionals } from "../data";
import { SiteShell, WhatsAppLink } from "../site-shell";
import { ScheduleList } from "./schedule-list";

export const metadata: Metadata={title:"Horários de Atendimento",description:"Consulte os dias e horários de atendimento da equipe Atos Med."};
export default function SchedulePage(){return <SiteShell><section className="page-hero schedule-hero"><div className="page-title"><span className="eyebrow"><i/> Horários de atendimento</span><h1>Encontre o melhor momento para o seu cuidado.</h1><p>Funcionamento geral demonstrativo: segunda a sexta, das 8h às 18h. Selecione uma especialidade para consultar os profissionais.</p><WhatsAppLink className="button button-primary">Consultar disponibilidade ↗</WhatsAppLink></div></section><section className="content-section"><div className="notice">◷ <span>Os horários podem sofrer alterações. Consulte nossa equipe pelo WhatsApp para confirmar a disponibilidade.</span></div><ScheduleList items={professionals}/></section></SiteShell>}
