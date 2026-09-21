import { z } from "zod";
import { contentSchema, initialContent } from "@/lib/content";
import { requireAdmin, apiError, HttpError } from "@/lib/admin-server";
export async function GET(request: Request) {
  try {
    const { client } = await requireAdmin(request);
    const { data, error } = await client
      .from("atos_content")
      .select("data,version")
      .eq("id", 1)
      .maybeSingle();
    if (error) throw new HttpError(503, "Não foi possível carregar os dados.");
    return Response.json(data ?? { data: initialContent, version: 0 }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    return apiError(e);
  }
}
export async function PUT(request: Request) {
  try {
    const { client } = await requireAdmin(request);
    const raw = await request.text();
    if (raw.length > 1_000_000)
      throw new HttpError(413, "Conteúdo muito grande.");
    let json;
    try {
      json = JSON.parse(raw);
    } catch {
      throw new HttpError(400, "Conteúdo inválido.");
    }
    const parsed = z
      .object({ data: contentSchema, version: z.number().int().nonnegative() })
      .safeParse(json);
    if (!parsed.success)
      throw new HttpError(
        400,
        parsed.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .slice(0, 4)
          .join(" • "),
      );
    const { data, error } = await client.rpc("atos_save_content", {
      document: parsed.data.data,
      expected_version: parsed.data.version,
    });
    if (error?.message.includes("VERSION_CONFLICT"))
      throw new HttpError(
        409,
        "Outro administrador salvou alterações. Copie seus textos e recarregue os dados antes de salvar.",
      );
    if (error)
      throw new HttpError(
        503,
        "Não foi possível salvar no banco. Suas alterações continuam no formulário.",
      );
    return Response.json(
      { version: data },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return apiError(e);
  }
}
