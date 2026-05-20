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
  const [tab, setTab] = useState('history')
  const [totalMinutes, setTotalMinutes] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) { router.push('/auth'); return }
      setUser(data.user)

      const { data: profile } = await supabase.from('profiles').select('is_premium, premium_until').eq('id', data.user.id).single()
      if (profile?.is_premium && new Date(profile.premium_until) > new Date()) setIsPremium(true)

      // โหลดประวัติ
      const { data: hist } = await supabase
        .from('listening_history_latest')
        .select('*, novels(title, cover_url), episodes(title)')
        .eq('user_id', data.user.id)
        .order('listened_at', { ascending: false })
        .limit(20)
      setHistory(hist || [])

      // คำนวณเวลาฟังรวม
      const total = (hist || []).reduce((sum: number, h: any) => sum + (h.playback_position || 0), 0)
      setTotalMinutes(Math.floor(total / 60))

      // โหลด favorites
      const { data: favs } = await supabase
        .from('favorites')
        .select('*, novels(id, title, cover_url)')
        .eq('user_id', data.user.id)
        .order('created_at', { ascending: false })
      setFavorites(favs || [])
    }
    init()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return h > 0 ? `${h} ชม. ${m} นาที` : `${m} นาที`
  }

  const formatProgress = (pos: number, dur: number) => {
    const p = Math.floor(pos / 60)
    const d = Math.floor(dur / 60)
    return `${p}:${String(Math.floor(pos % 60)).padStart(2,'0')} / ${d}:${String(Math.floor(dur % 60)).padStart(2,'0')}`
  }

  const menuItems = [
    { id: 'history', icon: '🕐', label: 'ประวัติการฟัง' },
    { id: 'favorites', icon: '❤️', label: 'รายการโปรด' },
    { id: 'account', icon: '⚙️', label: 'การตั้งค่า' },
  ]

  if (!user) return null

  const joinDate = new Date(user.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {user.email?.[0]?.toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                <p className="text-white font-bold text-lg">{user.email}</p>
                {isPremium ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">⭐ Premium</span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-500/20 text-gray-400 border border-gray-500/30">สมาชิกทั่วไป</span>
                )}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-6 mt-3">
                <div className="text-center">
                  <p className="text-gray-400 text-xs">เป็นสมาชิกตั้งแต่</p>
                  <p className="text-white text-sm font-medium">{joinDate}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs">ฟังรวม</p>
                  <p className="text-white text-sm font-medium">{formatTime(totalMinutes)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs">รายการโปรด</p>
                  <p className="text-white text-sm font-medium">{favorites.length} เรื่อง</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs">ฟังแล้ว</p>
                  <p className="text-white text-sm font-medium">{history.length} ตอน</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-56 flex-shrink-0 hidden md:block">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-3 space-y-1">
              {menuItems.map((item) => (
                <button key={item.id} onClick={() => setTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                    tab === item.id ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}>
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
              <div className="border-t border-white/10 pt-1 mt-1">
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-900/20 transition-all">
                  <span>🚪</span>
                  <span>ออกจากระบบ</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile tabs */}
            <div className="flex gap-2 mb-4 md:hidden">
              {menuItems.map((item) => (
                <button key={item.id} onClick={() => setTab(item.id)}
                  className={`px-3 py-2 text-xs rounded-lg transition-all ${tab === item.id ? 'bg-purple-600 text-white' : 'text-gray-400 bg-white/5'}`}>
                  {item.icon} {item.label}
                </button>
              ))}
            </div>

            {/* History */}
            {tab === 'history' && (
              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10">
                  <h2 className="text-white font-semibold">ประวัติการฟังล่าสุด</h2>
                </div>
                {history.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">ยังไม่มีประวัติการฟัง</p>
                ) : (
                  <div className="divide-y divide-white/5">
                    {history.map((h) => {
                      const progress = h.playback_position && h.episodes?.duration
                        ? (h.playback_position / h.episodes.duration) * 100 : 0;
                      return (
                        <Link key={h.id} href={`/novels/${h.novel_id}/episodes/${h.episode_id}`}
                          className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-all group">
                          {/* Cover */}
                          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-purple-900/50">
                            {h.novels?.cover_url ? (
                              <img src={h.novels.cover_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-purple-300">🎵</div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate group-hover:text-purple-300 transition-colors">{h.novels?.title}</p>
                            <p className="text-gray-400 text-xs truncate mb-2">{h.episodes?.title}</p>
                            {/* Progress bar */}
                            <div className="h-1 bg-white/10 rounded-full w-48 max-w-full">
                              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }} />
                            </div>
                          </div>

                          {/* Time */}
                          <div className="text-right flex-shrink-0">
                            <p className="text-gray-400 text-xs">{new Date(h.listened_at).toLocaleDateString('th-TH')}</p>
                            {h.playback_position > 0 && (
                              <p className="text-gray-500 text-xs mt-1">{Math.floor(h.playback_position / 60)} นาที</p>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Favorites */}
            {tab === 'favorites' && (
              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10">
                  <h2 className="text-white font-semibold">รายการโปรด</h2>
                </div>
                {favorites.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">ยังไม่มีรายการโปรด</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-6">
                    {favorites.map((f) => (
                      <Link key={f.id} href={`/novels/${f.novel_id}`}
                        className="group flex flex-col rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all bg-white/5">
                        <div className="aspect-[3/4] relative overflow-hidden">
                          {f.novels?.cover_url ? (
                            <img src={f.novels.cover_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full bg-purple-900 flex items-center justify-center text-2xl">📖</div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-white text-xs font-medium truncate">{f.novels?.title}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Account */}
            {tab === 'account' && (
              <div className="space-y-4">
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                  <h2 className="text-white font-semibold mb-4">ข้อมูลบัญชี</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Email</p>
                      <p className="text-white">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">แพ็กเกจ</p>
                      <p className="text-white">{isPremium ? '⭐ Premium — ฟังได้ทุกตอน' : 'สมาชิกทั่วไป (ฟรี)'}</p>
                    </div>
                  </div>
                </div>

                {!isPremium && (
                  <div className="bg-purple-900/20 rounded-2xl border border-purple-500/30 p-6">
                    <h3 className="text-purple-300 font-semibold mb-2">อัปเกรดเป็น Premium</h3>
                    <p className="text-gray-400 text-sm mb-4">ฟังได้ทุกตอน ไม่มีโฆษณา เพียง 79 บาท/เดือน</p>
                    <button className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-all">
                      สมัคร Premium
                    </button>
                  </div>
                )}

                <button onClick={handleLogout}
                  className="w-full py-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 transition-all">
                  ออกจากระบบ
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
