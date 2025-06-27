import { Badge, Col, Popover } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { WapperHeader, WrapperContentPopup, WrapperHeaderAccount, WrapperHeaderCart, WrapperHeaderHome, WrapperTextHeader, WrapperTextHeaderSmall } from './style'
import {
    UserOutlined,
    CaretDownOutlined,
    ShoppingCartOutlined,
    HomeOutlined
} from '@ant-design/icons'
import ButtoninputSearch from '../ButtoninputSearch/ButtoninputSearch'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import * as UserService from '../../services/UserService'
import { resetUser } from '../../redux/slides/userSlide'
import Loading from '../LoadingComponent/Loading'
import { searchProduct } from '../../redux/slides/productSlide'

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [userName, setUserName] = useState('')
    const [userAvatar, setUserAvatar] = useState('')
    const [search, setSearch] = useState('')
    const [isOpenPopup, setIsOpenPopup] = useState(false)
    const order = useSelector(state => state.order)

    const handleNavigateLogin = () => {
        navigate('/sign-in')
    }

    const handleLogout = async () => {
        setLoading(true)
        await UserService.logoutUser()
        dispatch(resetUser())
        localStorage.removeItem('access_token')
        setLoading(false)
        // handleNavigateLogin()
        navigate('/')
    }

    useEffect(() => {
        setLoading(true)
        setUserName(user?.name)
        setUserAvatar(user?.avatar)
        setLoading(false)
    }, [user?.name, user?.avatar])


    const content = (
        <div>
            <WrapperContentPopup
                onClick={() => {
                    handleClickNavigate('profile')
                }}>Thông tin người dùng</WrapperContentPopup>
            {user?.isAdmin && (
                <WrapperContentPopup onClick={() => {
                    handleClickNavigate('admin')
                }}>Quản lý hệ thống</WrapperContentPopup>
            )}
            <WrapperContentPopup onClick={() =>
                handleClickNavigate('my-order')
            }>Đơn hàng của tôi</WrapperContentPopup>
            <WrapperContentPopup onClick={() => {
                handleClickNavigate()
            }
            }>Đăng xuất</WrapperContentPopup>
        </div >
    )

    const handleClickNavigate = (type) => {
        if (type === 'profile') {
            navigate('/profile-user')
        } else if (type === 'admin') {
            navigate('/system/admin')
        } else if (type === 'my-order') {
            navigate('/my-order', {
                state: {
                    id: user?._id,
                    token: user?.access_token
                }
            })
        } else {
            handleLogout()
        }
        setIsOpenPopup(false)
    }

    const onSearch = (e) => {
        setSearch(e.target.value)
        dispatch(searchProduct(e.target.value))
    }

    return (
        <div style={{ width: '100%', background: 'rgb(26, 148, 255)', display: 'flex', justifyContent: 'center' }}>
            <WapperHeader style={{ justifyContent: isHiddenSearch && isHiddenCart ? 'space-between' : 'unset' }}>
                <Col span={4}>
                    <WrapperTextHeader onClick={() => navigate('/')}>Decora </WrapperTextHeader>
                </Col>
                {!isHiddenSearch && (
                    <Col span={12}>
                        <ButtoninputSearch
                            size="large"
                            textButton="Tìm kiếm"
                            placeholder="Nhập để tìm kiếm"
                            onChange={onSearch}
                        />
                    </Col>
                )}
                {!isHiddenSearch && !isHiddenCart && (
                    <Col span={4}
                        style={{
                            display: 'flex',
                            justifyContent: user?.access_token ? 'flex-end' : 'center',
                            alignItems: 'center',
                        }}>
                        <WrapperHeaderHome onClick={() => navigate('/')}>
                            <HomeOutlined style={{ fontSize: '24px' }} />
                            <WrapperTextHeaderSmall>Trang chủ</WrapperTextHeaderSmall>
                        </WrapperHeaderHome>
                    </Col>
                )}
                <Col span={4} style={{ display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Loading isLoading={loading}>
                        <WrapperHeaderAccount
                            onClick={() => {
                                if (user?.access_token) return;
                                handleNavigateLogin()
                            }}
                        >
                            {user?.access_token ? (
                                <Popover
                                    open={isOpenPopup}
                                    onOpenChange={setIsOpenPopup}
                                    placement="bottom"
                                    trigger="click"
                                    content={content}
                                >
                                    <div
                                        onClick={() => setIsOpenPopup(!isOpenPopup)}
                                        style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        {userAvatar ? (
                                            <img src={userAvatar} alt="avatar" style={{
                                                height: '30px',
                                                width: '30px',
                                                borderRadius: '50%',
                                                objectFit: 'cover'
                                            }} />
                                        ) : (
                                            <UserOutlined style={{ fontSize: '30px' }} />
                                        )}
                                        <WrapperTextHeaderSmall>{user?.name || 'User'}</WrapperTextHeaderSmall>
                                    </div>
                                </Popover>
                            ) : (
                                <div>
                                    <WrapperTextHeaderSmall>Đăng nhập/Đăng ký</WrapperTextHeaderSmall>
                                    <div>
                                        <WrapperTextHeaderSmall>Tài khoản </WrapperTextHeaderSmall>
                                        <CaretDownOutlined />
                                    </div>
                                </div>
                            )}
                        </WrapperHeaderAccount>
                    </Loading>
                    {!isHiddenCart && (
                        <WrapperHeaderCart
                            onClick={() => navigate('/order')}
                        >
                            <Badge count={order?.orderItems?.length} size='small'>
                                <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
                            </Badge>
                            <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
                        </WrapperHeaderCart>
                    )}
                </Col>
            </WapperHeader>
        </div>
    )
}

export default HeaderComponent