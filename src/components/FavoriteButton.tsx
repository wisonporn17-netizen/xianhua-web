'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function FavoriteButton({ novelId }: { novelId: string }) {
  const [isFav, setIsFav] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const check = async () => {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) return
      const { data } = await supabase.from('favorites').select('id').eq('user_id', userData.user.id).eq('novel_id', novelId).single()
      setIsFav(!!data)
    }
    check()
  }, [novelId])

  const toggle = async () => {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) { router.push('/auth'); return }
    setLoading(true)
    if (isFav) {
      await supabase.from('favorites').delete().eq('user_id', userData.user.id).eq('novel_id', novelId)
      setIsFav(false)
    } else {
      await supabase.from('favorites').insert({ user_id: userData.user.id, novel_id: novelId })
      setIsFav(true)
    }
    setLoading(false)
  }

  return (
    <button onClick={toggle} disabled={loading}
      className={`flex items-center gap-2 px-6 py-3 rounded-full border font-medium transition-all ${
        isFav ? 'border-red-500/50 bg-red-500/10 text-red-400' : 'border-white/20 hover:border-white/40 text-white'
      }`}>
      {isFav ? '❤️' : '🤍'} รายการโปรด
    </button>
  )
}
