'use client'

import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    // Redirect to login page
    window.location.href = '/login'
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="text-center">
        <p className="text-white text-lg">Redirecting to Legal AI Guide...</p>
      </div>
    </div>
  )
}
