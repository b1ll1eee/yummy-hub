import { createApi,fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from "../../env/utils";

const pause = (duration:number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

const productApi = createApi({
    reducerPath:'Products',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        fetchFn: async (...args) => {
            await pause(2000);
            return fetch(...args)
        },
    }),
    endpoints(builder){
        return{
            fetchProduct: builder.query({
                query: () => {
                    return{
                        url: '/product',
                        method: 'GET',
                    };
                },
            }),
            fetchProductByType: builder.query({
                query: (id) => {
                    return{
                        url: `/product/type/${id}`,
                        method: 'GET',
                    };
                },
            }),
            fetchProductByTypeAndLocation: builder.query({
                query: ({id, districtId, subdistrictId, provinceId}) => {
                    return{
                        url: `/product/type/${id}/${districtId}/${subdistrictId}/${provinceId}`,
                        method: 'GET',
                    };
                },
            }),
            fetchProductById: builder.query({
                query: (id) => {
                    return{
                        url: `/product/${id}`,
                        method: 'GET',
                    };
                },
            }),
            fetchProductByStoreId: builder.query({
                query: (id) => {
                    return{
                        url: `/product/store/${id}`,
                        method: 'GET',
                    };
                },
            }),
        }
    }
})

export const {
    useFetchProductByIdQuery,
    useFetchProductByStoreIdQuery,
    useFetchProductByTypeQuery,
    useFetchProductQuery,
    useFetchProductByTypeAndLocationQuery
} = productApi;

export { productApi };
