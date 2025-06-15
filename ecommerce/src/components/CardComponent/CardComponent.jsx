import React from 'react'
import { StyleNameProduct, WapperCardStyle, WrapperDiscountText, WrapperPriceText, WrapperReportText, WrapperStyleTextSell } from './style'
import { StarFilled } from '@ant-design/icons'
import official from '../../assets/images/official.png'
import { useNavigate } from 'react-router-dom'
import { convertPrice } from '../../utils'

const CardComponent = (props) => {
    const { countInStock, description, image, name, price, rating, type, discount, sold, id } = props
    const navigate = useNavigate()

    const handleDetailsProduct = (id) => {
        navigate(`/product-details/${id}`)
    }

    return (
        <WapperCardStyle
            hoverable
            style={{ width: 200 }}
            cover={<img alt="example" src={image} />}
            onClick={() => handleDetailsProduct(id)}
        >
            <img src={official} style={{ height: '30px', width: '70px', position: 'absolute', top: -1, left: -1 }} />
            <StyleNameProduct>{name}</StyleNameProduct>
            <WrapperReportText>
                <span style={{ marginRight: '4px' }}>
                    <span>{rating} </span><StarFilled style={{ fontSize: '14px', color: 'rgb(255, 196, 0)' }} />
                </span>
                <WrapperStyleTextSell> | Đã bán {sold}+</WrapperStyleTextSell>
            </WrapperReportText>
            <WrapperPriceText>
                <span style={{ marginRight: '8px' }}>{convertPrice(price)}</span>
                <WrapperDiscountText>-{discount || 5}%</WrapperDiscountText>
            </WrapperPriceText>
        </WapperCardStyle>
    )
}

export default CardComponent