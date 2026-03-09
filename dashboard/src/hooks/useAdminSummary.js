import { useState, useEffect } from 'react'
import { getList } from '../api'

export function useAdminSummary() {
  const [counts, setCounts] = useState({})
  const [blogDraft, setBlogDraft] = useState(0)
  const [blogPublished, setBlogPublished] = useState(0)
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const resources = ['users', 'projects', 'blog-posts', 'contact-messages']
        const out = {}
        for (const r of resources) {
          const res = await getList(r, { per_page: 1 })
          const data = res?.data ?? res
          out[r] = data?.total ?? (Array.isArray(data?.data) ? data.data.length : 0)
        }
        if (!cancelled) setCounts(out)

        const unreadRes = await getList('contact-messages', { is_read: 0, per_page: 1 })
        const unreadData = unreadRes?.data ?? unreadRes
        if (!cancelled) setUnreadMessages(unreadData?.total ?? 0)

        const [pubRes, draftRes] = await Promise.all([
          getList('blog-posts', { per_page: 1, is_published: 1 }),
          getList('blog-posts', { per_page: 1, is_published: 0 }),
        ])
        const pubData = pubRes?.data ?? pubRes
        const draftData = draftRes?.data ?? draftRes
        if (!cancelled) {
          setBlogPublished(pubData?.total ?? 0)
          setBlogDraft(draftData?.total ?? 0)
        }

        const total = out['blog-posts'] ?? 0
        if (total > 0) {
          const lastPage = Math.ceil(total / 5)
          const recentRes = await getList('blog-posts', { per_page: 5, page: lastPage })
          const recentData = recentRes?.data ?? recentRes
          const list = Array.isArray(recentData?.data) ? recentData.data : []
          if (!cancelled) setRecentPosts([...list].reverse())
        }
      } catch (_) {}
      if (!cancelled) setLoading(false)
    })()
    return () => { cancelled = true }
  }, [])

  return {
    counts,
    blogPublished,
    blogDraft,
    unreadMessages,
    recentPosts,
    loading,
  }
}
