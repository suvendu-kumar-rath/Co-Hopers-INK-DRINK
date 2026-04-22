import { useState, useEffect } from 'react'
import { refreshmentService } from '../api/services/refreshmentService'

const ICON_MAP = {
  coffee: '☕',
  espresso: '☕',
  cappuccino: '☕',
  latte: '🥛',
  mocha: '☕',
  americano: '☕',
  tea: '🍵',
  green: '🍵',
  black: '🍵',
  chai: '🍵',
  juice: '🧃',
  cold: '🧊',
  smoothie: '🥤',
  water: '💧',
  soda: '🥤',
  milk: '🥛',
  shake: '🥤',
  snack: '🍿',
  sandwich: '🥪',
  biscuit: '🍪',
  cake: '🍰',
  default: '🍽️',
}

function getIcon(name = '') {
  const lower = name.toLowerCase()
  for (const [key, icon] of Object.entries(ICON_MAP)) {
    if (lower.includes(key)) return icon
  }
  return ICON_MAP.default
}

const CARD_GRADIENTS = [
  'from-pink-400 via-rose-500 to-red-500',
  'from-orange-400 via-amber-500 to-yellow-500',
  'from-purple-400 via-fuchsia-500 to-pink-500',
  'from-emerald-400 via-teal-500 to-cyan-500',
  'from-indigo-400 via-blue-500 to-cyan-500',
  'from-rose-400 via-pink-500 to-fuchsia-500',
]

const INITIAL_ORDER = {
  name: '',
  quantity: 1,
  sugar: 'no',
  milk: 'no',
  time: '',
  notes: '',
}

/* ─── Skeleton Card ─────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-36 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-5/6" />
        <div className="h-8 bg-gray-200 rounded-xl w-1/2 mt-4" />
      </div>
    </div>
  )
}

/* ─── Order Modal ────────────────────────────────────────────── */
function OrderModal({ item, gradient, onClose }) {
  const [order, setOrder] = useState(INITIAL_ORDER)
  const [submitted, setSubmitted] = useState(false)

  const icon = getIcon(item.name || item.title || item.itemName || '')
  const name = item.name || item.title || item.itemName || 'Item'
  const price = item.price ?? item.rate ?? item.cost ?? null
  const total = price !== null ? price * Number(order.quantity) : null

  const handleChange = (e) => {
    const { name, value } = e.target
    setOrder(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!order.name || !order.time) {
      alert('Please fill in your name and preferred time.')
      return
    }
    console.log('Cafeteria order:', { item: name, ...order })
    setSubmitted(true)
  }

  const inputCls = 'w-full p-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100 bg-white transition-all'
  const labelCls = 'text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className={`bg-gradient-to-br ${gradient} p-6 flex items-center gap-4 rounded-t-3xl`}>
          <span className="text-4xl">{icon}</span>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{name}</h2>
            {price !== null && <p className="text-white/80 text-sm">₹{price} per item</p>}
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-3xl leading-none bg-transparent border-none cursor-pointer">×</button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 px-8 text-center">
            <div className="text-7xl">✅</div>
            <h3 className="text-2xl font-bold text-gray-800">Order Placed!</h3>
            <p className="text-gray-500 text-sm">Your order for <span className="font-semibold text-gray-700">{name}</span> has been submitted.</p>
            {total !== null && <p className="text-pink-600 font-bold text-lg">Total: ₹{total}</p>}
            <button onClick={onClose} className="mt-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
            <div>
              <label className={labelCls}>Your Name *</label>
              <input type="text" name="name" value={order.name} onChange={handleChange} placeholder="Enter your name" className={inputCls} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Quantity</label>
                <input type="number" name="quantity" min="1" max="10" value={order.quantity} onChange={handleChange} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Preferred Time *</label>
                <input type="time" name="time" value={order.time} onChange={handleChange} className={inputCls} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Sugar</label>
                <select name="sugar" value={order.sugar} onChange={handleChange} className={inputCls}>
                  <option value="no">No Sugar</option>
                  <option value="light">Light</option>
                  <option value="medium">Medium</option>
                  <option value="extra">Extra Sweet</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Milk</label>
                <select name="milk" value={order.milk} onChange={handleChange} className={inputCls}>
                  <option value="no">No Milk</option>
                  <option value="regular">Regular</option>
                  <option value="skim">Skim</option>
                  <option value="almond">Almond</option>
                  <option value="soy">Soy</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>Special Instructions <span className="text-gray-400 normal-case font-normal">(optional)</span></label>
              <textarea name="notes" value={order.notes} onChange={handleChange} rows={2} placeholder="e.g. extra hot, less sugar…" className={`${inputCls} resize-none`} />
            </div>

            {total !== null && (
              <div className="bg-pink-50 border border-pink-100 rounded-2xl p-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">₹{price} × {order.quantity} {Number(order.quantity) > 1 ? 'items' : 'item'}</div>
                <div className="text-2xl font-bold text-pink-600">₹{total}</div>
              </div>
            )}

            <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl text-base font-semibold hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200">
              Place Order ☕
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────────────── */
const CoffeeBooking = () => {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedGradient, setSelectedGradient] = useState('')

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await refreshmentService.getItems()
        const items = response?.data ?? response?.items ?? response ?? []
        setMenuItems(Array.isArray(items) ? items : [])
      } catch (err) {
        setError(err.message || 'Failed to load cafeteria items')
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [])

  const handleCardClick = (item, gradient) => {
    setSelectedItem(item)
    setSelectedGradient(gradient)
  }

  return (
    <div className="min-h-[60vh]">
      <div className="text-center mb-10">
        <p className="text-gray-500 text-base mt-2">Select an item to place your order</p>
      </div>

      {error && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="text-6xl">⚠️</div>
          <p className="text-red-500 font-semibold text-lg">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-pink-600 text-white rounded-xl font-medium hover:bg-pink-700 transition-colors">Retry</button>
        </div>
      )}

      {loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {!loading && !error && menuItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="text-8xl opacity-30">☕</div>
          <p className="text-gray-400 text-xl font-medium">No items available yet</p>
          <p className="text-gray-400 text-sm">Check back later — the admin hasn't posted anything yet.</p>
        </div>
      )}

      {!loading && !error && menuItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => {
            const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length]
            const icon = getIcon(item.name || item.title || item.itemName || '')
            const name = item.name || item.title || item.itemName || 'Item'
            const description = item.description || item.desc || item.details || ''
            const price = item.price ?? item.rate ?? item.cost ?? null
            const unit = item.unit || item.per || ''

            return (
              <div
                key={item.id ?? item._id ?? index}
                onClick={() => handleCardClick(item, gradient)}
                className="relative rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer hover:-translate-y-2"
              >
                <div className={`bg-gradient-to-br ${gradient} pt-10 pb-7 px-8 flex flex-col items-center text-white`}>
                  <span className="text-5xl mb-2 drop-shadow">{icon}</span>
                  <h3 className="text-xl font-bold text-center leading-tight">{name}</h3>
                </div>

                <div className="bg-white p-5 flex flex-col gap-3">
                  {description && <p className="text-gray-500 text-sm leading-relaxed">{description}</p>}

                  {price !== null && (
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-800">₹{price}</span>
                      {unit && <span className="text-sm text-gray-400">/ {unit}</span>}
                    </div>
                  )}

                  {item.category && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-xs bg-pink-50 text-pink-600 px-3 py-1 rounded-full font-medium border border-pink-100">{item.category}</span>
                    </div>
                  )}

                  <div className="mt-2 text-xs text-pink-500 font-semibold flex items-center gap-1">Tap to order →</div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedItem && (
        <OrderModal item={selectedItem} gradient={selectedGradient} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  )
}

export default CoffeeBooking

