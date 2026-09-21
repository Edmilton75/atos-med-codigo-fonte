"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main style={{ maxWidth: 600, margin: "100px auto", padding: 24 }}>
      <h1>Não foi possível carregar o site</h1>
      <p>
        Tente novamente em instantes. Se o problema continuar, o responsável
        pelo site deve verificar a conexão com o banco.
      </p>
      <button onClick={reset}>Tentar novamente</button>
    </main>
  );
}
