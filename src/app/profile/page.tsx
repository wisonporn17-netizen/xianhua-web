'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [isPremium, setIsPremium] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [favorites, setFavorites] = useState<any[]>([])
  const [tab, setTab] = useState<'history' | 'favorites' | 'account'>('history')
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) { router.push('/auth'); return }
      setUser(data.user)

      // เช็ค Premium
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_premium, premium_until')
        .eq('id', data.user.id)
        .single()
      if (profile?.is_premium && new Date(profile.premium_until) > new Date()) {
        setIsPremium(true)
      }

      loadHistory(data.user.id)
      loadFavorites(data.user.id)
    }
    init()
  }, [])

  const loadHistory = async (uid: string) => {
    const { data } = await supabase
      .from('listening_history_latest')
      .select('*, novels(title, cover_url), episodes(title)')
      .eq('user_id', uid)
      .order('listened_at', { ascending: false })
      .limit(20)
    setHistory(data || [])
  }

  const loadFavorites = async (uid: string) => {
    const { data } = await supabase
      .from('favorites')
      .select('*, novels(id, title, cover_url)')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
    setFavorites(data || [])
  }

  const removeFavorite = async (novelId: string) => {
    await supabase.from('favorites').delete().eq('novel_id', novelId).eq('user_id', user.id)
    loadFavorites(user.id)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const tabBtn = (t: string) =>
    `px-4 py-2 text-sm rounded-lg transition-all ${tab === t ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* User Info */}
        <div className="flex items-center gap-4 mb-8 p-5 bg-white/5 rounded-2xl border border-white/10">
          <div className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center text-white text-xl font-bold">
            {user.email?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              {isPremium ? (
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                  ⭐ Premium
                </span>
              ) : (
                <span className="text-gray-400 text-xs">สมาชิกทั่วไป</span>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button className={tabBtn('history')} onClick={() => setTab('history')}>🕐 ประวัติการฟัง</button>
          <button className={tabBtn('favorites')} onClick={() => setTab('favorites')}>❤️ รายการโปรด</button>
          <button className={tabBtn('account')} onClick={() => setTab('account')}>⚙️ บัญชี</button>
        </div>

        {/* History */}
        {tab === 'history' && (
          <div className="space-y-2">
            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-10">ยังไม่มีประวัติการฟัง</p>
            ) : history.map((h) => (
              <Link key={h.id} href={`/novels/${h.novel_id}/episodes/${h.episode_id}`}
                className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all">
                <div className="w-10 h-10 rounded-lg bg-purple-900/50 flex items-center justify-center text-purple-300 text-lg">🎵</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{h.novels?.title}</p>
                  <p className="text-gray-400 text-xs truncate">{h.episodes?.title}</p>
                </div>
                <p className="text-gray-600 text-xs">{new Date(h.listened_at).toLocaleDateString('th-TH')}</p>
              </Link>
            ))}
          </div>
        )}

        {/* Favorites */}
        {tab === 'favorites' && (
          <div className="space-y-2">
            {favorites.length === 0 ? (
              <p className="text-gray-500 text-center py-10">ยังไม่มีรายการโปรด</p>
            ) : favorites.map((f) => (
              <div key={f.id} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <Link href={`/novels/${f.novel_id}`} className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-purple-900/50 flex items-center justify-center text-purple-300 text-lg">📖</div>
                  <p className="text-white text-sm font-medium truncate">{f.novels?.title}</p>
                </Link>
                <button onClick={() => removeFavorite(f.novel_id)} className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded-lg hover:bg-red-900/20 transition-all">ลบ</button>
              </div>
            ))}
          </div>
        )}

        {/* Account */}
        {tab === 'account' && (
          <div className="space-y-4">
            <div className="p-5 bg-white/5 rounded-xl border border-white/10">
              <p className="text-gray-400 text-sm mb-1">Email</p>
              <p className="text-white">{user.email}</p>
            </div>
            <div className="p-5 bg-white/5 rounded-xl border border-white/10">
              <p className="text-gray-400 text-sm mb-1">แพ็กเกจ</p>
              <p className="text-white">{isPremium ? '⭐ Premium — ฟังได้ทุกตอน' : 'สมาชิกทั่วไป (ฟรี)'}</p>
            </div>
            {!isPremium && (
              <div className="p-5 bg-purple-900/20 rounded-xl border border-purple-500/30">
                <p className="text-purple-300 text-sm font-medium mb-1">อัปเกรดเป็น Premium</p>
                <p className="text-gray-400 text-xs mb-3">ฟังได้ทุกตอน ไม่มีโฆษณา</p>
                <Link href="/auth" className="text-xs px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white transition-all">
                  สมัคร Premium
                </Link>
              </div>
            )}
            <button onClick={handleLogout} className="w-full py-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 transition-all">
              ออกจากระบบ
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
