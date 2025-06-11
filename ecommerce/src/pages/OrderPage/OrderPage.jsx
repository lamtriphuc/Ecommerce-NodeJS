import React, { useState } from 'react'
import { WrapperCountOrder, WrapperInfo, WrapperInputNumber, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperPriceDiscount, WrapperRight, WrapperStyleHeader, WrapperTotal } from './style'
import { Checkbox } from 'antd'
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import image from '../../assets/images/test.webp'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useDispatch, useSelector } from 'react-redux'
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct } from '../../redux/slides/orderSlide'

const OrderPage = () => {
    const order = useSelector(state => state.order)
    const [checkedList, setCheckedList] = useState([])
    const dispatch = useDispatch()

    const onChange = (e) => {
        if (checkedList.includes(e.target.value)) {
            const newCheckedList = checkedList.filter(item => item !== e.target.value)
            setCheckedList(newCheckedList)
        } else {
            setCheckedList([...checkedList, e.target.value])
        }
    }

    const handleChangeCount = (type, productId) => {
        if (type === 'increase') {
            dispatch(increaseAmount({ productId }))
        }
        else {
            dispatch(decreaseAmount({ productId }))
        }
    }

    const handleDeleteProduct = (productId) => {
        dispatch(removeOrderProduct({ productId }))
    }

    const handleRemoveAllOrder = () => {
        if (checkedList.length > 0) {
            dispatch(removeAllOrderProduct({ checkedList }))
        }
    }

    const handleOnChangeCheckAll = (e) => {
        if (e.target.checked) {
            const newCheckedList = []
            order?.orderItems?.forEach(item => newCheckedList.push(item?.product))
            setCheckedList(newCheckedList)
        } else {
            setCheckedList([])
        }
    }

    return (
        <div style={{ background: '#f5f5fa', width: '100%', height: '100vh' }}>
            <div style={{ height: '100%', width: '1270px', margin: '0 auto' }} >
                <h3>Giỏ hàng</h3>
                <div style={{ display: 'flex', justifyContent: 'center' }} >
                    <WrapperLeft>
                        <WrapperStyleHeader>
                            <span style={{ display: 'inline-block', width: '390px' }}>
                                <Checkbox onChange={handleOnChangeCheckAll} checked={checkedList.length === order?.orderItems?.length}></Checkbox>
                                <span> Tất cả ({order?.orderItems?.length} sản phẩm) </span>
                            </span>
                            <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                                <span>Đơn giá</span>
                                <span>Số lượng</span>
                                <span>Thành tiền</span>
                                <DeleteOutlined style={{ cursor: 'pointer' }} onClick={handleRemoveAllOrder} />
                            </div>
                        </WrapperStyleHeader>
                        <WrapperListOrder>
                            {order?.orderItems?.map(order => {
                                return (
                                    <WrapperItemOrder>
                                        <div style={{ width: '390px', display: 'flex', alignItems: 'center' }} >
                                            <Checkbox onChange={onChange} value={order?.product} checked={checkedList.includes(order?.product)} ></Checkbox>
                                            <img src={order?.image} style={{ width: '70px', height: '70px', objectFit: 'cover', padding: '0 10px' }} alt='OK' />
                                            <div
                                                style={{
                                                    width: '260px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >{order?.name}</div>
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span>
                                                <span style={{ fontSize: '13px', color: '#242424' }}>{order?.price}</span>
                                            </span>
                                            <WrapperCountOrder>
                                                <button style={{ border: 'none', background: 'transparent' }} onClick={() => handleChangeCount('decrease', order?.product)}>
                                                    <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
                                                </button>
                                                <WrapperInputNumber min={1} defaultValue={order?.amount} value={order?.amount} size='small' />
                                                <button style={{ border: 'none', background: 'transparent' }} onClick={() => handleChangeCount('increase', order?.product)}>
                                                    <PlusOutlined style={{ color: '#000', fontSize: '10px' }} />
                                                </button>
                                            </WrapperCountOrder>
                                            <span style={{ color: 'rgb(255,66,78)', fontSize: '13px' }}>{order?.amount * order?.price}</span>
                                            <DeleteOutlined style={{ cursor: 'pointer' }} onClick={() => handleDeleteProduct(order?.product)} />
                                        </div>
                                    </WrapperItemOrder>
                                )
                            })}
                        </WrapperListOrder>
                    </WrapperLeft>
                    <WrapperRight>
                        <div style={{ width: '100%' }}>
                            <WrapperInfo>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span>Tạm tính</span>
                                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 100 }}>0</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span>Giảm giá</span>
                                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 400 }}>0</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span>Thuế</span>
                                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 400 }}>0</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span>Phí giao hàng</span>
                                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 400 }}>0</span>
                                </div>
                            </WrapperInfo>
                            <WrapperTotal>
                                <span>Tổng tiền</span>
                                <span style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ color: 'rgb(254, 56,52)', fontSize: '24px' }}>...giá</span>
                                    <span style={{ color: '#000', fontSize: '11px' }}>(Đã bao gồm VAT)</span>
                                </span>
                            </WrapperTotal>
                        </div>
                        <ButtonComponent
                            size={40}
                            styleButton={{
                                background: 'rgb(255, 57, 69)',
                                borderRadius: '2px',
                                border: 'none',
                                width: '220px',
                                height: '48px',
                            }}
                            textButton={'Mua ngay'}
                            styleTextButton={{ color: '#fff' }}
                        ></ButtonComponent>
                    </WrapperRight>
                </div>
            </div>
        </div>
    )
}

export default OrderPage