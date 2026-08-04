import { apiClient } from './client'

// ------------------------------------------------------------
// DELETE /users/:id → elimina un usuario por su ID
// Delegamos la inyección del token y el manejo de errores a apiClient.
// Se incorporó el envío del "motivo" para el registro de auditoría en la BD.
// ------------------------------------------------------------
export async function deleteUser(id: string, motivo: string): Promise<void> {
  return await apiClient(`/users/${id}`, {
    method: 'DELETE',
    body: JSON.stringify({ motivo }),
  })
}