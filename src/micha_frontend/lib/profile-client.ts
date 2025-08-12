import { getIdentity, userProfileActor } from "./ic/agent"
import type { UserProfile, UserProfileUpdate, UserSettings } from "./ic/user-profile.idl"
import { uploadToAssetCanister } from "./ic/asset-uploader"

// Local fallback keys
const LS_PREFIX = "peerverse_profile_"

function lsKey(principal: string) {
  return `${LS_PREFIX}${principal}`
}

// Helpers to normalize optional fields coming from candid
function readOpt<T>(opt: any): T | undefined | null {
  if (Array.isArray(opt)) return opt.length ? (opt[0] as T) : undefined
  return opt as T
}

function normalizeSettingsFromCanister(raw: any | undefined | null): UserSettings {
  if (!raw) return {}
  const theme = readOpt<string>(raw.theme)
  const language = readOpt<string>(raw.language)
  const compactMode = readOpt<boolean>(raw.compactMode)
  const interests: string[] = Array.isArray(raw.interests) ? raw.interests : []
  return {
    theme: theme ?? undefined,
    language: language ?? undefined,
    compactMode: compactMode ?? undefined,
    interests,
  }
}

function encodeSettingsToCandid(settings: UserSettings) {
  return {
    theme: settings.theme !== undefined ? [settings.theme] : [],
    language: settings.language !== undefined ? [settings.language] : [],
    compactMode: settings.compactMode !== undefined ? [settings.compactMode] : [],
    interests: settings.interests ?? [],
  }
}

export async function getMyProfile(): Promise<UserProfile | null> {
  const identity = await getIdentity()
  if (!identity) return null
  const principal = identity.getPrincipal().toText()

  try {
    const actor = await userProfileActor<any>(identity)
    const result = await actor.get_my_profile()
    if (result?.length) {
      const profile = result[0]
      const normalized: UserProfile = {
        owner: principal,
        name: profile.name ?? "",
        bio: profile.bio ?? "",
        xp: BigInt(profile.xp ?? 0),
        avatarUrl: profile.avatarUrl?.[0] ?? null,
        bannerUrl: profile.bannerUrl?.[0] ?? null,
        files: profile.files ?? [],
        settings: normalizeSettingsFromCanister(profile.settings),
      }
      try {
        localStorage.setItem(lsKey(principal), JSON.stringify(normalized))
      } catch {}
      return normalized
    }
  } catch (e) {
    console.warn("get_my_profile canister call failed, using local fallback:", e)
  }

  try {
    const raw = localStorage.getItem(lsKey(principal))
    if (raw) return JSON.parse(raw)
  } catch {}

  return {
    owner: principal,
    name: `User ${principal.slice(0, 5)}…`,
    bio: "New to Peerverse on the Internet Computer.",
    xp: BigInt(0),
    avatarUrl: null,
    bannerUrl: null,
    files: [],
    settings: { interests: [] },
  }
}

export async function updateMyProfile(update: UserProfileUpdate): Promise<UserProfile> {
  const identity = await getIdentity()
  if (!identity) throw new Error("Not authenticated")

  const principal = identity.getPrincipal().toText()

  try {
    const actor = await userProfileActor<any>(identity)

    // Merge settings so we don't clobber other fields.
    let mergedSettings: UserSettings | undefined = undefined
    if (update.settings) {
      try {
        const current = await getMyProfile()
        mergedSettings = { ...(current?.settings ?? {}), ...update.settings }
      } catch {
        mergedSettings = update.settings
      }
    }

    const result = await actor.update_profile({
      name: update.name !== undefined ? [update.name ?? ""] : [],
      bio: update.bio !== undefined ? [update.bio ?? ""] : [],
      avatarUrl: update.avatarUrl !== undefined ? [update.avatarUrl ?? ""] : [],
      bannerUrl: update.bannerUrl !== undefined ? [update.bannerUrl ?? ""] : [],
      settings: update.settings ? [encodeSettingsToCandid(mergedSettings!)] : [],
    })

    const normalized: UserProfile = {
      owner: principal,
      name: result.name,
      bio: result.bio,
      xp: BigInt(result.xp ?? 0),
      avatarUrl: result.avatarUrl?.[0] ?? null,
      bannerUrl: result.bannerUrl?.[0] ?? null,
      files: result.files ?? [],
      settings: normalizeSettingsFromCanister(result.settings),
    }
    try {
      localStorage.setItem(lsKey(principal), JSON.stringify(normalized))
    } catch {}
    return normalized
  } catch (e) {
    console.warn("update_profile canister call failed, saving to local fallback:", e)
    const current = (await getMyProfile())!
    const merged: UserProfile = {
      ...current,
      ...update,
      settings: { ...(current.settings ?? {}), ...(update.settings ?? {}) },
    } as UserProfile
    try {
      localStorage.setItem(lsKey(principal), JSON.stringify(merged))
    } catch {}
    return merged
  }
}

export async function setInterests(interests: string[]): Promise<UserProfile> {
  return updateMyProfile({ settings: { interests } })
}

export async function uploadAndLinkFile(file: File, keyPrefix = "user"): Promise<{ url: string; files: string[] }> {
  const identity = await getIdentity()
  if (!identity) throw new Error("Not authenticated")

  const principal = identity.getPrincipal().toText()
  const safeName = file.name.replace(/\s+/g, "_")
  const objectKey = `${keyPrefix}/${principal}/${Date.now()}_${safeName}`

  const url = await uploadToAssetCanister(file, objectKey, identity)

  try {
    const actor = await userProfileActor<any>(identity)
    const files: string[] = await actor.link_file(url)
    return { url, files }
  } catch (e) {
    console.warn("link_file canister call failed, updating local fallback:", e)
    const current = (await getMyProfile())!
    const files = [...(current.files || []), url]
    try {
      localStorage.setItem(lsKey(principal), JSON.stringify({ ...current, files }))
    } catch {}
    return { url, files }
  }
}
