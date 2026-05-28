'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import AdminGuard from '@/components/AdminGuard'

export default function AdminChaptersPage() {
  const [novels, setNovels] = useState<any[]>([])
  const [selectedNovel, setSelectedNovel] = useState('')
  const [chapters, setChapters] = useState<any[]>([])
  const [form, setForm] = useState({ chapter_num: 1, title: '', content: '', is_free: false })
  const [editing, setEditing] = useState<string | null>(null)
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('novels').select('id, title').order('created_at').then(({ data }) => setNovels(data || []))
  }, [])

  useEffect(() => {
    if (!selectedNovel) return
    supabase.from('chapters').select('*').eq('novel_id', selectedNovel).order('chapter_num')
      .then(({ data }) => setChapters(data || []))
  }, [selectedNovel])

  const save = async () => {
    if (!selectedNovel || !form.title || !form.content) return setMsg('กรุณากรอกข้อมูลให้ครบ')
    setLoading(true)
    const payload = { ...form, novel_id: selectedNovel }
    const { error } = editing
      ? await supabase.from('chapters').update(payload).eq('id', editing)
      : await supabase.from('chapters').insert(payload)
    if (error) setMsg('Error: ' + error.message)
    else {
      setMsg('✅ บันทึกสำเร็จ')
      setForm({ chapter_num: (form.chapter_num + 1), title: '', content: '', is_free: false })
      setEditing(null)
      const { data } = await supabase.from('chapters').select('*').eq('novel_id', selectedNovel).order('chapter_num')
      setChapters(data || [])
    }
    setLoading(false)
  }

  const deleteChapter = async (id: string) => {
    if (!confirm('ลบตอนนี้?')) return
    await supabase.from('chapters').delete().eq('id', id)
    setChapters(chapters.filter(c => c.id !== id))
    setMsg('🗑️ ลบแล้ว')
  }

  const editChapter = (ch: any) => {
    setEditing(ch.id)
    setForm({ chapter_num: ch.chapter_num, title: ch.title, content: ch.content, is_free: ch.is_free })
  }

  const inp = 'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500'

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#0a0a0f] text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/admin" className="text-gray-400 hover:text-white text-sm">← Admin</Link>
            <h1 className="text-2xl font-bold">📖 จัดการเนื้อหานิยาย</h1>
          </div>

          {msg && <div className="mb-4 p-3 bg-white/10 rounded-lg text-sm">{msg}</div>}

          <div className="bg-white/5 rounded-xl p-5 mb-6 border border-white/10">
            <h2 className="font-semibold mb-3 text-purple-400">เลือกนิยาย</h2>
            <select value={selectedNovel} onChange={e => setSelectedNovel(e.target.value)} className={inp}>
              <option value="">-- เลือกนิยาย --</option>
              {novels.map(n => <option key={n.id} value={n.id}>{n.title}</option>)}
            </select>
          </div>

          {selectedNovel && (
            <>
              <div className="bg-white/5 rounded-xl p-5 mb-6 border border-white/10">
                <h2 className="font-semibold mb-4 text-purple-400">{editing ? '✏️ แก้ไขตอน' : '➕ เพิ่มตอนใหม่'}</h2>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <input className={inp} type="number" placeholder="ตอนที่" value={form.chapter_num}
                    onChange={e => setForm({...form, chapter_num: +e.target.value})} />
                  <input className={inp} placeholder="ชื่อตอน" value={form.title}
                    onChange={e => setForm({...form, title: e.target.value})} />
                </div>
                <textarea className={inp + ' mb-3'} rows={15} placeholder="เนื้อหาตอน"
                  value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={form.is_free}
                      onChange={e => setForm({...form, is_free: e.target.checked})} className="w-4 h-4" />
                    อ่านฟรี
                  </label>
                  <span className="text-gray-500 text-xs">{form.content.length} ตัวอักษร</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={save} disabled={loading}
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-sm font-medium disabled:opacity-50">
                    {loading ? 'กำลังบันทึก...' : editing ? 'อัปเดต' : 'บันทึก'}
                  </button>
                  {editing && (
                    <button onClick={() => { setEditing(null); setForm({ chapter_num: chapters.length + 1, title: '', content: '', is_free: false }) }}
                      className="px-4 py-2 rounded-lg bg-white/10 text-sm">ยกเลิก</button>
                  )}
                </div>
              </div>

              <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <div className="px-5 py-4 border-b border-white/10 flex justify-between">
                  <h2 className="font-semibold text-purple-400">ตอนทั้งหมด</h2>
                  <span className="text-gray-500 text-xs">{chapters.length} ตอน</span>
                </div>
                {chapters.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">ยังไม่มีตอน</p>
                ) : chapters.map(ch => (
                  <div key={ch.id} className="flex items-center gap-4 px-5 py-3 border-b border-white/5 last:border-0">
                    <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center text-xs font-mono text-purple-300">{ch.chapter_num}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{ch.title}</p>
                      <p className="text-gray-500 text-xs">{ch.content.length} ตัวอักษร · {ch.is_free ? 'ฟรี' : 'สมาชิก'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editChapter(ch)} className="px-3 py-1 text-xs rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300">แก้ไข</button>
                      <button onClick={() => deleteChapter(ch.id)} className="px-3 py-1 text-xs rounded-lg bg-red-600/30 hover:bg-red-600 text-red-300">ลบ</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </AdminGuard>
  )
}
