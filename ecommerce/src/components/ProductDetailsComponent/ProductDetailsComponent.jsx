import { Button, Divider, Image } from 'antd'
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'antd'
import productImage from '../../assets/images/test.webp'
import productImageSmall from '../../assets/images/imagesmall.webp'
import { WrapperAddressProduct, WrapperComment, WrapperDiscountText, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQuantityProduct, WrapperStyleColSmall, WrapperStyleImageSmall, WrapperStyleNameProduct, WrapperStyleTextSell } from './style'
import { StarFilled, PlusOutlined, MinusOutlined } from '@ant-design/icons'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComponent/Loading'
import { Rate } from "antd";
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct, orderSlice } from '../../redux/slides/orderSlide'
import { convertPrice } from '../../utils'
import TextArea from 'antd/es/input/TextArea'
import SliderComponent from '../SliderComponent/SliderComponent'
import * as message from '../../components/Message/MessageComponent'
import { DeleteOutlined } from '@ant-design/icons'

const ProductDetailsComponent = ({ productId }) => {
    const [numProduct, setNumProduct] = useState(1)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const [rate, setRate] = useState(0)
    const [comment, setComment] = useState('')
    const [isLoading, setIsLoading] = useState(false)

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

    const { isPending, data: productDetails, refetch } = useQuery({
        queryKey: ['product-details', productId],
        queryFn: fetchGetDetailsProduct,
        enabled: !!productId
    })

    const handleChangeCount = (type, limited) => {
        if (limited) return
        if (type === 'increase') {
            setNumProduct(numProduct + 1)
        } else {
            if (numProduct === 1)
                return
            setNumProduct(numProduct - 1)
        }
    }

    const handleAddProductToCart = () => {
        if (!user?._id) {
            navigate('/sign-in', { state: location?.pathname })
        } else {
            dispatch(addOrderProduct({
                orderItem: {
                    name: productDetails?.name,
                    amount: numProduct,
                    image: productDetails?.image,
                    price: productDetails?.price,
                    product: productDetails?._id,
                    discount: productDetails?.discount,
                    countInStock: productDetails?.countInStock
                }
            }))
        }
    }

    const handleBuyProduct = () => {
        handleAddProductToCart()
        navigate('/order', {
            state: {
                buy: true
            }
        })
    }

    const productImages = productDetails?.image.split(',') || []
    const [selectedImage, setSelectedImage] = useState('');
    useEffect(() => {
        if (productImages.length > 0) {
            setSelectedImage(productImages[0]);
        }
    }, [productDetails]);

    const handleSubmit = async () => {
        if (!rate || !comment) {
            return message.warning('Vui lòng đánh giá sao và viết bình luận!')
        }
        try {
            setIsLoading(true);
            const response = await ProductService.submitComment(
                productDetails?._id,
                { rate, comment },
                user?.access_token
            )
            console.log('response', response)
            if (response.status === 'OK') {
                await refetch();
                message.success('Gửi đánh giá thành công!');
            } else if (response.status === 'ERR') {
                message.warning(response.message);
            }
            setRate(0);
            setComment('');
        } catch (error) {
            message.error('Lỗi khi đánh giá sản phẩn: ')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Loading isLoading={isPending}>
            {productDetails?.countInStock === 0 && (
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
                    fontWeight: 'bold',
                    zIndex: 2000
                }}>
                    HẾT HÀNG
                </div>
            )}
            <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px' }} >
                <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <SliderComponent
                        arrImages={productImages}
                        settings={{
                            dots: true,
                            infinite: true,
                            speed: 500,
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            autoplay: false,
                        }}
                    />
                    {/* <Image src={selectedImage} alt='Product Image 1' preview={false} style={{ height: '500px' }} /> */}
                    <Row style={{ paddingTop: '10px', justifyContent: 'center', alignItems: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        {productImages.map((img, idx) => {
                            return (
                                <WrapperStyleColSmall span={4} key={idx} onClick={() => setSelectedImage(img)}>
                                    <WrapperStyleImageSmall src={img} alt='Product Image' preview={false} />
                                </WrapperStyleColSmall>
                            )
                        })}
                    </Row>
                </Col>
                <Col span={14} style={{ paddingLeft: '10px' }}>
                    <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
                    <div>
                        <Rate disabled value={productDetails?.rating} />
                        <WrapperStyleTextSell> | Đã bán {productDetails?.sold}+</WrapperStyleTextSell>
                    </div>
                    <WrapperPriceProduct>
                        <WrapperPriceTextProduct>{convertPrice(productDetails?.price)}</WrapperPriceTextProduct>
                        <WrapperDiscountText>-{productDetails?.discount}%</WrapperDiscountText>
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
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase', numProduct === productDetails?.countInStock)}>
                                <PlusOutlined style={{ color: '#000', fontSize: '16px' }} />
                            </button>
                        </WrapperQuantityProduct>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center' }}>
                        <ButtonComponent
                            size={40}
                            styleButton={{
                                background: '#fff',
                                borderRadius: '2px',
                                border: '1px solid rgb(10, 104, 255)',
                                width: '220px',
                                height: '48px',
                            }}
                            onClick={handleAddProductToCart}
                            textButton={'Thêm vào giỏ'}
                            styleTextButton={{ color: 'rgb(10, 104, 255)' }}
                        ></ButtonComponent>
                        <ButtonComponent
                            size={40}
                            styleButton={{
                                background: 'rgb(255, 66, 78)',
                                borderRadius: '2px',
                                border: 'none',
                                width: '220px',
                                height: '48px',
                            }}
                            onClick={handleBuyProduct}
                            textButton={'Mua ngay'}
                            styleTextButton={{ color: '#fff' }}
                        ></ButtonComponent>
                    </div>
                </Col>
            </Row >
            <Divider />
            <div style={{ background: '#fff', paddingTop: '20px' }}>
                <div style={{
                    width: 'fit-content', border: '1px solid #ccc', margin: '0 20px', padding: '10px'
                }}>
                    Mô tả sản phẩm
                </div>
                <Row style={{ background: '#fff', borderRadius: '4px', margin: '0 20px', paddingBottom: '40px' }} >
                    <Col span={16} style={{ border: '1px solid #ccc', padding: '20px', fontSize: '16px' }}>
                        <p style={{ whiteSpace: 'pre-line' }}>
                            {productDetails?.description}
                        </p>
                    </Col>
                    <Col span={8} style={{ border: '1px solid #ccc', padding: '20px', fontSize: '16px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '20px', textAlign: 'center', marginBottom: '10px' }}>
                            <span>Đánh giá sản phẩm</span>
                        </div>
                        <Rate allowHalf defaultValue={rate} value={rate} onChange={value => setRate(value)} />
                        <TextArea
                            style={{ marginTop: '10px' }}
                            rows={4}
                            placeholder='Nhập đánh giá của bạn'
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                        />
                        <div style={{ textAlign: 'end', margin: '10px 0 20px 0' }}>
                            <Button
                                onClick={handleSubmit}
                                style={{ width: '80px' }}>Đăng</Button>
                        </div>
                        <div style={{ width: '100%' }}>
                            {productDetails?.comments?.map(comment => {
                                return (
                                    <WrapperComment>
                                        <div style={{ padding: '10px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ fontWeight: 'bold', fontStyle: 'italic' }}>{comment.name}</span>
                                                {user?.isAdmin && (
                                                    <span><DeleteOutlined /></span>
                                                )}
                                            </div>
                                            <div>{comment.comment}</div>
                                        </div>
                                    </WrapperComment>
                                )
                            })}
                        </div>
                    </Col>
                </Row>
            </div>
        </Loading >
    )
}

export default ProductDetailsComponent