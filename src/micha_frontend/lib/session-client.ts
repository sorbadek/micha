import { createActor, getIdentity } from "./ic/agent"
import type { CreateSessionInput, Session } from "./ic/sessions.idl"
import { idlFactory as sessionsIdl } from "./ic/sessions.idl"
import { SESSIONS_CANISTER_ID } from "./ic/agent"

// Create an actor for the Sessions canister
async function sessionsActor(identity?: any) {
  return createActor<any>(SESSIONS_CANISTER_ID, sessionsIdl as any, identity)
}

// Utility: generate a Jitsi room URL for online sessions
function buildJitsiUrl(title: string) {
  const slug = `peerverse-${title}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
  return `https://meet.jit.si/${slug || "peerverse-session"}#config.prejoinPageEnabled=true`
}

export async function createSession(input: Omit<CreateSessionInput, "meetingUrl"> & { meetingUrl?: string | null }) {
  const identity = await getIdentity()
  if (!identity) {
    throw new Error("Not authenticated. Please sign in with Internet Identity.")
  }

  const actor = await sessionsActor(identity)

  const isOnline = input.isOnline
  const meetingUrl = isOnline ? input.meetingUrl || buildJitsiUrl(input.title) : null

  // Convert to candid-friendly shape: Opt fields must be [] or [value]
  const payload = {
    title: input.title,
    description: input.description,
    sessionType: input.sessionType,
    date: input.date,
    time: input.time,
    durationMins: Number(input.durationMins) >>> 0,
    maxAttendees: Number(input.maxAttendees) >>> 0,
    priceXp: Number(input.priceXp) >>> 0,
    isOnline,
    location: input.location ?? "",
    meetingUrl: meetingUrl ? [meetingUrl] : [],
  }

  const created = await actor.create_session(payload)
  // Normalize some values for TS ergonomics
  const normalized: Session = {
    id: created.id,
    title: created.title,
    description: created.description,
    sessionType: created.sessionType,
    date: created.date,
    time: created.time,
    durationMins: Number(created.durationMins),
    maxAttendees: Number(created.maxAttendees),
    priceXp: Number(created.priceXp),
    isOnline: created.isOnline,
    location: created.location,
    meetingUrl: (Array.isArray(created.meetingUrl) && created.meetingUrl.length ? created.meetingUrl[0] : null) ?? null,
    owner: created.owner.toText(),
    createdAtNs: BigInt(created.createdAtNs ?? 0),
    startsAtNs: BigInt(created.startsAtNs ?? 0),
  }
  return normalized
}

export async function listMySessions(): Promise<Session[]> {
  const identity = await getIdentity()
  if (!identity) return []
  const actor = await sessionsActor(identity)
  const list = await actor.list_my_sessions()
  return (list || []).map((s: any) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    sessionType: s.sessionType,
    date: s.date,
    time: s.time,
    durationMins: Number(s.durationMins),
    maxAttendees: Number(s.maxAttendees),
    priceXp: Number(s.priceXp),
    isOnline: s.isOnline,
    location: s.location,
    meetingUrl: (Array.isArray(s.meetingUrl) && s.meetingUrl.length ? s.meetingUrl[0] : null) ?? null,
    owner: s.owner.toText(),
    createdAtNs: BigInt(s.createdAtNs ?? 0),
    startsAtNs: BigInt(s.startsAtNs ?? 0),
  }))
}
