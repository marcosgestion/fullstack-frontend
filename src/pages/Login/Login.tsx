import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import styles from './Login.module.css'
import Button from '@/components/ui/Button/Button'
import Brand from '@/components/ui/Brand/Brand'
import { login } from '@/api/login'
import logoHorizontal from '@/assets/logo-horizontal.png'
import bgVideo from '@/assets/work.mp4'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await login(email, password)
      
      // Guardamos la sesión
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)

      toast.success('¡Sesión iniciada con éxito!')
      navigate({ to: '/' })
    } catch (err) {
      // El mensaje de error lo dispara automáticamente apiClient con toast.error
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.container}>
      {/* LADO IZQUIERDO - FORMULARIO LIMPIO */}
      <section className={styles.left}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Brand />
          <h1 className={styles.title}>Iniciar Sesión</h1>
          <p className={styles.subtitle}>Ingresá tu email y contraseña para continuar</p>

          <input
            className={styles.input}
            id="email"
            type="email"
            placeholder="Email (tu@email.com)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <div className={styles.passwordWrapper}>
            <input
              className={`${styles.input} ${styles.passwordInput}`}
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              disabled={loading}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" y1="2" x2="22" y2="22" />
                </svg>
              )}
            </button>
          </div>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </Button>

          {/* Bloque para registro */}
          <p className={styles.registerPrompt}>
            ¿No tenés cuenta? <Link to="/register" className={styles.registerLink}>Registrate acá</Link>
          </p>
        </form>
      </section>

      {/* LADO DERECHO - VIDEO PREMIUM Y GLASSMORPHISM */}
      <section className={styles.right}>
        <div className={styles.videoWrapper}>
          <video
            className={styles.video}
            src={bgVideo}
            autoPlay
            loop
            muted
            playsInline
          />
          {/* Capa oscura para no encandilar */}
          <div className={styles.overlay}>
            <div className={styles.logoContainer}>
              <img src={logoHorizontal} alt="Logo de la empresa" className={styles.logoImage} />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Login