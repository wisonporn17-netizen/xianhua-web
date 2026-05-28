import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Link from 'next/link';
import ReadingView from '@/components/ReadingView';

export const revalidate = 0;

interface Props { params: { id: string; chapterId: string } }

export default async function ReadPage({ params }: Props) {
  const { data: novel } = await supabase.from('novels').select('id, title, cover_url').eq('id', params.id).single();
  if (!novel) notFound();

  const { data: chapter } = await supabase.from('chapters').select('*').eq('id', params.chapterId).single();
  if (!chapter) notFound();

  const { data: chapters } = await supabase.from('chapters').select('id, chapter_num, title').eq('novel_id', params.id).order('chapter_num');

  if (!chapter.is_free) {
    const cookieStore = cookies()
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { cookies: { get: (name) => cookieStore.get(name)?.value } }
    )
    const { data: { user } } = await supabaseAuth.auth.getUser()
    if (!user) redirect('/auth/login?next=' + encodeURIComponent('/novels/' + params.id + '/read/' + params.chapterId))
  }

  const idx = (chapters || []).findIndex(c => c.id === params.chapterId);
  const prev = idx > 0 ? chapters![idx - 1] : null;
  const next = idx < (chapters?.length || 0) - 1 ? chapters![idx + 1] : null;

  return (
    <div className="min-h-screen bg-[#111118]">
      <Header />
      <ReadingView
        novel={novel}
        chapter={chapter}
        chapters={chapters || []}
        prev={prev}
        next={next}
      />
    </div>
  )
}
