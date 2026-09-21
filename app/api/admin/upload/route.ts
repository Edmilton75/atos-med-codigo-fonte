import { requireAdmin, apiError, HttpError } from "@/lib/admin-server";
export async function POST(request: Request) {
  try {
    const { client, user } = await requireAdmin(request);
    if (Number(request.headers.get("content-length") || 0) > 3_300_000)
      throw new HttpError(413, "Use uma imagem de até 3 MB.");
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || !file.size || file.size > 3_000_000)
      throw new HttpError(400, "Selecione uma imagem de até 3 MB.");
    const bytes = new Uint8Array(await file.arrayBuffer());
    const png = [137, 80, 78, 71, 13, 10, 26, 10].every(
      (n, i) => bytes[i] === n,
    );
    const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
    const webp =
      new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" &&
      new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP";
    const ext = png ? "png" : jpeg ? "jpg" : webp ? "webp" : null;
    if (!ext)
      throw new HttpError(400, "Use uma imagem PNG, JPG ou WebP válida.");
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error } = await client.storage
      .from("atos-media")
      .upload(path, bytes, {
        contentType: jpeg ? "image/jpeg" : `image/${ext}`,
        upsert: false,
      });
    if (error)
      throw new HttpError(
        503,
        "Não foi possível enviar a imagem. Verifique o bucket e suas permissões.",
      );
    return Response.json({
      url: client.storage.from("atos-media").getPublicUrl(path).data.publicUrl,
    });
  } catch (e) {
    return apiError(e);
  }
}
