import React from 'react'
import { WrapperInputStyle } from './style'

const InputForm = (props) => {
    const { placeholder = 'Nhập text', value, onChange, ...rests } = props

    return (
        <WrapperInputStyle
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            {...rests}
        />
    )
}

export default InputForm
