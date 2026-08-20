export type Specialty = { slug: string; name: string; icon: string; summary: string; intro: string; indicated: string; areas: string[] };
export type Professional = {
  slug: string;
  name: string;
  profession: string;
  register: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  areas: string[];
  audiences: string[];
  modality: string[];
  bio: string;
  education: string[];
  schedule: { day: string; hours: string }[];
};

export const specialties: Specialty[] = [
  { slug:"psicologia", name:"Psicologia", icon:"◌", summary:"Acolhimento e acompanhamento para diferentes fases da vida.", intro:"Um espaço de escuta qualificada para compreender emoções, relações e experiências.", indicated:"Pessoas que buscam apoio emocional, autoconhecimento ou acompanhamento diante de desafios cotidianos.", areas:["Ansiedade e estresse","Relacionamentos","Autoconhecimento","Saúde emocional"] },
  { slug:"psicoterapia", name:"Psicoterapia", icon:"≈", summary:"Processo terapêutico construído com vínculo, ética e respeito.", intro:"Acompanhamento contínuo voltado à elaboração de experiências e ao fortalecimento de recursos emocionais.", indicated:"Crianças, adolescentes, adultos, idosos, casais ou famílias, conforme a formação do profissional.", areas:["Regulação emocional","Luto e mudanças","Vínculos","Qualidade de vida"] },
  { slug:"psiquiatria", name:"Psiquiatria", icon:"+", summary:"Avaliação médica responsável e cuidado integrado em saúde mental.", intro:"Especialidade médica dedicada à avaliação, prevenção e acompanhamento de questões relacionadas à saúde mental.", indicated:"Pessoas que necessitam de avaliação médica especializada ou acompanhamento integrado.", areas:["Avaliação psiquiátrica","Acompanhamento clínico","Saúde do sono","Cuidado compartilhado"] },
  { slug:"neuropsicologia", name:"Neuropsicologia", icon:"◇", summary:"Compreensão de aspectos cognitivos, emocionais e comportamentais.", intro:"Integra conhecimentos da psicologia e das neurociências para compreender o funcionamento cognitivo.", indicated:"Pessoas com indicação para investigação de atenção, memória, aprendizagem ou outras funções cognitivas.", areas:["Atenção","Memória","Funções executivas","Cognição"] },
  { slug:"psicopedagogia", name:"Psicopedagogia", icon:"✎", summary:"Acompanhamento dos processos de aprendizagem e suas singularidades.", intro:"Cuidado voltado à compreensão de como cada pessoa aprende e se relaciona com o conhecimento.", indicated:"Crianças, adolescentes e adultos com dificuldades ou necessidades específicas de aprendizagem.", areas:["Aprendizagem","Organização dos estudos","Desenvolvimento escolar","Orientação familiar"] },
  { slug:"terapia-ocupacional", name:"Terapia Ocupacional", icon:"↗", summary:"Autonomia, participação e qualidade de vida no cotidiano.", intro:"Atendimento que favorece participação, funcionalidade e independência em atividades significativas.", indicated:"Pessoas que precisam desenvolver ou recuperar habilidades para o cotidiano.", areas:["Autonomia","Rotina","Habilidades funcionais","Participação social"] },
  { slug:"fonoaudiologia", name:"Fonoaudiologia", icon:"◍", summary:"Cuidado com comunicação, linguagem, voz e funções orofaciais.", intro:"Avaliação e acompanhamento das habilidades de comunicação e funções relacionadas.", indicated:"Pessoas de diferentes idades com necessidades relacionadas à fala, linguagem, voz ou deglutição.", areas:["Linguagem","Fala","Voz","Comunicação"] },
  { slug:"nutricao", name:"Nutrição", icon:"⌁", summary:"Orientação alimentar individualizada para saúde e bem-estar.", intro:"Cuidado nutricional atento à rotina, preferências, necessidades e contexto de cada pessoa.", indicated:"Pessoas que desejam organizar a alimentação ou necessitam de acompanhamento nutricional.", areas:["Educação alimentar","Saúde e rotina","Planejamento alimentar","Bem-estar"] },
  { slug:"atendimento-infantil", name:"Atendimento Infantil", icon:"✦", summary:"Acolhimento especializado para infância e desenvolvimento.", intro:"Atendimento adequado à linguagem da criança, com participação da família quando necessário.", indicated:"Crianças e responsáveis que buscam apoio ao desenvolvimento emocional, social ou cognitivo.", areas:["Desenvolvimento","Emoções","Comportamento","Orientação familiar"] },
  { slug:"atendimento-adolescentes", name:"Atendimento para Adolescentes", icon:"△", summary:"Escuta respeitosa para os desafios e mudanças da adolescência.", intro:"Espaço seguro para expressão, compreensão emocional e desenvolvimento de autonomia.", indicated:"Adolescentes e famílias que buscam apoio nesta fase de transição.", areas:["Identidade","Relações","Autonomia","Vida escolar"] },
  { slug:"atendimento-adultos", name:"Atendimento para Adultos", icon:"○", summary:"Cuidado emocional para demandas da vida adulta.", intro:"Acompanhamento individualizado diante de questões emocionais, profissionais e relacionais.", indicated:"Adultos que desejam cuidado, apoio ou maior compreensão de sua experiência.", areas:["Trabalho e rotina","Relações","Ansiedade","Autoconhecimento"] },
  { slug:"atendimento-idosos", name:"Atendimento para Idosos", icon:"∞", summary:"Acolhimento e qualidade de vida durante o envelhecimento.", intro:"Cuidado atento às mudanças, vínculos, autonomia e bem-estar na maturidade.", indicated:"Pessoas idosas e famílias que buscam acompanhamento especializado.", areas:["Envelhecimento saudável","Memória","Autonomia","Vínculos familiares"] },
  { slug:"terapia-casal", name:"Terapia de Casal", icon:"∩", summary:"Espaço de diálogo, escuta e construção conjunta.", intro:"Acompanhamento para compreender padrões de relação e favorecer comunicação respeitosa.", indicated:"Casais que desejam cuidar do vínculo e da comunicação.", areas:["Comunicação","Conflitos","Projetos compartilhados","Vínculo"] },
  { slug:"terapia-familiar", name:"Terapia Familiar", icon:"⌂", summary:"Cuidado com vínculos, comunicação e dinâmica familiar.", intro:"Espaço para compreender relações e construir formas mais saudáveis de convivência.", indicated:"Famílias que buscam apoio diante de mudanças, conflitos ou novas fases.", areas:["Comunicação familiar","Parentalidade","Mudanças","Fortalecimento de vínculos"] },
  { slug:"orientacao-parental", name:"Orientação Parental", icon:"↟", summary:"Apoio para responsáveis nos desafios do cuidado e desenvolvimento.", intro:"Orientação profissional para compreender necessidades da criança ou adolescente e fortalecer práticas parentais.", indicated:"Pais e responsáveis que buscam apoio para conduzir desafios familiares.", areas:["Limites","Rotinas","Comunicação","Desenvolvimento"] },
  { slug:"avaliacao-psicologica", name:"Avaliação Psicológica", icon:"□", summary:"Processo técnico para compreensão de aspectos psicológicos.", intro:"Avaliação realizada com métodos reconhecidos e comunicação responsável dos resultados.", indicated:"Pessoas com indicação clínica, educacional, ocupacional ou outra finalidade prevista profissionalmente.", areas:["Entrevistas","Instrumentos psicológicos","Integração de dados","Devolutiva"] },
  { slug:"avaliacao-neuropsicologica", name:"Avaliação Neuropsicológica", icon:"▦", summary:"Investigação estruturada do funcionamento cognitivo.", intro:"Processo que reúne entrevistas, observações e instrumentos para compreender funções cognitivas.", indicated:"Pessoas com indicação para investigação do perfil cognitivo e funcional.", areas:["Atenção e memória","Linguagem","Raciocínio","Funções executivas"] },
  { slug:"desenvolvimento-infantil", name:"Desenvolvimento Infantil", icon:"✺", summary:"Acompanhamento atento ao desenvolvimento e à família.", intro:"Olhar integrado para habilidades, participação, comunicação e bem-estar da criança.", indicated:"Crianças com necessidades de acompanhamento do desenvolvimento e seus responsáveis.", areas:["Marcos do desenvolvimento","Brincar","Interação","Orientação familiar"] },
  { slug:"saude-bem-estar", name:"Saúde e Bem-Estar", icon:"☼", summary:"Práticas e acompanhamento para uma vida mais equilibrada.", intro:"Cuidado multidisciplinar voltado à prevenção, rotina saudável e qualidade de vida.", indicated:"Pessoas que desejam cultivar hábitos e recursos de bem-estar.", areas:["Qualidade de vida","Rotina","Autocuidado","Prevenção"] },
  { slug:"atendimentos-multidisciplinares", name:"Atendimentos Multidisciplinares", icon:"✣", summary:"Diferentes especialidades conectadas ao cuidado integral.", intro:"Quando necessário, profissionais de áreas distintas colaboram para uma compreensão mais ampla.", indicated:"Pessoas cujas necessidades se beneficiam de um plano de cuidado integrado.", areas:["Cuidado compartilhado","Comunicação entre áreas","Plano individualizado","Acompanhamento integral"] },
];

export const professionals: Professional[] = [
  {
    slug: "ana-martins",
    name: "Ana Martins",
    profession: "Psicologia",
    register: "CRP: inserir registro",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Foto demonstrativa de uma profissional de Psicologia",
    imagePosition: "center 35%",
    areas: ["Ansiedade", "Saúde emocional", "Terapia de casal"],
    audiences: ["Adolescente", "Adulto", "Casal"],
    modality: ["Presencial", "Online"],
    bio: "Conteúdo demonstrativo. Espaço reservado para uma apresentação humanizada da profissional, sua abordagem e forma de acolhimento.",
    education: ["Graduação: inserir instituição", "Especialização: inserir formação", "Cursos e áreas de estudo: inserir"],
    schedule: [
      { day: "Segunda-feira", hours: "08h às 12h" },
      { day: "Terça-feira", hours: "14h às 18h" },
      { day: "Quinta-feira", hours: "08h às 17h" },
    ],
  },
  {
    slug: "bruno-almeida",
    name: "Bruno Almeida",
    profession: "Psiquiatria",
    register: "CRM: inserir registro",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Foto demonstrativa de um profissional de Psiquiatria",
    imagePosition: "center 30%",
    areas: ["Avaliação psiquiátrica", "Saúde do sono", "Cuidado integrado"],
    audiences: ["Adulto", "Idoso"],
    modality: ["Presencial"],
    bio: "Conteúdo demonstrativo. Espaço para apresentar trajetória profissional, experiência e princípios de cuidado.",
    education: ["Medicina: inserir instituição", "Residência: inserir formação", "Especializações: inserir"],
    schedule: [
      { day: "Terça-feira", hours: "08h às 13h" },
      { day: "Quinta-feira", hours: "13h às 18h" },
    ],
  },
  {
    slug: "carla-souza",
    name: "Carla Souza",
    profession: "Neuropsicologia",
    register: "CRP: inserir registro",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Foto demonstrativa de uma profissional de Neuropsicologia",
    imagePosition: "center 35%",
    areas: ["Avaliação neuropsicológica", "Memória", "Atenção"],
    audiences: ["Infantil", "Adolescente", "Adulto", "Idoso"],
    modality: ["Presencial"],
    bio: "Conteúdo demonstrativo para futuro preenchimento com informações reais da profissional.",
    education: ["Graduação: inserir instituição", "Formação em Neuropsicologia: inserir", "Cursos: inserir"],
    schedule: [
      { day: "Segunda-feira", hours: "13h às 18h" },
      { day: "Quarta-feira", hours: "08h às 17h" },
    ],
  },
  {
    slug: "diego-rocha",
    name: "Diego Rocha",
    profession: "Terapia Ocupacional",
    register: "CREFITO: inserir registro",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Foto demonstrativa de um profissional de Terapia Ocupacional",
    imagePosition: "center 30%",
    areas: ["Autonomia", "Integração sensorial", "Desenvolvimento infantil"],
    audiences: ["Infantil", "Adolescente", "Adulto"],
    modality: ["Presencial"],
    bio: "Conteúdo demonstrativo. Apresentação profissional será inserida posteriormente.",
    education: ["Graduação: inserir instituição", "Especialização: inserir formação", "Cursos: inserir"],
    schedule: [
      { day: "Terça-feira", hours: "08h às 17h" },
      { day: "Sexta-feira", hours: "08h às 12h" },
    ],
  },
  {
    slug: "elisa-lima",
    name: "Elisa Lima",
    profession: "Nutrição",
    register: "CRN: inserir registro",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Foto demonstrativa de uma profissional de Nutrição",
    imagePosition: "center 25%",
    areas: ["Educação alimentar", "Saúde e rotina", "Bem-estar"],
    audiences: ["Adolescente", "Adulto", "Idoso"],
    modality: ["Presencial", "Online"],
    bio: "Conteúdo demonstrativo para apresentação humanizada da profissional e de sua abordagem nutricional.",
    education: ["Graduação: inserir instituição", "Pós-graduação: inserir", "Cursos: inserir"],
    schedule: [
      { day: "Quarta-feira", hours: "09h às 18h" },
      { day: "Sexta-feira", hours: "13h às 18h" },
    ],
  },
  {
    slug: "fernanda-costa",
    name: "Fernanda Costa",
    profession: "Fonoaudiologia",
    register: "CRFa: inserir registro",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Foto demonstrativa de uma profissional de Fonoaudiologia",
    imagePosition: "center 30%",
    areas: ["Linguagem", "Fala", "Desenvolvimento infantil"],
    audiences: ["Infantil", "Adolescente"],
    modality: ["Presencial"],
    bio: "Conteúdo demonstrativo. Espaço reservado para experiência, formação e mensagem de acolhimento.",
    education: ["Graduação: inserir instituição", "Especialização: inserir", "Cursos: inserir"],
    schedule: [
      { day: "Segunda-feira", hours: "08h às 17h" },
      { day: "Quinta-feira", hours: "08h às 12h" },
    ],
  },
];
