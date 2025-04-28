import { createApi,fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from "../../env/utils";

const pause = (duration:number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

const registerApi = createApi({
    reducerPath:'authen',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        fetchFn: async (...args) => {
            await pause(2000);
            return fetch(...args)
        }
    }),
    endpoints(builder){
        return{
            registerMFA: builder.mutation({
                query: (user) => {
                    console.log(user);
                    
                    return{
                        url: '/register/totp',
                        method: 'POST',
                        body:user
                    };
                }
            }),
            register: builder.mutation({
                query: (user) => {
                    console.log(user);
                    
                    return{
                        url: '/register',
                        method: 'POST',
                        body:user
                    };
                }
            }),
            MFACode: builder.query({
                query: (userId) => {
                    return{
                        url: `/generateMFACode/${userId}`,
                        method: 'GET',
                    };
                }
            }),
        }
    }
})

export const { 
    useMFACodeQuery,
    useRegisterMutation,
    useRegisterMFAMutation
 } = registerApi;
export { registerApi };