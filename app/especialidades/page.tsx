import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell, WhatsAppLink } from "../site-shell";
import { specialties } from "../data";

export const metadata: Metadata = { title:"Especialidades", description:"Conheça as especialidades e atendimentos multidisciplinares da Atos Med." };

export default function SpecialtiesPage(){return <SiteShell><section className="page-hero"><div className="page-title"><span className="eyebrow"><i/> Especialidades e serviços</span><h1>Cuidado completo, com diferentes olhares.</h1><p>Encontre o atendimento adequado para cada fase e necessidade. Todos os conteúdos abaixo são informativos e não substituem uma avaliação profissional.</p></div></section><section className="content-section"><div className="listing-grid">{specialties.map(item=><Link className="listing-card" href={`/especialidades/${item.slug}`} key={item.slug}><span className="service-icon">{item.icon}</span><div><h2>{item.name}</h2><p>{item.summary}</p></div><b>Saiba mais →</b></Link>)}</div><div className="inline-cta"><div><span>Não sabe por onde começar?</span><h2>Nossa equipe pode orientar seu primeiro contato.</h2></div><WhatsAppLink className="button button-light">Falar com a recepção ↗</WhatsAppLink></div></section></SiteShell>}
