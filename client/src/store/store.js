import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/products-slice";
import adminOrderSlice from "./admin/order-slice";
<<<<<<< HEAD
import adminComboSlice from "./admin/combo-slice";
=======
>>>>>>> origin/feature/rating-analysis

import shopProductsSlice from "./shop/products-slice";
import shopCartSlice from "./shop/cart-slice";
import shopAddressSlice from "./shop/address-slice";
import shopOrderSlice from "./shop/order-slice";
import shopSearchSlice from "./shop/search-slice";
import shopReviewSlice from "./shop/review-slice";
import commonFeatureSlice from "./common-slice";
<<<<<<< HEAD
=======
import ratingReducer from "./rating-slice";
>>>>>>> origin/feature/rating-analysis

const store = configureStore({
    reducer: {
        auth: authReducer,
<<<<<<< HEAD

        adminProducts: adminProductsSlice,
        adminOrder: adminOrderSlice,
        adminCombo: adminComboSlice,
=======
        rating: ratingReducer,

        adminProducts: adminProductsSlice,
        adminOrder: adminOrderSlice,
>>>>>>> origin/feature/rating-analysis

        shopProducts: shopProductsSlice,
        shopCart: shopCartSlice,
        shopAddress: shopAddressSlice,
        shopOrder: shopOrderSlice,
        shopSearch: shopSearchSlice,
        shopReview: shopReviewSlice,

        commonFeature: commonFeatureSlice,
    },
});

export default store;