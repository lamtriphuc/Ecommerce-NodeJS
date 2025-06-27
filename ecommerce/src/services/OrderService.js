import axios from "axios"
export const axiosJWT = axios.create()

export const createOrder = async (data, access_token) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create`, data, {
        headers: {
            token: `Bearer ${access_token}`
        }
    })
    return res.data
}

export const getOrderDetails = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-order-details/${id}`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    })
    return res.data
}

export const getAllOrderByUserId = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-order/${id}`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    })
    return res.data
}

export const getAllOrder = async (access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-order`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    })
    return res.data
}


export const deleteOrder = async (id, access_token, orderItems) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/order/delete-order/${id}`, {
        data: { orderItems },
        headers: {
            token: `Bearer ${access_token}`
        }
    })
    return res.data
}

export const updateOrderStatus = async (orderId, updateData, access_token) => {
    const res = await axiosJWT.patch(`${process.env.REACT_APP_API_URL}/order/update-status/${orderId}`, updateData, {
        headers: {
            token: `Bearer ${access_token}`
        }
    })
    return res.data
}