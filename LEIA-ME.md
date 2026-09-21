# Atos Med — site e painel administrativo

Next.js + React + TypeScript, preparado para Vercel. Supabase fornece autenticação, banco de conteúdo e armazenamento de fotos.

**Comece por `GUIA-ADMIN.md`**, que explica como criar seu acesso, configurar as variáveis e publicar.

```powershell
npm.cmd install
npm.cmd run dev
```

Site: http://localhost:3000 · Gestão: http://localhost:3000/admin

- `app/admin/`: interface da gestão.
- `app/api/admin/`: operações autenticadas de conteúdo e fotos.
- `lib/content.ts`: validação e dados iniciais.
- `lib/content-server.ts`: leitura pública do conteúdo.
- `supabase/setup.sql`: tabelas, funções e permissões.
- `.env.example`: variáveis necessárias (sem credenciais).
- `app/globals.css`: visual público preservado.
- `app/admin/admin.css`: visual do painel, inclusive mobile.

Comandos: `npm.cmd run test`, `npm.cmd run build`, `npm.cmd run start` e `npm.cmd run lint`.
