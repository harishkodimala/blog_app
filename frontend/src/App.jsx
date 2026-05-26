import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './components/RootLayout'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import UserDashboard from './components/UserProfile'
import AuthorDashboard from './components/AuthorProfile'
import AdminDashboard from './components/AdminProfile'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'
import ArticleById from './components/ArticleById'
import AddArticle from './components/AddArticle'
import EditArticle from './components/EditArticle'
import Unauthorized from './components/Unauthorized'
import { useEffect } from 'react'
import { useAuth } from './store/authStore'



function App() {
  const checkAuth = useAuth(state => state.checkAuth);

useEffect(() => {
  checkAuth();
}, []);
if (loading) {

    return (

      <div className="h-screen flex items-center justify-center">

        <h1 className="text-3xl font-semibold">
          Loading...
        </h1>

      </div>
    )
  }

  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          path: "",
          element: <Home />
        },
        {
          path: "login",
          element: <Login />
        },
        {
          path: "register",
          element: <Register />
        },
        {
          path: "userdashboard",
          element: <ProtectedRoute allowedRoles={["USER"]}>
            <UserDashboard />
          </ProtectedRoute>
        },
        {
          path: "authordashboard",
          element: <ProtectedRoute allowedRoles={["AUTHOR"]}>
            <AuthorDashboard />
          </ProtectedRoute>
        },
        {
          path: "admindashboard",
          element: <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        },
        {
          path: "article/:id",
          element: <ProtectedRoute allowedRoles={["USER", "AUTHOR", "ADMIN"]}>
            <ArticleById />
          </ProtectedRoute>
        },
        {
          path: "add-article",
          element: <ProtectedRoute allowedRoles={["AUTHOR"]}>
            <AddArticle />
          </ProtectedRoute>
        },
        {
          path: "edit-article/:id",
          element: <ProtectedRoute allowedRoles={["AUTHOR"]}>
            <EditArticle />
          </ProtectedRoute>
        },
        {
          path: "unauthorized",
          element: <Unauthorized />
        }
      ]
    }
  ])

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={routerObj} />
    </>
  )
}

export default App