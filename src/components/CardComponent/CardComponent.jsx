import { Card, Image } from 'antd'
import Meta from 'antd/es/card/Meta'
import React from 'react'
import { StyleNameProduct, WapperCardStyle, WrapperDiscountText, WrapperPriceText, WrapperReportText } from './style'
import { StarFilled } from '@ant-design/icons'
import official from '../../assets/images/official.png'

const CardComponent = () => {
    return (
        <WapperCardStyle
            hoverable
            style={{ width: 240 }}
            cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
        >
            <img src={official} style={{ height: '30px', width: '70px', position: 'absolute', top: -1, left: -1 }} />
            <StyleNameProduct>IPhone</StyleNameProduct>
            <WrapperReportText>
                <span style={{ marginRight: '4px' }}>
                    <span>4.8 </span><StarFilled style={{ fontSize: '14px', color: 'yellow' }} />
                </span>
                <span> | Đã bán 1000+</span>
            </WrapperReportText>
            <WrapperPriceText>
                1.000.000đ
                <WrapperDiscountText>-5%</WrapperDiscountText>
            </WrapperPriceText>
        </WapperCardStyle>
    )
}

export default CardComponent