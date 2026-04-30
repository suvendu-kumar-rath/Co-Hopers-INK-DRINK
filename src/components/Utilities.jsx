import { useState, useEffect, useRef } from 'react'
import { utilitiesService } from '../api'

const ICON_MAP = {
  print: '🖨️',
  printing: '🖨️',
  scan: '🔍',
  scanning: '🔍',
  photocopy: '📄',
  copy: '📄',
  lamination: '🗂️',
  laminate: '🗂️',
  binding: '📚',
  bind: '📚',
  stationery: '✏️',
  internet: '🌐',
  wifi: '📶',
  fax: '📠',
  id: '🪪',
  default: '⚙️',
}

function getIcon(name = '') {
  const lower = name.toLowerCase()
  for (const [key, icon] of Object.entries(ICON_MAP)) {
    if (lower.includes(key)) return icon
  }
  return ICON_MAP.default
}

const CARD_GRADIENTS = [
  'from-cyan-400 via-blue-500 to-indigo-600',
  'from-purple-400 via-purple-500 to-pink-500',
  'from-emerald-400 via-teal-500 to-cyan-600',
  'from-orange-400 via-rose-500 to-pink-600',
  'from-indigo-400 via-blue-500 to-cyan-500',
  'from-amber-400 via-orange-500 to-red-500',
]

const INITIAL_ORDER = {
  copies: 1,
  colorMode: 'blackwhite',
  paperSize: 'a4',
  orientation: 'portrait',
  doubleSided: false,
  printType: 'normal',
  notes: '',
  file: null,
}

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
  const [dragOver, setDragOver] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [orderResult, setOrderResult] = useState(null)
  const [utilityDetail, setUtilityDetail] = useState(null)
  const fileInputRef = useRef()

  const COLOR_MODE_MAP = { blackwhite: 'Black & White', color: 'Color' }
  const PAPER_SIZE_MAP = { a4: 'A4', a3: 'A3', letter: 'Letter', legal: 'Legal' }
  const ORIENTATION_MAP = { portrait: 'Portrait', landscape: 'Landscape' }
  const PRINT_TYPE_MAP = { normal: 'Normal', high_quality: 'High Quality', draft: 'Draft' }

  // Fetch full utility details on mount
  useEffect(() => {
    const id = item.id ?? item._id
    if (!id) return
    utilitiesService.getById(id)
      .then((data) => setUtilityDetail(data?.utility ?? data?.data ?? data))
      .catch(() => {}) // fallback to card data
  }, [item])

  const activeItem = utilityDetail ?? item
  const icon = getIcon(activeItem.name || activeItem.title || activeItem.utilityName || '')
  const name = activeItem.name || activeItem.title || activeItem.utilityName || 'Utility'
  const price = activeItem.price ?? activeItem.rate ?? activeItem.cost ?? null
  const utilityId = activeItem.id ?? activeItem._id ?? item.id ?? item._id

  const perPagePrice = price ?? (order.colorMode === 'color' ? 5 : 2)
  const total = perPagePrice * Number(order.copies)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setOrder(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleFile = (file) => {
    if (file) setOrder(prev => ({ ...prev, file }))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!order.file) {
      alert('Please upload a file before submitting.')
      return
    }
    setApiError(null)
    setSubmitting(true)
    try {
      const result = await utilitiesService.placeOrder({
        orders: [
          {
            utilityId: utilityId,
            quantity: Number(order.copies),
            printType: PRINT_TYPE_MAP[order.printType] ?? 'Normal',
            colorMode: COLOR_MODE_MAP[order.colorMode] ?? 'Black & White',
            paperSize: PAPER_SIZE_MAP[order.paperSize] ?? 'A4',
            orientation: ORIENTATION_MAP[order.orientation] ?? 'Portrait',
            doubleSided: order.doubleSided,
          },
        ],
        specialInstruction: order.notes || '',
        printFile: order.file,
      })
      setOrderResult(result)
      setSubmitted(true)
    } catch (err) {
      setApiError(err.message || 'Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls = 'w-full p-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white transition-all'
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
        {/* Modal header */}
        <div className={`bg-gradient-to-br ${gradient} p-6 flex items-center gap-4 rounded-t-3xl`}>
          <span className="text-4xl">{icon}</span>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{name}</h2>
            {price !== null && (
              <p className="text-white/80 text-sm">₹{price} per page</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-3xl leading-none bg-transparent border-none cursor-pointer"
          >
            ×
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 px-8 text-center">
            <div className="text-7xl">✅</div>
            <h3 className="text-2xl font-bold text-gray-800">Order Placed!</h3>
            <p className="text-gray-500 text-sm">Your print request for <span className="font-semibold text-gray-700">{name}</span> has been submitted.</p>
            <p className="text-indigo-600 font-bold text-lg">Total: ₹{orderResult?.totalAmount ?? total}</p>
            {orderResult?.orders?.[0] && (
              <p className="text-gray-400 text-xs">Order ID: #{orderResult.orders[0].id} · Status: {orderResult.orders[0].status}</p>
            )}
            <button
              onClick={onClose}
              className="mt-2 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">

            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                {apiError}
              </div>
            )}

            {/* ── File Upload ── */}
            <div>
              <label className={labelCls}>Upload File</label>
              <div
                className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200
                  ${dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50/50'}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.ppt,.pptx"
                  className="hidden"
                  onChange={e => handleFile(e.target.files[0])}
                />
                {order.file ? (
                  <>
                    <span className="text-4xl">📎</span>
                    <p className="text-indigo-600 font-semibold text-sm text-center break-all">{order.file.name}</p>
                    <p className="text-gray-400 text-xs">{(order.file.size / 1024).toFixed(1)} KB — click to change</p>
                  </>
                ) : (
                  <>
                    <span className="text-4xl text-gray-300">📁</span>
                    <p className="text-gray-500 text-sm font-medium">Drag & drop or <span className="text-indigo-500 underline">browse</span></p>
                    <p className="text-gray-400 text-xs">PDF, DOC, DOCX, JPG, PNG, PPT</p>
                  </>
                )}
              </div>
            </div>

            {/* ── Print Type & Color ── */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Print Type</label>
                <select name="printType" value={order.printType} onChange={handleChange} className={inputCls}>
                  <option value="normal">Normal</option>
                  <option value="high_quality">High Quality</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Color Mode</label>
                <select name="colorMode" value={order.colorMode} onChange={handleChange} className={inputCls}>
                  <option value="blackwhite">Black & White</option>
                  <option value="color">Color</option>
                </select>
              </div>
            </div>

            {/* ── Paper Size & Orientation ── */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Paper Size</label>
                <select name="paperSize" value={order.paperSize} onChange={handleChange} className={inputCls}>
                  <option value="a4">A4</option>
                  <option value="a3">A3</option>
                  <option value="letter">Letter</option>
                  <option value="legal">Legal</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Orientation</label>
                <select name="orientation" value={order.orientation} onChange={handleChange} className={inputCls}>
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
            </div>

            {/* ── Copies & Double Sided ── */}
            <div className="grid grid-cols-2 gap-4 items-end">
              <div>
                <label className={labelCls}>Number of Copies</label>
                <input
                  type="number"
                  name="copies"
                  min="1"
                  max="100"
                  value={order.copies}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div className="flex items-center gap-3 pb-2.5">
                <input
                  type="checkbox"
                  id="doubleSided"
                  name="doubleSided"
                  checked={order.doubleSided}
                  onChange={handleChange}
                  className="w-5 h-5 rounded accent-indigo-600 cursor-pointer"
                />
                <label htmlFor="doubleSided" className="text-sm font-semibold text-gray-700 cursor-pointer">
                  Double Sided
                </label>
              </div>
            </div>

            {/* ── Special Instructions ── */}
            <div>
              <label className={labelCls}>Special Instructions <span className="text-gray-400 normal-case font-normal">(optional)</span></label>
              <textarea
                name="notes"
                value={order.notes}
                onChange={handleChange}
                rows={2}
                placeholder="e.g. staple top-left, print pages 1–5 only…"
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* ── Price Summary ── */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                ₹{perPagePrice} × {order.copies} {order.copies > 1 ? 'copies' : 'copy'}
              </div>
              <div className="text-2xl font-bold text-indigo-600">₹{total}</div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-base font-semibold hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {submitting ? 'Submitting…' : 'Submit Order'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────────────── */
const Utilities = () => {
  const [utilities, setUtilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedGradient, setSelectedGradient] = useState('')
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  useEffect(() => {
    const fetchUtilities = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await utilitiesService.getAll()
        const items = response?.data ?? response?.utilities ?? response?.items ?? response ?? []
        setUtilities(Array.isArray(items) ? items : [])
      } catch (err) {
        setError(err.message || 'Failed to load utilities')
      } finally {
        setLoading(false)
      }
    }
    fetchUtilities()
  }, [])

  const handleCardClick = (item, gradient) => {
    const available = item.availability
      ? item.availability.toLowerCase() === 'available'
      : (item.available ?? item.isAvailable ?? true)
    if (!available) return
    if (!localStorage.getItem('authToken')) {
      setShowLoginPrompt(true)
      return
    }
    setSelectedItem(item)
    setSelectedGradient(gradient)
  }

  return (
    <div className="min-h-[60vh]">
      {/* Section header */}
      <div className="text-center mb-10">
        <p className="text-gray-500 text-base mt-2">Available services provided by admin</p>
      </div>

      {/* Login prompt */}
      {showLoginPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={() => setShowLoginPrompt(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center gap-5 text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-6xl">🔐</div>
            <h3 className="text-xl font-bold text-gray-800">Login Required</h3>
            <p className="text-gray-500 text-sm">You need to be logged in to place an order.</p>
            <button
              onClick={() => setShowLoginPrompt(false)}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="text-6xl">⚠️</div>
          <p className="text-red-500 font-semibold text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && utilities.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="text-8xl opacity-30">🗂️</div>
          <p className="text-gray-400 text-xl font-medium">No utilities available yet</p>
          <p className="text-gray-400 text-sm">Check back later — the admin hasn't posted anything yet.</p>
        </div>
      )}

      {/* Utilities grid */}
      {!loading && !error && utilities.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {utilities.map((item, index) => {
            const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length]
            const icon = getIcon(item.name || item.title || item.utilityName || '')
            const name = item.name || item.title || item.utilityName || 'Utility'
            const description = item.description || item.desc || item.details || ''
            const price = item.price ?? item.rate ?? item.cost ?? null
            const unit = item.unit || item.priceUnit || item.per || ''
            const available = item.availability
              ? item.availability.toLowerCase() === 'available'
              : (item.available ?? item.isAvailable ?? true)

            return (
              <div
                key={item.id ?? item._id ?? index}
                onClick={() => handleCardClick(item, gradient)}
                className={`relative rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl
                  ${available ? 'cursor-pointer hover:-translate-y-2' : 'opacity-60 cursor-not-allowed'}`}
              >
                {/* Availability badge */}
                <div className="absolute top-3 right-3 z-10">
                  {available ? (
                    <span className="flex items-center gap-1 bg-emerald-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                      <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-pulse" />
                      Available
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow">
                      <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
                      Not Available
                    </span>
                  )}
                </div>

                {/* Gradient banner */}
                <div className={`bg-gradient-to-br ${gradient} pt-10 pb-7 px-8 flex flex-col items-center text-white`}>
                  <span className="text-5xl mb-2 drop-shadow">{icon}</span>
                  <h3 className="text-xl font-bold text-center leading-tight">{name}</h3>
                </div>

                {/* Card body */}
                <div className="bg-white p-5 flex flex-col gap-3">
                  {description && (
                    <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
                  )}

                  {price !== null && (
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-800">₹{price}</span>
                      {unit && <span className="text-sm text-gray-400">/ {unit}</span>}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-1">
                    {item.category && (
                      <span className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-medium border border-indigo-100">
                        {item.category}
                      </span>
                    )}
                    {item.duration && (
                      <span className="text-xs bg-amber-50 text-amber-600 px-3 py-1 rounded-full font-medium border border-amber-100">
                        ⏱ {item.duration}
                      </span>
                    )}
                    {item.floor && (
                      <span className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-medium border border-emerald-100">
                        📍 Floor {item.floor}
                      </span>
                    )}
                  </div>

                  {available && (
                    <div className="mt-2 text-xs text-indigo-500 font-semibold flex items-center gap-1">
                      Tap to place order →
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Order Modal */}
      {selectedItem && (
        <OrderModal
          item={selectedItem}
          gradient={selectedGradient}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  )
}

export default Utilities
