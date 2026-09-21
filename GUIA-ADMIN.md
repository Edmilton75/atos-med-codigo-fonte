# Atos Med — ativação do painel administrativo

O painel está em `/admin`. O site e as APIs executam no Next.js/Vercel. Banco, login e fotos usam Supabase nesta versão; não é necessário contratar Vercel Blob. Não há conta ou senha padrão.

## 1. Preparar os arquivos

Use Node.js 22. Faça uma cópia do projeto anterior. Este pacote já contém o site completo e seus ajustes de fotos/header. Para atualizar o repositório existente, preserve a pasta `.git` local e os seus arquivos `.env`; copie os arquivos deste pacote sobre o projeto. Remova também os itens legados listados no final deste guia, pois sobrescrever um ZIP não apaga arquivos antigos.

No PowerShell, na pasta que contém `package.json`:

```powershell
npm.cmd install
Copy-Item .env.example .env.local
```

Não execute o segundo comando se já tiver `.env.local`: nesse caso, acrescente as variáveis manualmente.

## 2. Criar o banco e as permissões

1. Crie um projeto no Supabase (preferencialmente uma região próxima do público).
2. Abra **SQL Editor**, crie uma consulta e cole todo o conteúdo de `supabase/setup.sql`.
3. Execute. O script cria as tabelas, funções de publicação e o bucket público `atos-media`. Pode ser executado novamente sem apagar conteúdo.
4. Em **Authentication > Users > Add user**, crie seu usuário com e-mail e senha. Confirme o e-mail pelo painel se necessário. Este site não possui cadastro público.
5. Copie o UUID desse usuário e execute no SQL Editor:

```sql
insert into public.atos_admins (user_id)
values ('COLE-AQUI-O-UUID-DO-USUARIO')
on conflict do nothing;
```

Somente a lista `atos_admins` concede acesso. Um usuário comum, mesmo autenticado, não pode editar o site ou enviar fotos. Para revogar acesso, remova o UUID dessa tabela. Para redefinir uma senha esquecida, use as ferramentas de gerenciamento de usuários do Supabase; o painel desta versão não inclui recuperação por e-mail.

## 3. Configurar as variáveis

No painel Supabase, copie a URL do projeto e a chave pública `anon` (ou publishable). Preencha `.env.local`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA-CHAVE-PUBLICA
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Nunca coloque `service_role`, secret key ou senha do banco nessas variáveis. Esta implementação não usa chave administrativa: aplica as permissões do usuário em cada operação.

Sem as variáveis, o site abre com os dados demonstrativos e o painel mostra uma orientação de configuração. Com as variáveis configuradas, falhas de conexão são exibidas como indisponibilidade, sem voltar silenciosamente para dados de demonstração.

## 4. Testar e publicar o primeiro conteúdo

```powershell
npm.cmd run dev
```

Abra `http://localhost:3000/admin`, entre com a conta autorizada e revise:

- **Clínica**: WhatsApp com país e DDD (exemplo: `5585999999999`), Instagram, telefone, endereço e funcionamento.
- **Profissionais**: nome, profissão, registro, foto, apresentação, formação, públicos, modalidades e dias/horários.
- **Especialidades**: nome, resumo, introdução, público e áreas trabalhadas.
- **Textos e imagens**: título e apresentação da página inicial, história da clínica, missão, visão, valores e perguntas frequentes.

Clique em **Salvar alterações**. Na primeira gravação, os dados demonstrativos são gravados junto com as suas alterações; remova ou oculte cadastros que não devem ser publicados. Desative o aviso demonstrativo somente após substituir as informações por dados oficiais.

Novos cadastros começam ocultos. Marque **Publicar no site** e salve para disponibilizá-los. Alterar o slug muda o endereço da página; links antigos não recebem redirecionamento automático. Os cards da home mostram as primeiras seis especialidades publicadas, na ordem dos cadastros.

As mudanças aparecem em novas visitas/recarregamentos; páginas já abertas não se atualizam em tempo real. O formulário de contato abre uma mensagem no WhatsApp, que o visitante precisa enviar. Não armazena mensagens ou prontuários. Horários são informativos, sem reservas de consultas.

## 5. Fotos

Envie PNG, JPEG ou WebP de até 3 MB no próprio painel, ou informe uma URL HTTPS. Salve após o upload para associar a imagem ao cadastro. Use imagens otimizadas e autorizadas.

O bucket é público e serve apenas para imagens do site. Ocultar um profissional retira seus dados das consultas públicas, mas não torna confidencial uma foto cujo endereço já foi compartilhado. Fotos substituídas/excluídas não são apagadas automaticamente do Storage, para evitar quebrar referências. Remova arquivos sem uso pelo painel do Supabase quando necessário. Uploads não salvos também permanecem no bucket.

## 6. Vercel

1. Envie os arquivos ao seu GitHub.
2. No projeto Vercel, use o preset **Next.js** e a pasta que contém `package.json`.
3. Em **Settings > Environment Variables**, cadastre as três variáveis acima; em `NEXT_PUBLIC_SITE_URL`, use o endereço real com `https://`.
4. Use Node.js 22.x e build `npm run build`. Mantenha a saída padrão do Next.js.
5. Faça um novo deploy após configurar/alterar variáveis. Acesse `/admin` no domínio publicado.
6. Se precisar de previews independentes, configure outro projeto Supabase para Preview; não teste alterações de conteúdo no banco de produção.

O domínio pode continuar no registrador atual. Este pacote não altera DNS nem publica automaticamente na Vercel.

## 7. Verificação e commit

```powershell
npm.cmd run test
npm.cmd run build
npm.cmd run start
```

Confira no navegador: login, uma alteração de contato, um novo profissional, upload de foto, horários e ocultação. Teste também sem login: `/api/admin/content` deve responder 401. Depois:

```powershell
git status
git add -A
git diff --cached --stat
git commit -m "feat: adiciona painel administrativo da Atos Med com Supabase"
git push origin main
```

Revise o que será incluído. `.env.local` deve permanecer fora do Git; `.env.example` deve ser versionado.

## Limpeza incluída

Foram removidos os diretórios `build/`, `db/`, `drizzle/`, `examples/`, `worker/`, `scripts/`, os arquivos `vite.config.ts`, `drizzle.config.ts` e o teste antigo `tests/rendered-html.test.mjs`, exclusivos do fluxo anterior. Foram removidas as dependências de Cloudflare/Vite/Vinext/Drizzle sem uso. O banco agora é configurado por `supabase/setup.sql`. `app/data.ts` permanece como base de dados demonstrativos para a primeira configuração.

## Validação deste pacote

Testes automatizados executam as regras de acesso em PostgreSQL local via PGlite: bloqueio de anônimos, bloqueio de usuários comuns, concessão/revogação de administrador, gravação autorizada, conflito de versão, filtragem de itens ocultos e regras de upload. Também validam slugs duplicados, URLs inseguras e dias repetidos.

A ativação em seu Supabase real exige executar o SQL, configurar as variáveis e criar a conta administrativa. Nenhuma credencial real acompanha este pacote.

Também foram conferidos no navegador os fluxos de login válido/inválido, edição de contato, criação de perfil, link de WhatsApp, ocultação com 404 e layout mobile. Essa verificação utilizou um serviço Supabase simulado; as políticas SQL foram testadas separadamente em PostgreSQL via PGlite. As imagens em `docs/previas/` mostram essa sessão de teste e não representam dados publicados. Build de produção e TypeScript passaram; lint sem erros, com avisos de uso de imagens HTML já adotadas pelo projeto.
