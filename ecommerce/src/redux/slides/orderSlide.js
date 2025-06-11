import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    orderItems: [],
    shippingAddress: {},
    paymentMethod: '',
    itemsPrice: Number,
    shippingPrice: Number,
    TaxPrice: Number,
    totalPrice: Number,
    user: '',
    isPaid: false,
    paidAt: '',
    isDelivered: false,
    deliveredAt: '',
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addOrderProduct: (state, action) => {
            const { orderItem } = action.payload;
            // Tìm sản phẩm trong giỏ hàng (nếu đã có)
            const existingItem = state?.orderItems?.find(
                item => item?.product === orderItem.product
            )
            if (existingItem) {
                // Nếu sản phẩm đã có -> tăng số lượng
                existingItem.amount += orderItem?.amount
            } else {
                // Nếu chưa có -> thêm mới vào giỏ hàng
                state.orderItems.push(orderItem)
            }
        },
        increaseAmount: (state, action) => {
            const { productId } = action.payload
            const existingItem = state?.orderItems?.find(
                item => item?.product === productId
            )
            existingItem.amount++
        },
        decreaseAmount: (state, action) => {
            const { productId } = action.payload
            const existingItem = state?.orderItems?.find(
                item => item?.product === productId
            )
            existingItem.amount--
        },
        removeOrderProduct: (state, action) => {
            const { productId } = action.payload
            // Lọc bỏ sản phẩm cần xóa khỏi giỏ hàng
            state.orderItems = state.orderItems.filter(
                item => item.product !== productId
            )
        },

        removeAllOrderProduct: (state, action) => {
            const { checkedList } = action.payload
            console.log('checkedList', checkedList)
            // Lọc bỏ sản phẩm cần xóa khỏi giỏ hàng
            state.orderItems = state.orderItems.filter(
                item => !checkedList.includes(item.product)
            )
        },
    },
})

export const {
    addOrderProduct,
    removeOrderProduct,
    increaseAmount,
    decreaseAmount,
    removeAllOrderProduct
} = orderSlice.actions

export default orderSlice.reducer