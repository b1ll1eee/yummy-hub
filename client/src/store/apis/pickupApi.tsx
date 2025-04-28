import { createApi,fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from "../../env/utils";
import Cookies from 'js-cookie';
import { Payment } from '../../Model/Payment';

const pause = (duration:number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

const pickupApi = createApi({
    reducerPath:'Pickups',
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
    tagTypes: ['Pickups'],
    endpoints(builder){
        return{
            //for store owner
            fetchPickup: builder.query({
                query: (id) => {
                    return{
                        url: `/auth/pickup/${id}`,
                        method: 'GET',
                    };
                },
                providesTags: ['Pickups'],
            }),
            //for store owner
            fetchPickupCheck: builder.mutation({
                query: (pickupCode) => {
                    return{
                        url: '/auth/pickup/check',
                        method: 'POST',
                        body:pickupCode,
                    };
                },
            }),
            //provide user
            generatePickupQRCode: builder.query({
                query: (data) => {
                    return{
                        url: `auth/generatepickupqrcode`,
                        method: 'POST',
                        body: data
                    };
                },
            }),
            //for store owner change status order
            updateStatusPickup: builder.mutation({
                query: (orderData) => {
                    return{
                        url: `/auth/pickup/`,
                        method: 'PUT',
                        body:orderData
                    };
                },
                invalidatesTags: ['Pickups'],
            }),
        }
    }
})

export const {
    useFetchPickupQuery,
    useGeneratePickupQRCodeQuery,
    useUpdateStatusPickupMutation,
    useFetchPickupCheckMutation
} = pickupApi;

export { pickupApi };
