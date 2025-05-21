import { configureStore } from '@reduxjs/toolkit'
import couterSlide from './slides/counterSlide'

export const store = configureStore({
    reducer: {
        counter: couterSlide,
    },
})