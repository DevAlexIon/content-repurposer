import { baseApi } from "./baseApi"

export interface CreateJobRequest {
    input_type: 'url' | 'text'
    input_url?: string
    input_text?: string
}

export interface Job {
    id: string
    user_id: string
    input_type: 'url' | 'text'
    input_text: string | null
    input_url: string | null
    status: 'pending' | 'processing' | 'done' | 'error'
    outputs: {
        linkedin_post?: string
        twitter_thread?: string
        newsletter?: string
        tiktok_script?: string
    } | null
    created_at: string
}

export const jobsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getJobs: builder.query<Job[], void>({
            query: () => '/api/jobs',
            providesTags: ['Jobs'],
            transformResponse: (response: { jobs: Job[] }) => response.jobs,
        }),
        createJob: builder.mutation<{ job: Job }, CreateJobRequest>({
            query: (body) => ({
                url: '/api/jobs',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Jobs'],
        }),
        getJob: builder.query<{ job: Job }, string>({
            query: (id) => `/api/jobs/${id}`,
        }),
    }),
})

export const { useGetJobsQuery, useCreateJobMutation, useGetJobQuery } = jobsApi