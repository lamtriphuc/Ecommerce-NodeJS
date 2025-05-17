import { Col } from 'antd'
import React from 'react'
import { WapperHeader, WrapperHeaderAccount, WrapperTextHeader, WrapperTextHeaderSmall } from './style'
import {
    UserOutlined,
    CaretDownOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons'
import ButtoninputSearch from '../ButtoninputSearch/ButtoninputSearch'

const HeaderComponent = () => {
    return (
        <div>
            <WapperHeader>
                <Col span={6}>
                    <WrapperTextHeader>LAMTRIPHUC</WrapperTextHeader>
                </Col>
                <Col span={12}>
                    <ButtoninputSearch
                        size="large"
                        textButton="Tìm kiếm"
                        placeholder="input search text"
                    // onSearch={Search} 
                    />
                </Col>
                <Col span={6} style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <WrapperHeaderAccount>
                        <UserOutlined style={{ fontSize: '30px' }} />
                        <div>
                            <WrapperTextHeaderSmall>Đăng nhập/Đăng ký</WrapperTextHeaderSmall>
                            <div>
                                <WrapperTextHeaderSmall>Tài khoản </WrapperTextHeaderSmall>
                                <CaretDownOutlined />
                            </div>
                        </div>
                    </WrapperHeaderAccount>
                    <div>
                        <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
                        <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
                    </div>
                </Col>
            </WapperHeader>
        </div>
    )
}

export default HeaderComponent