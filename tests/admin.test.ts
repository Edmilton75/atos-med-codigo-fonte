import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { contentSchema, initialContent, whatsappUrl } from "../lib/content";
test("validação rejeita slugs repetidos, URLs perigosas e dias duplicados", () => {
  const duplicate = structuredClone(initialContent);
  duplicate.professionals.push(duplicate.professionals[0]);
  assert.equal(contentSchema.safeParse(duplicate).success, false);
  const bad = structuredClone(initialContent);
  bad.settings.heroImage = "javascript:alert(1)";
  assert.equal(contentSchema.safeParse(bad).success, false);
  bad.settings.heroImage = "//evil.test/x";
  assert.equal(contentSchema.safeParse(bad).success, false);
  const days = structuredClone(initialContent);
  days.professionals[0].schedule.push(days.professionals[0].schedule[0]);
  assert.equal(contentSchema.safeParse(days).success, false);
  assert.equal(whatsappUrl(""), "/contato");
});
test("RLS, publicação, revogação e conflito de edição no PostgreSQL", async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon;create role authenticated;create schema auth;create schema storage;
 create table auth.users(id uuid primary key);
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 grant usage on schema public,auth,storage to anon,authenticated;
 create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
 create table storage.objects(id bigserial primary key,bucket_id text,name text);
 alter table storage.objects enable row level security;
 grant insert on storage.objects to authenticated;grant usage on sequence storage.objects_id_seq to authenticated;
 create function storage.foldername(text) returns text[] language sql immutable as $$select string_to_array($1,'/')$$;`);
    const sql = await readFile(
      new URL("../supabase/setup.sql", import.meta.url),
      "utf8",
    );
    await db.exec(sql);
    await db.exec(sql);
    const admin = "11111111-1111-4111-8111-111111111111";
    const stranger = "22222222-2222-4222-8222-222222222222";
    await db.query("insert into auth.users(id) values ($1),($2)", [
      admin,
      stranger,
    ]);
    await db.query("insert into public.atos_admins values ($1)", [admin]);
    const doc = structuredClone(initialContent);
    doc.professionals[0].published = false;
    doc.specialties[0].published = false;
    await db.exec("set role anon");
    assert.equal(
      (await db.query("select public.atos_public_content() as doc")).rows[0]
        .doc,
      null,
    );
    await assert.rejects(
      db.query("select * from public.atos_content"),
      /permission denied/,
    );
    await assert.rejects(
      db.query("select public.atos_save_content($1::jsonb,0)", [
        JSON.stringify(doc),
      ]),
      /permission denied/,
    );
    await db.exec("reset role");
    await db.query("select set_config('request.jwt.claim.sub',$1,false)", [
      stranger,
    ]);
    await db.exec("set role authenticated");
    await assert.rejects(
      db.query("select public.atos_save_content($1::jsonb,0)", [
        JSON.stringify(doc),
      ]),
      /FORBIDDEN/,
    );
    await assert.rejects(
      db.query("insert into public.atos_admins values ($1)", [stranger]),
      /permission denied/,
    );
    await assert.rejects(
      db.query("insert into storage.objects(bucket_id,name) values ($1,$2)", [
        "atos-media",
        `${stranger}/x.png`,
      ]),
      /row-level security/,
    );
    await db.exec("reset role");
    await db.query("select set_config('request.jwt.claim.sub',$1,false)", [
      admin,
    ]);
    await db.exec("set role authenticated");
    assert.equal(
      (
        await db.query("select public.atos_save_content($1::jsonb,0) as v", [
          JSON.stringify(doc),
        ])
      ).rows[0].v,
      1,
    );
    assert.equal(
      (await db.query("select data from public.atos_content")).rows.length,
      1,
    );
    await db.query(
      "insert into storage.objects(bucket_id,name) values ($1,$2)",
      ["atos-media", `${admin}/x.png`],
    );
    await assert.rejects(
      db.query("select public.atos_save_content($1::jsonb,0)", [
        JSON.stringify(doc),
      ]),
      /VERSION_CONFLICT/,
    );
    doc.settings.phone = "Telefone atualizado";
    assert.equal(
      (
        await db.query("select public.atos_save_content($1::jsonb,1) as v", [
          JSON.stringify(doc),
        ])
      ).rows[0].v,
      2,
    );
    await db.exec("reset role;set role anon");
    const pub = (await db.query("select public.atos_public_content() as doc"))
      .rows[0].doc as typeof doc;
    assert.equal(pub.professionals.length, doc.professionals.length - 1);
    assert.equal(pub.specialties.length, doc.specialties.length - 1);
    assert.equal(pub.settings.phone, "Telefone atualizado");
    assert.equal(
      pub.professionals.some((p) => !p.published),
      false,
    );
    await db.exec("reset role");
    await db.query("delete from public.atos_admins where user_id=$1", [admin]);
    await db.exec("set role authenticated");
    assert.equal(
      (await db.query("select data from public.atos_content")).rows.length,
      0,
    );
    await assert.rejects(
      db.query("select public.atos_save_content($1::jsonb,2)", [
        JSON.stringify(doc),
      ]),
      /FORBIDDEN/,
    );
  } finally {
    await db.close();
  }
});
