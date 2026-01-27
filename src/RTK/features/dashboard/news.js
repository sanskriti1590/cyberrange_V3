import { createApi , fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import ApiConfig from '../../../APIConfig/ApiConfig'


export const news = createApi({
    reducerPath:"newApi",
    baseQuery:fetchBaseQuery({
        baseUrl:process.env.REACT_APP_API_PATH
    }),
    endpoints:(builder)=>({
        getNews :builder.query({ query:()=> ApiConfig.admin.news})
    })
})

export const { useGetNewsQuery } = news

