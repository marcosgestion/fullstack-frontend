import styles from './Avatar.module.css'

const ROLE_CLASSNAME: Record<string, string> = {
  ROOT: styles.avatar__root,
  ADMIN: styles.avatar__admin,
  USER: styles.avatar__user,
  GUEST: styles.avatar__guest,
}

interface AvatarProps {
  nombre: string
  apellido: string
  role: string
}

function Avatar({ nombre, apellido, role }: AvatarProps) {
  const roleClassName = ROLE_CLASSNAME[role] ?? styles.avatar__guest
  const initials = `${nombre[0] ?? ''}${apellido[0] ?? ''}`.toUpperCase()

  return (
    <div
      className={`${styles.avatar} ${roleClassName}`}
      role="img"
      aria-label={`Avatar de ${nombre} ${apellido}`}
    >
      {initials}
    </div>
  )
}

export default Avatar
