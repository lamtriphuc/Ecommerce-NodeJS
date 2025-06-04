import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slides/userSlide'
import productReducer from './slides/productSlide'

export const store = configureStore({
    reducer: {
        product: productReducer,
        user: userReducer
    },
})