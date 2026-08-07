# LP Gestión — Frontend

Interfaz web del sistema **LP Gestión**, desarrollada con React, TypeScript y Vite. Se conecta a una API REST propia para mostrar, buscar, editar y auditar usuarios según el rol que tenga cada uno dentro del sistema. Es el punto de partida de un proyecto más grande: un portal de autogestión para Maderera Los Pinos SRL.

Este proyecto parte de una base de código entregada por la cátedra, con la arquitectura general (React + Vite + TypeScript, estructura de carpetas, cliente HTTP, sistema de roles) ya definida. El trabajo propio consistió en corregir errores, completar funcionalidad faltante, reforzar la seguridad y prolijidad del código, y sumar algunas mejoras de interfaz — con apoyo de una herramienta de inteligencia artificial durante el desarrollo.

---

## Estructura del proyecto

```text
src/
├── api/            # Funciones que hablan con el backend (login, crear/editar/borrar usuarios, etc.)
├── assets/         # Imágenes y video de marca
├── components/
│   ├── blocks/     # Componentes compuestos (por ejemplo, el modal de confirmación)
│   └── ui/         # Componentes base reutilizables (botón, íconos, avatar, marca)
├── config/         # Configuración global (la URL del backend)
├── pages/
│   ├── CreateUser/ # Alta de usuarios desde el panel (solo para roles con permiso de administración)
│   ├── Home/       # Pantalla principal: listado de usuarios, búsqueda, edición y borrado
│   ├── Login/      # Inicio de sesión
│   └── Register/   # Registro público (el usuario que se crea así queda con el rol más bajo)
├── styles/         # Estilos globales y variables de color
├── App.tsx         # Componente raíz: define las rutas y las notificaciones emergentes
├── main.tsx        # Punto de entrada de la aplicación
└── router.tsx      # Definición de rutas
```

Cada página vive en su propia carpeta con su propio archivo de estilos, así que un cambio visual en una pantalla no afecta a las demás.

---

## Tecnologías utilizadas

| Tecnología | Para qué se usa |
| :--- | :--- |
| **React** | Construir la interfaz como componentes reutilizables. |
| **Vite** | Servidor de desarrollo y empaquetador del proyecto. |
| **TypeScript** | Detectar errores de tipos de datos antes de ejecutar el código. |
| **TanStack Router** | Manejo de rutas de la aplicación, con navegación sin recargar la página. |
| **Módulos CSS** | Cada componente tiene su propio archivo de estilos, sin que se mezclen entre sí. |
| **Sonner** | Librería para mostrar las notificaciones emergentes (avisos de éxito o error). |

---

## Cómo funciona la comunicación con el backend

Todas las peticiones al servidor pasan por un único archivo (`src/api/client.ts`), en vez de que cada pantalla arme sus propias llamadas por separado. Ese archivo central se encarga de tres cosas:

1. Agregar automáticamente el token de sesión guardado en el navegador a cada petición.
2. Mostrar una notificación cuando algo sale mal.
3. Distinguir entre dos situaciones que a simple vista se parecen pero no son lo mismo: que la sesión haya expirado, o que el usuario haya escrito mal su contraseña. Al principio ambos casos mostraban el mismo mensaje de "sesión expirada", lo cual era confuso al intentar iniciar sesión con una contraseña incorrecta. Se corrigió para que cada caso muestre el mensaje que realmente corresponde.

---

## Sistema de roles y permisos

Cada usuario tiene asignado uno de cuatro roles, ordenados de menor a mayor nivel de acceso: **invitado**, **usuario**, **administrador** y **superusuario**. La interfaz se adapta según el rol de la persona que inició sesión: por ejemplo, el botón para crear o eliminar usuarios solo aparece si el rol tiene permiso real para hacerlo en el servidor.

Esto es solo una capa de comodidad visual — la verificación real de permisos ocurre siempre en el servidor. Aunque alguien manipule el navegador para simular otro rol, el servidor va a rechazar igual cualquier acción para la que no tenga autorización.

Cada usuario se identifica en la tabla con un círculo de iniciales, coloreado según su rol (el mismo color que usa la etiqueta de rol al lado de su nombre), para reconocer de un vistazo quién es cada uno.

---

## Registro de motivo al eliminar un usuario

Cuando alguien elimina un usuario desde la pantalla principal, el sistema pide obligatoriamente que se escriba el motivo de la eliminación antes de confirmar. Ese motivo se envía junto con la petición de borrado, y el servidor lo guarda en un registro de auditoría — así queda constancia de quién eliminó a quién, cuándo y por qué.

---

## Configuración

La dirección del servidor backend se define en `src/config/globals.ts`:

```typescript
export const API_URL = 'http://localhost:3080'
```

---

## Instalación y ejecución

```bash
# 1. Clonar el repositorio e instalar dependencias
git clone https://github.com/marcosgestion/fullstack-frontend.git
cd fullstack-frontend
npm install

# 2. Levantar el entorno de desarrollo
npm run dev
# Queda disponible en http://localhost:5173

# 3. Generar el build de producción
npm run build

# 4. Previsualizar el build de producción
npm run preview
```

Para que la aplicación funcione por completo, el backend tiene que estar corriendo en paralelo (ver el README del proyecto backend).

---

## Rutas disponibles

| Ruta | Pantalla | Quién puede entrar | Qué hace |
| :--- | :--- | :--- | :--- |
| `/` | Inicio | Requiere sesión iniciada | Listado de usuarios, con edición y borrado. |
| `/login` | Inicio de sesión | Cualquiera | Autenticación con email y contraseña. |
| `/register` | Registro | Cualquiera | Alta pública de una cuenta nueva, con el rol más bajo por defecto. |
| `/create-user` | Crear usuario | Requiere sesión con permisos de administración | Alta de usuarios desde el panel. |

---

## Cambios realizados sobre la base del proyecto

Estos son los cambios y correcciones concretas que se hicieron sobre el código entregado por la cátedra:

- **Mensaje de error de login incorrecto:** se corrigió que un error de contraseña mostrara el mismo aviso que una sesión vencida.
- **Componente sin usar:** se eliminó un componente de navegación que había quedado armado pero nunca conectado a ninguna pantalla.
- **Confirmación de borrado:** se reemplazó una ventana emergente básica del navegador por un modal propio, consistente con el resto del diseño.
- **Datos desactualizados tras editar:** al guardar cambios en el perfil de un usuario, la tabla seguía mostrando algunos datos viejos hasta recargar la página a mano. Se corrigió del lado del servidor.
- **Identificación visual de usuarios:** se agregó un avatar con las iniciales de cada usuario, coloreado según su rol.
- **Marca del sistema:** se agregó el nombre "LP Gestión" de forma visible en todas las pantallas (antes solo aparecía el logo, que en pantallas chicas de celular no se llegaba a ver).
- **Limpieza general:** se corrigieron inconsistencias menores de código (tipos de datos poco estrictos, un archivo de imagen con mayúsculas que rompía en algunos sistemas operativos, una tarjeta de formulario que faltaba en una de las pantallas) y se actualizó la configuración del proyecto (`package.json`) para reflejar el nombre y los datos reales del proyecto.

---

## Qué faltaría para seguir mejorando

- Pruebas automatizadas (hoy no hay ninguna).
- Un sistema de notificaciones más completo, con historial.
- Manejo de estado más robusto si la aplicación crece con más pantallas.
- Carga diferida de componentes para que la aplicación inicie más rápido.
