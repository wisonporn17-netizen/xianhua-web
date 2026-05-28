'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import AdminGuard from '@/components/AdminGuard'

type Episode = { id: string; title: string; ep_num: number; audio_url: string; is_free: boolean }
type Novel = { id: string; title: string; subtitle: string; description: string; cover_url: string; episodes: Episode[] }

const empty = (): Novel => ({ id: '', title: '', subtitle: '', description: '', cover_url: '', episodes: [] })

export default function AdminPage() {
  const [novels, setNovels] = useState<Novel[]>([])
  const [form, setForm] = useState<Novel>(empty())
  const [epForm, setEpForm] = useState({ id: '', title: '', ep_num: 1, audio_url: '', is_free: false })
  const [editing, setEditing] = useState<string | null>(null)
  const [msg, setMsg] = useState('')

  const load = async () => {
    const { data } = await supabase.from('novels').select('*, episodes(*)').order('created_at')
    setNovels(data || [])
  }

  useEffect(() => { load() }, [])

  const saveNovel = async () => {
    if (!form.id || !form.title) return setMsg('กรุณาใส่ ID และชื่อนิยาย')
    const { error } = await supabase.from('novels').upsert({
      id: form.id, title: form.title, subtitle: form.subtitle,
      description: form.description, cover_url: form.cover_url
    })
    if (error) return setMsg('Error: ' + error.message)
    setMsg('✅ บันทึกนิยายสำเร็จ')
    setForm(empty())
    load()
  }

  const deleteNovel = async (id: string) => {
    await supabase.from('episodes').delete().eq('novel_id', id)
    await supabase.from('novels').delete().eq('id', id)
    setMsg('🗑️ ลบนิยายแล้ว')
    load()
  }

  const saveEp = async (novelId: string) => {
    if (!epForm.id || !epForm.title) return setMsg('กรุณาใส่ ID และชื่อตอน')
    const { error } = await supabase.from('episodes').upsert({
      id: epForm.id, novel_id: novelId, title: epForm.title,
      ep_num: epForm.ep_num, audio_url: epForm.audio_url, is_free: epForm.is_free
    })
    if (error) return setMsg('Error: ' + error.message)
    setMsg('✅ บันทึกตอนสำเร็จ')
    setEpForm({ id: '', title: '', ep_num: 1, audio_url: '', is_free: false })
    setEditing(null)
    load()
  }

  const deleteEp = async (id: string) => {
    await supabase.from('episodes').delete().eq('id', id)
    setMsg('🗑️ ลบตอนแล้ว')
    load()
  }

  const inp = 'w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm'
  const btn = (c: string) => `px-3 py-1.5 rounded text-xs font-medium ${c}`

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#0a0a0f] text-white p-6">
        <h1 className="text-2xl font-bold mb-6">🛠️ Admin Panel — เซียนหัว</h1>

        {msg && <div className="mb-4 p-3 bg-white/10 rounded text-sm">{msg}</div>}

        <div className="bg-white/5 rounded-xl p-5 mb-8">
          <h2 className="font-semibold mb-4 text-purple-400">➕ เพิ่ม / แก้ไขนิยาย</h2>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input className={inp} placeholder="ID" value={form.id} onChange={e => setForm({...form, id: e.target.value})} />
            <input className={inp} placeholder="ชื่อนิยาย" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            <input className={inp} placeholder="Subtitle" value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} />
            <input className={inp} placeholder="Cover URL" value={form.cover_url} onChange={e => setForm({...form, cover_url: e.target.value})} />
          </div>
          <textarea className={inp + ' mb-3'} rows={2} placeholder="คำอธิบาย" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <div className="flex gap-2">
            <button className={btn('bg-purple-600 hover:bg-purple-500')} onClick={saveNovel}>บันทึก</button>
            <button className={btn('bg-white/10')} onClick={() => setForm(empty())}>ล้าง</button>
          </div>
        </div>

        <h2 className="font-semibold mb-4 text-purple-400">📚 นิยายทั้งหมด</h2>
        {novels.map(n => (
          <div key={n.id} className="bg-white/5 rounded-xl p-5 mb-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-semibold">{n.title}</p>
                <p className="text-xs text-gray-400">{n.id}</p>
              </div>
              <div className="flex gap-2">
                <button className={btn('bg-blue-600/50')} onClick={() => setForm({...n, episodes: n.episodes || []})}>แก้ไข</button>
                <button className={btn('bg-red-600/50')} onClick={() => deleteNovel(n.id)}>ลบ</button>
              </div>
            </div>
            <div className="ml-2 border-l border-white/10 pl-4">
              {(n.episodes || []).map(ep => (
                <div key={ep.id} className="flex justify-between items-center py-1 text-sm">
                  <span className="text-gray-300">ตอน {ep.ep_num}: {ep.title} {ep.is_free ? '🆓' : '🔒'}</span>
                  <button className={btn('bg-red-600/30')} onClick={() => deleteEp(ep.id)}>ลบ</button>
                </div>
              ))}
              {editing === n.id ? (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <input className={inp} placeholder="ID ตอน" value={epForm.id} onChange={e => setEpForm({...epForm, id: e.target.value})} />
                  <input className={inp} placeholder="ชื่อตอน" value={epForm.title} onChange={e => setEpForm({...epForm, title: e.target.value})} />
                  <input className={inp} type="number" placeholder="ตอนที่" value={epForm.ep_num} onChange={e => setEpForm({...epForm, ep_num: +e.target.value})} />
                  <input className={inp} placeholder="Audio URL" value={epForm.audio_url} onChange={e => setEpForm({...epForm, audio_url: e.target.value})} />
                  <label className="flex items-center gap-2 text-sm text-white col-span-2">
                    <input type="checkbox" checked={epForm.is_free} onChange={e => setEpForm({...epForm, is_free: e.target.checked})} />
                    ฟังฟรี
                  </label>
                  <button className={btn('bg-green-600')} onClick={() => saveEp(n.id)}>บันทึก</button>
                  <button className={btn('bg-white/10')} onClick={() => setEditing(null)}>ยกเลิก</button>
                </div>
              ) : (
                <button className={btn('bg-green-600/30 mt-2')} onClick={() => setEditing(n.id)}>+ เพิ่มตอน</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </AdminGuard>
  )
}
