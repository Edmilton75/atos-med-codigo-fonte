import "server-only";
import { cache } from "react";
import { supabase, configured } from "./supabase";
import { initialContent, contentSchema } from "./content";
export const getContent = cache(async () => {
  if (!configured()) return initialContent;
  const { data, error } = await supabase().rpc("atos_public_content");
  if (error)
    throw new Error(
      "Não foi possível carregar o conteúdo. Verifique a configuração do banco.",
    );
  return data === null ? initialContent : contentSchema.parse(data);
});
