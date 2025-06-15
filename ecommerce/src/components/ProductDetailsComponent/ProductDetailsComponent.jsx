import { Image } from 'antd'
import React, { useState } from 'react'
import { Col, Row } from 'antd'
import productImage from '../../assets/images/test.webp'
import productImageSmall from '../../assets/images/imagesmall.webp'
import { WrapperAddressProduct, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQuantityProduct, WrapperStyleColSmall, WrapperStyleImageSmall, WrapperStyleNameProduct, WrapperStyleTextSell } from './style'
import { StarFilled, PlusOutlined, MinusOutlined } from '@ant-design/icons'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComponent/Loading'
import { Rate } from "antd";
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct } from '../../redux/slides/orderSlide'
import { convertPrice } from '../../utils'

const ProductDetailsComponent = ({ productId }) => {
    const [numProduct, setNumProduct] = useState(1)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    const user = useSelector(state => state.user)

    const onChange = (value) => {
        setNumProduct(Number(value))
    }

    const fetchGetDetailsProduct = async ({ queryKey }) => {
        const [, id] = queryKey
        if (id) {
            const res = await ProductService.getDetailsProduct(id)
            return res.data
        }

    }

    const { isPending, data: productDetails } = useQuery({
        queryKey: ['product-details', productId],
        queryFn: fetchGetDetailsProduct,
        enabled: !!productId
    })

    const handleChangeCount = (type) => {
        if (type === 'increase') {
            setNumProduct(numProduct + 1)
        } else {
            if (numProduct === 1)
                return
            setNumProduct(numProduct - 1)
        }
    }

    const handleAddOrderProduct = () => {
        if (!user?._id) {
            navigate('/sign-in', { state: location?.pathname })
        } else {
            dispatch(addOrderProduct({
                orderItem: {
                    name: productDetails?.name,
                    amount: numProduct,
                    image: productDetails?.image,
                    price: productDetails?.price,
                    product: productDetails?._id
                }
            }))
        }
    }

    return (
        <Loading isLoading={isPending}>
            <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px' }} >
                <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
                    <Image src={productDetails?.image} alt='Product Image' preview={false} />
                    <Row style={{ paddingTop: '10px', justifyContent: 'space-between' }}>
                        <WrapperStyleColSmall span={4}>
                            <WrapperStyleImageSmall src={productImageSmall} alt='Product Image' preview={false} />
                        </WrapperStyleColSmall>
                        <WrapperStyleColSmall span={4}>
                            <WrapperStyleImageSmall src={productImageSmall} alt='Product Image' preview={false} />
                        </WrapperStyleColSmall>
                        <WrapperStyleColSmall span={4}>
                            <WrapperStyleImageSmall src={productImageSmall} alt='Product Image' preview={false} />
                        </WrapperStyleColSmall>
                        <WrapperStyleColSmall span={4}>
                            <WrapperStyleImageSmall src={productImageSmall} alt='Product Image' preview={false} />
                        </WrapperStyleColSmall>
                        <WrapperStyleColSmall span={4}>
                            <WrapperStyleImageSmall src={productImageSmall} alt='Product Image' preview={false} />
                        </WrapperStyleColSmall>
                        <WrapperStyleColSmall span={4}>
                            <WrapperStyleImageSmall src={productImageSmall} alt='Product Image' preview={false} />
                        </WrapperStyleColSmall>
                    </Row>
                </Col>
                <Col span={14} style={{ paddingLeft: '10px' }}>
                    <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
                    <div>
                        <Rate disabled value={productDetails?.rating} />
                        <WrapperStyleTextSell> | Đã bán 1000+</WrapperStyleTextSell>
                    </div>
                    <WrapperPriceProduct>
                        <WrapperPriceTextProduct>{convertPrice(productDetails?.price)}đ</WrapperPriceTextProduct>
                    </WrapperPriceProduct>
                    <WrapperAddressProduct>
                        <span>Giao đến </span>
                        <span className='address'>  {user?.address}</span>
                        <span className='change-address'> Đổi địa chỉ</span>
                    </WrapperAddressProduct>
                    <div style={{ margin: '10px 0 20px', padding: '10px 0', borderBottom: '1px solid #e5e5e5', borderTop: '1px solid #e5e5e5' }}>
                        <div style={{ marginBottom: '6px' }}>Số lượng</div>
                        <WrapperQuantityProduct>
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease')}>
                                <MinusOutlined style={{ color: '#000', fontSize: '16px' }} />
                            </button>
                            <WrapperInputNumber min={1} defaultValue={1} onChange={onChange} value={numProduct} size='small' />
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase')}>
                                <PlusOutlined style={{ color: '#000', fontSize: '16px' }} />
                            </button>
                        </WrapperQuantityProduct>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center' }}>
                        <ButtonComponent
                            size={40}
                            styleButton={{
                                background: 'rgb(255, 66, 78)',
                                borderRadius: '2px',
                                border: 'none',
                                width: '220px',
                                height: '48px',
                            }}
                            onClick={handleAddOrderProduct}
                            textButton={'Mua ngay'}
                            styleTextButton={{ color: '#fff' }}
                        ></ButtonComponent>
                        <ButtonComponent
                            size={40}
                            styleButton={{
                                background: '#fff',
                                borderRadius: '2px',
                                border: '1px solid rgb(10, 104, 255)',
                                width: '220px',
                                height: '48px',
                            }}
                            textButton={'Thêm vào giỏ'}
                            styleTextButton={{ color: 'rgb(10, 104, 255)' }}
                        ></ButtonComponent>
                    </div>
                </Col>
            </Row >
        </Loading>
    )
}

export default ProductDetailsComponent