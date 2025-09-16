'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { useEffect } from 'react'

export default function Home() {
  const { user, loading, loginWithGitHub, logout } = useAuth()

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (user && !loading) {
      window.location.href = '/dashboard'
    }
  }, [user, loading])

  // Check for OAuth errors in URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const error = urlParams.get('error')
    const message = urlParams.get('message')
    
    if (error) {
      // Display error message to user
      alert(`OAuth Error: ${message || 'Authentication failed'}`)
      // Remove error parameters from URL
      window.history.replaceState({}, document.title, '/')
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome, {user.username}!</h1>
          <p className="text-gray-600 mb-4">Redirecting to dashboard...</p>
          {user.avatar_url && (
            <img 
              src={user.avatar_url} 
              alt={`${user.username}'s avatar`} 
              className="w-16 h-16 rounded-full mx-auto mb-4"
            />
          )}
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">FlowSync AI</h1>
        <p className="text-gray-600 mb-8">The Verifiable Coordination Layer for Modern Product Teams</p>
        <button 
          onClick={loginWithGitHub}
          className="bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-700"
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  )
}