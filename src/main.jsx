import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Sprout, CalendarDays, ChevronLeft, ChevronRight, Gift, Sun,
  CheckCircle2, Circle, Code2, BriefcaseBusiness, BookOpen, Dumbbell,
  Leaf, Heart, ExternalLink, Plus, X, StickyNote, ArrowLeft, Trash2,
  Save, Trophy, Target
} from 'lucide-react'
import './styles.css'

const STORAGE_KEY = 'calm-daily-tracker-v1'
const tasks = [
  { id: 'meditate', label: 'Meditate', subtitle: 'Calm mind, better days.', points: 5, icon: Sprout, color: 'mint' },
  { id: 'exercise', label: 'Exercise', subtitle: 'A healthy body fuels a happy mind.', points: 10, icon: Dumbbell, color: 'blue' },
  { id: 'opportunity', label: 'Apply or Research', subtitle: 'Build your future, one step at a time.', points: 20, icon: BriefcaseBusiness, color: 'lavender', action: 'applications' },
  { id: 'dsa', label: 'DSA', subtitle: 'Practice. Improve. Grow.', points: 50, icon: Code2, color: 'peach', action: 'roadmap' },
  { id: 'extra', label: 'Extra', subtitle: 'Optional — same as DSA later.', points: 0, icon: Leaf, color: 'mint' },
  { id: 'connection', label: 'Call parents or grandparents OR read a book', subtitle: 'Stay connected. Stay grounded.', points: 15, icon: Heart, color: 'rose' },
]
const initialTopics = [
  { section: 'Foundations', topics: ['Time and Space Complexity', 'Arrays', 'Strings', 'Recursion', 'Basic Mathematics'] },
  { section: 'Searching & Sorting', topics: ['Linear Search', 'Binary Search', 'Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort', 'Quick Sort'] },
  { section: 'Core Data Structures', topics: ['Linked Lists', 'Stacks', 'Queues', 'Hashing', 'Trees', 'Binary Search Trees', 'Heaps', 'Graphs'] },
  { section: 'Problem-Solving Patterns', topics: ['Two Pointers', 'Sliding Window', 'Prefix Sum', 'Backtracking', 'Greedy Algorithms', 'Dynamic Programming'] },
]

function dateKey(date) {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
function parseDate(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d, 12)
}
function shiftDate(key, amount) {
  const d = parseDate(key)
  d.setDate(d.getDate() + amount)
  return dateKey(d)
}
function prettyDate(key, options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) {
  return parseDate(key).toLocaleDateString(undefined, options)
}
function readStore() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return { days: {}, topics: {}, applications: [], notes: {} }
}
function mondayKey(key) {
  const d = parseDate(key)
  const weekday = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - weekday)
  return dateKey(d)
}
function MeditationIllustration() {
  return <svg className="meditation-illustration" style={{ display: 'block', width: '100%', maxWidth: 280, height: 'auto' }} viewBox="0 0 280 220" role="img" aria-label="Illustration of a woman meditating peacefully" xmlns="http://www.w3.org/2000/svg">
    <circle cx="146" cy="100" r="83" fill="#edf4e9" />
    <circle cx="215" cy="43" r="15" fill="#f4d9a9" opacity=".9" />
    <path d="M29 179 C58 154 93 162 122 177 C151 192 194 191 251 165 L251 220 L29 220 Z" fill="#dce9d7" />
    <path d="M44 182 C64 169 79 169 96 181" fill="none" stroke="#9ebd9d" strokeWidth="2" strokeLinecap="round" />
    <path d="M224 174 C235 160 247 159 258 165" fill="none" stroke="#9ebd9d" strokeWidth="2" strokeLinecap="round" />
    <path d="M72 199 C90 177 117 173 143 184 C162 192 178 192 198 199" fill="none" stroke="#b6cdb0" strokeWidth="2" strokeLinecap="round" />
    <path d="M117 110 C105 120 99 140 103 156 C108 173 128 182 146 181 C166 180 182 168 185 153 C188 139 180 121 167 111 Z" fill="#d99a78" />
    <path d="M118 125 C101 135 90 151 82 168 C98 180 121 187 144 185 C163 183 181 176 194 163 C186 145 176 133 163 125 Z" fill="#759a7d" />
    <path d="M123 136 C113 147 107 159 101 169 C115 177 131 180 146 179 C160 178 174 172 184 163 C176 151 167 143 157 136 Z" fill="#a9c4a6" />
    <path d="M113 151 C96 151 83 160 77 171 C90 180 108 183 125 179" fill="none" stroke="#d99a78" strokeWidth="13" strokeLinecap="round" />
    <path d="M166 151 C184 151 198 160 203 171 C190 180 172 183 155 179" fill="none" stroke="#d99a78" strokeWidth="13" strokeLinecap="round" />
    <path d="M113 166 C120 157 132 155 142 160 C152 155 165 157 173 166 C164 178 153 184 142 184 C131 184 121 178 113 166 Z" fill="#f0c5a7" />
    <path d="M116 92 C116 73 128 60 144 60 C160 60 171 73 171 92 L169 117 C166 132 155 141 144 141 C132 141 121 132 118 117 Z" fill="#f2c7a8" />
    <path d="M114 94 C109 77 116 57 135 51 C154 45 173 58 176 78 C178 89 173 100 169 105 L165 84 C151 84 138 78 130 69 C127 80 122 89 114 94 Z" fill="#4f493f" />
    <path d="M119 104 C116 96 110 98 111 106 C112 113 117 117 121 115" fill="#f2c7a8" />
    <path d="M167 104 C172 96 178 98 177 106 C176 113 171 117 167 115" fill="#f2c7a8" />
    <path d="M132 105 Q136 109 140 105 M149 105 Q153 109 157 105" fill="none" stroke="#70574c" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M139 119 Q144 122 149 119" fill="none" stroke="#c27d70" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M128 138 L143 150 L159 138" fill="none" stroke="#f2c7a8" strokeWidth="5" strokeLinecap="round" />
    <path d="M106 89 C101 71 111 49 133 43 C151 38 171 48 179 66 C169 59 158 57 149 60 C135 65 124 78 106 89 Z" fill="#4f493f" />
    <path d="M108 82 C99 101 104 119 116 130" fill="none" stroke="#4f493f" strokeWidth="8" strokeLinecap="round" />
    <path d="M174 79 C182 99 176 118 166 130" fill="none" stroke="#4f493f" strokeWidth="7" strokeLinecap="round" />
    <path d="M196 69 l4 -8 M204 75 l8 -3 M195 81 l-2 7" stroke="#c0d5b7" strokeWidth="2" strokeLinecap="round" />
    <path d="M66 94 l3 -7 M73 99 l7 -2 M65 105 l-1 6" stroke="#c0d5b7" strokeWidth="2" strokeLinecap="round" />
  </svg>
}

function App() {
  const [store, setStore] = useState(readStore)
  const [selectedDate, setSelectedDate] = useState(dateKey(new Date()))
  const [page, setPage] = useState('home')
  const [topicNote, setTopicNote] = useState(null)
  const [applicationNote, setApplicationNote] = useState(null)
  const [showAddApplication, setShowAddApplication] = useState(false)
  const [applicationForm, setApplicationForm] = useState({ company: '', role: '', date: dateKey(new Date()), link: '', status: 'Applied', note: '' })
  const [showDailyNote, setShowDailyNote] = useState(false)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)) } catch {}
  }, [store])

  const day = store.days[selectedDate] || {}
  const isSunday = parseDate(selectedDate).getDay() === 0
  const score = tasks.reduce((sum, task) => sum + (day[task.id] && task.id !== 'extra' ? task.points : 0), 0)
  const weekStart = mondayKey(selectedDate)
  const weekDays = Array.from({ length: 7 }, (_, i) => shiftDate(weekStart, i))
  const perfectDays = weekDays.filter(key => {
    if (parseDate(key).getDay() === 0) return false
    const d = store.days[key] || {}
    return tasks.reduce((sum, task) => sum + (d[task.id] && task.id !== 'extra' ? task.points : 0), 0) === 100
  }).length
  const topicItems = useMemo(() => initialTopics.flatMap(group => group.topics.map(topic => ({ section: group.section, topic }))), [])
  const completedTopics = topicItems.filter(({ topic }) => store.topics[topic]?.done).length
  const roadmapPercent = topicItems.length ? Math.round(completedTopics / topicItems.length * 100) : 0

  function updateStore(updater) { setStore(prev => typeof updater === 'function' ? updater(prev) : updater) }
  function toggleTask(id) {
    updateStore(prev => {
      const current = prev.days[selectedDate] || {}
      return { ...prev, days: { ...prev.days, [selectedDate]: { ...current, [id]: !current[id] } } }
    })
  }
  function setTopic(topic, field, value) {
    updateStore(prev => ({ ...prev, topics: { ...prev.topics, [topic]: { ...(prev.topics[topic] || {}), [field]: value } } }))
  }
  function saveApplication(e) {
    e.preventDefault()
    if (!applicationForm.company.trim() || !applicationForm.role.trim()) return
    updateStore(prev => ({ ...prev, applications: [...prev.applications, { ...applicationForm, id: `${Date.now()}-${Math.random().toString(16).slice(2)}` }] }))
    setApplicationForm({ company: '', role: '', date: dateKey(new Date()), link: '', status: 'Applied', note: '' })
    setShowAddApplication(false)
  }
  function updateApplication(id, field, value) {
    updateStore(prev => ({ ...prev, applications: prev.applications.map(app => app.id === id ? { ...app, [field]: value } : app) }))
  }
  function deleteApplication(id) {
    if (confirm('Delete this application?')) updateStore(prev => ({ ...prev, applications: prev.applications.filter(app => app.id !== id) }))
  }

  function exportBackup() {
    try {
      const backup = {
        app: 'Self Track',
        version: 1,
        exportedAt: new Date().toISOString(),
        data: store,
      }
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `daily-tracker-backup-${dateKey(new Date())}.json`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
      alert('Backup downloaded successfully!')
    } catch (error) {
      console.error('Backup export failed:', error)
      alert('Could not export backup. Please try again.')
    }
  }

  async function importBackup(event) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const backup = JSON.parse(text)
      const imported = backup.data

      if (
        !imported ||
        typeof imported !== 'object' ||
        !imported.days || typeof imported.days !== 'object' ||
        !imported.topics || typeof imported.topics !== 'object' ||
        !Array.isArray(imported.applications)
      ) {
        throw new Error('This file is not a valid tracker backup.')
      }

      const confirmed = window.confirm(
        'Import this backup? Your current tracker data will be replaced. Export your current data first if you want to keep it.'
      )
      if (!confirmed) return

      const restoredData = {
        days: imported.days,
        topics: imported.topics,
        applications: imported.applications,
        notes: imported.notes || {},
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(restoredData))
      setStore(restoredData)
      alert('Backup restored successfully!')
    } catch (error) {
      console.error('Backup import failed:', error)
      alert('Could not import this file. Please select a valid backup exported from this tracker.')
    } finally {
      event.target.value = ''
    }
  }

  const go = (next) => { setPage(next); setTopicNote(null); setApplicationNote(null) }
  const scoreLabel = isSunday ? 'Flexible Sunday' : `${score} / 100`
  const pageTitle = { home: 'Self Track', roadmap: 'DSA Roadmap', applications: 'Applications', notes: 'Your Notes' }[page]

  return <div className="app-shell">
    <header className="site-header">
      <div className="brand-mark"><Sprout size={34} strokeWidth={1.7} /></div>
      <div className="brand-copy">
        <button className="brand-title" onClick={() => go('home')}>{pageTitle}</button>
        <p>{page === 'home' ? 'Small steps every day, lead to big dreams.' : page === 'roadmap' ? 'One concept at a time. Keep growing.' : page === 'applications' ? 'Every application is a step forward.' : 'Keep the useful thoughts close.'}</p>
      </div>
      <div className="header-art" aria-hidden="true"><div className="sun-disc" /><div className="hill hill-one" /><div className="hill hill-two" /><div className="header-leaf"><Sprout size={72} strokeWidth={1} /></div></div>
    </header>

    <section
      aria-label="Backup and restore tracker data"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, margin: '0 0 24px', padding: '18px 20px', background: '#ffffff', border: '1px solid #e4eddf', borderRadius: 16 }}
    >
      <div>
        <strong style={{ color: '#355c48', fontSize: 15 }}>Keep your progress safe</strong>
        <p style={{ margin: '5px 0 0', color: '#7b8d80', fontSize: 12 }}>Export a backup or restore your saved progress.</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <button type="button" className="button button-soft" onClick={exportBackup}>Export backup</button>
        <label className="button button-primary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          Import backup
          <input type="file" accept=".json,application/json" onChange={importBackup} aria-label="Choose a tracker backup JSON file" style={{ display: 'none' }} />
        </label>
      </div>
    </section>

    {page === 'home' && <>
      <section className="weekly-banner">
        <div className="weekly-main">
          <Sprout className="section-icon" size={30} />
          <div className="weekly-copy">
            <span className="eyebrow">WEEKLY PROGRESS</span>
            <strong>{perfectDays} / 6 perfect days</strong>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${Math.min(perfectDays / 4, 1) * 100}%` }} /></div>
            <small>Reach 4 perfect days to unlock your treat.</small>
          </div>
        </div>
        <div className={`reward-box ${perfectDays >= 4 ? 'unlocked' : ''}`}>
          <Gift size={28} />
          <div><strong>{perfectDays >= 4 ? 'Treat unlocked!' : 'Your treat is waiting'}</strong><p>{perfectDays >= 4 ? 'You showed up for yourself. Enjoy it!' : `${4 - perfectDays} more perfect day${4 - perfectDays === 1 ? '' : 's'} to unlock your treat.`}</p></div>
        </div>
        <div className="sunday-box"><Sun size={30} /><div><strong>Sunday = flexible</strong><p>Skip anything you want today. Sunday doesn't count toward the weekly reward.</p></div></div>
      </section>

      <section className="mindful-hero" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 18, margin: '0 0 24px', padding: 'clamp(20px, 4vw, 34px)', background: 'linear-gradient(120deg, #f4f7ef 0%, #edf4e9 58%, #f8f2e8 100%)', border: '1px solid #e0eadd', borderRadius: 24, overflow: 'hidden' }}>
        <div className="mindful-copy" style={{ flex: '1 1 220px', minWidth: 0 }}>
          <span className="eyebrow">A GENTLE REMINDER</span>
          <h2 style={{ margin: '10px 0', color: '#355c48', fontFamily: 'Georgia, serif', fontSize: 'clamp(23px, 4vw, 32px)', lineHeight: 1.2, fontWeight: 500 }}>You are definately gonna get it  </h2>
          <p style={{ maxWidth: 390, margin: '0 0 16px', color: '#718273', fontSize: 14, lineHeight: 1.7 }}>Before you begin, give yourself a quiet moment. Progress can be peaceful, too.</p>
          <div className="mindful-caption" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 12px', background: 'rgba(255,255,255,.7)', borderRadius: 99, color: '#52765c', fontSize: 12, fontWeight: 600 }}><Sprout size={17} /> One small step at a time</div>
        </div>
        <div className="mindful-art" style={{ flex: '0 1 250px', display: 'flex', justifyContent: 'center', minWidth: 0 }}><MeditationIllustration /></div>
      </section>

      <div className="home-layout">
        <main className="panel tracker-panel">
          <div className="panel-heading">
            <div className="date-control">
              <CalendarDays size={21} />
              <button className="date-arrow" aria-label="Previous day" onClick={() => setSelectedDate(shiftDate(selectedDate, -1))}><ChevronLeft size={19} /></button>
              <input aria-label="Select date" type="date" value={selectedDate} onChange={e => e.target.value && setSelectedDate(e.target.value)} />
              <button className="date-arrow" aria-label="Next day" onClick={() => setSelectedDate(shiftDate(selectedDate, 1))}><ChevronRight size={19} /></button>
            </div>
            <button className="button button-soft" onClick={() => setShowDailyNote(v => !v)}><StickyNote size={16} /> {showDailyNote ? 'Close note' : 'Daily note'}</button>
          </div>
          {showDailyNote && <div className="daily-note"><label htmlFor="daily-note">A thought for {prettyDate(selectedDate, { month: 'short', day: 'numeric' })}</label><textarea id="daily-note" value={day.note || ''} onChange={e => updateStore(prev => ({ ...prev, days: { ...prev.days, [selectedDate]: { ...(prev.days[selectedDate] || {}), note: e.target.value } } }))} placeholder="What do you want to remember about today?" /></div>}
          <div className="table-head"><span>Activity</span><span>Points</span><span>Done</span><span>Action</span></div>
          <div className="task-list">
            {tasks.map(task => {
              const Icon = task.icon
              const checked = Boolean(day[task.id])
              return <div className={`task-row ${checked ? 'task-complete' : ''}`} key={task.id}>
                <div className={`task-icon ${task.color}`}><Icon size={22} strokeWidth={1.8} /></div>
                <div className="task-name"><strong>{task.label}</strong><small>{task.subtitle}</small></div>
                <div className="task-points">{task.points}</div>
                <button className={`check-button ${checked ? 'checked' : ''}`} aria-label={`${checked ? 'Uncheck' : 'Complete'} ${task.label}`} onClick={() => toggleTask(task.id)} disabled={isSunday} title={isSunday ? 'Sunday is flexible' : ''}>{checked ? <CheckCircle2 size={23} /> : <Circle size={23} />}</button>
                <div className="task-action">{task.action === 'roadmap' ? <button className="action-button peach-action" onClick={() => go('roadmap')}><Code2 size={16} /> Open Roadmap <ExternalLink size={14} /></button> : task.action === 'applications' ? <button className="action-button lavender-action" onClick={() => go('applications')}><BriefcaseBusiness size={16} /> Applications <ExternalLink size={14} /></button> : <span className={`status-pill ${checked ? 'status-done' : ''}`}>{checked ? 'Done' : isSunday ? 'Flexible' : 'Not done'}</span>}</div>
              </div>
            })}
          </div>
          <div className="score-footer"><div><Sprout size={21} /><strong>Daily Score</strong></div><strong className="score-number">{scoreLabel}</strong></div>
          <p className="tracker-footnote">{isSunday ? 'Take the space you need. Your weekly reward is based on Monday–Saturday.' : score === 100 ? 'A perfect day. Be proud of the effort you put in.' : 'Small steps count. Check off each activity as you complete it.'}</p>
        </main>
        <aside className="sidebar">
          <section className="panel side-panel">
            <h2><Trophy size={20} /> This week</h2>
            <div className="mini-score"><strong>{perfectDays} / 6</strong><span>perfect days</span></div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${perfectDays / 6 * 100}%` }} /></div>
            <div className={`reward-line ${perfectDays >= 4 ? 'unlocked-text' : ''}`}><Gift size={23} /><div><strong>{perfectDays >= 4 ? 'Treat unlocked!' : 'Treat goal'}</strong><small>{perfectDays >= 4 ? 'Make time to celebrate.' : '4 perfect days unlock your treat.'}</small></div></div>
            <div className="week-strip">{weekDays.map((key, i) => {
              const d = store.days[key] || {}
              const done = tasks.reduce((sum, task) => sum + (d[task.id] && task.id !== 'extra' ? task.points : 0), 0) === 100
              const sunday = parseDate(key).getDay() === 0
              return <button key={key} className={`week-day ${key === selectedDate ? 'selected' : ''} ${done ? 'perfect' : ''} ${sunday ? 'sunday' : ''}`} onClick={() => setSelectedDate(key)} title={prettyDate(key)}><span>{parseDate(key).toLocaleDateString(undefined, { weekday: 'narrow' })}</span>{done ? <CheckCircle2 size={15} /> : sunday ? <Sun size={15} /> : <i />}</button>
            })}</div>
          </section>
          <section className="panel side-panel quick-panel">
            <h2><Leaf size={20} /> Quick access</h2>
            <button className="quick-link" onClick={() => go('roadmap')}><span className="quick-icon peach"><Code2 size={19} /></span><span><strong>DSA Roadmap</strong><small>{completedTopics} of {topicItems.length} topics complete</small></span><ChevronRight size={18} /></button>
            <button className="quick-link" onClick={() => go('applications')}><span className="quick-icon lavender"><BriefcaseBusiness size={19} /></span><span><strong>Applications</strong><small>{store.applications.length} applications tracked</small></span><ChevronRight size={18} /></button>
            <button className="quick-link" onClick={() => go('notes')}><span className="quick-icon mint"><BookOpen size={19} /></span><span><strong>Notes</strong><small>Review your saved notes</small></span><ChevronRight size={18} /></button>
          </section>
          <section className="quote-card"><Sprout size={20} /><blockquote>“Little by little, a little becomes a lot.”</blockquote><span>— Tanzanian proverb</span><div className="quote-hills" /></section>
        </aside>
      </div>
    </>}

    {page === 'roadmap' && <section className="panel full-panel">
      <div className="panel-heading"><button className="back-button" onClick={() => go('home')}><ArrowLeft size={17} /> Daily tracker</button><span className="muted-label">{completedTopics} / {topicItems.length} topics completed</span></div>
      <div className="roadmap-summary"><div><span className="eyebrow">YOUR LEARNING JOURNEY</span><h2>Keep growing, one topic at a time.</h2><p>Tick a topic when you feel you've learned it. Add notes, reminders, or useful links for each topic.</p></div><div className="roadmap-ring" style={{ '--progress': `${roadmapPercent}%` }}><div><strong>{roadmapPercent}%</strong><small>complete</small></div></div></div>
      <div className="progress-track roadmap-progress"><div className="progress-fill" style={{ width: `${roadmapPercent}%` }} /></div>
      {initialTopics.map(group => <section className="topic-section" key={group.section}><h3>{group.section}<span>{group.topics.filter(topic => store.topics[topic]?.done).length}/{group.topics.length}</span></h3>{group.topics.map(topic => <div className={`topic-row ${store.topics[topic]?.done ? 'topic-done' : ''}`} key={topic}><button className={`topic-check ${store.topics[topic]?.done ? 'checked' : ''}`} aria-label={`Toggle ${topic}`} onClick={() => setTopic(topic, 'done', !store.topics[topic]?.done)}>{store.topics[topic]?.done ? <CheckCircle2 size={21} /> : <Circle size={21} />}</button><span className="topic-title">{topic}</span><button className="note-button" onClick={() => setTopicNote(topic)}><StickyNote size={16} /> {store.topics[topic]?.note ? 'Edit note' : 'Add note'}</button></div>)}</section>)}
      {topicNote && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setTopicNote(null)}><div className="modal"><div className="modal-heading"><div><span className="eyebrow">TOPIC NOTE</span><h2>{topicNote}</h2></div><button className="icon-button" onClick={() => setTopicNote(null)}><X size={20} /></button></div><label htmlFor="topic-note">Your notes</label><textarea id="topic-note" autoFocus rows={7} value={store.topics[topicNote]?.note || ''} onChange={e => setTopic(topicNote, 'note', e.target.value)} placeholder="Key ideas, mistakes to avoid, useful links, questions..." /><div className="modal-actions"><button className="button button-primary" onClick={() => setTopicNote(null)}><Save size={16} /> Save note</button></div></div></div>}
    </section>}

    {page === 'applications' && <section className="panel full-panel">
      <div className="panel-heading"><button className="back-button" onClick={() => go('home')}><ArrowLeft size={17} /> Daily tracker</button><button className="button button-primary" onClick={() => setShowAddApplication(true)}><Plus size={17} /> Add application</button></div>
      <div className="page-intro"><span className="eyebrow">YOUR OPPORTUNITIES</span><h2>Keep every application in one place.</h2><p>Track roles, dates, statuses, and follow-up notes. One application at a time.</p></div>
      <div className="application-stats"><div><strong>{store.applications.length}</strong><span>Total applications</span></div><div><strong>{store.applications.filter(a => a.status === 'Interview' || a.status === 'Assessment').length}</strong><span>In progress</span></div><div><strong>{store.applications.filter(a => a.status === 'Selected').length}</strong><span>Selected</span></div></div>
      {store.applications.length === 0 ? <div className="empty-state"><BriefcaseBusiness size={34} /><h3>Your next opportunity starts here.</h3><p>Add the first role you apply for. You can update its status any time.</p><button className="button button-primary" onClick={() => setShowAddApplication(true)}><Plus size={17} /> Add first application</button></div> : <div className="application-list">{[...store.applications].sort((a,b) => b.date.localeCompare(a.date)).map(app => <article className="application-card" key={app.id}><div className="application-main"><div className="application-company-icon"><BriefcaseBusiness size={20} /></div><div className="application-title"><h3>{app.role}</h3><p>{app.company} · {prettyDate(app.date, { month: 'short', day: 'numeric', year: 'numeric' })}</p>{app.link && <a href={app.link} target="_blank" rel="noreferrer">Open job link <ExternalLink size={13} /></a>}</div><select className={`status-select status-${app.status.toLowerCase()}`} value={app.status} onChange={e => updateApplication(app.id, 'status', e.target.value)} aria-label={`Status for ${app.company}`}><option>Applied</option><option>Assessment</option><option>Interview</option><option>Selected</option><option>Rejected</option><option>Withdrawn</option></select><button className="note-button" onClick={() => setApplicationNote(app.id)}><StickyNote size={16} /> {app.note ? 'Edit note' : 'Note'}</button><button className="icon-button delete-button" aria-label={`Delete ${app.company}`} onClick={() => deleteApplication(app.id)}><Trash2 size={16} /></button></div></article>)}</div>}
      {showAddApplication && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setShowAddApplication(false)}><form className="modal" onSubmit={saveApplication}><div className="modal-heading"><div><span className="eyebrow">NEW OPPORTUNITY</span><h2>Add an application</h2></div><button type="button" className="icon-button" onClick={() => setShowAddApplication(false)}><X size={20} /></button></div><div className="form-grid"><div><label htmlFor="company">Company / organization *</label><input id="company" required value={applicationForm.company} onChange={e => setApplicationForm({ ...applicationForm, company: e.target.value })} placeholder="e.g. Google" /></div><div><label htmlFor="role">Role / opportunity *</label><input id="role" required value={applicationForm.role} onChange={e => setApplicationForm({ ...applicationForm, role: e.target.value })} placeholder="e.g. Software Engineer Intern" /></div><div><label htmlFor="application-date">Date applied</label><input id="application-date" type="date" value={applicationForm.date} onChange={e => setApplicationForm({ ...applicationForm, date: e.target.value })} /></div><div><label htmlFor="status">Status</label><select id="status" value={applicationForm.status} onChange={e => setApplicationForm({ ...applicationForm, status: e.target.value })}><option>Applied</option><option>Assessment</option><option>Interview</option><option>Selected</option><option>Rejected</option><option>Withdrawn</option></select></div><div className="form-wide"><label htmlFor="job-link">Job link (optional)</label><input id="job-link" type="url" value={applicationForm.link} onChange={e => setApplicationForm({ ...applicationForm, link: e.target.value })} placeholder="https://..." /></div><div className="form-wide"><label htmlFor="app-note">Notes (optional)</label><textarea id="app-note" rows={3} value={applicationForm.note} onChange={e => setApplicationForm({ ...applicationForm, note: e.target.value })} placeholder="Resume version, follow-up date, contact person..." /></div></div><div className="modal-actions"><button type="button" className="button button-plain" onClick={() => setShowAddApplication(false)}>Cancel</button><button type="submit" className="button button-primary"><Plus size={16} /> Save application</button></div></form></div>}
      {applicationNote && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setApplicationNote(null)}><div className="modal"><div className="modal-heading"><div><span className="eyebrow">APPLICATION NOTE</span><h2>{store.applications.find(a => a.id === applicationNote)?.company}</h2></div><button className="icon-button" onClick={() => setApplicationNote(null)}><X size={20} /></button></div><label htmlFor="application-note">Notes and follow-ups</label><textarea id="application-note" rows={7} value={store.applications.find(a => a.id === applicationNote)?.note || ''} onChange={e => updateApplication(applicationNote, 'note', e.target.value)} placeholder="Recruiter contact, interview preparation, follow-up reminder..." /><div className="modal-actions"><button className="button button-primary" onClick={() => setApplicationNote(null)}><Save size={16} /> Save note</button></div></div></div>}
    </section>}

    {page === 'notes' && <section className="panel full-panel"><div className="panel-heading"><button className="back-button" onClick={() => go('home')}><ArrowLeft size={17} /> Daily tracker</button></div><div className="page-intro"><span className="eyebrow">YOUR NOTEBOOK</span><h2>Thoughts worth keeping.</h2><p>All the notes you've saved in your DSA roadmap, applications, and daily reflections.</p></div><div className="notes-collection">
      {Object.entries(store.topics).filter(([,v]) => v.note?.trim()).map(([topic, v]) => <article className="saved-note" key={topic}><span className="note-category"><Code2 size={14} /> DSA TOPIC</span><h3>{topic}</h3><p>{v.note}</p><button className="text-link" onClick={() => { go('roadmap'); setTopicNote(topic) }}>Open topic note <ChevronRight size={15} /></button></article>)}
      {store.applications.filter(a => a.note?.trim()).map(app => <article className="saved-note" key={app.id}><span className="note-category"><BriefcaseBusiness size={14} /> APPLICATION</span><h3>{app.company} — {app.role}</h3><p>{app.note}</p><button className="text-link" onClick={() => { go('applications'); setApplicationNote(app.id) }}>Open application note <ChevronRight size={15} /></button></article>)}
      {Object.entries(store.days).filter(([,v]) => v.note?.trim()).sort(([a],[b]) => b.localeCompare(a)).map(([key,v]) => <article className="saved-note" key={key}><span className="note-category"><CalendarDays size={14} /> DAILY REFLECTION</span><h3>{prettyDate(key)}</h3><p>{v.note}</p><button className="text-link" onClick={() => { setSelectedDate(key); go('home'); setShowDailyNote(true) }}>Open daily note <ChevronRight size={15} /></button></article>)}
      {!Object.values(store.topics).some(v => v.note?.trim()) && !store.applications.some(a => a.note?.trim()) && !Object.values(store.days).some(v => v.note?.trim()) && <div className="empty-state"><BookOpen size={34} /><h3>Your notes will live here.</h3><p>Add a note to a DSA topic, an application, or your daily tracker to see it collected here.</p></div>}
    </div></section>}

    <footer className="site-footer"><Sprout size={18} /><span>Better habits</span><span className="footer-star">✦</span><span>A brighter future</span><span className="footer-note">Made for your own pace.</span></footer>
  </div>
}

createRoot(document.getElementById('root')).render(<App />)
