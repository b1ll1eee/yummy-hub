import { createApi,fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from "../../env/utils";
import Cookies from 'js-cookie';

const pause = (duration:number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

const historyApi = createApi({
    reducerPath:'Historys',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        prepareHeaders: (headers) => {
            const jwt = Cookies.get('jwt');
            if(jwt){
                headers.set('Authorization', `Bearer ${jwt}`);
            }
            return headers;
        },
        fetchFn: async (...args) => {
            await pause(2000);
            return fetch(...args)
        },
    }),
    endpoints(builder){
        return{
            //for user ,show order history
            fetchHistory: builder.query({
                query: () => {
                    return{
                        url: '/auth/order',
                        method: 'GET',
                    };
                },
            }),
            //for user ,show modal order detail by order id in history page
            fetchHistoryDetail: builder.query({
                query: (id) => {
                    return{
                        url: `/auth/orderitem/order/${id}`,
                        method: 'GET',
                    };
                },
            }),
           
        }
    }
})

export const {
    useFetchHistoryQuery,
    useFetchHistoryDetailQuery
} = historyApi;

export { historyApi };
