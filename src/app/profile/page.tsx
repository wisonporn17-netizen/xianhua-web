'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [isPremium, setIsPremium] = useState(false)
  const [premiumUntil, setPremiumUntil] = useState<string>('')
  const [history, setHistory] = useState<any[]>([])
  const [favorites, setFavorites] = useState<any[]>([])
  const [tab, setTab] = useState('history')
  const [totalSeconds, setTotalSeconds] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) { router.push('/auth'); return }
      setUser(data.user)

      const { data: profile } = await supabase.from('profiles').select('is_premium, premium_until').eq('id', data.user.id).single()
      if (profile?.is_premium && new Date(profile.premium_until) > new Date()) {
        setIsPremium(true)
        setPremiumUntil(new Date(profile.premium_until).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }))
      }

      const { data: hist } = await supabase
        .from('listening_history_latest')
        .select('*, novels(title, cover_url), episodes(title)')
        .eq('user_id', data.user.id)
        .order('listened_at', { ascending: false })
        .limit(20)
      setHistory(hist || [])
      setTotalSeconds((hist || []).reduce((sum: number, h: any) => sum + (h.playback_position || 0), 0))

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

  const fmtTime = (sec: number) => {
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    return h > 0 ? `${h} ชม. ${m} นาที` : `${m} นาที`
  }

  const joinDate = user ? new Date(user.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

  // mock weekly data
  const weekDays = ['จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.', 'อา.']
  const weekData = [45, 120, 30, 90, 60, 180, 75]
  const maxVal = Math.max(...weekData)

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Premium Banner */}
        {isPremium && (
          <div className="relative rounded-2xl overflow-hidden mb-6 p-6 border border-yellow-500/20"
            style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #1a0a2e 100%)' }}>
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 80% 50%, #8b5cf6 0%, transparent 50%)' }} />
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar + Info */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                    {user.email?.[0]?.toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center text-sm">👑</div>
                </div>
                <div>
                  <p className="text-white font-bold text-xl">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/40">⭐ สมาชิกพรีเมียม</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 md:ml-8">
                <div>
                  <p className="text-gray-400 text-xs">สมาชิกตั้งแต่</p>
                  <p className="text-white font-medium">{joinDate}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">แพ็กเกจ</p>
                  <p className="text-yellow-400 font-medium">Premium Plus</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">ต่ออายุอัตโนมัติ</p>
                  <p className="text-white font-medium">{fmtTime(totalSeconds)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">วันต่ออายุ</p>
                  <p className="text-white font-medium">{premiumUntil}</p>
                </div>
              </div>

              {/* VIP Card */}
              <div className="md:ml-auto flex items-center gap-4 bg-black/30 rounded-xl p-4 border border-yellow-500/20">
                <div className="text-5xl">👑</div>
                <div>
                  <p className="text-yellow-400 font-bold">Premium Plus</p>
                  <p className="text-gray-400 text-xs">ประสบการณ์การฟังระดับพรีเมียม</p>
                  <button className="mt-2 text-xs px-3 py-1.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30 transition-all">
                    จัดการสมาชิก →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Non-premium header */}
        {!isPremium && (
          <div className="bg-white/5 rounded-2xl border border-white/10 p-5 mb-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {user.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-white font-bold">{user.email}</p>
              <p className="text-gray-400 text-sm">สมาชิกทั่วไป · สมาชิกตั้งแต่ {joinDate}</p>
            </div>
            <Link href="/auth" className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-all">
              อัปเกรด Premium
            </Link>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Benefits */}
            {isPremium && (
              <div className="bg-white/5 rounded-2xl border border-yellow-500/20 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-yellow-400">👑</span>
                  <h3 className="text-white font-semibold text-sm">สิทธิพิเศษสมาชิก</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: '🚫', title: 'ไม่มีโฆษณา', desc: 'ฟังได้อย่างเต็มที่ไม่มีสะดุด' },
                    { icon: '⬇️', title: 'ดาวน์โหลดออฟไลน์', desc: 'ฟังได้ทุกที่ ไม่ต้องใช้อินเทอร์เน็ต' },
                    { icon: '🎙️', title: 'เสียงคุณภาพสูง', desc: 'เสียงคมชัดระดับพรีเมียม' },
                    { icon: '⚡', title: 'ฟังได้ก่อนใคร', desc: 'เข้าถึงนิยายและตอนใหม่ก่อนใคร' },
                  ].map((b, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-900/50 flex items-center justify-center flex-shrink-0 text-sm">{b.icon}</div>
                      <div>
                        <p className="text-white text-xs font-medium">{b.title}</p>
                        <p className="text-gray-500 text-[10px]">{b.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Points */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
              <h3 className="text-white font-semibold text-sm mb-3">พอยท์สะสม</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{history.length * 10 + Math.floor(totalSeconds / 60)}</p>
                  <p className="text-gray-400 text-xs">พอยท์</p>
                </div>
                <div className="text-4xl">⭐</div>
              </div>
              <p className="text-gray-500 text-xs mt-2">แลกรับสิทธิพิเศษและของรางวัลได้ที่</p>
            </div>

            {/* Logout */}
            <button onClick={handleLogout}
              className="w-full py-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 transition-all text-sm">
              🚪 ออกจากระบบ
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Tabs */}
            <div className="flex gap-2">
              {[
                { id: 'history', label: '📊 ประวัติการฟัง' },
                { id: 'favorites', label: '❤️ รายการโปรด' },
                { id: 'account', label: '⚙️ บัญชี' },
              ].map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`px-4 py-2 text-sm rounded-xl transition-all ${tab === t.id ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white bg-white/5'}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* History */}
            {tab === 'history' && (
              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                  <h2 className="text-white font-semibold">ประวัติการฟังล่าสุด</h2>
                  <span className="text-gray-500 text-xs">{history.length} รายการ</span>
                </div>
                {history.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">ยังไม่มีประวัติการฟัง</p>
                ) : history.map((h) => (
                  <Link key={h.id} href={`/novels/${h.novel_id}/episodes/${h.episode_id}`}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-all group border-b border-white/5 last:border-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-purple-900/50">
                      {h.novels?.cover_url
                        ? <img src={h.novels.cover_url} alt="" className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-purple-300">🎵</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate group-hover:text-purple-300">{h.novels?.title}</p>
                      <p className="text-gray-400 text-xs truncate mb-1.5">{h.episodes?.title}</p>
                      <div className="flex items-center gap-2">
                        <div className="h-1 bg-white/10 rounded-full flex-1 max-w-32">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min((h.playback_position / 3600) * 100, 100)}%` }} />
                        </div>
                        <span className="text-gray-500 text-[10px]">{Math.floor(h.playback_position / 60)} นาที</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-gray-500 text-xs">{new Date(h.listened_at).toLocaleDateString('th-TH')}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Favorites */}
            {tab === 'favorites' && (
              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                <div className="px-5 py-4 border-b border-white/10">
                  <h2 className="text-white font-semibold">รายการโปรด</h2>
                </div>
                {favorites.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">ยังไม่มีรายการโปรด</p>
                ) : (
                  <div className="grid grid-cols-3 gap-3 p-5">
                    {favorites.map((f) => (
                      <Link key={f.id} href={`/novels/${f.novel_id}`}
                        className="group rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all">
                        <div className="aspect-[3/4] relative overflow-hidden bg-purple-900/50">
                          {f.novels?.cover_url
                            ? <img src={f.novels.cover_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            : <div className="w-full h-full flex items-center justify-center text-2xl">📖</div>}
                        </div>
                        <div className="p-2 bg-black/20">
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
                <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
                  <h2 className="text-white font-semibold mb-4">ข้อมูลบัญชี</h2>
                  <div className="space-y-3">
                    <div><p className="text-gray-400 text-xs mb-1">Email</p><p className="text-white">{user.email}</p></div>
                    <div><p className="text-gray-400 text-xs mb-1">สมาชิกตั้งแต่</p><p className="text-white">{joinDate}</p></div>
                    <div><p className="text-gray-400 text-xs mb-1">แพ็กเกจ</p>
                      <p className="text-white">{isPremium ? '⭐ Premium Plus' : 'สมาชิกทั่วไป (ฟรี)'}</p>
                    </div>
                    {isPremium && <div><p className="text-gray-400 text-xs mb-1">หมดอายุ</p><p className="text-white">{premiumUntil}</p></div>}
                  </div>
                </div>
                {!isPremium && (
                  <div className="bg-purple-900/20 rounded-2xl border border-purple-500/30 p-5">
                    <p className="text-purple-300 font-semibold mb-1">อัปเกรดเป็น Premium</p>
                    <p className="text-gray-400 text-sm mb-3">ฟังได้ทุกตอน ไม่มีโฆษณา เพียง 79 บาท/เดือน</p>
                    <button className="px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-all">สมัคร Premium</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Stats */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold text-sm">สถิติการฟัง</h3>
                <span className="text-gray-500 text-xs">7 วันที่ผ่านมา</span>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{fmtTime(Math.floor(totalSeconds / 60))}</p>
              <p className="text-gray-400 text-xs mb-4">เวลารวมที่ฟัง</p>
              {/* Bar chart */}
              <div className="flex items-end justify-between gap-1 h-16">
                {weekData.map((val, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full rounded-t-sm bg-purple-500/50 hover:bg-purple-500 transition-colors"
                      style={{ height: `${(val / maxVal) * 48}px` }} />
                    <span className="text-[9px] text-gray-500">{weekDays[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Favorites list */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold text-sm">❤️ รายการโปรด</h3>
                <button onClick={() => setTab('favorites')} className="text-purple-400 text-xs hover:text-purple-300">ดูทั้งหมด</button>
              </div>
              {favorites.slice(0, 3).map((f) => (
                <Link key={f.id} href={`/novels/${f.novel_id}`}
                  className="flex items-center gap-3 py-2 hover:opacity-80 transition-all">
                  <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-purple-900/50">
                    {f.novels?.cover_url
                      ? <img src={f.novels.cover_url} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-xs">📖</div>}
                  </div>
                  <p className="text-white text-xs truncate flex-1">{f.novels?.title}</p>
                </Link>
              ))}
              {favorites.length === 0 && <p className="text-gray-500 text-xs text-center py-2">ยังไม่มีรายการโปรด</p>}
            </div>

            {/* Achievements */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-5">
              <h3 className="text-white font-semibold text-sm mb-3">🏆 ความสำเร็จ</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: '🎧', label: 'นักฟัง', unlocked: totalSeconds > 60 },
                  { icon: '👑', label: 'เซียนตัวจริง', unlocked: isPremium },
                  { icon: '🎖️', label: 'นักสะสม', unlocked: favorites.length >= 3 },
                ].map((a, i) => (
                  <div key={i} className={`flex flex-col items-center p-2 rounded-xl border ${a.unlocked ? 'border-yellow-500/30 bg-yellow-500/10' : 'border-white/5 bg-white/5 opacity-40'}`}>
                    <span className="text-2xl mb-1">{a.icon}</span>
                    <span className="text-[9px] text-center text-gray-400">{a.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
