"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, BookOpen, Zap, Star, PlusCircle, GraduationCap, Code, Lightbulb } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface MicroClass {
  id: string
  title: string
  description: string
  author: {
    name: string
    avatar: string
  }
  xpReward: number
  rating: number
  reviews: number
  category: string
  imageUrl: string
  type: "course" | "tutorial" | "project"
}

const mockMicroClasses: MicroClass[] = [
  {
    id: "mc1",
    title: "Introduction to Motoko Smart Contracts",
    description: "Learn the basics of Motoko, the native language for smart contracts on the Internet Computer.",
    author: { name: "Alice Johnson", avatar: "/alice-johnson-avatar.png" },
    xpReward: 200,
    rating: 4.8,
    reviews: 120,
    category: "Blockchain",
    imageUrl: "/placeholder.svg?height=200&width=300",
    type: "course",
  },
  {
    id: "mc2",
    title: "Building a Simple DApp with React & ICP",
    description: "A step-by-step tutorial on creating your first decentralized application frontend.",
    author: { name: "Bob Williams", avatar: "/bob-williams-avatar.png" },
    xpReward: 150,
    rating: 4.7,
    reviews: 90,
    category: "Frontend",
    imageUrl: "/placeholder.svg?height=200&width=300",
    type: "tutorial",
  },
  {
    id: "mc3",
    title: "Rust for Blockchain Developers",
    description: "Dive into Rust fundamentals essential for developing high-performance blockchain solutions.",
    author: { name: "Sarah Chen", avatar: "/sarah-chen-avatar.png" },
    xpReward: 250,
    rating: 4.9,
    reviews: 150,
    category: "Programming",
    imageUrl: "/rust-ownership-thumbnail.png",
    type: "course",
  },
  {
    id: "mc4",
    title: "NFT Minting on ICP: A Practical Guide",
    description: "Learn how to create and deploy your own NFT collection on the Internet Computer.",
    author: { name: "Michael Lee", avatar: "/michael-lee-avatar.png" },
    xpReward: 180,
    rating: 4.6,
    reviews: 80,
    category: "NFTs",
    imageUrl: "/placeholder.svg?height=200&width=300",
    type: "project",
  },
  {
    id: "mc5",
    title: "Introduction to Data Structures & Algorithms",
    description: "Fundamental concepts of data structures and algorithms using JavaScript.",
    author: { name: "Emily White", avatar: "/emily-white-avatar.png" },
    xpReward: 120,
    rating: 4.5,
    reviews: 70,
    category: "Computer Science",
    imageUrl: "/placeholder.svg?height=200&width=300",
    type: "course",
  },
]

export default function LearnPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredClasses = mockMicroClasses.filter((mc) => {
    const matchesSearch =
      mc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mc.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeTab === "all" || mc.type === activeTab

    return matchesSearch && matchesCategory
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "course":
        return <GraduationCap className="h-4 w-4" />
      case "tutorial":
        return <Lightbulb className="h-4 w-4" />
      case "project":
        return <Code className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Learn & Explore</h1>
        <div className="relative w-full md:w-auto flex-grow md:flex-grow-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search micro-classes, tutorials, projects..."
            className="w-full pl-9 pr-4 py-2 rounded-md border border-input bg-background shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 h-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="course">Courses</TabsTrigger>
          <TabsTrigger value="tutorial">Tutorials</TabsTrigger>
          <TabsTrigger value="project">Projects</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-6">
          <Card className="flex flex-col items-center justify-center p-6 text-center border-2 border-dashed hover:border-primary transition-colors cursor-pointer">
            <PlusCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="text-xl">Build a New Micro-Class</CardTitle>
            <CardDescription>Share your knowledge and earn XP by creating a new learning module.</CardDescription>
            <Button asChild className="mt-4">
              <Link href="/micro-class-builder">Start Building</Link>
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClasses.length > 0 ? (
              filteredClasses.map((microClass) => (
                <Card
                  key={microClass.id}
                  className="flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative w-full h-48 bg-muted">
                    <Image
                      src={microClass.imageUrl || "/placeholder.svg"}
                      alt={microClass.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg"
                    />
                    <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-semibold">
                      {microClass.category}
                    </Badge>
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg font-semibold">{microClass.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                      {microClass.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex flex-col flex-grow justify-between">
                    <div className="flex items-center justify-between text-sm mb-3">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-yellow-500" />
                        <span>
                          {microClass.rating.toFixed(1)} ({microClass.reviews})
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        {getTypeIcon(microClass.type)}
                        <span>{microClass.type.charAt(0).toUpperCase() + microClass.type.slice(1)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={microClass.author.avatar || "/placeholder.svg"}
                            alt={microClass.author.name}
                          />
                          <AvatarFallback>{microClass.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{microClass.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                        <Zap className="h-4 w-4" /> {microClass.xpReward} XP
                      </div>
                    </div>
                    <Button className="w-full mt-3">Start Learning</Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-10">
                No micro-classes found matching your criteria.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
