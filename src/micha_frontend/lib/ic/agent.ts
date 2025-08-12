import { HttpAgent, Actor, type Identity, type ActorSubclass } from "@dfinity/agent"
import { AuthClient } from "@dfinity/auth-client"
import type { IDL } from "@dfinity/candid"
import { idlFactory as userProfileIdl } from "./user-profile.idl"

// Replace with your deployed canister IDs
export const USER_PROFILE_CANISTER_ID = "aaaaa-aa" // TODO: set real canister id
export const ASSET_CANISTER_ID = "bbbbb-bb" // TODO: set real asset canister id
export const SESSIONS_CANISTER_ID = "ccccc-cc" // TODO: set real sessions canister id

export function detectIcHost(): string {
  if (typeof window === "undefined") return "https://ic0.app"
  const host = window.location.hostname
  const isLocal = host === "localhost" || host === "127.0.0.1" || host.endsWith(".localhost") || host.endsWith(".local")
  // Local replica default
  return isLocal ? "http://127.0.0.1:4943" : "https://ic0.app"
}

export async function getIdentity(): Promise<Identity | null> {
  const client = await AuthClient.create()
  const ok = await client.isAuthenticated()
  return ok ? client.getIdentity() : null
}

export async function getAgent(identity?: Identity) {
  const host = detectIcHost()
  const agent = new HttpAgent({ host, identity })
  // Local replica requires root key
  if (host.includes("127.0.0.1") || host.includes(":4943")) {
    await agent.fetchRootKey().catch(() => {
      console.warn("Unable to fetch root key. Is the local replica running?")
    })
  }
  return agent
}

export async function createActor<T>(canisterId: string, idlFactory: IDL.InterfaceFactory, identity?: Identity) {
  const agent = await getAgent(identity)
  return Actor.createActor<T>(idlFactory, {
    agent,
    canisterId,
  })
}

// Convenience creator for the User Profile canister
export async function userProfileActor<T = any>(identity?: Identity): Promise<ActorSubclass<T>> {
  return createActor<T>(USER_PROFILE_CANISTER_ID, userProfileIdl as unknown as IDL.InterfaceFactory, identity)
}
