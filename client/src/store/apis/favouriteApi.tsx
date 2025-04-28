import { createApi,fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from "../../env/utils";
import Cookies from 'js-cookie';

const pause = (duration:number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

const favouriteApi = createApi({
    reducerPath:'Favourites',
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
    tagTypes: ['Favorites'],
    endpoints(builder){
        return{
            fetchFavourite: builder.query({
                query: () => {
                    return{
                        url: '/auth/favorite',
                        method: 'GET',
                    };
                },
                providesTags: ['Favorites'],
            }),
            fetchFavouriteById: builder.query({
                query: (id) => {
                    return{
                        url: `/auth/favorite/${id}`,
                        method: 'GET',
                    };
                },
                providesTags: ['Favorites'],
            }),
            addFavourite: builder.mutation({
                query: (favouriteData) => {
                    return{
                        url: '/auth/favorite',
                        method: 'POST',
                        body:favouriteData
                    };
                },
                invalidatesTags: ['Favorites'],
            }),
            removeFavourite: builder.mutation({
                query: (id) => {
                    return{
                        url: `/auth/favorite/${id}`,
                        method: 'DELETE',
                    };
                },
                invalidatesTags: ['Favorites'],
            }),
        }
    }
})

export const {
    useFetchFavouriteQuery,
    useAddFavouriteMutation,
    useRemoveFavouriteMutation,
    useFetchFavouriteByIdQuery
} = favouriteApi;

export { favouriteApi };
