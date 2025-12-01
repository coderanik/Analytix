"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'

interface User {
  _id: string
  name: string
  email: string
  role: string
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role?: string, country?: string, currency?: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored token and user on mount
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Error parsing stored user:', e)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }

    // Verify token is still valid
    if (storedToken) {
      api.getCurrentUser()
        .then((userData) => {
          setUser(userData)
          localStorage.setItem('user', JSON.stringify(userData))
        })
        .catch(() => {
          // Token invalid, clear storage
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setToken(null)
          setUser(null)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login(email, password)
      setToken(response.token)
      setUser({
        _id: response._id,
        name: response.name,
        email: response.email,
        role: response.role,
      })
      
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify({
        _id: response._id,
        name: response.name,
        email: response.email,
        role: response.role,
      }))

      // Fetch full user data
      const userData = await api.getCurrentUser()
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (error: any) {
      throw new Error(error.message || 'Login failed')
    }
  }

  const register = async (name: string, email: string, password: string, role?: string, country?: string, currency?: string) => {
    try {
      const response = await api.register(name, email, password, role, country, currency)
      setToken(response.token)
      setUser({
        _id: response._id,
        name: response.name,
        email: response.email,
        role: response.role,
      })
      
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify({
        _id: response._id,
        name: response.name,
        email: response.email,
        role: response.role,
      }))

      // Fetch full user data
      const userData = await api.getCurrentUser()
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed')
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

