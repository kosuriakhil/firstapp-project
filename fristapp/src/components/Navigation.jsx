import { Link, useNavigate } from "react-router-dom"

export default function Navigation() {
  const navigate = useNavigate()
  const userId = localStorage.getItem("userId")
  const userRole = localStorage.getItem("role")

  // Close navbar on link click
  const closeNavbar = () => {
    const navbar = document.getElementById("navbarNav")
    if (navbar && navbar.classList.contains("show")) {
      navbar.classList.remove("show")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("userId")
    localStorage.removeItem("role")
    closeNavbar()
    navigate("/login")
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/" onClick={closeNavbar}>
          MyApp
        </Link>

        {/* Toggle button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">

            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={closeNavbar}>
                Home
              </Link>
            </li>

            {userId ? (
              userRole === "admin" ? (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/add-product"
                      onClick={closeNavbar}
                    >
                      Add Product
                    </Link>
                  </li>

                  <li className="nav-item">
                    <button
                      className="nav-link btn btn-link text-white"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/cart"
                      onClick={closeNavbar}
                    >
                      Cart
                    </Link>
                  </li>

                  <li className="nav-item">
                    <button
                      className="nav-link btn btn-link text-white"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              )
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/login"
                    onClick={closeNavbar}
                  >
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/register"
                    onClick={closeNavbar}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  )
}