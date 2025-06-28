import React, { useEffect, useMemo } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query'
import { WrapperCard, WrapperContent, WrapperInfo, WrapperLabel, WrapperLabelHeader, WrapperPrice, WrapperProduct } from './style'
import { Col, Divider, Row } from 'antd'
import { convertPrice, formattedDate } from '../../utils'
import StepComponent from '../../components/StepComponent/StepComponent'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { orderConstant } from '../../constant'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as message from '../../components/Message/MessageComponent'
import { useSelector } from 'react-redux'

const OrderDetailsPage = () => {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    const params = useParams()
    const { id } = params
    const location = useLocation()
    const { state } = location

    const fetchOrderDetails = async () => {
        const res = await OrderService.getOrderDetails(id, state?.token)
        return res
    }

    const queryOrderDetails = useQuery({
        queryKey: ['order-details'],
        queryFn: fetchOrderDetails,
        enabled: !!id && !!state?.token
    })

    const { data, isPending } = queryOrderDetails
    const { orderItems, shippingAddress } = data?.data || {}
    const orderDetails = data?.data || {}

    const date = new Date(orderDetails?.createdAt);
    date.setDate(date.getDate() + 5);
    const formatted = formattedDate(date);

    const process = [
        { title: 'Đang chờ xử lý' },            // => 'pending'
        { title: 'Đang đóng gói và giao hàng' },// => 'confirmed'
        { title: 'Đang giao' },                 // => 'shipping'
        { title: 'Hoàn tất' }                   // => 'delivered'
    ]

    const mutationDelete = useMutationHooks(
        (data) => {
            const { id, token, orderItems } = data
            return OrderService.deleteOrder(id, token, orderItems)
        }
    )
    const { data: dataCancel, isPending: isPendingCancel, isSuccess: isSuccessCancel, isError: isErrorCancel } = mutationDelete

    const handleCancelOrder = (order) => {
        mutationDelete.mutate({ id: order?._id, token: state?.token, orderItems: order?.orderItems })
    }
    useEffect(() => {
        if (!isPendingCancel && dataCancel) {
            if (dataCancel?.status === 'OK') {
                message.success('Hủy đơn hàng thành công!')
                navigate('/my-order', {
                    state: {
                        id: user?._id,
                        token: user?.access_token
                    }
                })
            } else if (dataCancel?.status !== 'OK') {
                message.error('Hủy đơn hàng thất bại!')
            }
        }
    }, [isPendingCancel, dataCancel])

    const priceMemo = useMemo(() => {
        const result = orderDetails?.orderItems?.reduce((total, cur) => {
            return total + (cur.price * cur.amount)
        }, 0)
        return result
    }, [orderDetails])


    return (
        <div style={{ width: '100%', minHeight: 'calc(100vh - 62px)', background: '#f5f5fa' }}>
            <div style={{ width: '1000px', height: '100%', margin: '0 auto' }}>
                <h3 style={{ margin: '0', padding: '20px 0' }}>Chi tiết đơn hàng</h3>
                <WrapperCard>
                    <WrapperLabelHeader>Đơn hàng #</WrapperLabelHeader>
                    <p style={{ marginBottom: '20px' }}>Đặt hàng ngày: </p>
                    <StepComponent
                        labelPlacement="vertical"
                        items={process}
                        current={
                            orderDetails?.shippingStatus === 'pending' ? 0 : orderDetails?.shippingStatus === 'confirmed' ? 1 :
                                orderDetails?.shippingStatus === 'shipping' ? 2 : 3
                        }
                    />
                </WrapperCard>
                <WrapperCard>
                    <WrapperLabelHeader>Thông tin giao hàng</WrapperLabelHeader>
                    <Row>
                        <Col span={12}>
                            <WrapperInfo>
                                <p className='label'>Người nhận: </p>
                                <p className='content'>{orderDetails?.shippingAddress?.fullName}</p>
                            </WrapperInfo>
                        </Col>
                        <Col span={12}>
                            <WrapperInfo>
                                <p className='label'>Số điện thoại: </p>
                                <p className='content'>{orderDetails?.shippingAddress?.phone}</p>
                            </WrapperInfo>
                        </Col>
                    </Row>
                    <Row>
                        <WrapperInfo>
                            <p className='label'>Địa chỉ nhận hàng: </p>
                            <p className='content'>{orderDetails?.shippingAddress?.address}, {orderDetails?.shippingAddress?.city}</p>
                        </WrapperInfo>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <WrapperInfo>
                                <p className='label'>Hình thức giao hàng: </p>
                                <p className='content'>Nhanh</p>
                            </WrapperInfo>
                        </Col>
                        <Col span={12}>
                            <WrapperInfo>
                                <p className='label'>Dự kiến: </p>
                                <p className='content'>{formattedDate(date)}</p>
                            </WrapperInfo>
                        </Col>
                    </Row>
                    <Row>
                        <WrapperInfo>
                            <p className='label'>Ghi chú: </p>
                            <p className='content'>Không có</p>
                        </WrapperInfo>
                    </Row>
                </WrapperCard>
                <WrapperCard>
                    <WrapperLabelHeader>Sản phẩm đã đặt</WrapperLabelHeader>
                    {orderItems?.map(item => {
                        return (
                            <>
                                <WrapperProduct>
                                    <div style={{ display: 'flex', alignItems: 'center' }} >
                                        <img
                                            src={item?.image.split(',')[0]}
                                            style={{ width: '70px', height: '70px', objectFit: 'cover', padding: '0 10px 0 0', cursor: 'pointer' }} alt='Ảnh' />
                                        <div
                                            style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                cursor: 'pointer'
                                            }}
                                        >{item?.name}</div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: '4px' }} >
                                        <span>{convertPrice(item?.price)}</span>
                                        <span>x{item?.amount}</span>
                                    </div>
                                </WrapperProduct>
                                <Divider style={{ margin: '10px' }} />
                            </>
                        )
                    })}
                    <WrapperPrice>
                        <WrapperLabel>Tạm tính:</WrapperLabel>
                        <WrapperContent>{convertPrice(priceMemo)}</WrapperContent>
                    </WrapperPrice>
                    <WrapperPrice>
                        <WrapperLabel>Giảm giá:</WrapperLabel>
                        <div style={{ color: 'rgb(22, 163, 74)' }}>{convertPrice(orderDetails.discountPrice)}</div>
                    </WrapperPrice>
                    <WrapperPrice>
                        <WrapperLabel>Phí vận chuyển:</WrapperLabel>
                        <div>{convertPrice(orderDetails.shippingPrice)}</div>
                    </WrapperPrice>
                    <WrapperPrice style={{ fontSize: '20px' }}>
                        <div>Tổng cộng:</div>
                        <div>{convertPrice(orderDetails.totalPrice)}</div>
                    </WrapperPrice>
                    <Divider />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'rgb(31, 41, 55)', marginBottom: '5px' }}>
                        <div>Hình thức thanh toán: </div>
                        <div >{orderConstant.payment[orderDetails?.paymentMethod]}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'rgb(31, 41, 55)' }}>
                        <div>Trạng thái thanh toán: </div>
                        <div>{orderDetails?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
                    </div>
                </WrapperCard>
                <WrapperCard>
                    <WrapperLabel>
                        Bạn muốn hủy đơn hàng?
                    </WrapperLabel>
                    <WrapperLabel style={{ fontSize: '14px', margin: '4px 0 20px 0' }}>
                        Nếu bạn muốn hủy đơn hàng, vui lòng liên hệ với chúng tôi sớm nhất có thể.
                    </WrapperLabel>
                    <ButtonComponent
                        onClick={() => handleCancelOrder(orderDetails)}
                        size={40}
                        styleButton={{
                            background: 'rgb(254 ,242, 242)',
                            borderRadius: '2px',
                            border: '1px solid rgb(254 ,202, 202)',
                            width: '100%',
                            height: '42px',
                            borderRadius: '6px'
                        }}
                        textButton={'Hủy đơn hàng'}
                        styleTextButton={{ color: 'rgb(220 ,38 ,38)', fontWeight: 'bold' }}
                    ></ButtonComponent>
                </WrapperCard>
            </div>
        </div>
    )
}

export default OrderDetailsPage