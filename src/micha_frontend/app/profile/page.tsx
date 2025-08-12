"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageSquare,
  BookOpen,
  Award,
  Zap,
  Star,
  Calendar,
  MapPin,
  LinkIcon,
  Github,
  Twitter,
  Globe,
  UserIcon,
  Lightbulb,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export default function ProfilePage() {
  const { user } = useAuth()

  // Mock data for the current user's profile
  // In a real app, this would be fetched from a backend based on the logged-in user
  const currentUserProfile = {
    id: user?.principal || "user_id",
    name: user?.name || "Your Name",
    username: user?.principal ? user.principal.substring(0, 8) + "..." : "your_username",
    avatar: user?.avatar || "/generic-user-avatar.png",
    bio: "A passionate learner and peer educator on Peerverse. Always striving to share knowledge and grow with the community.",
    location: "Earth",
    joinedDate: "2023-01-01", // Example date
    socialLinks: {
      website: "https://peerverse.app",
      github: "https://github.com/peerverse",
      twitter: "https://twitter.com/peerverse",
    },
    xp: user?.xp || 0,
    reputation: 4.5, // Example reputation
    badges: [
      { name: "Early Adopter", icon: <Award className="h-4 w-4" />, color: "bg-purple-500" },
      { name: "Active Learner", icon: <BookOpen className="h-4 w-4" />, color: "bg-green-500" },
      { name: "Community Builder", icon: <Users className="h-4 w-4" />, color: "bg-blue-500" },
    ],
    contributions: [
      {
        type: "course",
        title: "Introduction to DFINITY Canisters",
        description: "A beginner-friendly course on smart contract development for ICP.",
        xp: 500,
        rating: 4.7,
      },
      {
        type: "forum_answer",
        title: "Best practices for Azle development",
        description: "Provided a detailed answer on structuring Azle projects and handling state.",
        xp: 100,
        rating: 5.0,
      },
    ],
    mentorshipCircles: [
      {
        id: "mc1",
        name: "ICP Devs Guild",
        role: "Member",
        members: 8,
        nextMeeting: "2024-08-10T14:00:00Z",
      },
    ],
    microClasses: [
      {
        id: "mc101",
        title: "Motoko Basics: Actors & Messages",
        description: "A short class on the fundamental concepts of Motoko actors and message passing.",
        xp: 100,
        completed: true,
      },
    ],
  }

  const formatJoinedDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  const formatNextMeeting = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-primary shadow-md">
          <AvatarImage src={currentUserProfile.avatar || "/placeholder.svg"} alt={currentUserProfile.name} />
          <AvatarFallback>{currentUserProfile.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold">{currentUserProfile.name}</h1>
          <p className="text-lg text-muted-foreground mb-2">@{currentUserProfile.username}</p>
          <p className="text-md text-gray-700 max-w-prose mb-4">{currentUserProfile.bio}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{currentUserProfile.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Joined {formatJoinedDate(currentUserProfile.joinedDate)}</span>
            </div>
            {currentUserProfile.socialLinks.website && (
              <Link
                href={currentUserProfile.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary"
              >
                <LinkIcon className="h-4 w-4" />
                <span>Website</span>
              </Link>
            )}
            {currentUserProfile.socialLinks.github && (
              <Link
                href={currentUserProfile.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary"
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </Link>
            )}
            {currentUserProfile.socialLinks.twitter && (
              <Link
                href={currentUserProfile.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary"
              >
                <Twitter className="h-4 w-4" />
                <span>Twitter</span>
              </Link>
            )}
          </div>
          <div className="flex gap-4 mt-4">
            <Button asChild>
              <Link href="/settings">
                <UserIcon className="h-4 w-4 mr-2" /> Edit Profile
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/public-profile">
                <Globe className="h-4 w-4 mr-2" /> View Public Profile
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Zap className="h-5 w-5 text-yellow-500" /> XP Earned
              </span>
              <span className="font-bold text-lg">{currentUserProfile.xp}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Star className="h-5 w-5 text-yellow-500" /> Reputation
              </span>
              <span className="font-bold text-lg">{currentUserProfile.reputation.toFixed(1)} / 5.0</span>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Badges</h3>
              <div className="flex flex-wrap gap-2">
                {currentUserProfile.badges.map((badge, index) => (
                  <Badge key={index} className={`${badge.color} text-white px-3 py-1 flex items-center gap-1`}>
                    {badge.icon}
                    {badge.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="contributions" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 h-auto">
              <TabsTrigger value="contributions">Contributions</TabsTrigger>
              <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
              <TabsTrigger value="micro-classes">Micro-Classes</TabsTrigger>
            </TabsList>

            <TabsContent value="contributions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Recent Contributions</CardTitle>
                  <CardDescription>Courses, forum answers, and tutorials you have created.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentUserProfile.contributions.length > 0 ? (
                    currentUserProfile.contributions.map((contribution, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <div className="flex items-center gap-2 mb-1">
                          {contribution.type === "course" && <BookOpen className="h-4 w-4 text-blue-500" />}
                          {contribution.type === "forum_answer" && <MessageSquare className="h-4 w-4 text-green-500" />}
                          {contribution.type === "tutorial" && <Lightbulb className="h-4 w-4 text-purple-500" />}
                          <h3 className="font-semibold text-lg">{contribution.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{contribution.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="h-4 w-4 fill-yellow-500" />
                            <span>{contribution.rating.toFixed(1)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Zap className="h-4 w-4 text-yellow-500" />
                            <span>{contribution.xp} XP</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">You haven't made any contributions yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mentorship" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Mentorship Circles</CardTitle>
                  <CardDescription>Circles you are part of.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentUserProfile.mentorshipCircles.length > 0 ? (
                    currentUserProfile.mentorshipCircles.map((circle, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <h3 className="font-semibold text-lg">{circle.name}</h3>
                        <p className="text-sm text-muted-foreground">Role: {circle.role}</p>
                        <p className="text-sm text-muted-foreground">Members: {circle.members}</p>
                        {circle.nextMeeting && (
                          <p className="text-sm text-muted-foreground">
                            Next Meeting: {formatNextMeeting(circle.nextMeeting)}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">You are not part of any mentorship circles yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="micro-classes" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Micro-Classes</CardTitle>
                  <CardDescription>Micro-classes you have created or completed.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentUserProfile.microClasses.length > 0 ? (
                    currentUserProfile.microClasses.map((microClass, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <h3 className="font-semibold text-lg">{microClass.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{microClass.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Zap className="h-4 w-4 text-yellow-500" />
                            <span>{microClass.xp} XP</span>
                          </div>
                          <Badge variant={microClass.completed ? "default" : "secondary"}>
                            {microClass.completed ? "Completed" : "In Progress"}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">You have no micro-classes yet.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
