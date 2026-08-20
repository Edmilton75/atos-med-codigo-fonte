"use client";

import Link from "next/link";
import { useState } from "react";

const whatsapp =
  "https://wa.me/55XXXXXXXXXXX?text=Ol%C3%A1!%20Acessei%20o%20site%20da%20Atos%20Med%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es%20sobre%20os%20atendimentos.";

export function WhatsAppLink({
  children,
  className = "",
  ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <a
      href={whatsapp}
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
          <p>
            Saúde mental, bem-estar e qualidade de vida com cuidado humano e
            integrado.
          </p>
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
        </div>
        <div>
          <h3>Atendimento</h3>
          <WhatsAppLink>WhatsApp</WhatsAppLink>
          <a
            href="https://instagram.com/USUARIO"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
          <span>Seg a Sex • 8h às 18h</span>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Atos Med. Todos os direitos reservados.</span>
          <span>Conteúdo demonstrativo — substitua pelos dados oficiais.</span>
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
