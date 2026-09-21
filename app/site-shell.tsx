"use client";

import Link from "next/link";
import { useState } from "react";

import { useSettings } from "./settings-provider";
import { whatsappUrl } from "@/lib/content";

export function WhatsAppLink({
  children,
  className = "",
  ariaLabel,
  message,
}: {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  message?: string;
}) {
  const settings = useSettings();
  return (
    <a
      href={whatsappUrl(settings.whatsapp, message)}
      target="_blank"
      rel="noreferrer"
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const settings = useSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="Atos Med - Início">
          <img src="/logo-atos-med.jpeg" alt="Atos Med" />
        </Link>
        <button
          className="menu-toggle"
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
        </button>
        <nav
          className={menuOpen ? "open" : ""}
          aria-label="Navegação principal"
        >
          <Link href="/" onClick={() => setMenuOpen(false)}>
            Início
          </Link>
          <Link href="/especialidades" onClick={() => setMenuOpen(false)}>
            Especialidades
          </Link>
          <Link href="/profissionais" onClick={() => setMenuOpen(false)}>
            Profissionais
          </Link>
          <Link href="/horarios" onClick={() => setMenuOpen(false)}>
            Horários
          </Link>
          <Link href="/sobre" onClick={() => setMenuOpen(false)}>
            Sobre
          </Link>
          <Link href="/contato" onClick={() => setMenuOpen(false)}>
            Contato
          </Link>
        </nav>
        <WhatsAppLink className="header-cta">
          Agendar atendimento <span>↗</span>
        </WhatsAppLink>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <div className="footer-brand">
          <img src="/logo-atos-med.jpeg" alt="Atos Med" />
          <p>{settings.footerText}</p>
        </div>
        <div>
          <h3>Navegue</h3>
          <Link href="/especialidades">Especialidades</Link>
          <Link href="/profissionais">Profissionais</Link>
          <Link href="/horarios">Horários</Link>
        </div>
        <div>
          <h3>Institucional</h3>
          <Link href="/sobre">Sobre a clínica</Link>
          <Link href="/contato">Contato</Link>
          <Link href="/politica-de-privacidade">Privacidade</Link>
          <Link href="/termos-de-uso">Termos de uso</Link>
          <Link href="/admin">Área de gestão</Link>
        </div>
        <div>
          <h3>Atendimento</h3>
          <WhatsAppLink>WhatsApp</WhatsAppLink>
          <a
            href={
              settings.instagram
                ? `https://instagram.com/${settings.instagram.replace(/^@/, "")}`
                : "/contato"
            }
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
          <span>{settings.hours}</span>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Atos Med. Todos os direitos reservados.</span>
          {settings.demoNotice && (
            <span>
              Conteúdo demonstrativo — substitua pelos dados oficiais.
            </span>
          )}
        </div>
      </footer>
      <div className="floating-actions">
        <button
          className="chat-button"
          onClick={() => setChatOpen(!chatOpen)}
          aria-expanded={chatOpen}
          aria-label="Abrir atendimento virtual"
        >
          ✦ <span>Precisa de ajuda?</span>
        </button>
        <WhatsAppLink
          className="whatsapp-float"
          ariaLabel="Falar pelo WhatsApp"
        >
          W
        </WhatsAppLink>
      </div>
      {chatOpen && (
        <aside
          className="chat-widget"
          aria-label="Assistente virtual demonstrativo"
        >
          <div className="chat-head">
            <div>
              <strong>Atos Med</strong>
              <span>Assistente virtual</span>
            </div>
            <button onClick={() => setChatOpen(false)} aria-label="Fechar">
              ×
            </button>
          </div>
          <p>Olá! 👋 Como podemos ajudar?</p>
          {[
            "Quero agendar um atendimento",
            "Conhecer especialidades",
            "Conhecer os profissionais",
            "Ver horários",
            "Falar com a recepção",
          ].map((item) => (
            <button key={item}>
              {item}
              <span>→</span>
            </button>
          ))}
          <small>Este assistente não realiza diagnósticos.</small>
        </aside>
      )}
    </>
  );
}
