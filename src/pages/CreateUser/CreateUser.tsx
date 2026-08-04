import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import styles from './CreateUser.module.css'
import Button from '@/components/ui/Button/Button'
import Brand from '@/components/ui/Brand/Brand'
import { createUser } from '@/api/createUser'
import logoHorizontal from '@/assets/logo-horizontal.png'
import depositoImg from '@/assets/deposito.jpg'

function CreateUser() {
  const navigate = useNavigate()

  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate({ to: '/login' })
    }
  }, [navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      await createUser(nombre, apellido, email, password)
      toast.success('Usuario creado correctamente.')
      navigate({ to: '/' })
    } catch (err) {
      // El mensaje de error lo dispara automáticamente apiClient con toast.error
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.container}>
      {/* LADO IZQUIERDO - FORMULARIO */}
      <section className={styles.left}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <Brand />
          <h1 className={styles.title}>Crear Usuario</h1>
          <p className={styles.subtitle}>Completá los datos del nuevo usuario</p>

          <input
            className={styles.input}
            id="name"
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            disabled={loading}
          />

          <input
            className={styles.input}
            id="lastname"
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
            disabled={loading}
          />

          <input
            className={styles.input}
            id="email"
            type="email"
            placeholder="Email (usuario@email.com)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <input
            className={styles.input}
            id="password"
            type="password"
            placeholder="Contraseña (Mínimo 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
          />

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Usuario'}
          </Button>

          <p className={styles.footer}>
            <Link to="/">Volver a la lista</Link>
          </p>
        </form>
      </section>

      {/* LADO DERECHO - IMAGEN DE DEPÓSITO Y LOGO */}
      <section className={styles.right}>
        <div className={styles.imageWrapper}>
          <img src={depositoImg} alt="Depósito de mercadería" className={styles.image} />
        </div>

        <div className={styles.overlay}>
          <div className={styles.logoContainer}>
            <img src={logoHorizontal} alt="Logo de la empresa" className={styles.logoImage} />
          </div>
        </div>
      </section>
    </main>
  )
}

export default CreateUser