import { Actor, HttpAgent } from "@dfinity/agent"
import { AuthClient } from "@dfinity/auth-client"
import { idlFactory } from "./ic/notifications.idl"

// Use a valid canister ID with proper checksum
const NOTIFICATIONS_CANISTER_ID = "bd3sg-teaaa-aaaaa-qaaba-cai"

export interface Activity {
  id: string
  userId: string
  activityType: any
  title: string
  description?: string
  timestamp: bigint
  isRead: boolean
  expiresAt?: bigint
}

class NotificationsClient {
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
        canisterId: NOTIFICATIONS_CANISTER_ID,
      })

      return this.actor
    } catch (error) {
      console.warn("Failed to create notifications actor:", error)
      return null
    }
  }

  async createActivity(activityType: any, title: string, description?: string): Promise<string> {
    try {
      const actor = await this.getActor()
      if (!actor) throw new Error("Actor not available")

      const result = await actor.createActivity(activityType, title, description ? [description] : [])
      if ("ok" in result) {
        return result.ok
      } else {
        throw new Error(result.err)
      }
    } catch (error) {
      console.error("Error creating activity:", error)
      throw error
    }
  }

  async getMyActivities(limit = 10): Promise<Activity[]> {
    try {
      const actor = await this.getActor()
      if (!actor) {
        // Return fallback data when canister is not available
        return this.getFallbackActivities()
      }

      const result = await actor.getMyActivities(limit)
      return result
    } catch (error) {
      console.warn("Error getting activities, using fallback:", error)
      return this.getFallbackActivities()
    }
  }

  async markActivityAsRead(activityId: string): Promise<Activity> {
    try {
      const actor = await this.getActor()
      if (!actor) throw new Error("Actor not available")

      const result = await actor.markActivityAsRead(activityId)
      if ("ok" in result) {
        return result.ok
      } else {
        throw new Error(result.err)
      }
    } catch (error) {
      console.error("Error marking activity as read:", error)
      throw error
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const actor = await this.getActor()
      if (!actor) return 0

      const result = await actor.getUnreadCount()
      return Number(result)
    } catch (error) {
      console.warn("Error getting unread count:", error)
      return 0
    }
  }

  async generateSampleActivities(): Promise<string> {
    try {
      const actor = await this.getActor()
      if (!actor) throw new Error("Actor not available")

      const result = await actor.generateSampleActivities()
      if ("ok" in result) {
        return result.ok
      } else {
        throw new Error(result.err)
      }
    } catch (error) {
      console.error("Error generating sample activities:", error)
      throw error
    }
  }

  private getFallbackActivities(): Activity[] {
    const now = BigInt(Date.now() * 1000000)
    return [
      {
        id: "1",
        userId: "anonymous",
        activityType: { quiz_completed: null },
        title: "Quiz Completed",
        description: "You completed the React Fundamentals quiz with 95% score!",
        timestamp: now - BigInt(3600000000000), // 1 hour ago
        isRead: false,
      },
      {
        id: "2",
        userId: "anonymous",
        activityType: { achievement_earned: null },
        title: "Achievement Unlocked",
        description: "You earned the 'Fast Learner' badge for completing 5 lessons in one day!",
        timestamp: now - BigInt(7200000000000), // 2 hours ago
        isRead: false,
      },
      {
        id: "3",
        userId: "anonymous",
        activityType: { course_available: null },
        title: "New Course Available",
        description: "Advanced TypeScript course is now available in your learning path.",
        timestamp: now - BigInt(10800000000000), // 3 hours ago
        isRead: true,
      },
      {
        id: "4",
        userId: "anonymous",
        activityType: { session_joined: null },
        title: "Study Session Joined",
        description: "You joined the 'React Patterns' study group session.",
        timestamp: now - BigInt(14400000000000), // 4 hours ago
        isRead: true,
      },
      {
        id: "5",
        userId: "anonymous",
        activityType: { comment: null },
        title: "New Comment",
        description: "Sarah Chen commented on your project submission.",
        timestamp: now - BigInt(18000000000000), // 5 hours ago
        isRead: true,
      },
    ]
  }
}

export const notificationsClient = new NotificationsClient()
