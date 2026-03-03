import { baseApi } from './baseApi'

export interface Job {
    id: string
    title: string
    content_type: string
    status: 'pending' | 'processing' | 'completed' | 'failed'
    formats: string[]
    created_at: string
}

export const jobsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getJobs: builder.query<Job[], void>({
            query: () => 'api/jobs',
            transformResponse: (response: { jobs: Job[] }) => response.jobs,

        }),
    }),
})

export const { useGetJobsQuery } = jobsApi