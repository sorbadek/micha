'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Star, BookOpen, Video, Code, Music, ImageIcon, Save } from 'lucide-react'
import Image from 'next/image'
import { toast } from '@/components/ui/use-toast'

interface MarketplaceItem {
  id: string
  title: string
  description: string
  price: number
  xpReward: number
  category: string
  type: 'course' | 'tutorial' | 'resource' | 'template' | 'tool'
  imageUrl: string
  rating: number
  reviews: number
}

const marketplaceItems: MarketplaceItem[] = [
  {
    id: '1',
    title: 'Introduction to Web3 Development',
    description: 'Learn the basics of decentralized application development on the Internet Computer.',
    price: 100,
    xpReward: 500,
    category: 'Blockchain',
    type: 'course',
    imageUrl: '/web3-development.png',
    rating: 4.8,
    reviews: 120,
  },
  {
    id: '2',
    title: 'Rust Ownership & Borrowing Deep Dive',
    description: 'Master Rust\'s core concepts for safe and performant code.',
    price: 75,
    xpReward: 300,
    category: 'Programming',
    type: 'tutorial',
    imageUrl: '/rust-ownership-thumbnail.png',
    rating: 4.9,
    reviews: 90,
  },
  {
    id: '3',
    title: 'Advanced React Hooks Handbook',
    description: 'A comprehensive guide to custom hooks and state management in React.',
    price: 50,
    xpReward: 200,
    category: 'Frontend',
    type: 'resource',
    imageUrl: '/react-hooks-handbook.png',
    rating: 4.7,
    reviews: 150,
  },
  {
    id: '4',
    title: 'Next.js Performance Optimization Checklist',
    description: 'A practical checklist to optimize your Next.js applications for speed.',
    price: 30,
    xpReward: 100,
    category: 'Web Development',
    type: 'template',
    imageUrl: '/nextjs-optimization.png',
    rating: 4.5,
    reviews: 70,
  },
  {
    id: '5',
    title: 'Decentralized Chat App Template',
    description: 'A starter template for building a real-time chat application on ICP.',
    price: 120,
    xpReward: 600,
    category: 'Blockchain',
    type: 'template',
    imageUrl: '/decentralized-chat-app.png',
    rating: 4.6,
    reviews: 80,
  },
  {
    id: '6',
    title: 'UI/UX Design Principles for DApps',
    description: 'Learn to design user-friendly interfaces for decentralized applications.',
    price: 60,
    xpReward: 250,
    category: 'Design',
    type: 'course',
    imageUrl: '/dapp-ui-ux.png',
    rating: 4.7,
    reviews: 110,
  },
  {
    id: '7',
    title: 'Solidity Smart Contract Best Practices',
    description: 'Guidelines and patterns for writing secure and efficient Solidity contracts.',
    price: 90,
    xpReward: 400,
    category: 'Blockchain',
    type: 'resource',
    imageUrl: '/solidity-best-practices.png',
    rating: 4.8,
    reviews: 95,
  },
  {
    id: '8',
    title: 'Introduction to Machine Learning with Python',
    description: 'A beginner-friendly course covering fundamental ML concepts and libraries.',
    price: 110,
    xpReward: 550,
    category: 'Data Science',
    type: 'course',
    imageUrl: '/machine-learning-python.png',
    rating: 4.7,
    reviews: 130,
  },
]

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [savedItems, setSavedItems] = useState<MarketplaceItem[]>([])

  useEffect(() => {
    const storedVaultItems = localStorage.getItem('peerverse_vault_items')
    if (storedVaultItems) {
      setSavedItems(JSON.parse(storedVaultItems))
    }
  }, [])

  const handleAccess = (item: MarketplaceItem) => {
    const isAlreadySaved = savedItems.some(savedItem => savedItem.id === item.id)

    if (isAlreadySaved) {
      toast({
        title: 'Already in Vault',
        description: `${item.title} is already in your Vault!`,
        variant: 'default',
      })
    } else {
      const newItem = { ...item, progress: 0, savedDate: new Date().toISOString() }
      const updatedSavedItems = [...savedItems, newItem]
      setSavedItems(updatedSavedItems)
      localStorage.setItem('peerverse_vault_items', JSON.stringify(updatedSavedItems))
      toast({
        title: 'Added to Vault',
        description: `${item.title} has been added to your Vault!`,
        variant: 'success',
      })
    }
  }

  const filteredItems = marketplaceItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeTab === 'all' || item.type === activeTab

    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <BookOpen className="h-5 w-5 text-primary" />
      case 'tutorial':
        return <Video className="h-5 w-5 text-primary" />
      case 'resource':
        return <ImageIcon className="h-5 w-5 text-primary" />
      case 'template':
        return <Code className="h-5 w-5 text-primary" />
      case 'tool':
        return <Music className="h-5 w-5 text-primary" /> // Placeholder, adjust as needed
      default:
        return <BookOpen className="h-5 w-5 text-primary" />
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <div className="relative w-full md:w-auto flex-grow md:flex-grow-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search courses, resources, and more..."
            className="w-full pl-9 pr-4 py-2 rounded-md border border-input bg-background shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-6 h-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="course">Courses</TabsTrigger>
          <TabsTrigger value="tutorial">Tutorials</TabsTrigger>
          <TabsTrigger value="resource">Resources</TabsTrigger>
          <TabsTrigger value="template">Templates</TabsTrigger>
          <TabsTrigger value="tool">Tools</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <Card key={item.id} className="flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative w-full h-48 bg-muted">
                    <Image
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-t-lg"
                    />
                    <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-semibold">
                      {item.category}
                    </Badge>
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg font-semibold">{item.title}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex flex-col flex-grow justify-between">
                    <div className="flex items-center justify-between text-sm mb-3">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-yellow-500" />
                        <span>{item.rating.toFixed(1)} ({item.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        {getCategoryIcon(item.type)}
                        <span>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-lg font-bold text-primary">${item.price}</span>
                      <Button
                        onClick={() => handleAccess(item)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <Save className="h-4 w-4 mr-2" /> Access
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-10">
                No items found matching your criteria.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
