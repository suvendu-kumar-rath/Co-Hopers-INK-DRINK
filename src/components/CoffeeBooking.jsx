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

const COFFEE_KEYWORDS = ['coffee', 'espresso', 'cappuccino', 'latte', 'mocha', 'americano']
const TEA_KEYWORDS = ['tea', 'chai', 'green', 'black']

function getOrderType(name = '') {
  const lower = name.toLowerCase()
  if (COFFEE_KEYWORDS.some(k => lower.includes(k))) return 'Coffee'
  if (TEA_KEYWORDS.some(k => lower.includes(k))) return 'Tea'
  return 'Food'
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
  itemName: '',
  orderType: '',
  price: null,
  quantity: 1,
  specialInstructions: '',
  utrNumber: '',
  isPersonal: false,
  isMonthlyPayment: false,
  paymentScreenshot: null,
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
  const itemId = item.id ?? item._id
  const fallbackName = item.name || item.title || item.itemName || ''

  const [order, setOrder] = useState({ ...INITIAL_ORDER })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [detailLoading, setDetailLoading] = useState(true)
  const [detailError, setDetailError] = useState(null)

  // Fetch full item detail by ID on open
  useEffect(() => {
    if (!itemId) {
      // No id — fall back to card data
      setOrder(prev => ({
        ...prev,
        itemName: fallbackName,
        orderType: item.category || getOrderType(fallbackName),
      }))
      setDetailLoading(false)
      return
    }
    setDetailLoading(true)
    setDetailError(null)
    refreshmentService.getItemById(itemId)
      .then(response => {
        // API may return { data: { item, category, ... } } or flat { item, category }
        const detail = response?.data ?? response
        const itemName = detail?.item ?? detail?.itemName ?? detail?.name ?? fallbackName
        const orderType = detail?.category ?? detail?.orderType ?? item.category ?? getOrderType(itemName)
        const detailPrice = detail?.price ?? detail?.rate ?? detail?.cost ?? null
        setOrder(prev => ({ ...prev, itemName, orderType, ...(detailPrice !== null && { price: detailPrice }) }))
      })
      .catch(err => {
        setDetailError('Could not load item details. Using card info.')
        setOrder(prev => ({
          ...prev,
          itemName: fallbackName,
          orderType: item.category || getOrderType(fallbackName),
        }))
      })
      .finally(() => setDetailLoading(false))
  }, [itemId])

  const icon = getIcon(order.itemName || fallbackName)
  const price = order.price ?? item.price ?? item.rate ?? item.cost ?? null
  const total = price !== null ? price * Number(order.quantity) : null

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    if (type === 'checkbox') {
      setOrder(prev => ({ ...prev, [name]: checked }))
    } else if (type === 'file') {
      setOrder(prev => ({ ...prev, [name]: files[0] || null }))
    } else if (name === 'itemName') {
      setOrder(prev => ({ ...prev, itemName: value, orderType: getOrderType(value) }))
    } else {
      setOrder(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitting(true)
    try {
      const orders = [
        {
          orderType: order.orderType,
          itemName: order.itemName,
          quantity: Number(order.quantity),
          price: price ?? 0,
        },
      ]
      const formData = new FormData()
      formData.append('orders', JSON.stringify(orders))
      formData.append('specialInstructions', order.specialInstructions)
      formData.append('utrNumber', order.utrNumber)
      formData.append('isPersonal', String(order.isPersonal))
      formData.append('isMonthlyPayment', String(order.isMonthlyPayment))
      if (order.paymentScreenshot) {
        formData.append('paymentScreenshot', order.paymentScreenshot)
      }
      await refreshmentService.createOrder(formData)
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err.message || 'Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
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
            <h2 className="text-xl font-bold text-white">{order.itemName || fallbackName}</h2>
            {price !== null && <p className="text-white/80 text-sm">₹{price} per item</p>}
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-3xl leading-none bg-transparent border-none cursor-pointer">×</button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 px-8 text-center">
            <div className="text-7xl">✅</div>
            <h3 className="text-2xl font-bold text-gray-800">Order Placed!</h3>
            <p className="text-gray-500 text-sm">Your order for <span className="font-semibold text-gray-700">{order.itemName || fallbackName}</span> has been submitted.</p>
            {total !== null && <p className="text-pink-600 font-bold text-lg">Total: ₹{total}</p>}
            <button onClick={onClose} className="mt-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
            {detailError && (
              <p className="text-amber-500 text-xs text-center">{detailError}</p>
            )}

            {/* Item Name — read-only, from API */}
            <div>
              <label className={labelCls}>Item Name</label>
              {detailLoading
                ? <div className="w-full p-2.5 border-2 border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-400 animate-pulse">Loading…</div>
                : <div className="w-full p-2.5 border-2 border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-800 font-medium">{order.itemName || '—'}</div>
              }
            </div>

            {/* Order Type — read-only, from API category */}
            <div>
              <label className={labelCls}>Order Type</label>
              {detailLoading
                ? <div className="w-full p-2.5 border-2 border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-400 animate-pulse">Loading…</div>
                : <div className="w-full p-2.5 border-2 border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-800 font-medium">{order.orderType || '—'}</div>
              }
            </div>

            {/* Quantity */}
            <div>
              <label className={labelCls}>Quantity</label>
              <input
                type="number"
                name="quantity"
                min="1"
                max="10"
                value={order.quantity}
                onChange={handleChange}
                className={inputCls}
              />
            </div>

            {/* Special Instructions */}
            <div>
              <label className={labelCls}>
                Special Instructions{' '}
                <span className="text-gray-400 normal-case font-normal">(optional)</span>
              </label>
              <textarea
                name="specialInstructions"
                value={order.specialInstructions}
                onChange={handleChange}
                rows={2}
                placeholder="e.g. extra hot, less sugar…"
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Payment toggles */}
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-pink-400 transition-colors">
                <input
                  type="checkbox"
                  name="isPersonal"
                  checked={order.isPersonal}
                  onChange={handleChange}
                  className="w-4 h-4 accent-pink-500"
                />
                <span className="text-sm font-medium text-gray-700">Personal Order</span>
              </label>
              <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-pink-400 transition-colors">
                <input
                  type="checkbox"
                  name="isMonthlyPayment"
                  checked={order.isMonthlyPayment}
                  onChange={handleChange}
                  className="w-4 h-4 accent-pink-500"
                />
                <span className="text-sm font-medium text-gray-700">Monthly Payment</span>
              </label>
            </div>

            {/* UTR Number */}
            <div>
              <label className={labelCls}>UTR Number</label>
              <input
                type="text"
                name="utrNumber"
                value={order.utrNumber}
                onChange={handleChange}
                placeholder="Enter UTR / transaction ID"
                className={inputCls}
              />
            </div>

            {/* Payment Screenshot */}
            <div>
              <label className={labelCls}>
                Payment Screenshot{' '}
                <span className="text-gray-400 normal-case font-normal">(optional)</span>
              </label>
              <input
                type="file"
                name="paymentScreenshot"
                accept="image/*"
                onChange={handleChange}
                className={`${inputCls} file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-pink-50 file:text-pink-600 hover:file:bg-pink-100 cursor-pointer`}
              />
            </div>

            {/* Total */}
            {total !== null && (
              <div className="bg-pink-50 border border-pink-100 rounded-2xl p-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">₹{price} × {order.quantity} {Number(order.quantity) > 1 ? 'items' : 'item'}</div>
                <div className="text-2xl font-bold text-pink-600">₹{total}</div>
              </div>
            )}

            {/* Error */}
            {submitError && (
              <p className="text-red-500 text-sm text-center">{submitError}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl text-base font-semibold hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {submitting ? 'Placing Order…' : 'Place Order ☕'}
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
                  <h3 className="text-4xl font-bold text-center leading-tight">{item.category}</h3>
                </div>

                <div className="bg-white p-5 flex flex-col gap-3">
                  {description && <p className="text-gray-500 text-sm leading-relaxed">{description}</p>}

                  {price !== null && (
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-800">₹{price}</span>
                      {unit && <span className="text-sm text-gray-400">/ {unit}</span>}
                    </div>
                  )}

                  {/* {item.category && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-xs bg-pink-50 text-pink-600 px-3 py-1 rounded-full font-medium border border-pink-100">{item.category}</span>
                    </div>
                  )} */}

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

