import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import Button from '@/components/ui/Button/Button'
import Modal from '@/components/blocks/Modal/Modal'
import styles from './Home.module.css'
import { getUsers } from '@/api/getUsers'
import { deleteUser } from '@/api/deleteUser'
import type { User } from '@/api/types'
import logoHorizontal from '@/assets/logo-horizontal.png'

// Importamos los íconos desde el archivo centralizado
import { EyeIcon, EditIcon, TrashIcon, SearchIcon } from '../../components/ui/Icons/Icons'

import UserDetails from './components/UserDetails'
import UserEditForm from './components/UserEditForm'

function Home() {
  const navigate = useNavigate()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const [modalUser, setModalUser] = useState<User | null>(null)
  const [modalMode, setModalMode] = useState<'view' | 'edit' | null>(null)
  
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate({ to: '/login' })
      return
    }

    async function loadUsers() {
      try {
        const data = await getUsers()
        setUsers(data)
      } catch (error) {
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [navigate])

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    toast.info('Sesión cerrada.')
    navigate({ to: '/login' })
  }

  function openView(user: User) {
    setModalUser(user)
    setModalMode('view')
  }

  function openEdit(user: User) {
    setModalUser(user)
    setModalMode('edit')
  }

  function closeModal() {
    setModalMode(null)
    setModalUser(null)
  }

  function handleUserUpdated(updated: User | any) {
    const updatedUser = updated?.data ? updated.data : updated

    setUsers((prev) =>
      prev.map((u) => {
        const updatedId = updatedUser._id || updatedUser.id
        if (u._id === updatedId) {
          return {
            ...u,
            ...updatedUser,
            _id: u._id,
          }
        }
        return u
      })
    )
    
    closeModal()
    toast.success('Cambios guardados.')
  }

  async function handleDelete(user: User) {
    // Solicitamos el motivo para el registro de auditoría
    const motivo = window.prompt(
      `Estás por eliminar al usuario ${user.nombre} ${user.apellido}.\n\nPor favor, ingresá el motivo de la eliminación para el registro de auditoría:`
    )

    // Si el administrador cancela el prompt, abortamos la función
    if (motivo === null) return

    // Validamos que el administrador no envíe un string vacío o con solo espacios
    if (motivo.trim() === '') {
      toast.error('Operación cancelada: Debes ingresar un motivo válido para eliminar al usuario.')
      return
    }

    try {
      // Pasamos el id del usuario y el motivo a nuestra API actualizada
      await deleteUser(user._id, motivo)
      
      setUsers((prev) => prev.filter((u) => u._id !== user._id))
      toast.success('Usuario eliminado y auditado con éxito.')
    } catch (err) {
      // El error lo ataja e informa apiClient automáticamente
    }
  }

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      user.nombre.toLowerCase().includes(searchLower) ||
      user.apellido.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    )
  })

  const userRole = localStorage.getItem('role')
  const isManager = userRole === 'ROOT' || userRole === 'ADMIN'

  return (
    <main className={styles.container}>
      {/* HEADER CON TÍTULO, LOGO CENTRADO Y ACCIONES */}
      <div className={styles.header}>
        <div className={styles.headerBrand}>
          <h1 className={styles.title}>LP Gestion</h1>
          <p className={styles.subtitle}>Gestión usuarios</p>
        </div>

        <div className={styles.logoContainer}>
          <img src={logoHorizontal} alt="Logo LP Gestión" className={styles.headerLogo} />
        </div>

        <div className={styles.headerActions}>
          {isManager && (
            <Button variant="primary" onClick={() => navigate({ to: '/create-user' })}>
              + Agregar Usuario
            </Button>
          )}
          <Button variant="secondary" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </div>

      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Directorio de Usuarios</h2>
        
        <div className={styles.searchContainer}>
          <div className={styles.searchIconWrapper}>
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre, email o rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {loading && <p className={styles.message}>Cargando usuarios...</p>}
      
      {!loading && users.length === 0 && (
        <p className={styles.message}>No hay usuarios para mostrar</p>
      )}

      {!loading && users.length > 0 && filteredUsers.length === 0 && (
        <p className={styles.message}>No se encontraron usuarios que coincidan con "{searchTerm}"</p>
      )}

      {!loading && filteredUsers.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Usuario</th>
                <th className={styles.th}>Email</th>
                <th className={styles.th}>Teléfono</th>
                <th className={styles.th}>Localidad</th>
                <th className={styles.th}>Rol</th>
                <th className={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className={styles.tr}>
                  <td className={styles.td}>
                    <div className={styles.userCell}>
                      <img
                        className={styles.avatar}
                        src={`https://ui-avatars.com/api/?name=${user.nombre}+${user.apellido}&background=random`}
                        alt={`${user.nombre} ${user.apellido}`}
                      />
                      <span>
                        {user.nombre} {user.apellido}
                      </span>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${user.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.emailLink}
                    >
                      {user.email}
                    </a>
                  </td>
                  <td className={styles.td}>{user.telefono || '-'}</td>
                  <td className={styles.td}>{user.localidad || '-'}</td>
                  <td className={styles.td}>
                    <span
                      className={`${styles.badge} ${
                        styles[`badge__${user.role ? user.role.toLowerCase() : 'user'}`] ?? ''
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.actions}>
                      <button
                        className={`${styles.actionBtn} ${styles.actionBtnView}`}
                        onClick={() => openView(user)}
                        title="Inspeccionar usuario"
                      >
                        <EyeIcon />
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
                        onClick={() => openEdit(user)}
                        title="Editar usuario"
                      >
                        <EditIcon />
                      </button>
                      {isManager && (
                        <button
                          className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                          onClick={() => handleDelete(user)}
                          title="Eliminar usuario"
                          aria-label="Eliminar usuario"
                        >
                          <TrashIcon />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={modalMode !== null}
        onClose={closeModal}
        title={modalMode === 'view' ? 'Detalle de usuario' : 'Editar usuario'}
      >
        {modalMode === 'view' && modalUser && <UserDetails user={modalUser} />}
        {modalMode === 'edit' && modalUser && (
          <UserEditForm user={modalUser} onCancel={closeModal} onSaved={handleUserUpdated} />
        )}
      </Modal>
    </main>
  )
}

export default Home