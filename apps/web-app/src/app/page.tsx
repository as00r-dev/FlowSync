'use client'

import { useAuth } from '@/lib/hooks/useAuth'

export default function Home() {
  const { user, loading, loginWithGitHub, logout } = useAuth()

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
          {user.avatar_url && (
            <img 
              src={user.avatar_url} 
              alt={`${user.username}'s avatar`} 
              className="w-16 h-16 rounded-full mx-auto mb-4"
            />
          )}
          <button 
            onClick={logout}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Logout
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