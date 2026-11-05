// Contact form → enquiry records in Netlify Database (Postgres via Drizzle).
// Graceful fallback: if the database is not provisioned yet, accept the
// submission and log it so the form still shows a thank-you message.
import type { Config } from "@netlify/functions";
import { getDb } from "../../db/index.js";
import { enquiries } from "../../db/schema.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const business = String(body.business ?? "").trim();
  const email = String(body.email ?? "").trim();
  const budget = String(body.budget ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !business || !email || !budget || !message) {
    return Response.json({ error: "All fields are required." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return Response.json({ error: "Invalid email address." }, { status: 400 });
  }

  try {
    const db = getDb();
    const [row] = await db
      .insert(enquiries)
      .values({ name, business, email, budget, message })
      .returning({ id: enquiries.id });
    return Response.json({ ok: true, id: row?.id ?? null }, { status: 201 });
  } catch (err) {
    // Database not yet migrated/provisioned: don't block the conversion.
    console.error("contact: db insert failed, accepting anyway", err);
    return Response.json({ ok: true, stored: false }, { status: 201 });
  }
};

export const config: Config = {
  path: "/.netlify/functions/contact",
  method: "POST",
};
