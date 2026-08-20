import type { Metadata } from "next";
import { SiteShell } from "../site-shell";
import { professionals } from "../data";
import { ProfessionalList } from "./professional-list";

export const metadata: Metadata = { title:"Profissionais", description:"Conheça a equipe multidisciplinar e os horários de atendimento da Atos Med." };
export default function ProfessionalsPage(){return <SiteShell><section className="page-hero"><div className="page-title"><span className="eyebrow"><i/> Equipe multidisciplinar</span><h1>Conhecimento técnico com cuidado humano.</h1><p>Conheça as áreas de atuação, modalidades e horários da nossa equipe. Os nomes abaixo são demonstrativos até a inserção dos dados oficiais.</p></div></section><section className="content-section"><ProfessionalList items={professionals}/></section></SiteShell>}
