'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from '@/components/ui/use-toast'
import { Zap, CircleDollarSign } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface XPurchaseModalProps {
  isOpen: boolean
  onClose: () => void
}

const xpPackages = [
  { id: 'small', xp: 1000, price: 10 },
  { id: 'medium', xp: 2500, price: 20 },
  { id: 'large', xp: 5000, price: 40 },
  { id: 'xlarge', xp: 10000, price: 75 },
]

export default function XPurchaseModal({ isOpen, onClose }: XPurchaseModalProps) {
  const { user, isAuthenticated } = useAuth()
  const [selectedPackage, setSelectedPackage] = useState<string>(xpPackages[0].id)
  const [customXPAmount, setCustomXPAmount] = useState<string>('')
  const [customXPPrice, setCustomXPPrice] = useState<number>(0)
  const [isCustom, setIsCustom] = useState(false)
  const [loading, setLoading] = useState(false)

  const currentPackage = xpPackages.find(p => p.id === selectedPackage)

  const handleCustomXPAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseInt(e.target.value)
    if (!isNaN(amount) && amount >= 0) {
      setCustomXPAmount(e.target.value)
      // Simple linear pricing for custom XP: 1 XP = $0.01
      setCustomXPPrice(amount * 0.01)
    } else {
      setCustomXPAmount('')
      setCustomXPPrice(0)
    }
  }

  const handlePurchase = () => {
    setLoading(true)
    
    if (!isAuthenticated || !user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to purchase XP.',
        variant: 'destructive',
      })
      setLoading(false)
      return
    }

    let xpToAward = 0
    let cost = 0

    if (isCustom) {
      xpToAward = parseInt(customXPAmount)
      cost = customXPPrice
      if (isNaN(xpToAward) || xpToAward <= 0) {
        toast({
          title: 'Invalid Amount',
          description: 'Please enter a valid custom XP amount.',
          variant: 'destructive',
        })
        setLoading(false)
        return
      }
    } else {
      if (!currentPackage) {
        toast({
          title: 'No Package Selected',
          description: 'Please select an XP package.',
          variant: 'destructive',
        })
        setLoading(false)
        return
      }
      xpToAward = currentPackage.xp
      cost = currentPackage.price
    }

    // Simulate payment processing
    toast({
      title: 'Processing Payment',
      description: `Attempting to purchase ${xpToAward} XP for $${cost.toFixed(2)}...`,
      variant: 'default',
    })

    setTimeout(() => {
      // Simulate success
      // In a real app, you'd update user XP via a backend/blockchain transaction
      const updatedUser = { ...user, xp: (user.xp || 0) + xpToAward }
      // This would typically be handled by the AuthProvider or a global state manager
      // For this mock, we'll just show a success toast.
      console.log('User XP updated:', updatedUser.xp)

      toast({
        title: 'Purchase Successful!',
        description: `You have successfully purchased ${xpToAward} XP for $${cost.toFixed(2)}. Your new XP total is ${updatedUser.xp}.`,
        variant: 'default',
        duration: 5000,
      })
      onClose()
      setIsCustom(false) // Reset to default view
      setCustomXPAmount('')
      setCustomXPPrice(0)
      setLoading(false)
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-500" /> Buy XP
          </DialogTitle>
          <DialogDescription>
            Gain experience points to unlock new features and boost your reputation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup
            value={isCustom ? 'custom' : selectedPackage}
            onValueChange={(value) => {
              if (value === 'custom') {
                setIsCustom(true)
              } else {
                setIsCustom(false)
                setSelectedPackage(value)
              }
            }}
            className="grid grid-cols-2 gap-4"
          >
            {xpPackages.map(pkg => (
              <div key={pkg.id}>
                <RadioGroupItem value={pkg.id} id={`package-${pkg.id}`} className="sr-only" />
                <Label
                  htmlFor={`package-${pkg.id}`}
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <Zap className="mb-2 h-6 w-6 text-yellow-500" />
                  <span className="text-xl font-bold">{pkg.xp} XP</span>
                  <span className="text-sm text-muted-foreground">${pkg.price}</span>
                </Label>
              </div>
            ))}
            <div>
              <RadioGroupItem value="custom" id="package-custom" className="sr-only" />
              <Label
                htmlFor="package-custom"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <CircleDollarSign className="mb-2 h-6 w-6 text-green-500" />
                <span className="text-xl font-bold">Custom XP</span>
                <span className="text-sm text-muted-foreground">Your Price</span>
              </Label>
            </div>
          </RadioGroup>

          {isCustom && (
            <div className="grid gap-2 mt-4">
              <Label htmlFor="custom-xp-amount">Enter XP Amount</Label>
              <Input
                id="custom-xp-amount"
                type="number"
                placeholder="e.g., 1500"
                value={customXPAmount}
                onChange={handleCustomXPAmountChange}
              />
              {customXPAmount && (
                <p className="text-sm text-muted-foreground">
                  Estimated Cost: ${customXPPrice.toFixed(2)}
                </p>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handlePurchase} disabled={loading || (isCustom && (!customXPAmount || customXPPrice <= 0))}>
            {loading ? 'Processing...' : `Purchase ${isCustom ? `${customXPAmount} XP` : `${currentPackage?.xp} XP`} for $${isCustom ? customXPPrice.toFixed(2) : currentPackage?.price.toFixed(2)}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
