'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const ADMIN_EMAILS = ['wisonporn2517@gmail.com']

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [allowed, setAllowed] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user && ADMIN_EMAILS.includes(data.user.email || '')) {
        setAllowed(true)
      } else {
        router.push('/')
      }
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/20 border-t-purple-500 rounded-full animate-spin" />
    </div>
  )

  if (!allowed) return null
  return <>{children}</>
}
