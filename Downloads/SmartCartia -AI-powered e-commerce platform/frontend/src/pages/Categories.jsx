import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function Categories() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  useEffect(() => {
    api('/products/categories').then(setItems).catch(e => setError(String(e)))
  }, [])
  if (error) return <div className="p-6 text-red-600">{error}</div>
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map(c => (
          <Link key={c.name} to={`/categories/${encodeURIComponent(c.name)}`} className="border rounded p-3">
            <img src={c.image} className="w-full h-24 object-cover mb-2" alt={c.name} />
            <div className="font-medium">{c.name}</div>
            <div className="text-xs text-gray-500">{c.productCount} items</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
