"use client";
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body style={{ fontFamily: "Arial", padding: 40, color: "#01485e" }}>
        <h1>Não foi possível carregar o site</h1>
        <p>
          O conteúdo está temporariamente indisponível. Tente novamente em
          instantes.
        </p>
        <button onClick={reset}>Tentar novamente</button>
      </body>
    </html>
  );
}
