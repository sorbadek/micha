import { Actor, HttpAgent } from "@dfinity/agent"
import { AuthClient } from "@dfinity/auth-client"
import { idlFactory } from "./ic/sessions.idl"

// Replace with your actual deployed canister ID
const SESSIONS_CANISTER_ID = "bw4dl-smaaa-aaaaa-qaacq-cai"

export interface CreateSessionInput {
  title: string
  description: string
  sessionType: { video: null } | { voice: null }
  scheduledTime: bigint
  duration: number
  maxAttendees: number
  price: number
  hostName: string
  hostAvatar: string
  tags: string[]
}

export interface Session {
  id: string
  title: string
  description: string
  sessionType: { video: null } | { voice: null }
  scheduledTime: bigint
  duration: number
  maxAttendees: number
  price: number
  hostName: string
  hostAvatar: string
  tags: string[]
  attendees: string[]
  status: { scheduled: null } | { live: null } | { completed: null } | { cancelled: null }
  createdAt: bigint
  recordingUrl?: string
  meetingUrl?: string
}

class SessionClient {
  private actor: any = null

  private async getActor() {
    if (this.actor) return this.actor

    const authClient = await AuthClient.create()
    const identity = authClient.getIdentity()

    const agent = new HttpAgent({
      identity,
      host: process.env.NODE_ENV === "development" ? "https://ic0.app" : "https://ic0.app",
    })

    if (process.env.NODE_ENV === "development") {
      await agent.fetchRootKey()
    }

    this.actor = Actor.createActor(idlFactory, {
      agent,
      canisterId: SESSIONS_CANISTER_ID,
    })

    return this.actor
  }

  async createSession(input: CreateSessionInput): Promise<Session> {
    const actor = await this.getActor()
    const result = await actor.create_session(input)
    return result
  }

  async getAllSessions(): Promise<Session[]> {
    const actor = await this.getActor()
    const result = await actor.list_all_sessions()
    return result
  }

  async getMySessions(): Promise<Session[]> {
    const actor = await this.getActor()
    const result = await actor.list_my_sessions()
    return result
  }

  async getSession(id: string): Promise<Session | null> {
    const actor = await this.getActor()
    const result = await actor.get_session(id)
    return result.length > 0 ? result[0] : null
  }

  async joinSession(id: string): Promise<Session> {
    const actor = await this.getActor()
    const result = await actor.join_session(id)
    return result
  }

  async updateSessionStatus(id: string, status: Session["status"]): Promise<Session> {
    const actor = await this.getActor()
    const result = await actor.update_session_status(id, status)
    return result
  }

  async deleteSession(id: string): Promise<boolean> {
    const actor = await this.getActor()
    const result = await actor.delete_session(id)
    return result
  }

  async searchSessions(query: string): Promise<Session[]> {
    const actor = await this.getActor()
    const result = await actor.search_sessions(query)
    return result
  }

  async getCompletedSessions(): Promise<Session[]> {
    const actor = await this.getActor()
    const result = await actor.getSessionsByStatus({ completed: null })
    return result
  }
}

export const sessionClient = new SessionClient()
