import { useState } from 'react';
import './CoffeeBooking.css';

const CoffeeBooking = () => {
  const [booking, setBooking] = useState({
    coffeeType: 'espresso',
    size: 'medium',
    sugar: 'no',
    milk: 'no',
    quantity: 1,
    name: '',
    time: ''
  });

  const [bookings, setBookings] = useState([]);

  const coffeeTypes = ['Espresso', 'Cappuccino', 'Latte', 'Americano', 'Mocha'];
  const sizes = { small: '₹50', medium: '₹80', large: '₹120' };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBooking(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!booking.name || !booking.time) {
      alert('Please fill in all required fields');
      return;
    }

    const newBooking = {
      ...booking,
      id: Date.now(),
      status: 'pending',
      createdAt: new Date().toLocaleString()
    };

    setBookings([...bookings, newBooking]);
    
    // Reset form
    setBooking({
      coffeeType: 'espresso',
      size: 'medium',
      sugar: 'no',
      milk: 'no',
      quantity: 1,
      name: '',
      time: ''
    });

    alert('Coffee booking confirmed! ☕');
  };

  const cancelBooking = (id) => {
    setBookings(bookings.filter(b => b.id !== id));
  };

  return (
    <div className="coffee-booking">
      <h1>☕ Coffee Booking Station</h1>
      
      <div className="booking-container">
        <form onSubmit={handleSubmit} className="booking-form">
          <h2>Place Your Order</h2>
          
          <div className="form-group">
            <label htmlFor="name">Your Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={booking.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="coffeeType">Coffee Type *</label>
            <select
              id="coffeeType"
              name="coffeeType"
              value={booking.coffeeType}
              onChange={handleInputChange}
              required
            >
              {coffeeTypes.map(type => (
                <option key={type} value={type.toLowerCase()}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="size">Size *</label>
            <select
              id="size"
              name="size"
              value={booking.size}
              onChange={handleInputChange}
              required
            >
              {Object.entries(sizes).map(([size, price]) => (
                <option key={size} value={size}>
                  {size.charAt(0).toUpperCase() + size.slice(1)} - {price}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="sugar">Sugar</label>
            <select
              id="sugar"
              name="sugar"
              value={booking.sugar}
              onChange={handleInputChange}
            >
              <option value="no">No Sugar</option>
              <option value="light">Light</option>
              <option value="medium">Medium</option>
              <option value="extra">Extra Sweet</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="milk">Milk</label>
            <select
              id="milk"
              name="milk"
              value={booking.milk}
              onChange={handleInputChange}
            >
              <option value="no">No Milk</option>
              <option value="regular">Regular Milk</option>
              <option value="skim">Skim Milk</option>
              <option value="almond">Almond Milk</option>
              <option value="soy">Soy Milk</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              max="10"
              value={booking.quantity}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="time">Preferred Time *</label>
            <input
              type="time"
              id="time"
              name="time"
              value={booking.time}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Book Coffee ☕
          </button>
        </form>

        <div className="bookings-list">
          <h2>Your Bookings</h2>
          {bookings.length === 0 ? (
            <p className="no-bookings">No bookings yet. Place your first order!</p>
          ) : (
            <div className="bookings-cards">
              {bookings.map(b => (
                <div key={b.id} className="booking-card">
                  <div className="booking-header">
                    <h3>{b.name}</h3>
                    <span className="status-badge">{b.status}</span>
                  </div>
                  <div className="booking-details">
                    <p><strong>Coffee:</strong> {b.coffeeType.charAt(0).toUpperCase() + b.coffeeType.slice(1)}</p>
                    <p><strong>Size:</strong> {b.size}</p>
                    <p><strong>Sugar:</strong> {b.sugar}</p>
                    <p><strong>Milk:</strong> {b.milk}</p>
                    <p><strong>Quantity:</strong> {b.quantity}</p>
                    <p><strong>Time:</strong> {b.time}</p>
                    <p className="created-at">Booked: {b.createdAt}</p>
                  </div>
                  <button 
                    onClick={() => cancelBooking(b.id)} 
                    className="cancel-btn"
                  >
                    Cancel Booking
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoffeeBooking;
