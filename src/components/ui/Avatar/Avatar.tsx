import styles from './Avatar.module.css'

const ROLE_CLASSNAME: Record<string, string> = {
  ROOT: styles.avatar__root,
  ADMIN: styles.avatar__admin,
  USER: styles.avatar__user,
  GUEST: styles.avatar__guest,
}

const GENERO_ICON: Record<string, string> = {
  Mujer: '💄',
  Hombre: '🥷',
}

interface AvatarProps {
  nombre: string
  apellido: string
  role: string
  genero: string
}

function Avatar({ nombre, apellido, role, genero }: AvatarProps) {
  const roleClassName = ROLE_CLASSNAME[role] ?? styles.avatar__guest
  const icon = GENERO_ICON[genero] ?? '👽'

  return (
    <div
      className={`${styles.avatar} ${roleClassName}`}
      role="img"
      aria-label={`Avatar de ${nombre} ${apellido}`}
      title={genero}
    >
      {icon}
    </div>
  )
}

export default Avatar
