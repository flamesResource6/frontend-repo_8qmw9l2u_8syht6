import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Login({ onLogin }) {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) throw new Error('Login gagal')
      const data = await res.json()
      onLogin(data.access_token)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm w-full">
      <h2 className="text-2xl font-bold mb-4">Masuk</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-blue-600 text-white rounded py-2">{loading? 'Memproses...' : 'Login'}</button>
      </form>
    </div>
  )
}

function Dashboard({ token }) {
  const [admin, setAdmin] = useState(null)
  const [staf, setStaf] = useState(null)

  useEffect(()=>{
    const load = async()=>{
      try {
        const a = await fetch(`${API}/dashboard/admin?token=${token}`)
        if (a.ok) setAdmin(await a.json())
      } catch {}
      try {
        const s = await fetch(`${API}/dashboard/staf?token=${token}`)
        if (s.ok) setStaf(await s.json())
      } catch {}
    }
    load()
  },[token])

  return (
    <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
      <div className="p-6 rounded-lg shadow bg-white">
        <h3 className="font-semibold mb-2">Ringkas Admin</h3>
        <pre className="text-sm bg-gray-50 p-3 rounded">{admin? JSON.stringify(admin,null,2) : 'Tidak ada / bukan admin'}</pre>
      </div>
      <div className="p-6 rounded-lg shadow bg-white">
        <h3 className="font-semibold mb-2">Ringkas Staf</h3>
        <pre className="text-sm bg-gray-50 p-3 rounded">{staf? JSON.stringify(staf,null,2) : 'Tidak ada akses / belum ada wilayah'}</pre>
      </div>
    </div>
  )
}

function App() {
  const [token, setToken] = useState(null)

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      {!token ? (
        <Login onLogin={setToken} />
      ) : (
        <Dashboard token={token} />
      )}
    </div>
  )
}

export default App
