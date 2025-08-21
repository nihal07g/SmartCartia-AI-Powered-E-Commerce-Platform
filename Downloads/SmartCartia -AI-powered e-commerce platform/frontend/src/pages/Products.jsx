import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function Products() {
  const [data, setData] = useState({ products: [], totalPages: 1, currentPage: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api('/products')
      .then(setData)
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-6">Loading products…</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {data.products.map(p => (
          <Link key={p.id} to={`/products/${p.id}`} className="border rounded p-4 hover:shadow">
            <img src={p.image} alt={p.name} className="w-full h-40 object-cover mb-3" />
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-gray-500">{p.category}</div>
            <div className="mt-1">₹{p.price}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
