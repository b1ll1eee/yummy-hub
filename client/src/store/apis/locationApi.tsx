import { createApi,fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from "../../env/utils";

const pause = (duration:number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

const locationApi = createApi({
    reducerPath:'Locations',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        fetchFn: async (...args) => {
            await pause(2000);
            return fetch(...args)
        },
    }),
    endpoints(builder){
        return{
            fetchLocation: builder.query({
                query: () => {
                    return{
                        url: '/location',
                        method: 'GET',
                    };
                },
            }),
        }
    }
})

export const {
    useFetchLocationQuery
} = locationApi;

export { locationApi };
