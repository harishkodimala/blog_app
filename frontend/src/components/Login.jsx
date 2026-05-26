import React, { useState, useEffect } from 'react'

import { useForm } from 'react-hook-form'

import { useNavigate } from 'react-router-dom'

import { useAuth } from '../store/authStore'

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

  // =========================
  // Zustand Store
  // =========================

  const login = useAuth(state => state.login)

  const currentUser = useAuth(state => state.currentUser)

  const isAuthenticated = useAuth(state => state.isAuthenticated)

  const error = useAuth(state => state.error)

  // =========================
  // Google Role Modal State
  // =========================

  const [showRoleModal, setShowRoleModal] = useState(false)

  const [googleUserData, setGoogleUserData] = useState(null)

  const [selectedRole, setSelectedRole] = useState('USER')

  // =========================
  // Redirect Function
  // =========================

  const redirectUser = (role) => {

    if (!role) return

    const normalizedRole = role.toUpperCase()

    switch (normalizedRole) {

      case 'USER':
        navigate('/userdashboard')
        break

      case 'AUTHOR':
        navigate('/authordashboard')
        break

      case 'ADMIN':
        navigate('/admindashboard')
        break

      default:
        navigate('/')
    }
  }

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

          redirectUser(auth.currentUser.role)

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
        },

        {
          withCredentials: true,
        }
      )

      // =====================================
      // EXISTING USER
      // =====================================

      if (!res.data.isNewUser) {

        useAuth.setState({

          currentUser: res.data.payload,

          isAuthenticated: true,

          loading: false,

          error: null,
        })

        toast.success('Google Login Successful!')

        redirectUser(res.data.payload.role)

        return
      }

      // =====================================
      // NEW USER
      // =====================================

      setGoogleUserData(res.data.googleData)

      setShowRoleModal(true)

    } catch (err) {

      console.log(err)

      toast.error(

        err.response?.data?.message ||

        'Google login failed'
      )
    }
  }

  // =========================
  // Complete Google Registration
  // =========================

  const completeGoogleRegistration = async () => {

    try {

      const res = await axios.post(

        `${import.meta.env.VITE_API_URL}/auth/google/register`,

        {

          ...googleUserData,

          role: selectedRole,
        },

        {
          withCredentials: true,
        }
      )

      // console.log("REGISTER RESPONSE:", res.data)

      // Zustand Update
      useAuth.setState({

        currentUser: res.data.payload,

        isAuthenticated: true,

        loading: false,

        error: null,
      })

      toast.success('Registration Successful!')

      setShowRoleModal(false)

      redirectUser(res.data.payload.role)

    } catch (err) {

      console.log(err)

      toast.error(

        err.response?.data?.message ||

        'Registration failed'
      )
    }
  }

  // =========================
  // Redirect if authenticated
  // =========================

  useEffect(() => {

    if (isAuthenticated && currentUser?.role) {

      redirectUser(currentUser.role)
    }

  }, [isAuthenticated, currentUser])

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

      {/* ===================================== */}
      {/* ROLE SELECTION MODAL */}
      {/* ===================================== */}

      {
        showRoleModal && (

          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-[400px] rounded-2xl p-8">

              <h2 className="text-2xl font-semibold mb-6">

                Select Your Role

              </h2>

              <div className="space-y-4">

                {/* USER */}

                <button

                  onClick={() => setSelectedRole('USER')}

                  className={`w-full border rounded-xl p-4 transition-all duration-200 ${
                    selectedRole === 'USER'
                      ? 'bg-black text-white border-black'
                      : 'border-gray-300'
                  }`}
                >
                  User
                </button>

                {/* AUTHOR */}

                <button

                  onClick={() => setSelectedRole('AUTHOR')}

                  className={`w-full border rounded-xl p-4 transition-all duration-200 ${
                    selectedRole === 'AUTHOR'
                      ? 'bg-black text-white border-black'
                      : 'border-gray-300'
                  }`}
                >
                  Author
                </button>

              </div>

              {/* Continue */}

              <button

                onClick={completeGoogleRegistration}

                className="w-full bg-black text-white py-3 rounded-xl mt-6 hover:opacity-90"
              >
                Continue
              </button>

            </div>

          </div>
        )
      }

    </div>
  )
}

export default Login