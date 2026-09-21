"use client";
import Link from "next/link";
import { useEffect, useState, useCallback, useId } from "react";
import { browserSupabase, configured } from "@/lib/supabase";
import { contentSchema, type Content, type Settings } from "@/lib/content";
import "./admin.css";
type Tab =
  | "Resumo"
  | "Clínica"
  | "Profissionais"
  | "Especialidades"
  | "Textos e imagens";
const tabs: Tab[] = [
  "Resumo",
  "Clínica",
  "Profissionais",
  "Especialidades",
  "Textos e imagens",
];
const days = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
];
function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  multiline?: boolean;
  type?: string;
  hint?: string;
}) {
  const id = useId();
  return (
    <label className="adm-field">
      <span id={id}>{label}</span>
      {multiline ? (
        <textarea
          aria-labelledby={id}
          aria-describedby={hint ? `${id}-hint` : undefined}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          aria-labelledby={id}
          aria-describedby={hint ? `${id}-hint` : undefined}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}{" "}
      {hint && <small id={`${id}-hint`}>{hint}</small>}
    </label>
  );
}
function Lines({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <Field
      label={label}
      hint="Um item por linha."
      value={value.join("\n")}
      multiline
      onChange={(v) => onChange(v.split("\n"))}
    />
  );
}
export default function AdminPanel() {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [signedIn, setSignedIn] = useState(false),
    [checking, setChecking] = useState(true);
  const [data, setData] = useState<Content | null>(null),
    [version, setVersion] = useState(0),
    [dirty, setDirty] = useState(false),
    [busy, setBusy] = useState(false),
    [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState(""),
    [failure, setFailure] = useState(""),
    [tab, setTab] = useState<Tab>("Resumo"),
    [selected, setSelected] = useState(0),
    [search, setSearch] = useState("");
  const ready = configured();
  const api = useCallback(async (path: string, init: RequestInit = {}) => {
    const {
      data: { session },
    } = await browserSupabase().auth.getSession();
    if (!session) throw new Error("Sua sessão expirou. Entre novamente.");
    const response = await fetch(path, {
      ...init,
      headers: {
        ...init.headers,
        Authorization: `Bearer ${session.access_token}`,
      },
      cache: "no-store",
    });
    const result = await response.json();
    if (!response.ok)
      throw new Error(result.error || "Não foi possível concluir a operação.");
    return result;
  }, []);
  const load = useCallback(async () => {
    setBusy(true);
    setFailure("");
    try {
      const result = await api("/api/admin/content");
      setData(contentSchema.parse(result.data));
      setVersion(result.version);
      setDirty(false);
      setSelected(0);
    } catch (e) {
      setFailure(e instanceof Error ? e.message : "Erro ao carregar.");
    } finally {
      setBusy(false);
    }
  }, [api]);
  useEffect(() => {
    if (!ready) return;
    const client = browserSupabase();
    client.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSignedIn(!!session);
        setChecking(false);
        if (session) void load();
      })
      .catch(() => {
        setChecking(false);
        setFailure("Não foi possível verificar a sessão.");
      });
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setSignedIn(false);
        setData(null);
        setDirty(false);
      } else if (session) {
        setSignedIn(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [ready, load]);
  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
  function edit(next: Content) {
    setData(next);
    setDirty(true);
    setNotice("");
  }
  function setting<K extends keyof Settings>(key: K, value: Settings[K]) {
    if (data) edit({ ...data, settings: { ...data.settings, [key]: value } });
  }
  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setFailure("");
    try {
      const { error } = await browserSupabase().auth.signInWithPassword({
        email,
        password,
      });
      if (error)
        throw new Error("Não foi possível entrar. Confira e-mail e senha.");
      setPassword("");
      setSignedIn(true);
      await load();
    } catch (e) {
      setFailure((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    if (dirty && !confirm("Sair e descartar alterações não salvas?")) return;
    try {
      const { error } = await browserSupabase().auth.signOut();
      if (error) throw error;
      setData(null);
      setSignedIn(false);
      setDirty(false);
    } catch {
      setFailure("Não foi possível encerrar a sessão. Tente novamente.");
    }
  }
  async function save() {
    if (!data) return;
    setFailure("");
    setNotice("");
    const result = contentSchema.safeParse(data);
    if (!result.success) {
      setFailure(
        "Revise os campos: " +
          result.error.issues
            .map((i) => `${i.path.join(".")}: ${i.message}`)
            .slice(0, 4)
            .join(" • "),
      );
      return;
    }
    setBusy(true);
    try {
      const saved = await api("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: result.data, version }),
      });
      setVersion(saved.version);
      setData(result.data);
      setDirty(false);
      setNotice(
        "Alterações publicadas. Abra o site em uma nova aba para conferir.",
      );
    } catch (e) {
      setFailure((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function upload(file: File | undefined, onDone: (url: string) => void) {
    if (!file) return;
    if (file.size > 3_000_000) {
      setFailure("A imagem deve ter até 3 MB.");
      return;
    }
    setUploading(true);
    setFailure("");
    try {
      const form = new FormData();
      form.set("file", file);
      const result = await api("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      onDone(result.url);
      setNotice("Foto enviada. Clique em Salvar alterações para publicar.");
    } catch (e) {
      setFailure((e as Error).message);
    } finally {
      setUploading(false);
    }
  }
  function photo(label: string, value: string, onChange: (v: string) => void) {
    return (
      <div className="adm-photo">
        <div className="adm-photo-preview">
          {value ? <img src={value} alt={label} /> : <span>Sem imagem</span>}
        </div>
        <div>
          <Field
            label={label}
            value={value}
            onChange={onChange}
            hint="Cole uma URL HTTPS ou envie um arquivo."
          />
          <label className="adm-upload">
            Enviar foto
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={busy || uploading}
              onChange={(e) => {
                void upload(e.target.files?.[0], onChange);
                e.target.value = "";
              }}
            />
          </label>
          <small>JPG, PNG ou WebP • até 3 MB</small>
        </div>
      </div>
    );
  }
  const banners = (
    <>
      {failure && (
        <div className="adm-alert error" role="alert">
          {failure}
        </div>
      )}
      {notice && (
        <div className="adm-alert" role="status">
          {notice}
        </div>
      )}
    </>
  );
  if (!signedIn)
    return (
      <main className="adm-login">
        <div className="adm-login-story">
          <Link href="/">
            <img src="/logo-atos-med.jpeg" alt="Atos Med" />
          </Link>
          <span>ÁREA DE GESTÃO</span>
          <h1>
            Mais tempo para cuidar.
            <br />
            Mais facilidade para gerir.
          </h1>
          <p>Informações da clínica, equipe e atendimentos em um só lugar.</p>
          <small>Atos Med · Cuidado humano e integrado</small>
        </div>
        <section className="adm-login-form">
          <span className="adm-kicker">BEM-VINDO DE VOLTA</span>
          <h2>Acesse sua gestão</h2>
          <p>Entre com sua conta de administrador.</p>
          {banners}
          {!ready ? (
            <div className="adm-alert">
              O painel precisa ser conectado ao Supabase. Siga o arquivo{" "}
              <strong>GUIA-ADMIN.md</strong> incluído no projeto para configurar
              o banco e criar seu acesso.
            </div>
          ) : checking ? (
            <p>Verificando acesso…</p>
          ) : (
            <form onSubmit={login}>
              <Field
                label="E-mail"
                type="email"
                value={email}
                onChange={setEmail}
              />
              <Field
                label="Senha"
                type="password"
                value={password}
                onChange={setPassword}
              />
              <button
                className="adm-primary"
                disabled={busy || !email || !password}
              >
                {busy ? "Entrando…" : "Entrar na gestão →"}
              </button>
              <small>
                Não há cadastro público. Solicite seu acesso ao responsável pela
                clínica.
              </small>
            </form>
          )}
          <Link href="/">← Voltar ao site</Link>
        </section>
      </main>
    );
  const p = data?.professionals[selected],
    s = data?.specialties[selected];
  function changeP(key: string, value: unknown) {
    if (data && p)
      edit({
        ...data,
        professionals: data.professionals.map((item, i) =>
          i === selected ? { ...item, [key]: value } : item,
        ),
      });
  }
  function changeS(key: string, value: unknown) {
    if (data && s)
      edit({
        ...data,
        specialties: data.specialties.map((item, i) =>
          i === selected ? { ...item, [key]: value } : item,
        ),
      });
  }
  function add() {
    if (!data) return;
    const slug = `novo-${Date.now()}`;
    if (tab === "Profissionais") {
      setSelected(data.professionals.length);
      edit({
        ...data,
        professionals: [
          ...data.professionals,
          {
            slug,
            name: "Novo profissional",
            profession: "Psicologia",
            register: "",
            image: "",
            imageAlt: "",
            imagePosition: "center 25%",
            areas: [],
            audiences: [],
            modality: ["Presencial"],
            bio: "",
            education: [],
            schedule: [],
            published: false,
          },
        ],
      });
    } else {
      setSelected(data.specialties.length);
      edit({
        ...data,
        specialties: [
          ...data.specialties,
          {
            slug,
            name: "Nova especialidade",
            icon: "◌",
            summary: "",
            intro: "",
            indicated: "",
            areas: [],
            published: false,
          },
        ],
      });
    }
    setSearch("");
  }
  function remove() {
    if (
      !data ||
      !confirm("Excluir este cadastro? A exclusão será publicada ao salvar.")
    )
      return;
    edit(
      tab === "Profissionais"
        ? {
            ...data,
            professionals: data.professionals.filter((_, i) => i !== selected),
          }
        : {
            ...data,
            specialties: data.specialties.filter((_, i) => i !== selected),
          },
    );
    setSelected(0);
  }
  return (
    <div className="adm-layout">
      <aside className="adm-sidebar">
        <Link href="/" target="_blank">
          <img src="/logo-atos-med.jpeg" alt="Atos Med" />
        </Link>
        <span className="adm-sidebar-caption">GESTÃO DA CLÍNICA</span>
        <nav>
          {tabs.map((name, i) => (
            <button
              key={name}
              className={tab === name ? "active" : ""}
              onClick={() => {
                setTab(name);
                setSelected(0);
                setSearch("");
              }}
            >
              <span aria-hidden="true">{["◫", "⌂", "◉", "✚", "✎"][i]}</span>
              {name}
            </button>
          ))}
        </nav>
        <div className="adm-sidebar-bottom">
          <a href="/" target="_blank" rel="noreferrer">
            Abrir site ↗
          </a>
          <button onClick={logout}>Sair da conta</button>
        </div>
      </aside>
      <main className="adm-main">
        <header className="adm-top">
          <div>
            <span className="adm-kicker">ATOS MED / GESTÃO</span>
            <h1>{tab}</h1>
          </div>
          <div className="adm-save">
            <span>
              {dirty ? "● Alterações não salvas" : "✓ Dados carregados"}
            </span>
            <button
              className="adm-primary"
              disabled={!data || busy || uploading || (!dirty && version > 0)}
              onClick={save}
            >
              {busy
                ? "Aguarde…"
                : uploading
                  ? "Enviando foto…"
                  : "Salvar alterações"}
            </button>
          </div>
        </header>
        {banners}
        {!data ? (
          <section className="adm-card">
            <h2>
              {busy
                ? "Carregando conteúdo…"
                : "Não foi possível abrir o painel"}
            </h2>
            <p>Verifique a configuração e a autorização da sua conta.</p>
            <button disabled={busy} onClick={load}>
              Tentar novamente
            </button>
          </section>
        ) : (
          <fieldset className="adm-work" disabled={busy || uploading}>
            {tab === "Resumo" && (
              <>
                <section className="adm-welcome">
                  <div>
                    <span>SEU ESPAÇO DE CUIDADO</span>
                    <h2>Uma clínica sempre atualizada.</h2>
                    <p>
                      Organize sua equipe e mantenha as informações de
                      atendimento acessíveis.
                    </p>
                    <button onClick={() => setTab("Profissionais")}>
                      Gerenciar profissionais →
                    </button>
                  </div>
                  <div className="adm-welcome-mark">✦</div>
                </section>
                <div className="adm-stats">
                  <article>
                    <span>Profissionais publicados</span>
                    <strong>
                      {data.professionals.filter((p) => p.published).length}
                    </strong>
                    <small>
                      {data.professionals.length} cadastros no total
                    </small>
                  </article>
                  <article>
                    <span>Especialidades publicadas</span>
                    <strong>
                      {data.specialties.filter((p) => p.published).length}
                    </strong>
                    <small>Áreas de atendimento</small>
                  </article>
                  <article>
                    <span>Horários cadastrados</span>
                    <strong>
                      {data.professionals.reduce(
                        (sum, p) => sum + p.schedule.length,
                        0,
                      )}
                    </strong>
                    <small>Distribuídos na semana</small>
                  </article>
                </div>
                <section className="adm-card">
                  <h2>Antes de publicar</h2>
                  <p>
                    {data.settings.demoNotice
                      ? "O aviso de conteúdo demonstrativo está ativo. Substitua nomes, registros e imagens pelos dados oficiais."
                      : "O site está configurado para exibir os dados oficiais."}
                  </p>
                  {!data.settings.whatsapp && (
                    <p>
                      Cadastre o WhatsApp em Clínica para ativar os botões de
                      agendamento.
                    </p>
                  )}
                  <p>
                    Os horários são informativos. Este painel não gerencia
                    reservas de consultas.
                  </p>
                  <button onClick={() => setTab("Clínica")}>
                    Revisar dados da clínica →
                  </button>
                </section>
                <section className="adm-card">
                  <h2>Atualizar os dados do painel</h2>
                  <p>
                    Use após uma alteração feita por outro administrador.
                    Alterações locais não salvas serão descartadas.
                  </p>
                  <button
                    onClick={() => {
                      if (
                        !dirty ||
                        confirm("Descartar alterações e recarregar os dados?")
                      )
                        void load();
                    }}
                  >
                    Recarregar dados
                  </button>
                </section>
              </>
            )}
            {tab === "Clínica" && (
              <section className="adm-card">
                <h2>Contato e funcionamento</h2>
                <p>
                  Esses dados serão usados nos botões, no rodapé e na página de
                  contato.
                </p>
                <div className="adm-grid">
                  <Field
                    label="WhatsApp"
                    value={data.settings.whatsapp}
                    onChange={(v) => setting("whatsapp", v)}
                    hint="País + DDD + número. Exemplo: 5585999999999"
                  />
                  <Field
                    label="Telefone para exibição"
                    value={data.settings.phone}
                    onChange={(v) => setting("phone", v)}
                  />
                  <Field
                    label="Usuário do Instagram"
                    value={data.settings.instagram}
                    onChange={(v) => setting("instagram", v)}
                    hint="Exemplo: atosmed"
                  />
                  <Field
                    label="Funcionamento"
                    value={data.settings.hours}
                    onChange={(v) => setting("hours", v)}
                  />
                </div>
                <Field
                  label="Endereço completo"
                  value={data.settings.address}
                  onChange={(v) => setting("address", v)}
                  multiline
                />
                <Field
                  label="Texto do rodapé"
                  value={data.settings.footerText}
                  onChange={(v) => setting("footerText", v)}
                  multiline
                />
                <label className="adm-check">
                  <input
                    type="checkbox"
                    checked={data.settings.demoNotice}
                    onChange={(e) => setting("demoNotice", e.target.checked)}
                  />{" "}
                  Exibir aviso de conteúdo demonstrativo
                </label>
              </section>
            )}
            {(tab === "Profissionais" || tab === "Especialidades") && (
              <div className="adm-editor">
                <section className="adm-records">
                  <button className="adm-primary" onClick={add}>
                    +{" "}
                    {tab === "Profissionais"
                      ? "Novo profissional"
                      : "Nova especialidade"}
                  </button>
                  <Field
                    label="Pesquisar cadastro"
                    value={search}
                    onChange={setSearch}
                  />
                  {(tab === "Profissionais"
                    ? data.professionals
                    : data.specialties
                  ).map(
                    (item, i) =>
                      item.name
                        .toLowerCase()
                        .includes(search.toLowerCase()) && (
                        <button
                          key={i}
                          className={`adm-record ${selected === i ? "selected" : ""}`}
                          onClick={() => setSelected(i)}
                        >
                          <strong>{item.name}</strong>
                          <small>
                            {item.published ? "Publicado" : "Oculto"}
                          </small>
                        </button>
                      ),
                  )}
                </section>
                <section className="adm-card">
                  {(tab === "Profissionais" ? p : s) ? (
                    <>
                      <div className="adm-record-heading">
                        <h2>{tab === "Profissionais" ? p?.name : s?.name}</h2>
                        <button className="adm-danger" onClick={remove}>
                          Excluir
                        </button>
                      </div>
                      {tab === "Profissionais" && p ? (
                        <>
                          <label className="adm-check">
                            <input
                              type="checkbox"
                              checked={p.published}
                              onChange={(e) =>
                                changeP("published", e.target.checked)
                              }
                            />{" "}
                            Publicar no site
                          </label>
                          <div className="adm-grid">
                            <Field
                              label="Nome"
                              value={p.name}
                              onChange={(v) => changeP("name", v)}
                            />
                            <Field
                              label="Especialidade / profissão"
                              value={p.profession}
                              onChange={(v) => changeP("profession", v)}
                            />
                            <Field
                              label="Registro profissional"
                              value={p.register}
                              onChange={(v) => changeP("register", v)}
                            />
                            <Field
                              label="Endereço do perfil (slug)"
                              value={p.slug}
                              onChange={(v) => changeP("slug", v)}
                              hint="Mudar este campo altera o link do perfil."
                            />
                          </div>
                          {photo("Foto do profissional", p.image, (v) =>
                            changeP("image", v),
                          )}
                          <div className="adm-grid">
                            <Field
                              label="Descrição da foto"
                              value={p.imageAlt}
                              onChange={(v) => changeP("imageAlt", v)}
                            />
                            <Field
                              label="Enquadramento"
                              value={p.imagePosition || "center 25%"}
                              onChange={(v) => changeP("imagePosition", v)}
                              hint="Exemplo: center 25%"
                            />
                          </div>
                          <Field
                            label="Apresentação"
                            value={p.bio}
                            onChange={(v) => changeP("bio", v)}
                            multiline
                          />
                          <div className="adm-grid">
                            <Lines
                              label="Áreas de atuação"
                              value={p.areas}
                              onChange={(v) => changeP("areas", v)}
                            />
                            <Lines
                              label="Públicos atendidos"
                              value={p.audiences}
                              onChange={(v) => changeP("audiences", v)}
                            />
                            <Lines
                              label="Modalidades"
                              value={p.modality}
                              onChange={(v) => changeP("modality", v)}
                            />
                            <Lines
                              label="Formação"
                              value={p.education}
                              onChange={(v) => changeP("education", v)}
                            />
                          </div>
                          <h3>Horários de atendimento</h3>
                          {p.schedule.map((row, i) => (
                            <div className="adm-schedule" key={i}>
                              <label>
                                Dia
                                <select
                                  value={row.day}
                                  onChange={(e) =>
                                    changeP(
                                      "schedule",
                                      p.schedule.map((r, j) =>
                                        j === i
                                          ? { ...r, day: e.target.value }
                                          : r,
                                      ),
                                    )
                                  }
                                >
                                  {days.map((day) => (
                                    <option key={day}>{day}</option>
                                  ))}
                                </select>
                              </label>
                              <Field
                                label="Horário"
                                value={row.hours}
                                onChange={(v) =>
                                  changeP(
                                    "schedule",
                                    p.schedule.map((r, j) =>
                                      j === i ? { ...r, hours: v } : r,
                                    ),
                                  )
                                }
                              />
                              <button
                                aria-label={`Remover ${row.day}`}
                                onClick={() =>
                                  changeP(
                                    "schedule",
                                    p.schedule.filter((_, j) => j !== i),
                                  )
                                }
                              >
                                Remover
                              </button>
                            </div>
                          ))}
                          <button
                            disabled={p.schedule.length >= 7}
                            onClick={() =>
                              changeP("schedule", [
                                ...p.schedule,
                                {
                                  day:
                                    days.find(
                                      (day) =>
                                        !p.schedule.some((r) => r.day === day),
                                    ) || days[0],
                                  hours: "08h às 12h",
                                },
                              ])
                            }
                          >
                            + Adicionar dia
                          </button>
                        </>
                      ) : (
                        s && (
                          <>
                            <label className="adm-check">
                              <input
                                type="checkbox"
                                checked={s.published}
                                onChange={(e) =>
                                  changeS("published", e.target.checked)
                                }
                              />{" "}
                              Publicar no site
                            </label>
                            <div className="adm-grid">
                              <Field
                                label="Nome da especialidade"
                                value={s.name}
                                onChange={(v) => changeS("name", v)}
                              />
                              <Field
                                label="Endereço da página (slug)"
                                value={s.slug}
                                onChange={(v) => changeS("slug", v)}
                              />
                            </div>
                            <Field
                              label="Símbolo / ícone"
                              value={s.icon}
                              onChange={(v) => changeS("icon", v)}
                            />
                            <Field
                              label="Resumo"
                              value={s.summary}
                              onChange={(v) => changeS("summary", v)}
                              multiline
                            />
                            <Field
                              label="Introdução"
                              value={s.intro}
                              onChange={(v) => changeS("intro", v)}
                              multiline
                            />
                            <Field
                              label="Para quem é indicado"
                              value={s.indicated}
                              onChange={(v) => changeS("indicated", v)}
                              multiline
                            />
                            <Lines
                              label="Áreas trabalhadas"
                              value={s.areas}
                              onChange={(v) => changeS("areas", v)}
                            />
                          </>
                        )
                      )}
                    </>
                  ) : (
                    <p>
                      Nenhum cadastro selecionado. Clique em adicionar para
                      começar.
                    </p>
                  )}
                </section>
              </div>
            )}
            {tab === "Textos e imagens" && (
              <>
                <section className="adm-card">
                  <h2>Página inicial</h2>
                  <Field
                    label="Título principal"
                    value={data.settings.heroTitle}
                    onChange={(v) => setting("heroTitle", v)}
                  />
                  <Field
                    label="Texto principal"
                    value={data.settings.heroText}
                    onChange={(v) => setting("heroText", v)}
                    multiline
                  />
                  {photo("Imagem principal", data.settings.heroImage, (v) =>
                    setting("heroImage", v),
                  )}
                  <Field
                    label="Título de apresentação"
                    value={data.settings.introTitle}
                    onChange={(v) => setting("introTitle", v)}
                  />
                  <Field
                    label="Texto de apresentação"
                    value={data.settings.introText}
                    onChange={(v) => setting("introText", v)}
                    multiline
                  />
                </section>
                <section className="adm-card">
                  <h2>Sobre a clínica</h2>
                  <Field
                    label="Título"
                    value={data.settings.aboutTitle}
                    onChange={(v) => setting("aboutTitle", v)}
                  />
                  <Field
                    label="História da clínica"
                    value={data.settings.aboutText}
                    onChange={(v) => setting("aboutText", v)}
                    multiline
                  />
                  {photo("Foto da estrutura", data.settings.aboutImage, (v) =>
                    setting("aboutImage", v),
                  )}
                  <div className="adm-grid">
                    <Field
                      label="Missão"
                      value={data.settings.mission}
                      onChange={(v) => setting("mission", v)}
                      multiline
                    />
                    <Field
                      label="Visão"
                      value={data.settings.vision}
                      onChange={(v) => setting("vision", v)}
                      multiline
                    />
                  </div>
                  <Lines
                    label="Valores"
                    value={data.settings.values}
                    onChange={(v) => setting("values", v)}
                  />
                </section>
                <section className="adm-card">
                  <h2>Perguntas frequentes</h2>
                  {data.settings.faqs.map((faq, i) => (
                    <div className="adm-faq" key={i}>
                      <Field
                        label={`Pergunta ${i + 1}`}
                        value={faq.question}
                        onChange={(v) =>
                          setting(
                            "faqs",
                            data.settings.faqs.map((f, j) =>
                              i === j ? { ...f, question: v } : f,
                            ),
                          )
                        }
                      />
                      <Field
                        label="Resposta"
                        value={faq.answer}
                        onChange={(v) =>
                          setting(
                            "faqs",
                            data.settings.faqs.map((f, j) =>
                              i === j ? { ...f, answer: v } : f,
                            ),
                          )
                        }
                        multiline
                      />
                      <button
                        className="adm-danger"
                        onClick={() =>
                          setting(
                            "faqs",
                            data.settings.faqs.filter((_, j) => j !== i),
                          )
                        }
                      >
                        Remover pergunta
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setting("faqs", [
                        ...data.settings.faqs,
                        { question: "Nova pergunta", answer: "" },
                      ])
                    }
                  >
                    + Adicionar pergunta
                  </button>
                </section>
              </>
            )}
          </fieldset>
        )}
      </main>
    </div>
  );
}
