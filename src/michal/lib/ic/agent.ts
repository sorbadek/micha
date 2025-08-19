import { HttpAgent, Actor, type Identity, type ActorSubclass } from "@dfinity/agent"
import { AuthClient } from "@dfinity/auth-client"
import type { IDL } from "@dfinity/candid"
import { idlFactory as userProfileIdl } from "./user-profile.idl"

// Replace with your deployed canister IDs on ICP mainnet
export const USER_PROFILE_CANISTER_ID = "rdmx6-jaaaa-aaaah-qdrva-cai" // Example mainnet canister ID
export const ASSET_CANISTER_ID = "rrkah-fqaaa-aaaah-qcuwa-cai" // Example mainnet canister ID
export const SESSIONS_CANISTER_ID = "ryjl3-tyaaa-aaaah-qcuwa-cai" // Replace with your actual Sessions canister ID

export function detectIcHost(): string {
  // Always use mainnet for production
  return "https://ic0.app"
}

export async function getIdentity(): Promise<Identity | null> {
  const client = await AuthClient.create({
    idleOptions: {
      idleTimeout: 1000 * 60 * 30, // 30 minutes
      disableDefaultIdleCallback: true,
    },
  })
  const ok = await client.isAuthenticated()
  return ok ? client.getIdentity() : null
}

export async function getAgent(identity?: Identity) {
  const host = detectIcHost()
  const agent = new HttpAgent({
    host,
    identity,
    // Use fetch for better compatibility
    fetch: globalThis.fetch,
  })

  // No need to fetch root key for mainnet
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
