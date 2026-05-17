import React, { useState, useEffect } from 'react'
import axios from 'axios'
import API_BASE from '../config/api'
import { toast } from 'react-hot-toast'

import {
  cardClass,
  pageTitleClass,
  bodyText,
  pageWrapper,
  loadingClass
} from '../styles/common'

import UsersList from './UsersList'
import AuthorsList from './AuthorsList'

function AdminProfile() {

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('users')

  // fetch all users
  const fetchUsers = async () => {

    setLoading(true)

    try {

      const res = await axios.get(
        `${API_BASE}/admin-api/users`,
        { withCredentials: true }
      )

      setUsers(res.data.payload || [])

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        err.message ||
        'Failed to fetch users'
      )

    } finally {

      setLoading(false)

    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // block/unblock user
  const handleToggleBlock = async (user) => {

    const isBlocking = user.isActive

    const endpoint = isBlocking
      ? `/admin-api/block/${user._id}`
      : `/admin-api/unblock/${user._id}`

    // optimistic update
    setUsers(prev =>
      prev.map(u =>
        u._id === user._id
          ? { ...u, isActive: !isBlocking }
          : u
      )
    )

    try {

      const res = await axios.put(
        `${API_BASE}${endpoint}`,
        {},
        { withCredentials: true }
      )

      toast.success(res.data.message)

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        err.message ||
        'Failed to update status'
      )

      // revert update
      setUsers(prev =>
        prev.map(u =>
          u._id === user._id
            ? { ...u, isActive: isBlocking }
            : u
        )
      )

    }
  }

  const justUsers = users.filter(
    u => u.role === 'USER'
  )

  const justAuthors = users.filter(
    u => u.role === 'AUTHOR'
  )

  return (
    <div className={pageWrapper}>

      <div className={
        cardClass +
        ' text-center mb-16 py-12 border border-[#e8e8ed]'
      }>

        <h2 className={pageTitleClass}>
          System Control
        </h2>

        <p className={
          bodyText +
          " mb-10 text-lg max-w-xl mx-auto"
        }>
          Monitor platform health, manage user permissions,
          and ensure community standards.
        </p>

        <div className="flex justify-center gap-4">

          <button
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 transform ${
              activeTab === 'users'
                ? 'bg-[#0066cc] text-white shadow-md scale-105'
                : 'bg-white border border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7]'
            }`}
            onClick={() => setActiveTab('users')}
          >
            Users ({justUsers.length})
          </button>

          <button
            className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 transform ${
              activeTab === 'authors'
                ? 'bg-[#0066cc] text-white shadow-md scale-105'
                : 'bg-white border border-[#d2d2d7] text-[#1d1d1f] hover:bg-[#f5f5f7]'
            }`}
            onClick={() => setActiveTab('authors')}
          >
            Authors ({justAuthors.length})
          </button>

        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">

        {loading ? (

          <p className={loadingClass}>
            Fetching system data...
          </p>

        ) : (

          activeTab === 'users' ? (
            <UsersList
              users={justUsers}
              onToggleBlock={handleToggleBlock}
            />
          ) : (
            <AuthorsList
              authors={justAuthors}
              onToggleBlock={handleToggleBlock}
            />
          )

        )}

      </div>
    </div>
  )
}

export default AdminProfile