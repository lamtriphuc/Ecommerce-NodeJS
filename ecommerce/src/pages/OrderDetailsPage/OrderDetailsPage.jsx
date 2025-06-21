import React from 'react'
import { useLocation, useParams } from 'react-router-dom'
import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query'
import { WrapperCard, WrapperContent, WrapperInfo, WrapperLabel, WrapperLabelHeader, WrapperPrice, WrapperProduct } from './style'
import { Col, Divider, Row } from 'antd'
import { convertPrice } from '../../utils'
import StepComponent from '../../components/StepComponent/StepComponent'

const OrderDetailsPage = () => {
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
    console.log('orderDetails', orderDetails)

    const process = [
        {
            title: 'Đang chờ xử lý',
            // description: 'Chúng tôi đã nhận được đơn hàng của bạn và đang chuẩn bị.'
        },
        {
            title: 'Đang đóng gói và giao hàng',
            // description: 'Đơn hàng của bạn đã được đóng gói và gửi đến đơn vị vận chuyển.'
        },
        {
            title: 'Đang giao',
            // description: 'Đơn hàng đang được giao đến bạn'
        },
        {
            title: 'Hoàn tất',
            // description: 'Đơn hàng đã được giao thành công'
        }
    ];


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
                        current={0}
                    />
                </WrapperCard>
                <WrapperCard>
                    <WrapperLabelHeader>Thông tin giao hàng</WrapperLabelHeader>
                    <Row>
                        <Col span={12}>
                            <WrapperInfo>
                                <p className='label'>Người nhận: </p>
                                <p className='content'>LTP</p>
                            </WrapperInfo>
                        </Col>
                        <Col span={12}>
                            <WrapperInfo>
                                <p className='label'>Số điện thoại: </p>
                                <p className='content'>0987654321</p>
                            </WrapperInfo>
                        </Col>
                    </Row>
                    <Row>
                        <WrapperInfo>
                            <p className='label'>Địa chỉ nhận hàng: </p>
                            <p className='content'>123 Đường ABC, Phường XYZ, Quận 1, Thành phố Hồ Chí Minh</p>
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
                                <p className='content'>19/02/2025</p>
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
                                            src={item?.image}
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
                        <WrapperContent>{convertPrice(data?.data?.totalPrice)}</WrapperContent>
                    </WrapperPrice>
                    <WrapperPrice>
                        <WrapperLabel>Giảm giá:</WrapperLabel>
                        <div>1000000</div>
                    </WrapperPrice>
                    <WrapperPrice>
                        <WrapperLabel>Phí vận chuyển:</WrapperLabel>
                        <div style={{ color: 'rgb(22, 163, 74)' }}>1000000</div>
                    </WrapperPrice>
                    <WrapperPrice style={{ fontSize: '20px' }}>
                        <div>Tổng cộng:</div>
                        <div>1000000</div>
                    </WrapperPrice>
                    <Divider />
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'rgb(31, 41, 55)', marginBottom: '5px' }}>
                        <div>Hình thức thanh toán: </div>
                        <div >{orderDetails?.paymentMethod}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'rgb(31, 41, 55)' }}>
                        <div>Trạng thái thanh toán: </div>
                        <div>{orderDetails?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</div>
                    </div>
                </WrapperCard>
            </div>
        </div>
    )
}

export default OrderDetailsPage