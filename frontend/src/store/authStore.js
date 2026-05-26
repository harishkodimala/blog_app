import { create } from 'zustand'
import axios from 'axios'
import API_BASE from '../config/api'
axios.defaults.withCredentials = true;

export let useAuth = create((set) => ({
    currentUser: null,
    isAuthenticated: false,
    loading: true,
    error: null,
    login: async (userCredObjWithRole) => {
        const {role, ...userCredObj} = userCredObjWithRole
        try{
            set({ loading: true, error: null})
            let res = await axios.post(`${API_BASE}/common-api/login`, userCredObj, {withCredentials: true})
            set({
                loading: false,
                isAuthenticated: true,
                currentUser: res.data.payload
            })
        }catch(err){
            set({
                loading: false,
                error: err,
                isAuthenticated: false,
                currentUser: null
            })
        }
    },
    logout: async () => {
        try{
            set({ loading: true, error: null })
            await axios.get(`${API_BASE}/common-api/logout`, { withCredentials: true})
            set({ loading: false, currentUser: null, isAuthenticated: false})
        }catch(err){
            set({
                loading: false,
                error: err,
                isAuthenticated: false,
                currentUser: null
            })
        }
    },
    checkAuth: async () => {
        try{
            set({loading: true, error: null})
            const res = await axios.get(`${API_BASE}/common-api/check-auth?t=${Date.now()}`, {withCredentials: true})

            console.log("Response from check auth API", res.data)

            set({
                loading: false,
                currentUser: res.data.payload,
                isAuthenticated: true
            })
        }catch(err){
            set({
                loading: false,
                error: err,
                isAuthenticated: false,
                currentUser: null
            })
        }
    }
}))