import { apiClient } from './client'
import type { User } from '@/api/types'

// ------------------------------------------------------------
// GET /users → devuelve la lista de usuarios
// Es una ruta protegida: delegamos la autenticación y el
// manejo de errores global a apiClient.
// ------------------------------------------------------------
export async function getUsers(): Promise<User[]> {
  const data = await apiClient<User | User[]>('/users')

  // Normalización estricta: Garantizamos devolver un Array
  // independientemente de si el backend responde con objeto o array.
  if (data) {
    return Array.isArray(data) ? data : [data]
  }

  return []
}