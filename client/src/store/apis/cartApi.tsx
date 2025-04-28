import { createApi,fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from "../../env/utils";
import Cookies from 'js-cookie';

const pause = (duration:number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

const cartApi = createApi({
    reducerPath:'Carts',
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
    tagTypes: ['Carts'],
    endpoints(builder){
        return{
            fetchCart: builder.query({
                query: () => {
                    return{
                        url: '/auth/cart',
                        method: 'GET',
                    };
                },
                providesTags: ['Carts'],
            }),
            fetchCartOrder: builder.query({
                query: () => {
                    return{
                        url: '/auth/order/cart',
                        method: 'GET',
                    };
                },
                providesTags: ['Carts'],
            }),
            fetchCartDetail: builder.query({
                query: (id) => {
                    return{
                        url: `/auth/orderitem/${id}`,
                        method: 'GET',
                    };
                },
                providesTags: ['Carts'],
            }),
            payment: builder.mutation({
                query: (data) => {
                    return{
                        url: `/auth/payment`,
                        method: 'POST',
                        body: data,
                    };
                },
                invalidatesTags: ['Carts'],
            }),
            fetchCartLength: builder.query({
                query: () => {
                    return{
                        url: '/auth/order/cart/length',
                        method: 'GET',
                    };
                },
                providesTags: ['Carts'],
            }),
            addItem: builder.mutation({
                query: ({ id, itemData }) => {
                    return{
                        url: `/auth/orderitem/${id}`,
                        method: 'POST',
                        body:itemData
                    };
                },
                invalidatesTags: ['Carts'],
            }),
            updateItem: builder.mutation({
                query: ({ id, itemData }) => {
                    return{
                        url: `/auth/orderitem/${id}`,
                        method: 'PUT',
                        body:itemData
                    };
                },
                invalidatesTags: ['Carts'],
            }),
            removeItem: builder.mutation({
                query: (id) => {
                    return{
                        url: `/auth/orderitem/${id}`,
                        method: 'DELETE',
                    };
                },
                invalidatesTags: ['Carts'],
            }),
        }
    }
})

export const {
    useAddItemMutation,
    useFetchCartQuery,
    useRemoveItemMutation,
    useUpdateItemMutation,
    useFetchCartOrderQuery,
    useFetchCartLengthQuery,
    usePaymentMutation
} = cartApi;

export { cartApi };
