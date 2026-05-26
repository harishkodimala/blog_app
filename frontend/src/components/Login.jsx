import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/authStore'
import { useEffect } from 'react'

import {
  errorClass,
  formCard,
  formTitle,
  inputClass,
  submitBtn,
  formGroup,
  labelClass
} from '../styles/common'

import { toast } from 'react-hot-toast'

import { GoogleLogin } from '@react-oauth/google'
import axios from 'axios'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Login() {

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Zustand Store
  const login = useAuth(state => state.login)
  const currentUser = useAuth(state => state.currentUser)
  const isAuthenticated = useAuth(state => state.isAuthenticated)
  const error = useAuth(state => state.error)

  // =========================
  // Normal Login
  // =========================

  const onLogin = async (userLoginObj) => {

    try {

      await login(userLoginObj)

      setTimeout(() => {

        const auth = useAuth.getState()

        if (auth.isAuthenticated && auth.currentUser) {

          toast.success('Login successful!')

        } else if (auth.error) {

          toast.error(
            auth.error.response?.data?.error ||
            auth.error.message ||
            'Login failed'
          )
        }

      }, 100)

    } catch (err) {

      toast.error('Something went wrong')
    }
  }

  // =========================
  // Google Login
  // =========================

  const handleGoogleSuccess = async (credentialResponse) => {

    try {

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/google`,
        {
          credential: credentialResponse.credential,
        }
      )

      console.log(res.data)

      // Save Token
      localStorage.setItem('token', res.data.token)

      // Save User
      localStorage.setItem(
        'currentUser',
        JSON.stringify(res.data.user)
      )

      // Update Zustand State
      useAuth.setState({
        currentUser: res.data.user,
        isAuthenticated: true,
        error: null,
      })

      toast.success('Google Login Successful!')

      // Redirect based on role
      if (res?.data?.user?.role === 'USER' || res?.data?.user?.role === 'user') {

        navigate('/userdashboard')

      } else if (res?.data?.user?.role === 'AUTHOR' || res?.data?.user?.role === 'author') {

        navigate('/authordashboard')

      } else if (res?.data?.user?.role === 'ADMIN' || res?.data?.user?.role === 'admin') {

        navigate('/admindashboard')
      }

    } catch (err) {

      console.log(err)

      toast.error(
        err.response?.data?.message ||
        'Google login failed'
      )
    }
  }

  // =========================
  // Redirect if authenticated
  // =========================

  useEffect(() => {

    if (isAuthenticated && currentUser && currentUser.role) {

      if (currentUser.role === 'USER') {

        navigate('/userdashboard')

      } else if (currentUser.role === 'AUTHOR') {

        navigate('/authordashboard')

      } else if (currentUser.role === 'ADMIN') {

        navigate('/admindashboard')
      }
    }

  }, [isAuthenticated, currentUser, navigate])

  return (

    <div className="flex items-center justify-center min-h-[70vh]">

      <div className={formCard + " shadow-sm border border-[#e8e8ed]"}>

        <h2 className={formTitle}>
          Welcome back
        </h2>

        {/* Error Message */}

        {error && (
          <p className={errorClass + ' mb-6'}>

            {
              error.response?.data?.error ||
              error.response?.data?.message ||
              error.message ||
              'Login failed'
            }

          </p>
        )}

        {/* Login Form */}

        <form
          onSubmit={handleSubmit(onLogin)}
          className="space-y-4"
        >

          {/* Email */}

          <div className={formGroup}>

            <label className={labelClass}>
              EMAIL ADDRESS
            </label>

            <input
              className={inputClass}
              type='email'
              placeholder='name@example.com'
              {...register('email', {
                required: 'Email required',
                pattern: {
                  value: emailRegex,
                  message: 'Invalid email format'
                },
              })}
            />

            {errors.email?.message && (

              <p className={errorClass + ' mt-2 animate-in fade-in'}>
                {errors.email.message}
              </p>

            )}

          </div>

          {/* Password */}

          <div className={formGroup}>

            <label className={labelClass}>
              PASSWORD
            </label>

            <input
              className={inputClass}
              type='password'
              placeholder='Enter password'
              {...register('password', {
                required: 'Password required'
              })}
            />

            {errors.password?.message && (

              <p className={errorClass + ' mt-2 animate-in fade-in'}>
                {errors.password.message}
              </p>

            )}

          </div>

          {/* Login Button */}

          <button
            className={submitBtn + " py-3 mt-4"}
            type='submit'
          >
            Sign In
          </button>

        </form>

        {/* Divider */}

        <div className="flex items-center gap-4 my-6">

          <div className="flex-1 h-[1px] bg-gray-200"></div>

          <p className="text-sm text-gray-400">
            OR
          </p>

          <div className="flex-1 h-[1px] bg-gray-200"></div>

        </div>

        {/* Google Login */}

        <div className="flex justify-center">

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {

              toast.error('Google Login Failed')
            }}
          />

        </div>

      </div>

    </div>
  )
}

export default Login