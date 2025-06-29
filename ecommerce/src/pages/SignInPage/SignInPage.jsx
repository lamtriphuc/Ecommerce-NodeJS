import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import { Image } from 'antd'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import logoLogin from '../../assets/images/logo-login.png'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import * as UserService from '../../services/UserService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../../components/LoadingComponent/Loading'
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux'
import { updateUser } from '../../redux/slides/userSlide'

const SignInPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()

    const mutation = useMutationHooks(
        data => UserService.loginUser(data)
    )

    const { data, isPending, isSuccess } = mutation

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            if (location?.state) {
                navigate(location?.state)
            } else {
                navigate('/')
            }
            localStorage.setItem('access_token', JSON.stringify(data?.access_token))
            localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token))
            if (data?.access_token) {
                const decoded = jwtDecode(data?.access_token);
                if (decoded?.id) {
                    handleGetDetailsUser(decoded?.id, data?.access_token)
                }
            }
        }
    }, [isSuccess])

    const handleGetDetailsUser = async (id, token) => {
        const storage = localStorage.getItem('refresh_token')
        const refreshToken = JSON.parse(storage)
        const res = await UserService.getDetailsUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token, refreshToken }))
    }

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isShowPassword, setIsShowPassword] = useState(false)

    const handleNavigateSignUp = () => {
        navigate('/sign-up')
    }

    const handelSignIn = () => {
        mutation.mutate({
            email,
            password
        })
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#ccc' }}>
            <div style={{ display: 'flex', width: '800px', height: '445px', borderRadius: '6px', background: '#fff' }}>
                <WrapperContainerLeft>
                    <h1 style={{ margin: '0' }}>Xin chào,</h1>
                    <p>Đăng nhập hoặc tạo tài khoản</p>
                    <InputForm
                        style={{ marginBottom: '10px' }}
                        placeholder='abc@gmail.com'
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <div style={{ position: 'relative' }}>
                        <span
                            onClick={() => setIsShowPassword(!isShowPassword)}
                            style={{
                                zIndex: 10,
                                position: 'absolute',
                                top: '4px',
                                right: '8px',
                            }}
                        >
                            {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
                        </span>
                        <InputForm
                            style={{ marginBottom: '10px' }}
                            placeholder='password'
                            type={isShowPassword ? 'text' : 'password'}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {data?.status === 'ERR' && <span style={{ color: 'red', marginTop: '5px' }}>{data?.message}</span>}
                    <Loading isLoading={isPending}>
                        <ButtonComponent
                            disabled={!email.length || !password.length}
                            onClick={handelSignIn}
                            size={40}
                            styleButton={{
                                background: 'rgb(255, 66, 78)',
                                borderRadius: '2px',
                                border: 'none',
                                width: '100%',
                                height: '48px',
                                margin: '20px 0 10px'
                            }}
                            textButton={'Đăng nhập'}
                            styleTextButton={{ color: '#fff' }}
                        ></ButtonComponent>
                    </Loading>
                    <p><WrapperTextLight>Quên mật khẩu?</WrapperTextLight></p>
                    <p>Chưa có tài khoản? <WrapperTextLight onClick={handleNavigateSignUp}> Tạo tài khoản</WrapperTextLight></p>
                </WrapperContainerLeft>
                <WrapperContainerRight>
                    <Image src={logoLogin} preview={false} alt='logo login' width={200} height={200} />
                    <h4 style={{ color: 'rgb(10, 104, 255)' }}>Mua sắm tại LTP</h4>
                </WrapperContainerRight>
            </div>
        </div>
    )
}

export default SignInPage