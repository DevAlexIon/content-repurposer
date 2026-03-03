import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '../types/auth'
import type { RootState } from './index'

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.user = action.payload.user
            state.token = action.payload.token
            state.isAuthenticated = true
        },
        logout: (state) => {
            state.user = null
            state.token = null
            state.isAuthenticated = false
        },
    },
})

export const selectIsAuthenticated = (state: RootState) => {
    return state.auth.isAuthenticated
}

export const selectUser = (state: RootState) => {
    return state.auth.user
}

export const { setCredentials, logout } = authSlice.actions