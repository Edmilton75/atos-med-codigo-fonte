import { z } from "zod";
import { professionals, specialties } from "../app/data";
const text = z.string().max(10000);
const required = z.string().trim().min(1, "Preencha este campo").max(200);
const list = z
  .array(z.string().max(500))
  .max(100)
  .transform((rows) => [...new Set(rows.map((v) => v.trim()).filter(Boolean))]);
const slug = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use letras minúsculas, números e hífens",
  )
  .max(100);
const url = z
  .string()
  .max(2048)
  .refine(
    (v) => !v || /^https:\/\/[^\s]+$/i.test(v) || /^\/(?!\/)[^\s]*$/.test(v),
    "Use um endereço HTTPS ou caminho local",
  );
export const settingsSchema = z.object({
  whatsapp: z
    .string()
    .refine(
      (v) => !v || /^\d{10,15}$/.test(v),
      "WhatsApp: informe país, DDD e número, somente dígitos",
    ),
  phone: z.string().max(80),
  instagram: z
    .string()
    .max(100)
    .regex(/^@?[a-zA-Z0-9_.]*$/, "Informe apenas o usuário do Instagram"),
  address: text,
  hours: text,
  heroTitle: required,
  heroText: text,
  heroImage: url,
  introTitle: required,
  introText: text,
  footerText: text,
  aboutTitle: required,
  aboutText: text,
  aboutImage: url,
  mission: text,
  vision: text,
  values: list,
  demoNotice: z.boolean(),
  faqs: z.array(z.object({ question: required, answer: text })).max(50),
});
export const professionalSchema = z.object({
  slug,
  name: required,
  profession: required,
  register: z.string().max(200),
  image: url,
  imageAlt: z.string().max(300),
  imagePosition: z.string().max(80).optional(),
  areas: list,
  audiences: list,
  modality: list,
  bio: text,
  education: list,
  schedule: z
    .array(
      z.object({
        day: z.enum([
          "Segunda-feira",
          "Terça-feira",
          "Quarta-feira",
          "Quinta-feira",
          "Sexta-feira",
          "Sábado",
          "Domingo",
        ]),
        hours: z.string().trim().min(1).max(100),
      }),
    )
    .max(7)
    .refine(
      (rows) => new Set(rows.map((r) => r.day)).size === rows.length,
      "Não repita o mesmo dia",
    ),
  published: z.boolean(),
});
export const specialtySchema = z.object({
  slug,
  name: required,
  icon: z.string().max(20),
  summary: text,
  intro: text,
  indicated: text,
  areas: list,
  published: z.boolean(),
});
export const contentSchema = z
  .object({
    settings: settingsSchema,
    professionals: z.array(professionalSchema).max(200),
    specialties: z.array(specialtySchema).max(100),
  })
  .superRefine((data, ctx) => {
    for (const key of ["professionals", "specialties"] as const) {
      const seen = new Set<string>();
      data[key].forEach((item, i) => {
        if (seen.has(item.slug))
          ctx.addIssue({
            code: "custom",
            path: [key, i, "slug"],
            message: "Este endereço já está em uso",
          });
        seen.add(item.slug);
      });
    }
  });
export type Content = z.infer<typeof contentSchema>;
export type Settings = Content["settings"];
export const defaultSettings: Settings = {
  whatsapp: "",
  phone: "(00) 0000-0000",
  instagram: "",
  address: "Inserir endereço completo",
  hours: "Segunda a sexta • 8h às 18h",
  heroTitle: "Cuidar da mente também é cuidar da vida.",
  heroText:
    "Atendimento humanizado e multidisciplinar para promover equilíbrio emocional, autonomia e qualidade de vida em todas as fases.",
  heroImage: "/logo-atos-med.jpeg",
  introTitle: "Um espaço pensado para cuidar de você",
  introText:
    "Unimos diferentes áreas do cuidado em um ambiente contemporâneo, tranquilo e humano, respeitando a história e o tempo de cada pessoa.",
  footerText:
    "Saúde mental, bem-estar e qualidade de vida com cuidado humano e integrado.",
  aboutTitle: "Um lugar onde ciência e acolhimento caminham juntos.",
  aboutText:
    "Este espaço está preparado para receber a história oficial da Atos Med. A proposta institucional é reunir especialidades em saúde mental, bem-estar e qualidade de vida, oferecendo uma jornada simples desde o primeiro contato.",
  aboutImage: "",
  mission: "Inserir a missão oficial da clínica.",
  vision: "Inserir a visão oficial da clínica.",
  values: [
    "Ética",
    "Acolhimento",
    "Respeito",
    "Humanização",
    "Excelência",
    "Responsabilidade",
    "Cuidado integral",
  ],
  demoNotice: true,
  faqs: [
    {
      question: "Como faço para agendar uma consulta?",
      answer:
        "Entre em contato pelo WhatsApp. Nossa equipe irá orientar sobre profissionais, modalidades e disponibilidade.",
    },
    {
      question: "A clínica atende crianças e adolescentes?",
      answer:
        "Sim. A Atos Med reúne especialidades e profissionais preparados para diferentes fases da vida.",
    },
    {
      question: "Existem atendimentos online?",
      answer:
        "Alguns profissionais oferecem atendimento online. Consulte a modalidade disponível no perfil ou fale com a recepção.",
    },
    {
      question: "Como escolher o profissional mais adequado?",
      answer:
        "Nossa recepção pode ajudar a identificar a especialidade mais indicada para sua necessidade, sem realizar diagnóstico pelo atendimento digital.",
    },
  ],
};
export const initialContent: Content = contentSchema.parse({
  settings: defaultSettings,
  professionals: professionals.map((p) => ({ ...p, published: true })),
  specialties: specialties.map((s) => ({ ...s, published: true })),
});
export function whatsappUrl(
  number: string,
  message = "Olá! Acessei o site da Atos Med e gostaria de mais informações sobre os atendimentos.",
) {
  return number
    ? `https://wa.me/${number}?text=${encodeURIComponent(message)}`
    : "/contato";
}
