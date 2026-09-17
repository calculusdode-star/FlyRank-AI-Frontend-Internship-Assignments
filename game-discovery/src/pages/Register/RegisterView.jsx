import { useContext, useEffect, useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext.jsx'
import { auth } from '../../services/firebase.js'
import './Register.css'

function getRegistrationErrorMessage(error) {
  switch (error?.code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.'
    case 'auth/invalid-email':
      return 'Enter a valid email address.'
    case 'auth/weak-password':
      return 'Choose a stronger password.'
    case 'auth/network-request-failed':
      return 'Registration failed because of a network problem. Try again.'
    default:
      return 'Registration failed. Check your details and try again.'
  }
}

async function registerUser(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
}

/**
 * RegisterView - Presents the user registration form.
 */
function RegisterView() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useContext(AuthContext)
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    confirmPassword: '',
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

    const { email, password, confirmPassword } = formValues

    if (!email.trim() || !password || !confirmPassword) {
      setValidationError('Email, password, and password confirmation are required.')
      return
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.')
      return
    }

    setLoading(true)
    setValidationError('')
    setAuthenticationError('')
    setSuccessMessage('')

    try {
      await registerUser(email.trim(), password)
      navigate('/', { replace: true })
    } catch (error) {
      setAuthenticationError(getRegistrationErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="register">
      <section className="register__panel" aria-labelledby="register-title">
        <header className="register__header">
          <h1 id="register-title" className="register__title">
            Create your account
          </h1>
          <p className="register__subtitle">
            Join Game Discovery to build your personal game collection.
          </p>
        </header>

        <form className="register__form" onSubmit={handleSubmit} noValidate>
          <div className="register__field">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              name="email"
              type="email"
              value={formValues.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="register__field">
            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              name="password"
              type="password"
              value={formValues.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="register__field">
            <label htmlFor="register-confirm-password">Confirm Password</label>
            <input
              id="register-confirm-password"
              name="confirmPassword"
              type="password"
              value={formValues.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          {validationError && (
            <p className="register__message register__message--error" role="alert">
              {validationError}
            </p>
          )}

          {authenticationError && (
            <p className="register__message register__message--error" role="alert">
              {authenticationError}
            </p>
          )}

          {successMessage && (
            <p className="register__message register__message--success" role="status">
              {successMessage}
            </p>
          )}

          <button
            className="register__submit"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default RegisterView
