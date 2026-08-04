import { apiClient } from './client'
import type { User } from './types'

// El email no se puede modificar: el backend rechaza el request si viene en el body
export type UpdateUserPayload = Partial<Omit<User, '_id' | 'email'>>

// El backend devuelve el usuario actualizado con "id" en vez de "_id"
type BackendUser = Omit<User, '_id'> & { id: string }

// ------------------------------------------------------------
// PUT /users/:id → actualiza un usuario existente
// ------------------------------------------------------------
export async function updateUser(id: string, data: UpdateUserPayload): Promise<User> {
  const result = await apiClient<BackendUser>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  const { id: userId, ...rest } = result
  return { _id: userId, ...rest }
}