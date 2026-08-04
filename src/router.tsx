import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router'

import Home from '@/pages/Home/Home'
import Login from '@/pages/Login/Login'
import CreateUser from '@/pages/CreateUser/CreateUser'
import Register from '@/pages/Register/Register' // 1. Importa el componente de Register

const rootRoute = createRootRoute({
  component: Outlet,
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
})

const createUserRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-user',
  component: CreateUser,
})

// 2. Define la ruta /register
const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: Register,
})

// 3. Agrega registerRoute a los hijos del árbol de rutas
const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  createUserRoute,
  registerRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}