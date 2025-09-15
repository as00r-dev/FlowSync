'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { useEffect } from 'react'

export default function Dashboard() {
  const { user, loading } = useAuth()

  useEffect(() => {
    // Redirect to home page if not authenticated
    if (!loading && !user) {
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    }
  }, [user, loading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">FlowSync Dashboard</h1>
          <div className="flex items-center space-x-4">
            {user.avatar_url && (
              <img 
                src={user.avatar_url} 
                alt={`${user.username}'s avatar`} 
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-gray-700">{user.username}</span>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <p className="text-gray-500">Dashboard content will go here</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}