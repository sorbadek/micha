'use client'

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { AuthClient } from '@dfinity/auth-client'

interface User {
  id: string
  name: string
  email?: string
  avatar?: string
  xp?: number
  reputation?: number
  principal?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Identity Provider URLs
const II_PROD_URL = 'https://identity.ic0.app'
// If you run a local II canister with dfx start and dfx deploy internet_identity
// this URL is typically the default:
const II_LOCAL_URL = 'https://identity.ic0.app'

// 8 hours in nanoseconds for maxTimeToLive
const EIGHT_HOURS_NS = BigInt(8 * 60 * 60) * BigInt(1_000_000_000)

function detectIdentityProvider(): string {
  if (typeof window === 'undefined') return II_PROD_URL
  // Heuristic: when running on a localhost-like domain, prefer local II if available.
  const host = window.location.hostname
  const isLocalhost =
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local')
  return isLocalhost ? II_LOCAL_URL : II_PROD_URL
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const authClientRef = useRef<AuthClient | null>(null)

  const identityProvider = useMemo(detectIdentityProvider, [])

  // Initialize AuthClient once
  useEffect(() => {
    let mounted = true

    async function init() {
      try {
        const client = await AuthClient.create()
        if (!mounted) return
        authClientRef.current = client

        const alreadyAuthenticated = await client.isAuthenticated()
        if (alreadyAuthenticated) {
          const identity = client.getIdentity()
          const principal = identity.getPrincipal().toText()
          // You can enrich this user object with profile info from your backend/canisters later
          const hydratedUser: User = {
            id: principal,
            name: `User ${principal.slice(0, 5)}…`,
            avatar: '/generic-user-avatar.png',
            xp: 1250, // Keep mock XP for UI continuity; replace with real data later
            reputation: 4.8,
            principal,
          }
          setUser(hydratedUser)
        } else {
          setUser(null)
        }
      } catch (e) {
        console.error('Failed to initialize AuthClient:', e)
        setUser(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()
    return () => {
      mounted = false
    }
  }, [identityProvider])

  const login = async () => {
    setLoading(true)
    try {
      const client = authClientRef.current ?? (await AuthClient.create())
      authClientRef.current = client

      // If already authenticated, just hydrate state
      if (await client.isAuthenticated()) {
        const identity = client.getIdentity()
        const principal = identity.getPrincipal().toText()
        setUser((prev) => ({
          id: principal,
          name: prev?.name ?? `User ${principal.slice(0, 5)}…`,
          avatar: prev?.avatar ?? '/generic-user-avatar.png',
          xp: prev?.xp ?? 1250,
          reputation: prev?.reputation ?? 4.8,
          principal,
        }))
        setLoading(false)
        return
      }

      await new Promise<void>((resolve, reject) => {
        client.login({
          identityProvider,
          // Optional: derivationOrigin is recommended if your app runs on a custom domain with proxies.
          // derivationOrigin: window.location.origin,
          maxTimeToLive: EIGHT_HOURS_NS,
          onSuccess: () => resolve(),
          onError: (err) => reject(err),
        })
      })

      // Success: set user from authenticated identity
      const identity = client.getIdentity()
      const principal = identity.getPrincipal().toText()
      const hydratedUser: User = {
        id: principal,
        name: `User ${principal.slice(0, 5)}…`,
        avatar: '/generic-user-avatar.png',
        xp: 1250,
        reputation: 4.8,
        principal,
      }
      setUser(hydratedUser)
    } catch (error) {
      console.error('Internet Identity login failed:', error)
      // Keep user null on failure
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      const client = authClientRef.current ?? (await AuthClient.create())
      await client.logout()
      setUser(null)
      // Clear any app-specific cached data if needed
      try {
        localStorage.removeItem('peerverse_vault_items')
        localStorage.removeItem('peerverse_user')
      } catch {}
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
