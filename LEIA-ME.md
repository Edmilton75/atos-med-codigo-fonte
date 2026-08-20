# Código-fonte — Atos Med

Projeto do site institucional da Atos Med, criado com Next.js, React, TypeScript, Tailwind CSS e Vinext.

## Como abrir e executar

1. Instale o Node.js 22 ou superior.
2. Abra esta pasta no Visual Studio Code.
3. No terminal da pasta, execute `npm install`.
4. Depois, execute `npm run dev`.
5. Abra o endereço informado no terminal.

## Arquivos principais

- `app/page.tsx`: página inicial.
- `app/globals.css`: cores, tipografia e estilos visuais.
- `app/site-shell.tsx`: header, menu, footer, WhatsApp e chatbot.
- `app/data.ts`: especialidades, profissionais e horários demonstrativos.
- `app/especialidades/`: páginas de especialidades.
- `app/profissionais/`: listagem e perfis dos profissionais.
- `app/horarios/`: horários de atendimento.
- `app/contato/`: página e formulário de contato.
- `public/`: logo e imagens públicas.

## Dados que precisam ser substituídos

Procure no projeto por:

- `55XXXXXXXXXXX` para inserir o WhatsApp oficial.
- `USUARIO` para inserir o perfil do Instagram.
- `(00) 0000-0000` para inserir o telefone.
- `Inserir endereço completo` para informar o endereço.
- `inserir registro` para preencher os registros profissionais.

Os profissionais e horários atuais são demonstrativos. Atualize essas informações em `app/data.ts` antes da publicação definitiva.

## Observação

O arquivo `.openai/hosting.json` foi entregue sem a identificação interna do Site publicado. Isso permite usar esta cópia como um projeto independente.
