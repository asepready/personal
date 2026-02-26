import { useState, useEffect } from 'react'
import { getUsers, getSkillCategories, getSkills, getUserSkills } from '../api'
import Loading from '../components/Loading'
import ErrorState from '../components/ErrorState'

export default function Skills() {
  const [userId, setUserId] = useState(null)
  const [categories, setCategories] = useState([])
  const [skills, setSkills] = useState([])
  const [userSkills, setUserSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setError(null)
        const userRes = await getUsers({ per_page: 1 })
        const first = userRes?.data?.data?.[0] ?? userRes?.data?.[0]
        if (cancelled) return
        if (first) setUserId(first.id)
        const [catRes, skillRes, usRes] = await Promise.all([
          getSkillCategories({ per_page: 50 }),
          getSkills({ per_page: 100 }),
          first ? getUserSkills({ user_id: first.id, per_page: 100 }) : Promise.resolve({ data: {} }),
        ])
        if (cancelled) return
        setCategories(catRes?.data?.data ?? catRes?.data ?? [])
        setSkills(skillRes?.data?.data ?? skillRes?.data ?? [])
        setUserSkills(usRes?.data?.data ?? usRes?.data ?? [])
      } catch (e) {
        if (!cancelled) setError(e.message || 'Gagal memuat data.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [retryKey])

  if (loading) return <Loading />
  if (error) return <ErrorState message={error} onRetry={() => setRetryKey((k) => k + 1)} />

  const byCategory = {}
  const usMap = Object.fromEntries((userSkills || []).map((us) => [us.skill_id, us]))
  ;(skills || []).forEach((s) => {
    const cid = s.skill_category_id || 0
    if (!byCategory[cid]) byCategory[cid] = []
    byCategory[cid].push({ ...s, userSkill: usMap[s.id] })
  })
  const catMap = Object.fromEntries((categories || []).map((c) => [c.id, c]))

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <h1 className="section-title">Skills</h1>
      {categories.length > 0 ? (
        <div style={styles.grid}>
          {categories.map((cat) => (
            <section key={cat.id} style={styles.section}>
              <h2 style={styles.catTitle}>{cat.name}</h2>
              {cat.description && <p style={styles.catDesc}>{cat.description}</p>}
              <div className="skill-tags">
                {(byCategory[cat.id] || []).map((s) => {
                  const level = s.userSkill?.proficiency_level
                  const title = level ? `Level: ${level}` : undefined
                  return (
                    <span
                      key={s.id}
                      className="skill-tag"
                      style={styles.tag}
                      title={title}
                    >
                      {s.name}
                      {level && (
                        <span style={styles.level}>· {level}</span>
                      )}
                    </span>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="skill-tags">
          {(skills || []).map((s) => (
            <span
              key={s.id}
              className="skill-tag"
              style={styles.tag}
              title={s.level ? `Level: ${s.level}` : undefined}
            >
              {s.name}
              {s.level && <span style={styles.level}> · {s.level}</span>}
            </span>
          ))}
        </div>
      )}
      {skills.length === 0 && <p style={{ color: 'var(--color-text-muted)' }}>Belum ada data skills.</p>}
    </div>
  )
}

const styles = {
  grid: { display: 'flex', flexDirection: 'column', gap: '2rem' },
  section: {},
  catTitle: { fontSize: '1.125rem', margin: '0 0 0.25rem' },
  catDesc: { fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0 0 0.75rem' },
  tag: {
    fontSize: '0.875rem',
  },
  level: { color: 'var(--color-text-muted)' },
}
