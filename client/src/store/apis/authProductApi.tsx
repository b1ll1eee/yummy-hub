import { createApi,fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from "../../env/utils";
import Cookies from "js-cookie";
import { ProductData } from '../../Model/Product';

const pause = (duration:number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

const authProductApi = createApi({
    reducerPath:'authProducts',
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
    tagTypes: ['Products'],
    endpoints(builder){
        return{
            fetchAuthProduct: builder.query<Array<ProductData>,void>({
                query: () => {
                    return{
                        url: '/auth/product',
                        method: 'GET',
                    };
                },
                providesTags: ['Products'],
            }),
            addProduct: builder.mutation({
                query: (productData) => {
                    const product = new FormData();
                    const data = {
                        store:productData.store,
                        type:productData.type,
                        name:productData.name,
                        description:productData.description,
                        expiryDate:productData.expiryDate,
                        price:productData.price,
                        discountPrice:productData.discountPrice,
                        quantityAvailable:productData.quantityAvailable,
                    }
                    product.append(`product`, JSON.stringify(data));
                    product.append(`file`, productData.file);
                    return{
                        url: `/auth/product`,
                        method: 'POST',
                        body: product
                    };
                },
                invalidatesTags: ['Products'],
            }),
            updateProduct: builder.mutation({
                query: (productData) => {
                    const product = new FormData();  
                    const data = {
                        store:productData.store,
                        type:productData.type,
                        name:productData.name,
                        description:productData.description,
                        expiryDate:productData.expiryDate,
                        price:productData.price,
                        discountPrice:productData.discountPrice,
                        quantityAvailable:productData.quantityAvailable,
                    }
                    product.append(`product`, JSON.stringify(data));
                    product.append(`file`, productData.file);
                    return{
                        url: `/auth/product/${productData.productId}`,
                        method: 'PUT',
                        body:product
                    };
                },
                invalidatesTags: ['Products'],
            }),
            removeProduct: builder.mutation({
                query: (id) => {
                    return{
                        url: `/auth/product/${id}`,
                        method: 'DELETE',
                    };
                },
                invalidatesTags: ['Products'],
            }),
        }
    }
})

export const {
    useAddProductMutation,
    useFetchAuthProductQuery,
    useRemoveProductMutation,
    useUpdateProductMutation
} = authProductApi;

export { authProductApi };
