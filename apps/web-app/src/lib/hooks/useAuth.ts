'use client'

import { useState, useEffect } from 'react'
import { apiCall } from '@/lib/utils/api'

interface User {
  id: number
  github_id: number
  username: string
  email?: string
  avatar_url?: string
  created_at?: string
  updated_at?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiCall('/api/auth/me')
        setUser(data.user)
      } catch (error) {
        // Not authenticated
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const loginWithGitHub = () => {
    window.location.href = '/api/auth/github'
  }

  const logout = async () => {
    try {
      await apiCall('/api/auth/logout', { method: 'POST' })
      setUser(null)
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return { user, loading, loginWithGitHub, logout }
}