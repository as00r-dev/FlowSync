'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Dashboard() {
  const { user, loading, logout } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">You need to be logged in to access the dashboard.</p>
          <Link href="/" className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">FlowSync Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Link href="/projects" className="text-gray-700 hover:text-gray-900">
              Projects
            </Link>
            {user.avatar_url && (
              <img 
                src={user.avatar_url} 
                alt={`${user.username}'s avatar`} 
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="text-gray-700">{user.username}</span>
            <button 
              onClick={logout}
              className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to FlowSync AI</h2>
                <p className="text-gray-600 mb-4">This is your dashboard where you can manage your projects and track progress.</p>
                <Link 
                  href="/projects" 
                  className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  View Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}