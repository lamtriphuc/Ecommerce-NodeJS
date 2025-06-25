import React, { useEffect, useMemo, useState } from 'react'
import { WrapperCountOrder, WrapperInfo, WrapperInputNumber, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperPriceDiscount, WrapperRadio, WrapperRight, WrapperStyleHeader, WrapperTotal } from './style'
import { Button, Checkbox, Form, Radio } from 'antd'
import { DeleteOutlined, MinusOutlined, PlusOutlined, RetweetOutlined } from '@ant-design/icons'
import image from '../../assets/images/test.webp'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useDispatch, useSelector } from 'react-redux'
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../redux/slides/orderSlide'
import { convertPrice } from '../../utils'
import ModalComponent from '../../components/ModalComponent/ModalComponent'
import InputComponent from '../../components/InputComponent/InputComponent'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as UserService from '../../services/UserService'
import * as OrderService from '../../services/OrderService'
import * as message from '../../components/Message/MessageComponent'
import { updateUser } from '../../redux/slides/userSlide'
import { useNavigate } from 'react-router-dom'
import Loading from '../../components/LoadingComponent/Loading'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import * as PaymentService from '../../services/PaymentService'
import axios from 'axios'

const PaymentPage = () => {
    const order = useSelector(state => state.order)
    const user = useSelector(state => state.user)
    const [checkedList, setCheckedList] = useState([])
    const [isOpenModelUpdateInfo, setIsOpenModelUpdateInfo] = useState(false)
    const [payment, setPayment] = useState('cod')
    const [delivery, setDelivery] = useState('fast')
    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        phone: '',
        address: '',
        city: ''
    })

    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id, token, ...rests } = data
            return UserService.updateUser(id, { ...rests }, token)
        }
    )

    const mutationCreateOrder = useMutationHooks(
        data => {
            const { token, ...rests } = data
            return OrderService.createOrder({ ...rests }, token)
        }
    )

    const { isPending, data } = mutationCreateOrder

    useEffect(() => {
        if (!isPending && data) {
            if (data.status === 'OK') {
                const arrayOrder = []
                order?.orderItemsSelected?.forEach(element => {
                    arrayOrder.push(element.product)
                })
                dispatch(removeAllOrderProduct({ checkedList: arrayOrder }))
                message.success('Đặt hàng thành công!')
                navigate('/order-success', {
                    state: {
                        delivery,
                        payment,
                        orders: order?.orderItemsSelected,
                        totalPrice: totalPriceMemo
                    }
                })
            } else {
                message.error('Đặt hàng thất bại!');
            }
        }
    }, [isPending, data]);

    useEffect(() => {
        form.setFieldsValue(stateUserDetails)
    }, [form, stateUserDetails])

    useEffect(() => {
        if (isOpenModelUpdateInfo) {
            setStateUserDetails({
                name: user?.name,
                phone: user?.phone,
                address: user?.address,
                city: user?.city
            })
        }
    }, [isOpenModelUpdateInfo])


    const priceMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            return total + (cur.price * cur.amount)
        }, 0)
        return result
    }, [order])

    const priceDiscountMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            const discount = cur.discount || 0
            return total + (cur.price * (discount / 100) * cur.amount)
        }, 0)
        return Number(result) || 0
    }, [order])

    const deliveryPriceMemo = useMemo(() => {
        if (priceMemo >= 200000 && priceMemo < 500000) {
            return 10000
        } else if (priceMemo === 0 || priceMemo >= 500000) {
            return 0
        } else {
            return 20000
        }
    }, [priceMemo])

    const totalPriceMemo = useMemo(() => {
        return Number(priceMemo) - Number(priceDiscountMemo) + Number(deliveryPriceMemo)
    }, [priceMemo, priceDiscountMemo, deliveryPriceMemo])


    const handleAddOrder = () => {
        if (user?.access_token && order?.orderItemsSelected && user?.name && user?.address
            && user?.phone && user?.city && user?._id && priceMemo
        ) {
            mutationCreateOrder.mutate({
                token: user?.access_token,
                orderItems: order?.orderItemsSelected,
                fullName: user?.name,
                address: user?.address,
                phone: user?.phone,
                city: user?.city,
                paymentMethod: payment,
                shippingMethod: delivery,
                itemsPrice: priceMemo,
                shippingPrice: deliveryPriceMemo,
                discountPrice: priceDiscountMemo,
                totalPrice: totalPriceMemo,
                user: user?._id
            })
        }
    }

    const handleCancelUpdateInfo = () => {
        setStateUserDetails({
            name: '',
            phone: '',
            address: '',
            city: ''
        })
        form.resetFields()
        setIsOpenModelUpdateInfo(false)
    }

    const handleUpdateInfo = () => {
        const { name, phone, address, city } = stateUserDetails
        if (name && phone && address && city) {
            mutationUpdate.mutate({
                id: user?._id,
                token: user?.access_token,
                ...stateUserDetails
            }, {
                onSuccess: () => {
                    dispatch(updateUser({ name, phone, address, city }))
                    setIsOpenModelUpdateInfo(false)
                }
            })
        }
    }

    const handleOnChageDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value
        })
    }

    const handleChangeAddress = () => {
        setIsOpenModelUpdateInfo(true)
    }

    const handleDelivery = (e) => {
        setDelivery(e.target.value)
    }
    const handlePayment = (e) => {
        setPayment(e.target.value)
    }

    const handlePaymentVNPay = async () => {
        try {
            const orderInfo = {
                token: user?.access_token,
                orderItems: order?.orderItemsSelected,
                fullName: user?.name,
                address: user?.address,
                phone: user?.phone,
                city: user?.city,
                paymentMethod: payment,
                shippingMethod: delivery,
                itemsPrice: priceMemo,
                shippingPrice: deliveryPriceMemo,
                discountPrice: priceDiscountMemo,
                totalPrice: totalPriceMemo,
                user: user?._id
            }
            const { payUrl } = await PaymentService.createVNPayment(orderInfo?.itemsPrice)

            if (payUrl) {
                localStorage.setItem('orderInfo', JSON.stringify(orderInfo));
                window.location.href = payUrl;
            } else {
                message.error('Không lấy được URL thanh toán');
            }
        } catch (err) {
            console.error('Lỗi khi thanh toán:', err);
            message.error('Thanh toán thất bại payment');
        }
    };

    return (
        <div style={{ background: '#f5f5fa', width: '100%', height: '100vh' }}>
            <Loading isLoading={isPending}>
                <div style={{ height: '100%', width: '1270px', margin: '0 auto' }} >
                    <h3 style={{ margin: '0', padding: '20px 0' }}>Thanh toán</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                        <WrapperLeft>
                            <WrapperInfo>
                                <div>
                                    <label style={{ fontWeight: 'bold' }}>Chọn phương thức giao hàng</label>
                                    <WrapperRadio
                                        name="shippping-method"
                                        defaultValue='fast'
                                        onChange={handleDelivery}
                                        value={delivery}
                                    >
                                        <Radio value='fast'><span style={{ fontWeight: 'bold', color: '#F77E00' }}>GHN </span><span>Giao hàng nhanh</span></Radio>
                                        <Radio value='save'><span style={{ fontWeight: 'bold', color: '#008B48' }}>GHTK </span><span>Giao hàng tiết kiệm</span></Radio>
                                        <Radio value='jt'><span style={{ fontWeight: 'bold', color: '#F60002' }}>J&t </span><span>J&T EXPRESS</span></Radio>
                                    </WrapperRadio>
                                </div>
                            </WrapperInfo>
                            <WrapperInfo>
                                <div>
                                    <label>Chọn phương thức thanh toán</label>
                                    <WrapperRadio
                                        name="payment-method"
                                        defaultValue='cod'
                                        onChange={handlePayment}
                                        value={payment}
                                    >
                                        <Radio value='cod'><span style={{ fontWeight: 'bold', color: '#000' }}>COD </span>Thanh toán tiền mặt khi nhận hàng</Radio>
                                        <Radio value='vnpay'><span style={{ fontWeight: 'bold', color: '#2A60AA' }}>VNPay </span>Thanh toán qua ví điện tử VNPay</Radio>
                                        <Radio value='paypal'><span style={{ fontWeight: 'bold', color: 'blue' }}>Paypal </span>Thanh toán qua Paypal</Radio>
                                    </WrapperRadio>
                                </div>
                            </WrapperInfo>
                        </WrapperLeft>
                        <WrapperRight>
                            <div style={{ width: '100%' }}>
                                <WrapperInfo>
                                    <div>
                                        <span>Địa chỉ: </span>
                                        <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{`${user?.address}, ${user?.city}`}</span>
                                        <span style={{ color: 'rgb(47, 111, 249)', cursor: 'pointer' }} onClick={handleChangeAddress}> Thay đổi</span>
                                    </div>
                                </WrapperInfo>
                                <WrapperInfo>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span>Tạm tính</span>
                                        <span style={{ color: '#000', fontSize: '14px', fontWeight: 100 }}>{convertPrice(priceMemo)}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span>Giảm giá</span>
                                        <span style={{ color: '#000', fontSize: '14px', fontWeight: 400 }}>{convertPrice(priceDiscountMemo)}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span>Phí giao hàng</span>
                                        <span style={{ color: '#000', fontSize: '14px', fontWeight: 400 }}>{convertPrice(deliveryPriceMemo)}</span>
                                    </div>
                                </WrapperInfo>
                                <WrapperTotal>
                                    <span>Tổng tiền</span>
                                    <span style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ color: 'rgb(254, 56,52)', fontSize: '24px' }}>{convertPrice(totalPriceMemo)}</span>
                                        <span style={{ color: '#000', fontSize: '11px' }}>(Đã bao gồm VAT)</span>
                                    </span>
                                </WrapperTotal>
                            </div>
                            {payment === 'paypal' ? (
                                <div style={{ width: '320px' }}>
                                    <PayPalScriptProvider options={{ clientId: "test" }}>
                                        <PayPalButtons style={{ layout: "horizontal" }} />
                                    </PayPalScriptProvider>
                                </div>
                            ) : payment === 'vnpay' ? (
                                <ButtonComponent
                                    onClick={handlePaymentVNPay}
                                    size={40}
                                    styleButton={{
                                        background: '#2A60AA',
                                        borderRadius: '2px',
                                        border: 'none',
                                        width: '320px',
                                        height: '48px',
                                    }}
                                    textButton={'Thanh toán'}
                                    styleTextButton={{ color: '#fff' }}
                                ></ButtonComponent>
                            ) : (
                                <ButtonComponent
                                    onClick={handleAddOrder}
                                    size={40}
                                    styleButton={{
                                        background: 'rgb(255, 57, 69)',
                                        borderRadius: '2px',
                                        border: 'none',
                                        width: '320px',
                                        height: '48px',
                                    }}
                                    textButton={'Đặt hàng'}
                                    styleTextButton={{ color: '#fff' }}
                                ></ButtonComponent>
                            )}
                        </WrapperRight>
                    </div>
                </div>
                <ModalComponent forceRender
                    title="Cập nhật thông tin người dùng"
                    open={isOpenModelUpdateInfo}
                    onCancel={handleCancelUpdateInfo}
                    onOk={handleUpdateInfo}
                >
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        initialValues={{ remember: true }}
                        // onFinish={onUpdateUser}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Tên"
                            name="name"
                            rules={[{ required: true, message: 'Hãy nhập tên!' }]}
                        >
                            <InputComponent
                                name='name'
                                value={stateUserDetails.name}
                                onChange={handleOnChageDetails}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[{ required: true, message: 'Hãy nhập số điện thoại!' }]}
                        >
                            <InputComponent
                                value={stateUserDetails.phone}
                                onChange={handleOnChageDetails}
                                name='phone'
                            />
                        </Form.Item>
                        <Form.Item
                            label="Địa chỉ"
                            name="address"
                            rules={[{ required: true, message: 'Hãy nhập địa chỉ!' }]}
                        >
                            <InputComponent
                                value={stateUserDetails.address}
                                onChange={handleOnChageDetails}
                                name='address'
                            />
                        </Form.Item>
                        <Form.Item
                            label="Thành phố"
                            name="city"
                            rules={[{ required: true, message: 'Hãy nhập thành phố!' }]}
                        >
                            <InputComponent
                                value={stateUserDetails.city}
                                onChange={handleOnChageDetails}
                                name='city'
                            />
                        </Form.Item>

                    </Form>
                </ModalComponent>
            </Loading >
        </div >
    )
}

export default PaymentPage