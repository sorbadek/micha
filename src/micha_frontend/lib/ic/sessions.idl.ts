import type { IDL } from "@dfinity/candid"

// TypeScript types for convenience on the frontend
export type Session = {
  id: string
  title: string
  description: string
  sessionType: string
  date: string
  time: string
  durationMins: number
  maxAttendees: number
  priceXp: number
  isOnline: boolean
  location: string
  meetingUrl?: string | null
  owner: string // principal text
  createdAtNs: bigint
  startsAtNs: bigint
}

export type CreateSessionInput = {
  title: string
  description: string
  sessionType: string
  date: string
  time: string
  durationMins: number
  maxAttendees: number
  priceXp: number
  isOnline: boolean
  location: string
  meetingUrl?: string | null
}

// Candid factory that matches the canister interface.
// Adjust on the backend to keep these in sync.
export const idlFactory: IDL.InterfaceFactory = ({ IDL }) => {
  const Text = IDL.Text
  const Bool = IDL.Bool
  const Nat32 = IDL.Nat32
  const Nat64 = IDL.Nat64
  const Principal = IDL.Principal
  const OptText = IDL.Opt(Text)

  const CreateSessionInput = IDL.Record({
    title: Text,
    description: Text,
    sessionType: Text,
    date: Text,
    time: Text,
    durationMins: Nat32,
    maxAttendees: Nat32,
    priceXp: Nat32,
    isOnline: Bool,
    location: Text,
    meetingUrl: OptText,
  })

  const Session = IDL.Record({
    id: Text,
    title: Text,
    description: Text,
    sessionType: Text,
    date: Text,
    time: Text,
    durationMins: Nat32,
    maxAttendees: Nat32,
    priceXp: Nat32,
    isOnline: Bool,
    location: Text,
    meetingUrl: OptText,
    owner: Principal,
    createdAtNs: Nat64,
    startsAtNs: Nat64,
  })

  return IDL.Service({
    create_session: IDL.Func([CreateSessionInput], [Session], []),
    list_my_sessions: IDL.Func([], [IDL.Vec(Session)], ["query"]),
    get_session: IDL.Func([Text], [IDL.Opt(Session)], ["query"]),
  })
}

export const init = ({ IDL }: { IDL: typeof import("@dfinity/candid").IDL }) => {
  return []
}
