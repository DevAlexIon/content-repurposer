export interface User {
    id: string
    email: string
    plan: 'free' | 'pro'
    credits: number
    created_at: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    name: string
    email: string
    password: string
}

export interface LoginResponse {
    token: string
    user: User
}

export interface RegisterResponse {
    message: string
}

export interface MeResponse {
    user: User
}