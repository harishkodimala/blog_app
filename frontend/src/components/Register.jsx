import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {
  formCard,
  formTitle,
  inputClass,
  submitBtn,
  formGroup,
  labelClass,
  pageWrapper,
  errorClass,
  loadingClass
} from '../styles/common.js'
import API_BASE from '../config/api'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      role: 'USER',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      profileImageUrl: '',
    },
  })

  let navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)
  

  const onRegister = async (newUser) => {
    const formData = new FormData();
    console.log("profileImageUrl:", profileImageUrl);
console.log("formData entries:");

for (let pair of formData.entries()) {
  console.log(pair[0], pair[1]);
}
    let { role, profileImageUrl, ...userObj } = newUser;
    Object.keys(userObj).forEach((key) => {
      formData.append(key, userObj[key]);
    });
    if (profileImageUrl && profileImageUrl[0]) {
      formData.append("profileImageUrl", profileImageUrl[0]);
    }

    try {
      setLoading(true)
      if (newUser.role === "USER") {
        let res = await axios.post(`${API_BASE}/user-api/users`, formData, { withCredentials: true })
        if (res.status === 201) navigate('/login')
      }
      if (newUser.role === "AUTHOR") {
        let res = await axios.post(`${API_BASE}/author-api/users`, formData, { withCredentials: true })
        if (res.status === 201) navigate('/login')
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration Failed")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  if (loading) return <p className={loadingClass}>Creating your account...</p>;

  return (
    <div className={pageWrapper + " flex justify-center"}>
      <div className={formCard + " w-full shadow-sm border border-[#e8e8ed]"}>
        <h2 className={formTitle}>Create Account</h2>

        <form onSubmit={handleSubmit(onRegister)} className="space-y-4">
          {error && <p className={errorClass + " mb-6"}>{error}</p>}

          <div className="flex items-center justify-center gap-8 mb-8 pb-4 border-b border-[#e8e8ed]">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type='radio' value='USER' className="w-4 h-4 text-[#0066cc]" {...register('role', { required: 'Role required' })} />
              <span className="text-sm font-medium text-[#6e6e73] group-hover:text-[#1d1d1f]">User</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type='radio' value='AUTHOR' className="w-4 h-4 text-[#0066cc]" {...register('role', { required: 'Role required' })} />
              <span className="text-sm font-medium text-[#6e6e73] group-hover:text-[#1d1d1f]">Author</span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={formGroup}>
              <label className={labelClass}>FIRST NAME</label>
              <input className={inputClass} type='text' placeholder='Jobs' {...register('firstName', { required: 'Required' })} />
              {errors.firstName?.message && <p className="text-[#ff3b30] text-[10px] mt-1 uppercase font-bold">{errors.firstName.message}</p>}
            </div>
            <div className={formGroup}>
              <label className={labelClass}>LAST NAME</label>
              <input className={inputClass} type='text' placeholder='Steve' {...register('lastName')} />
            </div>
          </div>

          <div className={formGroup}>
            <label className={labelClass}>EMAIL ADDRESS</label>
            <input className={inputClass} type='email' placeholder='steve@apple.com' {...register('email', { required: 'Required', pattern: { value: emailRegex, message: 'Invalid format' } })} />
            {errors.email?.message && <p className="text-[#ff3b30] text-[10px] mt-1 uppercase font-bold">{errors.email.message}</p>}
          </div>

          <div className={formGroup}>
            <label className={labelClass}>PASSWORD</label>
            <input className={inputClass} type='password' placeholder='Minimum 8 characters' {...register('password', { required: 'Required' })} />
            {errors.password?.message && <p className="text-[#ff3b30] text-[10px] mt-1 uppercase font-bold">{errors.password.message}</p>}
          </div>

          <div className={formGroup}>
            <label className={labelClass}>PROFILE PICTURE</label>
            <div className="flex items-center gap-4">
              <label className="flex-1">
                <input type="file"
  className="hidden"
  accept="image/png, image/jpeg"
  {...register("profileImageUrl", {
    onChange: (e) => {

      const file = e.target.files[0];

      if (file) {

        if (!["image/jpeg", "image/png"].includes(file.type)) {
          setError("Only JPG or PNG allowed");
          return;
        }

        if (file.size > 2 * 1024 * 1024) {
          setError("File size must be less than 2MB");
          return;
        }

        setPreview(URL.createObjectURL(file));
        setError(null);

      }
    }
  })}
/>
                <div className="w-full text-center py-2 border-2 border-dashed border-[#d2d2d7] rounded-xl text-xs text-[#6e6e73] hover:border-[#0066cc] hover:text-[#0066cc] cursor-pointer transition-all">
                  {preview ? 'Change Photo' : 'Upload Photo'}
                </div>
              </label>
              {preview && (
                <img src={preview} alt="Preview" className="w-12 h-12 rounded-full object-cover border border-[#d2d2d7]" />
              )}
            </div>
          </div>

          <button className={submitBtn + " py-3 mt-6"} type='submit'>
            Create Account
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
