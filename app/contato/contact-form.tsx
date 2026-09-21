"use client";
import { useState } from "react";
import { useSettings } from "../settings-provider";
import { whatsappUrl } from "@/lib/content";
export function ContactForm() {
  const [notice, setNotice] = useState("");
  const settings = useSettings();
  return (
    <form
      className="contact-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!settings.whatsapp) {
          setNotice(
            "O WhatsApp ainda não está disponível. Consulte os outros contatos da clínica.",
          );
          return;
        }
        const form = new FormData(e.currentTarget);
        const message = `Olá! Meu nome é ${form.get("nome")}.\nTelefone: ${form.get("telefone")}\nE-mail: ${form.get("email")}\nAssunto: ${form.get("assunto")}\n\n${form.get("mensagem")}`;
        window.location.assign(whatsappUrl(settings.whatsapp, message));
      }}
    >
      <div className="form-row">
        <label>
          Nome
          <input required name="nome" maxLength={120} placeholder="Seu nome" />
        </label>
        <label>
          Telefone
          <input
            required
            name="telefone"
            type="tel"
            maxLength={40}
            placeholder="(00) 00000-0000"
          />
        </label>
      </div>
      <div className="form-row">
        <label>
          E-mail
          <input
            required
            name="email"
            type="email"
            maxLength={200}
            placeholder="voce@exemplo.com"
          />
        </label>
        <label>
          Assunto
          <select required name="assunto" defaultValue="">
            <option value="" disabled>
              Selecione
            </option>
            <option>Agendamento</option>
            <option>Especialidades</option>
            <option>Profissionais</option>
            <option>Outras informações</option>
          </select>
        </label>
      </div>
      <label>
        Mensagem
        <textarea
          required
          name="mensagem"
          maxLength={1500}
          rows={5}
          placeholder="Como podemos ajudar? Não envie informações clínicas sensíveis."
        />
      </label>
      <label className="checkbox">
        <input required type="checkbox" /> Li e aceito a Política de
        Privacidade.
      </label>
      <button className="button button-primary" type="submit">
        Continuar no WhatsApp →
      </button>
      <small>
        A mensagem será aberta no WhatsApp para você conferir e enviar.
      </small>
      {notice && <p role="status">{notice}</p>}
    </form>
  );
}
