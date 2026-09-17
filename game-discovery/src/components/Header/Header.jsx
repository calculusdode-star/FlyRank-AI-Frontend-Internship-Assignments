import { useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext.jsx'
import './Header.css'

function Header() {
  const { user, loading, logout } = useContext(AuthContext)

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // AuthContext stores a safe error state; keep navigation stable.
    }
  }

  return (
    <header className="header">
      <div className="header__brand">
        <Link to="/" className="header__brand-link">
          <span className="header__logo" aria-hidden="true">🎮</span>
          <span className="header__name">Game Discovery</span>
        </Link>
      </div>
      <nav className="header__nav" aria-label="Primary">
        <ul className="header__list">
          <li>
            <NavLink to="/" className="header__link">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/favourites" className="header__link">
              Favourites
            </NavLink>
          </li>
          {!loading && user ? (
            <li>
              <button
                type="button"
                className="header__link header__logout-button"
                onClick={handleLogout}
              >
                Log out
              </button>
            </li>
          ) : !loading ? (
            <>
              <li>
                <NavLink to="/register" className="header__link">
                  Register
                </NavLink>
              </li>
              <li>
                <NavLink to="/login" className="header__link">
                  Log in
                </NavLink>
              </li>
            </>
          ) : null}
        </ul>
      </nav>
    </header>  
  )
}

export default Header