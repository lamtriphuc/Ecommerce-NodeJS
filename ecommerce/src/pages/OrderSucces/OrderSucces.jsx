import React, { useEffect, useMemo, useState } from 'react'
import { WrapperInfo, WrapperItemOrder, WrapperContainer, WrapperValue, WrapperItemOrderInfo } from './style'
import { useDispatch, useSelector } from 'react-redux'
import { convertPrice } from '../../utils'
import { useLocation, useNavigate } from 'react-router-dom'
import Loading from '../../components/LoadingComponent/Loading'
import { orderConstant } from '../../constant'

const OrderSuccess = () => {
    const order = useSelector(state => state.order)
    const location = useLocation()
    const { state } = location

    return (
        <div style={{ background: '#f5f5fa', width: '100%', height: '100vh' }}>
            <Loading isLoading={false}>
                <div style={{ height: '100%', width: '1270px', margin: '0 auto' }} >
                    <h3>Đơn hàng đặt thành công</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                        <WrapperContainer>
                            <WrapperInfo>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>Phương thức giao hàng</label>
                                    <WrapperValue>
                                        <span style={{ fontWeight: 'bold', color: '#F77E00' }}>{orderConstant.delivery[state?.delivery]} </span>
                                    </WrapperValue>
                                </div>
                            </WrapperInfo>
                            <WrapperInfo>
                                <div>
                                    <label>Phương thức thanh toán</label>
                                    <WrapperValue>
                                        <span style={{ fontWeight: 'bold', color: '#000' }}>{orderConstant.payment[state?.payment]}  </span>
                                    </WrapperValue>
                                </div>
                            </WrapperInfo>
                            <WrapperItemOrderInfo>
                                {state?.orders?.map(order => {
                                    return (
                                        <WrapperItemOrder>
                                            <div style={{ width: '400px', display: 'flex', alignItems: 'center' }} >
                                                <img
                                                    src={order?.image}
                                                    style={{ width: '70px', height: '70px', objectFit: 'cover', padding: '0 10px', cursor: 'pointer' }} alt='Ảnh' />
                                                <div
                                                    style={{
                                                        width: '260px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        cursor: 'pointer'
                                                    }}
                                                >{order?.name}</div>
                                            </div>
                                            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                                <span style={{ width: '180px' }}>
                                                    <span style={{ fontSize: '13px', color: '#242424' }}>Giá tiền: {convertPrice(order?.price)}</span>
                                                </span>
                                                <span style={{ width: '180px' }}>
                                                    <span style={{ fontSize: '13px', color: '#242424' }}>Số lượng: {order?.amount}</span>
                                                </span>
                                            </div>
                                        </WrapperItemOrder>
                                    )
                                })}
                            </WrapperItemOrderInfo>
                            <WrapperInfo>
                                <span >
                                    <span style={{ fontSize: '20px', color: '#242424' }}>Tổng tiền: <span style={{ color: 'red' }}>{convertPrice(state?.totalPrice)}</span></span>
                                </span>
                            </WrapperInfo>
                        </WrapperContainer>
                    </div>
                </div>
            </Loading>
        </div>
    )
}

export default OrderSuccess
