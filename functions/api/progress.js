// functions/api/progress.js
//
// Cloudflare Pages Function backing koine-drill.pages.dev's cross-device
// sync fallback -- used only by the static (GitHub/Cloudflare) copy of the
// app, since window.claude (the claude.ai Artifact runtime that powers
// sync on the published Artifact) never exists there. See the "CLOUDFLARE
// FALLBACK" block inside koine-drill.html's <script> for the client side
// of this.
//
// Requires two things set up on the Cloudflare Pages project (dashboard):
//   1. Settings -> Functions -> KV namespace bindings
//        Variable name: PROGRESS_KV
//        KV namespace: (create one, e.g. "koine-drill-progress")
//   2. Settings -> Environment variables
//        SYNC_TOKEN = eed9f5d7a6b3d09344afc3ada2ac5cb35b411b4110eb4936
//      (this must match the TOKEN constant in koine-drill.html's
//      cloudflareSync() -- if you ever change one, change the other)
// Do both for the Production environment; add them to Preview too if you
// use preview deployments and want sync to work there as well.
//
// This is a single fixed key -- there is exactly one saved progress blob
// for this whole app, matching the one shared document the claude.ai db
// capability uses (db.doc("progress/state")). Nothing here is per-user;
// it's a personal single-user app, not a multi-tenant one.
//
// X-Sync-Token is NOT real security -- on a public static site, anything
// the client sends is visible to anyone who reads the page source. It
// only keeps this endpoint from being casually found and hit by scanners;
// it does not protect against someone who deliberately reads the JS.

const KV_KEY = "progress-state-v1";

function tokenOk(request, env) {
  const got = request.headers.get("X-Sync-Token") || "";
  return !!env.SYNC_TOKEN && got === env.SYNC_TOKEN;
}

export async function onRequestGet({ request, env }) {
  if (!env.PROGRESS_KV) return new Response("KV not bound", { status: 500 });
  if (!tokenOk(request, env)) return new Response("unauthorized", { status: 401 });
  const raw = await env.PROGRESS_KV.get(KV_KEY);
  if (raw === null) return new Response("not found", { status: 404 });
  return new Response(raw, { headers: { "content-type": "application/json" } });
}

export async function onRequestPut({ request, env }) {
  if (!env.PROGRESS_KV) return new Response("KV not bound", { status: 500 });
  if (!tokenOk(request, env)) return new Response("unauthorized", { status: 401 });
  const body = await request.text();
  if (body.length > 2_000_000) return new Response("payload too large", { status: 413 });
  try { JSON.parse(body); } catch (e) { return new Response("invalid json", { status: 400 }); }
  await env.PROGRESS_KV.put(KV_KEY, body);
  return new Response("ok");
}
