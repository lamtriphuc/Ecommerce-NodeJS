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
            cover={
                <div style={{ width: '100%', height: '200px', position: 'relative', overflow: 'hidden' }}>
                    <img
                        className="product-image"
                        alt="product"
                        src={image}
                    />
                    {countInStock === 0 && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            fontWeight: 'bold'
                        }}>
                            HẾT HÀNG
                        </div>
                    )}
                </div>

            }
            onClick={() => countInStock !== 0 && handleDetailsProduct(id)}
            disabled={countInStock === 0}
        >
            {/* <img src={official} style={{ height: '30px', width: '70px', position: 'absolute', top: -1, left: -1, borderTopLeftRadius: '8px' }} /> */}
            <StyleNameProduct>{name}</StyleNameProduct>
            <WrapperReportText>
                <span style={{ marginRight: '4px' }}>
                    <span>{rating} </span><StarFilled style={{ fontSize: '14px', color: 'rgb(255, 196, 0)' }} />
                </span>
                <WrapperStyleTextSell> | Đã bán {sold}+</WrapperStyleTextSell>
            </WrapperReportText>
            <WrapperPriceText>
                <span>{convertPrice(price)}</span>
                <WrapperDiscountText>-{discount || 5}%</WrapperDiscountText>
            </WrapperPriceText>
        </WapperCardStyle>
    )
}

export default CardComponent