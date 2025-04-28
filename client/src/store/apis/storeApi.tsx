import { createApi,fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from "../../env/utils";

const pause = (duration:number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

const storeApi = createApi({
    reducerPath:'Stores',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        fetchFn: async (...args) => {
            await pause(2000);
            return fetch(...args)
        },
    }),
    endpoints(builder){
        return{
            fetchStore: builder.query({
                query: () => {
                    return{
                        url: '/store',
                        method: 'GET',
                    };
                },
            }),
            fetchStoreById: builder.query({
                query: (id) => {
                    return{
                        url: `/store/${id}`,
                        method: 'GET',
                    };
                },
            }),
            fetchStoreByLocation: builder.query({
                query: ({ districtId, subdistrictId, provinceId }) => {
                    return{
                        url: `/store/${districtId}/${subdistrictId}/${provinceId}`,
                        method: 'GET',
                    };
                },
            }),
            fetchType: builder.query({
                query: () => {
                    return{
                        url: '/type',
                        method: 'GET',
                    };
                },
            }),
        }
    }
})

export const {
    useFetchStoreByIdQuery,
    useFetchStoreByLocationQuery,
    useFetchStoreQuery,
    useFetchTypeQuery
} = storeApi;

export { storeApi };
