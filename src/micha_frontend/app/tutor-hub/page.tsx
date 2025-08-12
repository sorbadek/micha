'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Search, Video, Calendar, Clock, MapPin, Users, DollarSign, PlusCircle, Lightbulb, MessageSquare, Star } from 'lucide-react'
import Link from 'next/link'
import SessionCreationModal from '@/components/session-creation-modal'

interface Session {
  id: string
  title: string
  description: string
  host: {
    name: string
    avatar: string
    username: string
    rating: number
  }
  date: string
  time: string
  duration: number // in minutes
  maxAttendees: number
  currentAttendees: number
  price: number // in XP
  isOnline: boolean
  location: string
  type: 'live' | 'q&a' | 'workshop'
  tags: string[]
}

const mockSessions: Session[] = [
  {
    id: 's1',
    title: 'Mastering Motoko Basics',
    description: 'A comprehensive live class covering the fundamentals of Motoko programming for ICP smart contracts.',
    host: { name: 'Alice Johnson', avatar: '/alice-johnson-avatar.png', username: 'alice_j', rating: 4.9 },
    date: '2024-08-15',
    time: '10:00 AM UTC',
    duration: 90,
    maxAttendees: 50,
    currentAttendees: 35,
    price: 100,
    isOnline: true,
    location: 'Online',
    type: 'live',
    tags: ['Motoko', 'ICP', 'Smart Contracts'],
  },
  {
    id: 's2',
    title: 'Q&A: Frontend Development with Azle',
    description: 'An interactive Q&A session to answer your questions about building frontends for ICP dApps using Azle (TypeScript/JavaScript).',
    host: { name: 'Bob Williams', avatar: '/bob-williams-avatar.png', username: 'bob_w', rating: 4.7 },
    date: '2024-08-17',
    time: '02:00 PM UTC',
    duration: 60,
    maxAttendees: 30,
    currentAttendees: 20,
    price: 50,
    isOnline: true,
    location: 'Online',
    type: 'q&a',
    tags: ['Azle', 'Frontend', 'ICP', 'TypeScript'],
  },
  {
    id: 's3',
    title: 'Rust Ownership & Borrowing Workshop',
    description: 'A hands-on workshop to solidify your understanding of Rust\'s unique ownership and borrowing system.',
    host: { name: 'Sarah Chen', avatar: '/sarah-chen-avatar.png', username: 'sarah_c', rating: 4.8 },
    date: '2024-08-20',
    time: '06:00 PM Local',
    duration: 120,
    maxAttendees: 15,
    currentAttendees: 10,
    price: 150,
    isOnline: false,
    location: 'Community Hub, City Center',
    type: 'workshop',
    tags: ['Rust', 'Programming', 'Workshop'],
  },
  {
    id: 's4',
    title: 'Introduction to Canister Upgrades',
    description: 'Learn the process and best practices for upgrading your ICP canisters without downtime.',
    host: { name: 'Michael Lee', avatar: '/michael-lee-avatar.png', username: 'michael_l', rating: 4.6 },
    date: '2024-08-22',
    time: '09:00 AM UTC',
    duration: 75,
    maxAttendees: 40,
    currentAttendees: 28,
    price: 80,
    isOnline: true,
    location: 'Online',
    type: 'live',
    tags: ['ICP', 'Deployment', 'Canisters'],
  },
]

export default function TutorHubPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [isSessionCreationModalOpen, setIsSessionCreationModalOpen] = useState(false)

  const filteredSessions = mockSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          session.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          session.host.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          session.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = activeTab === 'all' || session.type === activeTab

    return matchesSearch && matchesType
  })

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'live':
        return <Video className="h-4 w-4 text-red-500" />
      case 'q&a':
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case 'workshop':
        return <Lightbulb className="h-4 w-4 text-purple-500" />
      default:
        return <Video className="h-4 w-4" />
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Tutor Hub</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button onClick={() => setIsSessionCreationModalOpen(true)} className="w-full sm:w-auto">
            <PlusCircle className="h-4 w-4 mr-2" /> Create Session
          </Button>
          <div className="relative w-full sm:w-auto flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search sessions or hosts..."
              className="w-full pl-9 pr-4 py-2 rounded-md border border-input bg-background shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 h-auto">
          <TabsTrigger value="all">All Sessions</TabsTrigger>
          <TabsTrigger value="live">Live Classes</TabsTrigger>
          <TabsTrigger value="q&a">Q&A Sessions</TabsTrigger>
          <TabsTrigger value="workshop">Workshops</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSessions.length > 0 ? (
              filteredSessions.map(session => (
                <Card key={session.id} className="flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg font-semibold">{session.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs flex items-center gap-1">
                        {getSessionTypeIcon(session.type)} {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                      {session.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex flex-col flex-grow justify-between">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session.host.avatar || "/placeholder.svg"} alt={session.host.name} />
                        <AvatarFallback>{session.host.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{session.host.name}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 mr-1" /> {session.host.rating.toFixed(1)}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> {session.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {session.time} ({session.duration} min)
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" /> {session.currentAttendees}/{session.maxAttendees}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" /> {session.location}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {session.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-lg font-bold text-primary flex items-center gap-1">
                        <DollarSign className="h-5 w-5" /> {session.price} XP
                      </span>
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        Join Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-10">
                No sessions found matching your criteria.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      <SessionCreationModal isOpen={isSessionCreationModalOpen} onClose={() => setIsSessionCreationModalOpen(false)} />
    </div>
  )
}
