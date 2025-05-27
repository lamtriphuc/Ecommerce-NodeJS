import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    _id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
    access_token: ''
}

export const userSlide = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const { _id, name = '', email = '', access_token = '', phone = '', address = '', avatar = '' } = action.payload
            state._id = _id
            state.name = name
            state.email = email
            state.phone = phone
            state.address = address
            state.avatar = avatar
            state.access_token = access_token
        },

        resetUser: (state) => {
            state._id = ''
            state.name = ''
            state.email = ''
            state.phone = ''
            state.address = ''
            state.avatar = ''
            state.access_token = ''
        }
    },
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser } = userSlide.actions

export default userSlide.reducer