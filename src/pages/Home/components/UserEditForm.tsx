import { useState } from 'react'
import Button from '@/components/ui/Button/Button'
import { updateUser } from '@/api/updateUser'
import type { User } from '@/api/types'
import styles from '../Home.module.css'

const ROLES = ['ROOT', 'ADMIN', 'USER', 'GUEST']
const GENEROS = ['Mujer', 'Hombre', 'No definido']

interface UserEditFormProps {
  user: User
  onCancel: () => void
  onSaved: (user: User) => void
}

function UserEditForm({ user, onCancel, onSaved }: UserEditFormProps) {
  const [nombre, setNombre] = useState(user.nombre ?? '')
  const [apellido, setApellido] = useState(user.apellido ?? '')
  const [genero, setGenero] = useState(user.genero ?? '')
  const [edad, setEdad] = useState(String(user.edad ?? ''))
  const [fechaNacimiento, setFechaNacimiento] = useState(user.fechaNacimiento?.slice(0, 10) ?? '')
  const [telefono, setTelefono] = useState(user.telefono ?? '')
  const [direccion, setDireccion] = useState(user.direccion ?? '')
  const [localidad, setLocalidad] = useState(user.localidad ?? '')
  const [provincia, setProvincia] = useState(user.provincia ?? '')
  const [pais, setPais] = useState(user.pais ?? '')
  const [codigoPostal, setCodigoPostal] = useState(user.codigoPostal ?? '')
  const [role, setRole] = useState(user.role ?? 'USER')
  
  // Eliminamos el estado de error local, apiClient se encarga de mostrar la alerta
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    try {
      const updated = await updateUser(user._id, {
        nombre,
        apellido,
        genero,
        edad: Number(edad),
        fechaNacimiento,
        telefono,
        direccion,
        localidad,
        provincia,
        pais,
        codigoPostal,
        role,
      })
      onSaved(updated)
    } catch (err) {
      // El error (HTTP 401, 403, etc.) es interceptado y mostrado vía toast por apiClient.
      // Solo capturamos para evitar que se llame a onSaved y para apagar el loading.
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={styles.editForm} onSubmit={handleSubmit}>
      <div className={styles.formRow}>
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
      </div>

      <div className={styles.formRow}>
        <select
          className={styles.select}
          title="Género"
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
          disabled={loading}
        >
          {GENEROS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <input
          className={styles.input}
          type="number"
          placeholder="Edad"
          min={1}
          max={120}
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className={styles.formRow}>
        <input
          className={styles.input}
          type="date"
          title="Fecha de nacimiento"
          value={fechaNacimiento}
          onChange={(e) => setFechaNacimiento(e.target.value)}
          required
          disabled={loading}
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <input
        className={styles.input}
        type="text"
        placeholder="Dirección"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
        required
        disabled={loading}
      />

      <div className={styles.formRow}>
        <input
          className={styles.input}
          type="text"
          placeholder="Localidad"
          value={localidad}
          onChange={(e) => setLocalidad(e.target.value)}
          required
          disabled={loading}
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Provincia"
          value={provincia}
          onChange={(e) => setProvincia(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className={styles.formRow}>
        <input
          className={styles.input}
          type="text"
          placeholder="País"
          value={pais}
          onChange={(e) => setPais(e.target.value)}
          required
          disabled={loading}
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Código postal"
          value={codigoPostal}
          onChange={(e) => setCodigoPostal(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <select
        className={styles.select}
        title="Rol del usuario"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        disabled={loading}
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      <div className={styles.modalActions}>
        <Button variant="secondary" type="button" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  )
}

export default UserEditForm