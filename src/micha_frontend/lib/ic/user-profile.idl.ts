// Minimal Candid IDL for a UserProfile canister.
// Methods: get_profile, update_profile, link_file, unlink_file, increment_xp

import type { IDL } from "@dfinity/candid"

export const idlFactory = ({ IDL }: { IDL: IDL }) => {
  const Principal = IDL.Principal
  const UserSettings = IDL.Record({
    theme: IDL.Opt(IDL.Text),
    language: IDL.Opt(IDL.Text),
    compactMode: IDL.Opt(IDL.Bool),
    interests: IDL.Vec(IDL.Text), // NEW: on-chain interests
  })

  const UserProfile = IDL.Record({
    owner: Principal,
    name: IDL.Text,
    bio: IDL.Text,
    xp: IDL.Nat64,
    avatarUrl: IDL.Text, // Updated to be required
    bannerUrl: IDL.Text, // Updated to be required
    files: IDL.Vec(IDL.Text), // URLs or asset keys
    settings: UserSettings,
  })

  const UserProfileUpdate = IDL.Record({
    name: IDL.Opt(IDL.Text),
    bio: IDL.Opt(IDL.Text),
    avatarUrl: IDL.Opt(IDL.Text),
    bannerUrl: IDL.Opt(IDL.Text),
    settings: IDL.Opt(UserSettings),
  })

  return IDL.Service({
    get_profile: IDL.Func([Principal], [IDL.Opt(UserProfile)], ["query"]),
    get_my_profile: IDL.Func([], [IDL.Opt(UserProfile)], ["query"]),
    update_profile: IDL.Func([UserProfileUpdate], [UserProfile], []),
    link_file: IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], []), // returns files after linking
    unlink_file: IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], []),
    increment_xp: IDL.Func([IDL.Nat64], [IDL.Nat64], []), // returns new XP
  })
}

export type UserSettings = {
  theme?: string
  language?: string
  compactMode?: boolean
  interests?: string[]
}

export type UserProfile = {
  owner: string // principal text
  name: string
  bio: string
  xp: bigint
  avatarUrl: string | null
  bannerUrl: string | null
  files: string[]
  settings: UserSettings
}

export type UserProfileUpdate = {
  name?: string
  bio?: string
  avatarUrl?: string | null
  bannerUrl?: string | null
  settings?: UserSettings
}
