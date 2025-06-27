import React, { useEffect, useMemo, useState } from 'react'
import { WrapperCountOrder, WrapperInfo, WrapperInputNumber, WrapperItemOrder, WrapperLeft, WrapperListOrder, WrapperPriceDiscount, WrapperRight, WrapperStyleHeader, WrapperStyleHeaderDelivery, WrapperTotal } from './style'
import { Button, Checkbox, Form } from 'antd'
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import image from '../../assets/images/test.webp'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useDispatch, useSelector } from 'react-redux'
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../redux/slides/orderSlide'
import { convertPrice } from '../../utils'
import ModalComponent from '../../components/ModalComponent/ModalComponent'
import InputComponent from '../../components/InputComponent/InputComponent'
import { WrapperUploadFile } from '../../components/AdminUser/style'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as UserService from '../../services/UserService'
import * as message from '../../components/Message/MessageComponent'
import { updateUser } from '../../redux/slides/userSlide'
import { useLocation, useNavigate } from 'react-router-dom'
import StepComponent from '../../components/StepComponent/StepComponent'

const OrderPage = () => {
    const order = useSelector(state => state.order)
    const user = useSelector(state => state.user)
    const [checkedList, setCheckedList] = useState([])
    const [isOpenModelUpdateInfo, setIsOpenModelUpdateInfo] = useState(false)
    const [form] = Form.useForm()
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        phone: '',
        address: '',
        city: ''
    })
    const { state } = location // state.buy

    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id, token, ...rests } = data
            return UserService.updateUser(id, { ...rests }, token)
        }
    )
    const { data, isPending, isSuccess, isError } = mutationUpdate

    const onChange = (e) => {
        if (checkedList.includes(e.target.value)) {
            const newCheckedList = checkedList.filter(item => item !== e.target.value)
            setCheckedList(newCheckedList)
        } else {
            setCheckedList([...checkedList, e.target.value])
        }
    }

    useEffect(() => {
        dispatch(selectedOrder({ checkedList }))
    }, [checkedList])

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

    const handleChangeCount = (type, productId, limited) => {
        if (limited) return
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

    useEffect(() => {
        if (state?.buy && order?.orderItems) {
            const newCheckedList = order.orderItems.map(item => item.product);
            setCheckedList(newCheckedList);
        }
    }, [state?.buy, order?.orderItems]);


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


    const handleAddCart = () => {
        if (!order?.orderItemsSelected?.length) {
            message.error('Vui lòng chọn sản phẩm')
        } else if (!user?.phone || !user?.address || !user.name || !user?.city) {
            setIsOpenModelUpdateInfo(true)
        } else {
            navigate('/payment')
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

    const handleToProductDetails = (id) => {
        navigate(`/product-details/${id}`)
    }

    const itemsDelivery = [
        {
            title: '20.000 VNĐ',
            description: 'Dưới 200.000 VNĐ',
        },
        {
            title: '10.000 VNĐ',
            description: 'Từ 200.000 VNĐ đến dưới 500.000 VNĐ',
        },
        {
            title: '0 VNĐ',
            description: 'Từ 500.000 VNĐ',
        },
    ]

    return (
        <div style={{ background: '#f5f5fa', width: '100%', height: '100vh' }}>
            <div style={{ height: '100%', width: '1270px', margin: '0 auto' }} >
                <h3 style={{ margin: 0, padding: '20px 0' }}>Giỏ hàng</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                    <WrapperLeft>
                        <WrapperStyleHeaderDelivery>
                            <StepComponent items={itemsDelivery} current={
                                !order?.orderItemsSelected.length ? -1
                                    : deliveryPriceMemo === 20000 ? 0
                                        : deliveryPriceMemo === 10000 ? 1
                                            : 2
                            } />
                        </WrapperStyleHeaderDelivery>
                        <WrapperStyleHeader>
                            <span style={{ display: 'inline-block', width: '390px' }}>
                                <Checkbox style={{ marginRight: '10px' }} onChange={handleOnChangeCheckAll} checked={checkedList.length === order?.orderItems?.length}></Checkbox>
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
                                            <Checkbox style={{ marginRight: '10px' }} onChange={onChange} value={order?.product} checked={checkedList.includes(order?.product)} ></Checkbox>
                                            <img
                                                onClick={() => handleToProductDetails(order?.product)}
                                                src={order?.image.split(',')[0]}
                                                style={{ width: '70px', height: '70px', objectFit: 'cover', padding: '0 10px', cursor: 'pointer' }} alt='OK' />
                                            <div
                                                onClick={() => handleToProductDetails(order?.product)}
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
                                            <span style={{ width: '140px' }}>
                                                <span style={{ fontSize: '13px', color: '#242424' }}>{convertPrice(order?.price)}</span>
                                            </span>
                                            <WrapperCountOrder>
                                                <button style={{ border: 'none', background: 'transparent' }} onClick={() => handleChangeCount('decrease', order?.product, order?.amount === 1)}>
                                                    <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
                                                </button>
                                                <WrapperInputNumber min={1} defaultValue={order?.amount} value={order?.amount} size='small' />
                                                <button style={{ border: 'none', background: 'transparent' }} onClick={() => handleChangeCount('increase', order?.product, order?.amount === order?.countInStock)}>
                                                    <PlusOutlined style={{ color: '#000', fontSize: '10px' }} />
                                                </button>
                                            </WrapperCountOrder>
                                            <span style={{ color: 'rgb(255,66,78)', fontSize: '13px' }}>{convertPrice(order?.amount * order?.price)}</span>
                                            <DeleteOutlined style={{ cursor: 'pointer', marginLeft: 'auto' }} onClick={() => handleDeleteProduct(order?.product)} />
                                        </div>
                                    </WrapperItemOrder>
                                )
                            })}
                        </WrapperListOrder>
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
                        <ButtonComponent
                            onClick={handleAddCart}
                            size={40}
                            styleButton={{
                                background: 'rgb(255, 57, 69)',
                                borderRadius: '2px',
                                border: 'none',
                                width: '320px',
                                height: '48px',
                            }}
                            textButton={'Mua hàng'}
                            styleTextButton={{ color: '#fff' }}
                        ></ButtonComponent>
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
        </div >
    )
}

export default OrderPage