import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    async function fetchData() {
      try {
        const p = await api(`/products/${id}`)
        if (!ignore) setProduct(p)
        const r = await api(`/products/${id}/related`)
        if (!ignore) setRelated(r)
      } catch (e) {
        setError(String(e))
      }
    }
    fetchData()
    return () => { ignore = true }
  }, [id])

  if (error) return <div className="p-6 text-red-600">{error}</div>
  if (!product) return <div className="p-6">Loading…</div>

  return (
    <div className="p-6">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <img src={product.image} alt={product.name} className="w-full h-80 object-cover" />
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="text-gray-500 mb-4">{product.category}</div>
          <div className="text-2xl mb-4">₹{product.price}</div>
          <p className="mb-6">{product.description}</p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Related Products</h2>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {related.map(r => (
            <div key={r.id} className="border rounded p-3">
              <img src={r.image} alt={r.name} className="w-full h-32 object-cover mb-2" />
              <div className="font-medium text-sm">{r.name}</div>
              <div className="text-xs text-gray-500">₹{r.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
