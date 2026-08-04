import { useState } from 'react'
import Button from '@/components/ui/Button/Button'
import type { User } from '@/api/types'
import styles from '../Home.module.css'

interface DeleteReasonFormProps {
  user: User
  onCancel: () => void
  onConfirm: (motivo: string) => void
  loading?: boolean
}

function DeleteReasonForm({ user, onCancel, onConfirm, loading = false }: DeleteReasonFormProps) {
  const [motivo, setMotivo] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (motivo.trim() === '') return
    onConfirm(motivo.trim())
  }

  return (
    <form className={styles.editForm} onSubmit={handleSubmit}>
      <p>
        Estás por eliminar a <strong>{user.nombre} {user.apellido}</strong>. Ingresá el motivo
        para el registro de auditoría:
      </p>

      <textarea
        className={styles.input}
        placeholder="Motivo de la eliminación"
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
        rows={3}
        required
        disabled={loading}
        autoFocus
      />

      <div className={styles.modalActions}>
        <Button variant="secondary" type="button" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit" disabled={loading || motivo.trim() === ''}>
          {loading ? 'Eliminando...' : 'Confirmar eliminación'}
        </Button>
      </div>
    </form>
  )
}

export default DeleteReasonForm
