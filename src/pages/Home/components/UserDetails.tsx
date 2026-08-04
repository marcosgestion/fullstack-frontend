import type { User } from '@/api/types'
import styles from '../Home.module.css'

interface UserDetailsProps {
  user: User
}

function UserDetails({ user }: UserDetailsProps) {
  const addressQuery = encodeURIComponent(
    `${user.direccion || ''}, ${user.localidad || ''}, ${user.provincia || ''}, Argentina`
  )
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${addressQuery}`

  const fields: [string, string][] = [
    ['Nombre', `${user.nombre} ${user.apellido}`],
    ['Email', user.email],
    ['Rol', user.role],
    ['Género', user.genero],
    ['Edad', String(user.edad)],
    ['Teléfono', user.telefono],
    ['Localidad', user.localidad],
    ['Provincia', user.provincia],
    ['Código postal', user.codigoPostal],
  ]

  return (
    <div className={styles.viewContainer}>
      <dl className={styles.viewGrid}>
        {fields.map(([label, value]) => (
          <div className={styles.viewRow} key={label}>
            <dt className={styles.viewLabel}>{label}</dt>
            <dd className={styles.viewValue}>{value || '-'}</dd>
          </div>
        ))}
      </dl>

      <div className={styles.addressBlock}>
        <span className={styles.viewLabel}>Dirección de entrega / visita</span>
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={styles.mapsLink}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          {user.direccion || 'Sin dirección'}, {user.localidad || 'Sin localidad'},{' '}
          {user.provincia || 'Sin provincia'}
        </a>
      </div>
    </div>
  )
}

export default UserDetails