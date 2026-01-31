import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

export default function Cart() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItems, setSelectedItems] = useState([])
  const [address, setAddress] = useState({ street: '', city: '', zip: '', country: '' })
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const userId = localStorage.getItem("userId")
  const navigate = useNavigate()

  useEffect(() => {
    fetchCart()
  }, [])

  async function fetchCart() {
    if (!userId) {
      Swal.fire({
        title: "Login Required",
        text: "Please login first to view your cart",
        icon: "warning"
      })
      return
    }
    axios.get("https://firstapp-project-1.onrender.com/api/cart", {
      params: { userId }
    })
      .then(res => {
        if (res.status === 200) {
          setCart(res.data)
          setLoading(false)
          setSelectedItems(res.data.items.map(item => item.product._id))
        }
      })
      .catch(err => {
        console.error("Error fetching cart", err)
        setLoading(false)
      })
  }

  // Remove Item
  async function removeItem(productId) {
    try {
      await axios.delete(`https://firstapp-project-1.onrender.com/api/cart/${productId}`, {
        params: { userId }
      })
      Swal.fire("Removed!", "Item removed from cart", "success")
      fetchCart()
    } catch (err) {
      Swal.fire("Error", "Could not remove item", "error")
    }
  }

  // Update Quantity
  async function updateQuantity(productId, quantity) {
    try {
      await axios.put("https://firstapp-project-1.onrender.com/api/cart/update", {
        userId,
        productId,
        quantity: parseInt(quantity)
      })
      fetchCart()
    } catch (err) {
      Swal.fire("Error", "Could not update quantity", "error")
    }
  }

  // Checkout
  async function checkout() {
    if (selectedItems.length === 0) {
      Swal.fire("No items selected", "Please select items to checkout", "warning")
      return
    }
    if (!address.street || !address.city || !address.zip || !address.country) {
      Swal.fire("Address Required", "Please fill in your delivery address", "warning")
      return
    }
    try {
      await axios.post("https://firstapp-project-1.onrender.com/api/order", { userId, selectedItems, address, promoCode })
      Swal.fire("Success!", "Your order has been placed", "success")
      setCart(null)
      setSelectedItems([])
      setAddress({ street: '', city: '', zip: '', country: '' })
      setPromoCode('')
    } catch (err) {
      Swal.fire("Error", "Checkout failed", "error")
    }
  }

  // Save for Later
  async function saveForLater(productId) {
    try {
      await axios.post("https://firstapp-project-1.onrender.com/api/wishlist", { userId, productId })
      Swal.fire("Saved!", "Item moved to wishlist", "info")
      removeItem(productId)
    } catch (err) {
      Swal.fire("Error", "Could not save item", "error")
    }
  }

  // Toggle select item
  function toggleSelect(productId) {
    setSelectedItems(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  // Select/Deselect All
  function toggleSelectAll() {
    if (selectedItems.length === cart.items.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(cart.items.map(item => item.product._id))
    }
  }

  // Apply Promo Code
  function applyPromo() {
    if (promoCode === 'DISCOUNT10') {
      setDiscount(0.1) // 10% discount
      Swal.fire("Applied!", "10% discount applied", "success")
    } else {
      setDiscount(0)
      Swal.fire("Invalid", "Promo code not valid", "error")
    }
  }

  const filteredItems = cart ? cart.items.filter(item =>
    item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : []

  const selectedTotal = cart ? cart.items
    .filter(item => selectedItems.includes(item.product._id))
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0) : 0

  const shipping = selectedTotal > 50 ? 0 : 5.99
  const tax = selectedTotal * 0.08
  const discountAmount = selectedTotal * discount
  const grandTotal = selectedTotal + shipping + tax - discountAmount

  return (
    <div className='container-fluid mt-4' style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px' }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="text-primary">🛒 Your Shopping Cart</h2>
          <button className="btn btn-outline-primary" onClick={() => navigate('/')}>🏠 Continue Shopping</button>
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">🔍</span>
          <input
            type="text"
            className="form-control"
            placeholder="Search products in cart..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {
          loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            !cart || cart.items.length === 0 ? (
              <div className="text-center">
                <p className="display-6 text-muted">Your cart is empty</p>
                <button className="btn btn-primary" onClick={() => navigate('/')}>Start Shopping</button>
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-8">
                  <div className="card shadow-sm mb-3">
                    <div className="card-header bg-light">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={selectedItems.length === cart.items.length}
                          onChange={toggleSelectAll}
                          id="selectAll"
                        />
                        <label className="form-check-label fw-bold" htmlFor="selectAll">
                          Select All Items ({cart.items.length})
                        </label>
                      </div>
                    </div>
                    <div className="card-body">
                      {filteredItems.map((item) => (
                        <div className="row align-items-center border-bottom py-3" key={item.product._id}>
                          <div className="col-1">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={selectedItems.includes(item.product._id)}
                              onChange={() => toggleSelect(item.product._id)}
                            />
                          </div>
                          <div className="col-2">
                            {item.product.image ? (
                              <img src={item.product.image} alt={item.product.name} className="img-fluid rounded" style={{ maxHeight: '80px' }} />
                            ) : (
                              <div className="bg-secondary text-white d-flex align-items-center justify-content-center rounded" style={{ height: '80px', width: '80px' }}>
                                No Image
                              </div>
                            )}
                          </div>
                          <div className="col-5">
                            <h6 className="mb-1">{item.product.name}</h6>
                            <p className="text-muted small mb-1">{item.product.description}</p>
                            <p className="text-muted small mb-1">Category: {item.product.category}</p>
                            <p className="text-warning small mb-0">⭐ {item.product.rating || 'N/A'} / 5</p>
                            <div className="mt-2">
                              <button className="btn btn-sm btn-outline-danger me-2" onClick={() => removeItem(item.product._id)}>🗑️ Delete</button>
                              <button className="btn btn-sm btn-outline-info" onClick={() => saveForLater(item.product._id)}>💾 Save for Later</button>
                            </div>
                          </div>
                          <div className="col-2 text-center">
                            <p className="fw-bold mb-1">₹{item.product.price}</p>
                            <select
                              className="form-select form-select-sm"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.product._id, e.target.value)}
                            >
                              {Array.from({length: 10}, (_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                              ))}
                            </select>
                          </div>
                          <div className="col-2 text-end">
                            <p className="fw-bold">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="card shadow-sm mb-3">
                    <div className="card-header bg-light">
                      <h5 className="mb-0">📍 Delivery Address</h5>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Street Address"
                          value={address.street}
                          onChange={(e) => setAddress({...address, street: e.target.value})}
                        />
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="City"
                          value={address.city}
                          onChange={(e) => setAddress({...address, city: e.target.value})}
                        />
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="ZIP Code"
                          value={address.zip}
                          onChange={(e) => setAddress({...address, zip: e.target.value})}
                        />
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Country"
                          value={address.country}
                          onChange={(e) => setAddress({...address, country: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="card shadow-sm mb-3">
                    <div className="card-header bg-light">
                      <h5 className="mb-0">💰 Order Summary</h5>
                    </div>
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal ({selectedItems.length} items):</span>
                        <span>₹{selectedTotal.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Shipping:</span>
                        <span>₹{shipping.toFixed(2)}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Tax:</span>
                        <span>₹{tax.toFixed(2)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="d-flex justify-content-between mb-2 text-success">
                          <span>Discount:</span>
                          <span>-₹{discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <hr />
                      <div className="d-flex justify-content-between fw-bold">
                        <span>Total:</span>
                        <span>₹{grandTotal.toFixed(2)}</span>
                      </div>
                      <div className="input-group mt-3 mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Promo Code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <button className="btn btn-outline-secondary" onClick={applyPromo}>Apply</button>
                      </div>
                      <button className="btn btn-success w-100" onClick={checkout}>🚀 Proceed to Checkout</button>
                    </div>
                  </div>
                </div>
              </div>
            )
          )
        }
      </div>
    </div>
  )
}
