import { createApi,fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from "../../env/utils";
import { StoreAuth } from '../../Model/Store'
import Cookies from "js-cookie";

const pause = (duration:number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

const authStoreApi = createApi({
    reducerPath:'authStores',
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
            fetchAuthStore: builder.query<StoreAuth,void>({
                query: () => {
                    return{
                        url: '/auth/store',
                        method: 'GET',
                    };
                },
            }),
        }
    }
})

export const {
    useFetchAuthStoreQuery
} = authStoreApi;

export { authStoreApi };
