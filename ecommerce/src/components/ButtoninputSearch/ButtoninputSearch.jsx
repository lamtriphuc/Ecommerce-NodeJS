import React from 'react'
import { SearchOutlined } from '@ant-design/icons'
import InputComponent from '../InputComponent/InputComponent'
import ButtonComponent from '../ButtonComponent/ButtonComponent'

const ButtoninputSearch = (props) => {
    const {
        size,
        placeholder,
        textButton,
        backgroundColorInput = '#fff',
        backgroundColorButton = 'rgb(12,92, 182)',
        colorButton = '#fff'
    } = props
    return (
        <div style={{ display: 'flex' }}>
            <InputComponent
                suffix={<SearchOutlined />}
                size={size}
                placeholder={placeholder}
                style={{ backgroundColor: backgroundColorInput, borderRadius: '6px', border: 'none' }}
                {...props}
            />
            {/* <ButtonComponent
                size={size}
                icon={<SearchOutlined style={{ color: colorButton }} />}
                styleButton={{ background: backgroundColorButton, borderRadius: '0 6px 6px 0', border: 'none' }}
                textButton={textButton}
                styleTextButton={{ color: colorButton }}
            /> */}
        </div >
    )
}

export default ButtoninputSearch