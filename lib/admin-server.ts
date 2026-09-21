import "server-only";
import { supabase, configured } from "./supabase";
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export async function requireAdmin(request: Request) {
  const token = request.headers
    .get("authorization")
    ?.match(/^Bearer (.+)$/)?.[1];
  if (!token) throw new HttpError(401, "Entre na sua conta para continuar.");
  if (!configured())
    throw new HttpError(503, "Configure o Supabase conforme o GUIA-ADMIN.md.");
  const client = supabase(token);
  const {
    data: { user },
    error,
  } = await client.auth.getUser(token);
  if (error || !user)
    throw new HttpError(401, "Sua sessão expirou. Entre novamente.");
  const { data, error: permissionError } = await client
    .from("atos_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (permissionError)
    throw new HttpError(
      503,
      "Verifique se o SQL de configuração foi executado.",
    );
  if (!data)
    throw new HttpError(403, "Sua conta não tem permissão de administrador.");
  return { client, user };
}
export function apiError(error: unknown) {
  return Response.json(
    {
      error:
        error instanceof HttpError
          ? error.message
          : "Não foi possível concluir. Tente novamente.",
    },
    {
      status: error instanceof HttpError ? error.status : 500,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
