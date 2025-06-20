import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useMemo, useState } from 'react'
import * as OrderService from '../../services/OrderService'
import { useSelector } from 'react-redux'
import Loading from '../../components/LoadingComponent/Loading'
import { WrapperContainer, WrapperListOrder, WrapperListOrderItem, WrapperOrderInfo, WrapperOrderItem, WrapperOrderItemInfo, WrapperOrderItemStatus, WrapperOrderPrice, WrapperOrderStatus } from './style'
import { convertPrice } from '../../utils'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useLocation, useNavigate } from 'react-router-dom'

const MyOrderPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { state } = location

    const fetchMyOrder = () => OrderService.getAllOrderByUserId(state?.id, state?.token)
    const queryOrder = useQuery({
        queryKey: ['orders'],
        queryFn: fetchMyOrder,
        enabled: !!state?.id && !!state?.token,
    })
    const { data, isPending } = queryOrder

    const handleOrderDetails = (id) => {
        navigate(`/order-details/${id}`, {
            state: {
                token: state?.token
            }
        })
    }

    return (
        <Loading isLoading={isPending}>
            <WrapperContainer>
                <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
                    <h3 style={{ margin: '0', padding: '10px 0' }}>Đơn hàng của tôi</h3>
                    <WrapperListOrder>
                        {data?.data?.map(order => {
                            console.log('order', order)
                            return (
                                <WrapperListOrderItem>
                                    <WrapperOrderStatus>
                                        <span style={{ fontWeight: 'bold' }}>Trạng thái</span>
                                        <div>
                                            <span style={{ fontSize: '14px', color: 'rgb(255, 66, 78' }}>Giao hàng: </span> {order?.isDelivered ? 'Đã giao' : 'Chưa giao'}
                                        </div>
                                        <div>
                                            <span style={{ fontSize: '14px', color: 'rgb(255, 66, 78' }}>Thanh toán: </span> {order?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                        </div>
                                    </WrapperOrderStatus>
                                    <WrapperOrderInfo>
                                        {order?.orderItems?.map(item => {
                                            return (
                                                <WrapperOrderItem>
                                                    <div style={{ display: 'flex', alignItems: 'center' }} >
                                                        <img
                                                            src={item?.image}
                                                            style={{ width: '70px', height: '70px', objectFit: 'cover', padding: '0 10px', cursor: 'pointer' }} alt='Ảnh' />
                                                        <div
                                                            style={{
                                                                width: '400px',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                cursor: 'pointer'
                                                            }}
                                                        >{item?.name}</div>
                                                    </div>
                                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                                        <span style={{ width: '180px' }}>
                                                            <span style={{ fontSize: '13px', color: '#242424' }}>Giá tiền: {convertPrice(item?.price)}</span>
                                                        </span>
                                                        <span style={{ width: '180px' }}>
                                                            <span style={{ fontSize: '13px', color: '#242424' }}>Số lượng: {item?.amount}</span>
                                                        </span>
                                                    </div>
                                                </WrapperOrderItem>
                                            )
                                        })}
                                    </WrapperOrderInfo>
                                    <WrapperOrderPrice>
                                        <span style={{ fontSize: '14px', color: 'rgb(255, 66, 78' }}>Tổng tiền: </span>{convertPrice(order?.totalPrice)}
                                        <div style={{ margin: '10px 0', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                            <ButtonComponent
                                                onClick={() => handleOrderDetails(order?._id)}
                                                size={40}
                                                styleButton={{
                                                    background: '#fff',
                                                    borderRadius: '4px',
                                                    border: '2px solid rgb(10, 104, 255)',
                                                    width: '100px',
                                                    height: '40px',
                                                }}
                                                textButton={'Xem chi tiết'}
                                                styleTextButton={{ color: 'rgb(10, 104, 255)' }}
                                            ></ButtonComponent>
                                            <ButtonComponent
                                                size={40}
                                                styleButton={{
                                                    background: '#fff',
                                                    borderRadius: '4px',
                                                    border: '2px solid #cc3300',
                                                    width: '100px',
                                                    height: '40px',
                                                }}
                                                textButton={'Hủy đơn hàng'}
                                                styleTextButton={{ color: '	#cc3300' }}
                                            ></ButtonComponent>
                                        </div>
                                    </WrapperOrderPrice>
                                </WrapperListOrderItem>
                            )
                        })}

                    </WrapperListOrder>
                </div >
            </WrapperContainer>
        </Loading>
    )
}

export default MyOrderPage