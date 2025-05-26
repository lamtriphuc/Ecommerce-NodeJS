import { configureStore } from '@reduxjs/toolkit'
import couterSlide from './slides/counterSlide'
import userSlide from './slides/userSlide'

export const store = configureStore({
    reducer: {
        counter: couterSlide,
        user: userSlide
    },
})