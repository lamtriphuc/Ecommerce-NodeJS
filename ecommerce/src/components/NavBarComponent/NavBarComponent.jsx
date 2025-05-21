import React from 'react'
import { WrapperContent, WrapperLableText, WrapperTextPrice, WrapperTextValue } from './style'
import { Checkbox, Rate } from 'antd'

const NavBarComponent = () => {
    const onChange = (e) => {
    }
    const renderContent = (type, options) => {
        switch (type) {
            case 'text':
                return options.map((option) => {
                    return (
                        <WrapperTextValue>{option}</WrapperTextValue>
                    )
                })
            case 'checkbox':
                return (
                    <Checkbox.Group style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }} onChange={onChange}>
                        {options.map((option) => {
                            return (
                                <Checkbox style={{ marginLeft: '0' }} value={option.value}>{option.label}</Checkbox>
                            )
                        })}
                    </Checkbox.Group >
                )
            case 'star':
                return options.map((option) => {
                    return (
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <Rate style={{ fontSize: '14px' }} disabled defaultValue={option} />
                            <span style={{ color: 'rgb(56, 56, 61)' }}>{` từ ${option} sao`}</span>
                        </div>
                    )
                })
            case 'price':
                return options.map((option) => {
                    return (
                        <WrapperTextPrice>
                            {option}
                        </WrapperTextPrice>
                    )
                })
            default:
                return {}
        }
    }
    return (
        <div>
            <WrapperLableText>Label</WrapperLableText>
            <WrapperContent>
                {renderContent('text', ['TV', 'Tủ lạnh', 'Laptop'])}
            </WrapperContent>
            <WrapperContent>
                {renderContent('checkbox', [
                    { value: 'a', label: 'AA' },
                    { value: 'b', label: 'BB' },
                ])}
            </WrapperContent>
            <WrapperContent>
                {renderContent('star', [3, 4, 5])}
            </WrapperContent>
            <WrapperContent>
                {renderContent('price', ['dưới 50', 'trên 50'])}
            </WrapperContent>
        </div>
    )
}

export default NavBarComponent