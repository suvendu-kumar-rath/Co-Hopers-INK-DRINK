// Example usage of API services in React components
import { useState, useEffect } from 'react'
import { authService, refreshmentService, utilitiesService } from '../api'

/**
 * Example: Login Component
 */
export const LoginExample = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await authService.login({ email, password })
      console.log('Login successful:', response)
      // Handle successful login (e.g., redirect to dashboard)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  )
}

/**
 * Example: Fetch Menu Items
 */
export const MenuExample = () => {
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await refreshmentService.getMenu()
        setMenu(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
  }, [])

  if (loading) return <div>Loading menu...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h2>Menu</h2>
      <ul>
        {menu.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Example: Create Order
 */
export const OrderExample = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const handleCreateOrder = async () => {
    setLoading(true)
    try {
      const order = await refreshmentService.createOrder({
        items: items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
        notes: 'Please deliver to desk 5',
      })
      console.log('Order created:', order)
      alert('Order placed successfully!')
    } catch (err) {
      alert('Failed to create order: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleCreateOrder} disabled={loading}>
      {loading ? 'Creating order...' : 'Place Order'}
    </button>
  )
}

/**
 * Example: Fetch Pricing
 */
export const PricingExample = () => {
  const [pricing, setPricing] = useState(null)

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const data = await utilitiesService.getPricing()
        setPricing(data)
      } catch (err) {
        console.error('Failed to fetch pricing:', err)
      }
    }

    fetchPricing()
  }, [])

  return (
    <div>
      {pricing ? (
        <div>
          <h3>Printing Prices</h3>
          <p>Black & White: ${pricing.bw}</p>
          <p>Color: ${pricing.color}</p>
        </div>
      ) : (
        <p>Loading pricing...</p>
      )}
    </div>
  )
}
