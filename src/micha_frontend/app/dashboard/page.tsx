"use client"

import * as React from "react"
import { Plus_Jakarta_Sans } from "next/font/google"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowUpRight,
  Clock,
  Flame,
  Plus,
  Sparkles,
  CheckCircle2,
  PlayCircle,
  Star,
  TrendingUp,
  UploadCloud,
} from "lucide-react"
import XPurchaseModal from "@/components/xp-purchase-modal"
import { cn } from "@/lib/utils"

// Apply Plus Jakarta Sans to dashboard texts
const dashboardFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
})

// Simple inline SVG Bar Chart
function BarChart({ values, labels }: { values: number[]; labels: string[] }) {
  const max = Math.max(...values, 1)
  return (
    <div className="flex h-40 items-end gap-3">
      {values.map((v, i) => {
        const height = (v / max) * 100
        return (
          <div key={i} className="flex w-full flex-col items-center gap-2">
            <div className="relative w-8 flex-1 rounded-lg bg-white/10">
              <div
                className="absolute bottom-0 left-0 w-full rounded-lg bg-gradient-to-t from-cyan-400 to-emerald-400"
                style={{ height: `${height}%` }}
              />
            </div>
            <span className="text-xs text-white/70">{labels[i]}</span>
          </div>
        )
      })}
    </div>
  )
}

// Simple CSS donut chart using conic-gradient
function DonutChart({ segments }: { segments: { value: number; color: string; label: string }[] }) {
  const total = segments.reduce((a, b) => a + b.value, 0) || 1
  let accum = 0
  const gradient = segments
    .map((s) => {
      const start = (accum / total) * 100
      accum += s.value
      const end = (accum / total) * 100
      return `${s.color} ${start}% ${end}%`
    })
    .join(", ")

  return (
    <div className="flex items-center gap-6">
      <div className="grid place-items-center">
        <div className="size-28 rounded-full" style={{ background: `conic-gradient(${gradient})` }}>
          <div className="relative left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 shadow-inner" />
        </div>
      </div>
      <div className="space-y-2">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-sm text-white/80">
            <span className="inline-block size-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="w-28">{s.label}</span>
            <span className="tabular-nums">{Math.round((s.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [isXPPurchaseModalOpen, setIsXPPurchaseModalOpen] = React.useState(false)

  const weekly = [2, 3, 2.5, 4, 3.5, 2.8, 3.2] // hours
  const labels = ["SAT", "SUN", "MON", "TUE", "WED", "THU", "FRI"]

  const completion = [
    { label: "Completed", value: 62, color: "#22c55e" },
    { label: "In Progress", value: 18, color: "#38bdf8" },
    { label: "Not Completed", value: 12, color: "#f59e0b" },
    { label: "Not Started", value: 8, color: "#ef4444" },
  ]

  const notifications = [
    {
      icon: <Sparkles className="size-4 text-emerald-400" />,
      title: "Clients comments on your Algorithm post",
      time: "Yesterday",
    },
    {
      icon: <CheckCircle2 className="size-4 text-cyan-400" />,
      title: "You submitted your JavaScript quiz",
      time: "Tuesday, 2:14 PM",
    },
    { icon: <Clock className="size-4 text-amber-400" />, title: "Task overdue by 13 hours", time: "30 June 2024" },
    {
      icon: <PlayCircle className="size-4 text-pink-400" />,
      title: "New quiz and PHP course released",
      time: "25 May 2024",
    },
  ]

  const partners = [
    { initials: "SC", name: "Sarah Chen", role: "Frontend Dev", xp: 21, color: "bg-fuchsia-500" },
    { initials: "MR", name: "Mike Rodriguez", role: "Data Engineer", xp: 19, color: "bg-cyan-500" },
    { initials: "EJ", name: "Emma Johnson", role: "UI/UX Designer", xp: 15, color: "bg-emerald-500" },
    { initials: "DP", name: "David Park", role: "ML Researcher", xp: 12, color: "bg-amber-500" },
    { initials: "LW", name: "Lisa Wang", role: "Mobile Engineer", xp: 8, color: "bg-purple-500" },
  ]

  const recs = [
    {
      tag: "BEGINNER",
      title: "Beginner's Guide To Becoming A Professional Frontend Developer",
      author: "Mohammad Shame Tefenz",
      role: "UI / UX Designer",
      color: "from-fuchsia-500 to-pink-400",
    },
    {
      tag: "INTERMEDIATE",
      title: "How To Create Your Portfolio Website",
      author: "Sarah Johnson",
      role: "Frontend Developer",
      color: "from-amber-400 to-yellow-400",
    },
    {
      tag: "FRONTEND",
      title: "Beginner's Guide To Becoming A Professional Frontend Developer",
      author: "Prashant Kumar Singh",
      role: "Software Developer",
      color: "from-cyan-400 to-sky-400",
    },
  ]

  return (
    <div className={cn("grid gap-6 lg:grid-cols-3 text-white", dashboardFont.className)}>
      {/* Left 2 columns */}
      <div className="space-y-6 lg:col-span-2">
        {/* XP Balance with conic backplate */}
        <Card className="overflow-hidden border-emerald-400/20 bg-slate-900/50">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 opacity-30"
            style={{
              background:
                "conic-gradient(from 180deg at 50% 50%, rgba(56,189,248,0.35), rgba(16,185,129,0.25), rgba(99,102,241,0.25), rgba(56,189,248,0.35))",
              maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
            }}
          />
          <CardContent className="p-5">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Flame className="size-4 text-amber-300" />
                  <span>XP Balance</span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    size="sm"
                    onClick={() => setIsXPPurchaseModalOpen(true)}
                    className="rounded-full bg-white/20 text-white hover:bg-white/30"
                  >
                    <Plus className="mr-1 size-4" /> Add More XP
                  </Button>
                  <p className="text-sm text-white/80">137 Contributions made this month!</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold tracking-tight">17,395.54</div>
                <div className="text-xs text-white/70">xp</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Time Spent + Course Completion */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-amber-400/20 bg-gradient-to-br from-amber-700/20 to-rose-500/10 text-white">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white/90">Time Spent</h3>
                <Badge className="bg-white/10 text-white/80">This Week</Badge>
              </div>
              <BarChart values={weekly} labels={labels} />
            </CardContent>
          </Card>

          <Card className="border-emerald-400/20 bg-gradient-to-br from-emerald-700/20 to-lime-500/10 text-white">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white/90">Course Completion</h3>
                <Badge className="bg-white/10 text-white/80">Overview</Badge>
              </div>
              <DonutChart segments={completion} />
            </CardContent>
          </Card>
        </div>

        {/* Things That Might Interest You */}
        <Card className="border-fuchsia-400/20 bg-gradient-to-r from-fuchsia-600/10 to-violet-600/10 text-white">
          <CardContent className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white/90">Things That Might Interest You</h3>
              <Button variant="ghost" size="sm" className="text-white/80 hover:bg-white/10">
                View All <ArrowUpRight className="ml-1 size-4" />
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {recs.map((r, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className={cn("absolute inset-0 -z-10 bg-gradient-to-r opacity-20 blur-xl", r.color)} />
                  <div className="mb-3">
                    <Badge className="rounded-full bg-white/10 px-3 text-[10px] tracking-wide text-white/80">
                      {r.tag}
                    </Badge>
                  </div>
                  <div className="mb-6 flex items-center justify-between">
                    <h4 className="line-clamp-2 text-sm font-semibold">{r.title}</h4>
                    <PlayCircle className="ml-3 shrink-0 text-white/70" />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/70">
                    <div className="grid size-8 place-items-center rounded-full bg-white/10">
                      <Star className="size-4 text-amber-300" />
                    </div>
                    <div>
                      <div className="font-medium text-white/90">{r.author}</div>
                      <div>{r.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right column */}
      <div className="space-y-6">
        {/* Notifications */}
        <Card className="border-pink-400/20 bg-gradient-to-br from-pink-700/20 to-rose-500/10 text-white">
          <CardContent className="p-5">
            <h3 className="mb-4 text-sm font-semibold text-white/90">Notifications</h3>
            <div className="space-y-4">
              {notifications.map((n, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="grid size-8 place-items-center rounded-lg bg-white/10">{n.icon}</div>
                  <div className="min-w-0">
                    <p className="text-sm">{n.title}</p>
                    <p className="text-xs text-white/60">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Frequent Learning Partners */}
        <Card className="border-purple-400/20 bg-gradient-to-br from-purple-700/20 to-violet-600/10 text-white">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white/90">Frequent Learning Partners</h3>
              <Badge className="bg-white/10 text-white/80">Top</Badge>
            </div>
            <div className="space-y-3">
              {partners.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "grid size-9 place-items-center rounded-full text-sm font-semibold text-white",
                        p.color,
                      )}
                    >
                      {p.initials}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{p.name}</div>
                      <div className="text-xs text-white/70">{p.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-emerald-400" />
                    <span className="text-xs text-white/80">{p.xp} xp</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Upload (hybrid storage hint) */}
        <Card className="border-teal-400/20 bg-gradient-to-br from-teal-700/20 to-emerald-600/10 text-white">
          <CardContent className="p-5">
            <h3 className="mb-3 text-sm font-semibold text-white/90">Quick Upload</h3>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-xs hover:bg-white/15">
              <UploadCloud className="h-4 w-4" />
              Upload & Link
              <input type="file" className="sr-only" />
            </label>
            <p className="mt-2 text-xs text-white/60">
              Store large media in an Asset canister and keep URLs in your on-chain profile.
            </p>
          </CardContent>
        </Card>
      </div>

      <XPurchaseModal isOpen={isXPPurchaseModalOpen} onClose={() => setIsXPPurchaseModalOpen(false)} />
    </div>
  )
}
