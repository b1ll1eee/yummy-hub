import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { loginMFAReducer,resetMFALogin,getMFALoginState } from "./slices/loginMFASlice";
import { loginReducer,resetLogin,getLoginState } from "./slices/loginSlice";
import { registerApi } from "./apis/registerApi";
import { favouriteApi } from "./apis/favouriteApi";
import { locationApi } from "./apis/locationApi";
import { cartApi } from "./apis/cartApi";
import { paymentApi } from "./apis/paymentApi";
import { pickupApi } from "./apis/pickupApi";
import { historyApi } from "./apis/historyApi";
import { authProductApi } from "./apis/authProductApi";
import { storeApi } from "./apis/storeApi";
import { productApi } from "./apis/productApi";
import { authStoreApi } from "./apis/authStoreApi";

export const store = configureStore({
    reducer: {
        loginMFA: loginMFAReducer,
        login: loginReducer,
        [registerApi.reducerPath]: registerApi.reducer,
        [favouriteApi.reducerPath]: favouriteApi.reducer,
        [locationApi.reducerPath]: locationApi.reducer,
        [cartApi.reducerPath]: cartApi.reducer,
        [paymentApi.reducerPath]: paymentApi.reducer,
        [pickupApi.reducerPath]: pickupApi.reducer,
        [historyApi.reducerPath]:historyApi.reducer,
        [authProductApi.reducerPath]: authProductApi.reducer,
        [storeApi.reducerPath]: storeApi.reducer,
        [authStoreApi.reducerPath]: authStoreApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware()
            .concat(registerApi.middleware)
            .concat(favouriteApi.middleware)
            .concat(locationApi.middleware)
            .concat(cartApi.middleware)
            .concat(paymentApi.middleware)
            .concat(pickupApi.middleware)
            .concat(historyApi.middleware)
            .concat(authProductApi.middleware)
            .concat(storeApi.middleware)
            .concat(authStoreApi.middleware)
            .concat(productApi.middleware);
    }
})

setupListeners(store.dispatch);

export {
    useMFACodeQuery,
    useRegisterMutation,
    useRegisterMFAMutation
} from './apis/registerApi';

export {
    useAddFavouriteMutation,
    useFetchFavouriteQuery,
    useRemoveFavouriteMutation,
    useFetchFavouriteByIdQuery
} from './apis/favouriteApi';

export {
    useFetchLocationQuery
} from './apis/locationApi';

export {
    useFetchCartQuery,
    useAddItemMutation,
    useRemoveItemMutation,
    useUpdateItemMutation,
    useFetchCartOrderQuery,
    useFetchCartLengthQuery,
    usePaymentMutation,
} from './apis/cartApi';

export {
    useFetchPaymentQuery,
    useGeneratePromptpayQRCodeQuery,
    // usePaymentMutation,
    useUpdateStatusPaymentMutation
} from './apis/paymentApi';

export {
    useFetchPickupQuery,
    useGeneratePickupQRCodeQuery,
    useUpdateStatusPickupMutation,
    useFetchPickupCheckMutation
} from './apis/pickupApi';

export {
    useFetchHistoryDetailQuery,
    useFetchHistoryQuery
} from './apis/historyApi';

export {
    useAddProductMutation,
    useFetchAuthProductQuery,
    useRemoveProductMutation,
    useUpdateProductMutation
} from './apis/authProductApi';

export {
    useFetchStoreByIdQuery,
    useFetchStoreByLocationQuery,
    useFetchStoreQuery,
    useFetchTypeQuery
} from './apis/storeApi'

export {
    useFetchProductByIdQuery,
    useFetchProductByStoreIdQuery,
    useFetchProductByTypeQuery,
    useFetchProductQuery,
    useFetchProductByTypeAndLocationQuery
} from './apis/productApi'

export {
    useFetchAuthStoreQuery
} from './apis/authStoreApi';

export { userLoginMFA } from './thunks/userLoginMFA';
export { userLogin } from './thunks/userLogin';
export {
    resetMFALogin,
    resetLogin,
    getMFALoginState,
    getLoginState
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch