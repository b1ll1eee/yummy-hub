import { createApi,fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from "../../env/utils";
import Cookies from 'js-cookie';

const pause = (duration:number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

const paymentApi = createApi({
    reducerPath:'Payments',
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
    tagTypes: ['Payments'],
    endpoints(builder){
        return{
            //for admin
            fetchPayment: builder.query({
                query: () => {
                    return{
                        url: '/auth/payment',
                        method: 'GET',
                    };
                },
                providesTags: ['Payments'],
            }),
            //provide user
            generatePromptpayQRCode: builder.query({
                query: (data) => {

                    const orders = data.map((item:string) => ({ "orderId": item }));

                    return{
                        url: `/auth/generatepromptpayqrcode`,
                        method: 'POST',
                        body: orders,
                    };
                },
            }),
            //for user pay order
            // payment: builder.mutation({
            //     query: (data) => {
            //         return{
            //             url: `/auth/payment`,
            //             method: 'POST',
            //             body: data,
            //         };
            //     },
            //     invalidatesTags: ['Payments'],
            // }),
            //for admin change status order
            updateStatusPayment: builder.mutation({
                query: ({ id, orderData }) => {
                    return{
                        url: `/auth/payment/${id}`,
                        method: 'PUT',
                        body:orderData
                    };
                },
                invalidatesTags: ['Payments'],
            }),
        }
    }
})

export const {
    useFetchPaymentQuery,
    useGeneratePromptpayQRCodeQuery,
    // usePaymentMutation,
    useUpdateStatusPaymentMutation
} = paymentApi;

export { paymentApi };
