import { Actor, HttpAgent } from "@dfinity/agent"
import { AuthClient } from "@dfinity/auth-client"
import { idlFactory } from "./ic/social.idl"

// Use a valid canister ID with proper checksum
const SOCIAL_CANISTER_ID = "b77ix-eeaaa-aaaaa-qaada-cai"

export interface PartnerProfile {
  principal: string
  name: string
  role: string
  xp: number
  onlineStatus: "online" | "away" | "offline"
  avatarColor: string
  initials: string
  joinedAt: bigint
  lastActive: bigint
}

export interface PartnerRequest {
  id: string
  from: string
  to: string
  message?: string
  timestamp: bigint
  status: "pending" | "accepted" | "declined"
}

export interface StudyGroup {
  id: string
  name: string
  description: string
  creator: string
  members: string[]
  maxMembers: number
  isPublic: boolean
  createdAt: bigint
  tags: string[]
}

class SocialClient {
  private actor: any = null

  private async getActor() {
    if (this.actor) return this.actor

    try {
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
        canisterId: SOCIAL_CANISTER_ID,
      })

      return this.actor
    } catch (error) {
      console.warn("Failed to create social actor:", error)
      return null
    }
  }

  async sendPartnerRequest(to: string, message?: string): Promise<string> {
    try {
      const actor = await this.getActor()
      if (!actor) throw new Error("Actor not available")

      const result = await actor.sendPartnerRequest(to, message ? [message] : [])
      if ("ok" in result) {
        return result.ok
      } else {
        throw new Error(result.err)
      }
    } catch (error) {
      console.error("Error sending partner request:", error)
      throw error
    }
  }

  async getMyPartners(): Promise<PartnerProfile[]> {
    try {
      const actor = await this.getActor()
      if (!actor) {
        return this.getFallbackPartners()
      }

      const result = await actor.getMyPartners()
      return result
    } catch (error) {
      console.warn("Error getting partners, using fallback:", error)
      return this.getFallbackPartners()
    }
  }

  async getPartnerRequests(): Promise<PartnerRequest[]> {
    try {
      const actor = await this.getActor()
      if (!actor) return []

      const result = await actor.getPartnerRequests()
      return result
    } catch (error) {
      console.warn("Error getting partner requests:", error)
      return []
    }
  }

  async createStudyGroup(
    name: string,
    description: string,
    maxMembers: number,
    isPublic: boolean,
    tags: string[],
  ): Promise<StudyGroup> {
    try {
      const actor = await this.getActor()
      if (!actor) throw new Error("Actor not available")

      const result = await actor.createStudyGroup(name, description, maxMembers, isPublic, tags)
      if ("ok" in result) {
        return result.ok
      } else {
        throw new Error(result.err)
      }
    } catch (error) {
      console.error("Error creating study group:", error)
      throw error
    }
  }

  async generateSamplePartners(): Promise<string> {
    try {
      const actor = await this.getActor()
      if (!actor) throw new Error("Actor not available")

      const result = await actor.generateSamplePartners()
      if ("ok" in result) {
        return result.ok
      } else {
        throw new Error(result.err)
      }
    } catch (error) {
      console.error("Error generating sample partners:", error)
      throw error
    }
  }

  private getFallbackPartners(): PartnerProfile[] {
    const now = BigInt(Date.now() * 1000000)
    return [
      {
        principal: "user1",
        name: "Sarah Chen",
        role: "Frontend Developer",
        xp: 2847,
        onlineStatus: "online",
        avatarColor: "bg-gradient-to-r from-sky-400 to-cyan-400",
        initials: "SC",
        joinedAt: now - BigInt(86400000000000), // 1 day ago
        lastActive: now - BigInt(300000000000), // 5 minutes ago
      },
      {
        principal: "user2",
        name: "Michael Rodriguez",
        role: "Full Stack Engineer",
        xp: 3921,
        onlineStatus: "away",
        avatarColor: "bg-gradient-to-r from-emerald-400 to-teal-400",
        initials: "MR",
        joinedAt: now - BigInt(172800000000000), // 2 days ago
        lastActive: now - BigInt(1800000000000), // 30 minutes ago
      },
      {
        principal: "user3",
        name: "Emily Watson",
        role: "UI/UX Designer",
        xp: 1654,
        onlineStatus: "online",
        avatarColor: "bg-gradient-to-r from-purple-400 to-pink-400",
        initials: "EW",
        joinedAt: now - BigInt(259200000000000), // 3 days ago
        lastActive: now - BigInt(120000000000), // 2 minutes ago
      },
      {
        principal: "user4",
        name: "David Kim",
        role: "Backend Developer",
        xp: 4205,
        onlineStatus: "offline",
        avatarColor: "bg-gradient-to-r from-orange-400 to-red-400",
        initials: "DK",
        joinedAt: now - BigInt(345600000000000), // 4 days ago
        lastActive: now - BigInt(7200000000000), // 2 hours ago
      },
      {
        principal: "user5",
        name: "Lisa Thompson",
        role: "Product Manager",
        xp: 2156,
        onlineStatus: "away",
        avatarColor: "bg-gradient-to-r from-indigo-400 to-blue-400",
        initials: "LT",
        joinedAt: now - BigInt(432000000000000), // 5 days ago
        lastActive: now - BigInt(3600000000000), // 1 hour ago
      },
    ]
  }
}

export const socialClient = new SocialClient()
