import { Button, Input } from 'antd'
import React from 'react'
import { SearchOutlined } from '@ant-design/icons'
import InputComponent from '../InputComponent/InputComponent'
import ButtonComponent from '../ButtonComponent/ButtonComponent'

const ButtoninputSearch = (props) => {
    const { size,
        placeholder,
        textButton,
        backgroundColorInput = '#fff',
        backgroundColorButton = 'rgb(12,92, 182)',
        colorButton = '#fff'
    } = props
    return (
        <div style={{ display: 'flex' }}>
            <InputComponent
                size={size}
                placeholder={placeholder}
                style={{ backgroundColor: backgroundColorInput, borderRadius: '0px', border: 'none' }}
            />
            <ButtonComponent
                size={size}
                icon={<SearchOutlined style={{ color: colorButton }} />}
                styleButton={{ backgroundColor: backgroundColorButton, borderRadius: '0px', border: 'none' }}
                textButton={textButton}
                styleTextButton={{ color: colorButton }}
            />
        </div >
    )
}

export default ButtoninputSearch