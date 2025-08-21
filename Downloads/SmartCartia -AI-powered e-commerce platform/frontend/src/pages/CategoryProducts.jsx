import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function CategoryProducts() {
  const { category } = useParams()
  const [data, setData] = useState({ products: [] })
  const [error, setError] = useState('')
  useEffect(() => {
    api(`/products?category=${encodeURIComponent(category)}`).then(setData).catch(e => setError(String(e)))
  }, [category])
  if (error) return <div className="p-6 text-red-600">{error}</div>
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{category}</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {data.products.map(p => (
          <Link key={p.id} to={`/products/${p.id}`} className="border rounded p-4 hover:shadow">
            <img src={p.image} alt={p.name} className="w-full h-40 object-cover mb-3" />
            <div className="font-semibold">{p.name}</div>
            <div className="mt-1">₹{p.price}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
