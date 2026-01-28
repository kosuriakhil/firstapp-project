import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import "./Login.css"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    const newUser = { email, password }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/login",
        newUser
      )

      if (response.status === 200) {
        localStorage.setItem("userId", response.data.userId)
        localStorage.setItem("role", response.data.role)
        navigate("/")
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed")
    }
  }

  return (
    <div className="login-bg">
      <div className="login-card">
        <h3 className="text-center mb-4 text-white">Login Form</h3>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control custom-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control custom-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="d-flex justify-content-between mb-4 text-white small">
            <div>
              <input type="checkbox" className="form-check-input me-1" />
              Remember me
            </div>
            <span className="cursor-pointer">Forgot password?</span>
          </div>

          <button className="btn btn-light w-100 fw-semibold">
            Log In
          </button>

          <p className="text-center text-white mt-4 mb-0">
            Don’t have an account?{" "}
            <Link to="/register" className="text-white fw-semibold">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}