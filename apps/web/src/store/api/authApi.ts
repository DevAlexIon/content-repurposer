import { baseApi } from './baseApi'

import type { LoginResponse, LoginRequest, RegisterResponse, RegisterRequest, MeResponse } from '../../types/auth'

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (body) => ({ url: '/api/auth/login', method: 'POST', body }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                await queryFulfilled
                dispatch(baseApi.util.invalidateTags(['Jobs']))
            }
        }),
        register: builder.mutation<RegisterResponse, RegisterRequest>({
            query: (data) => ({
                url: '/api/auth/register',
                method: 'POST',
                body: data,
            }),
        }),
        getMe: builder.query<MeResponse, void>({
            query: () => '/api/auth/me',
        }),
    }),
})

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = authApi