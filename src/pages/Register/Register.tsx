import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import styles from './Register.module.css'
import Button from '@/components/ui/Button/Button'
import Brand from '@/components/ui/Brand/Brand'
import { register } from '@/api/register'
import logoHorizontal from '@/assets/logo-horizontal.png'
import bgVideo from '@/assets/work.mp4'

function Register() {
  const navigate = useNavigate()

  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      await register({
        nombre,
        apellido,
        email,
        password,
      })

      toast.success('¡Cuenta creada correctamente! Redirigiendo...')

      setTimeout(() => {
        navigate({ to: '/login' })
      }, 1500)
    } catch (err) {
      // El mensaje de error lo dispara automáticamente apiClient con toast.error
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.container}>
      {/* LADO IZQUIERDO - FORMULARIO CON ANIMACIÓN */}
      <section className={styles.left}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Brand />
          <h1 className={styles.title}>Crear Cuenta</h1>
          <p className={styles.subtitle}>Completá tus datos para registrarte</p>

          <input
            className={styles.input}
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            disabled={loading}
          />

          <input
            className={styles.input}
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
            disabled={loading}
          />

          <input
            className={styles.input}
            type="email"
            placeholder="Email (tu@email.com)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <input
            className={styles.input}
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrarse'}
          </Button>

          <p className={styles.loginPrompt}>
            ¿Ya tenés cuenta? <Link to="/login" className={styles.loginLink}>Iniciá sesión acá</Link>
          </p>
        </form>
      </section>

      {/* LADO DERECHO - VIDEO Y LOGO */}
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

export default Register