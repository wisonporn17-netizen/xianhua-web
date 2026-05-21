'use client'
import { useState } from 'react'

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title, url })
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button onClick={share}
      className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 hover:border-white/40 text-white font-medium transition-all">
      {copied ? '✅ คัดลอกแล้ว' : '🔗 แชร์'}
    </button>
  )
}
