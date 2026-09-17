import { useContext, useEffect, useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext.jsx'
import { auth } from '../../services/firebase.js'
import './Login.css'

function getLoginErrorMessage(error) {
  switch (error?.code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'The email or password is incorrect.'
    case 'auth/invalid-email':
      return 'Enter a valid email address.'
    case 'auth/user-disabled':
      return 'This account is currently unavailable.'
    case 'auth/network-request-failed':
      return 'Login failed because of a network problem. Try again.'
    default:
      return 'Login failed. Check your details and try again.'
  }
}

async function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

/**
 * LoginView - Presents the user login form.
 */
function LoginView() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useContext(AuthContext)
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  })
  const [validationError, setValidationError] = useState('')
  const [authenticationError, setAuthenticationError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && user) {
      navigate('/', { replace: true })
    }
  }, [authLoading, navigate, user])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
    setValidationError('')
    setAuthenticationError('')
    setSuccessMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (loading) return

    const { email, password } = formValues

    if (!email.trim() || !password) {
      setValidationError('Email and password are required.')
      return
    }

    setLoading(true)
    setValidationError('')
    setAuthenticationError('')
    setSuccessMessage('')

    try {
      await loginUser(email.trim(), password)
      navigate('/', { replace: true })
    } catch (error) {
      setAuthenticationError(getLoginErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login">
      <section className="login__panel" aria-labelledby="login-title">
        <header className="login__header">
          <h1 id="login-title" className="login__title">
            Welcome back
          </h1>
          <p className="login__subtitle">
            Log in to continue discovering great games.
          </p>
        </header>

        <form className="login__form" onSubmit={handleSubmit} noValidate>
          <div className="login__field">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              value={formValues.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="login__field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              value={formValues.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          {validationError && (
            <p className="login__message login__message--error" role="alert">
              {validationError}
            </p>
          )}

          {authenticationError && (
            <p className="login__message login__message--error" role="alert">
              {authenticationError}
            </p>
          )}

          {successMessage && (
            <p className="login__message login__message--success" role="status">
              {successMessage}
            </p>
          )}

          <button className="login__submit" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default LoginView
