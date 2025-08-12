"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ForumTopLevelRedirectNotice() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the first available forum or a default forum
    // This is a placeholder - adjust the redirect path as needed
    router.replace("/forum/general")
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to the forum...</p>
      </div>
    </div>
  )
}
