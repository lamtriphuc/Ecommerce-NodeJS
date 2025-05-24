import React, { useEffect, useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { Image } from 'antd'
import logoLogin from '../../assets/images/logo-login.png'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as UserService from '../../services/UserService'
import Loading from '../../components/LoadingComponent/Loading'
import * as message from '../../components/Message/MessageComponent'

const SignUpPage = () => {
  const navigate = useNavigate()

  const mutation = useMutationHooks(
    data => UserService.signUpUser(data)
  )

  const { data, isPending, isError, isSuccess } = mutation

  useEffect(() => {
    if (isSuccess && data?.status === 'OK') {
      message.success()
      handleNavigateSignIn()
    } else if (isError) {
      message.error()
    }
  }, [isSuccess, isError])

  const [isShowPassword, setIsShowPassword] = useState(false)
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSignUp = () => {
    mutation.mutate({
      email,
      password,
      confirmPassword
    })
  }

  const handleNavigateSignIn = () => {
    navigate('/sign-in')
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#ccc' }}>
      <div style={{ display: 'flex', width: '800px', height: '460px', borderRadius: '6px', background: '#fff' }}>
        <WrapperContainerLeft>
          <h1 style={{ margin: '0' }}>Tạo tài khoản</h1>
          <p>Vui lòng nhập các thông tin bên dưới</p>
          <InputForm
            style={{ marginBottom: '10px' }}
            placeholder='abc@gmail.com'
            value={email}
            onChange={(e) => { setEmail(e.target.value) }}
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
          </div>
          <InputForm
            style={{ marginBottom: '10px' }}
            placeholder='password'
            value={password}
            type={isShowPassword ? 'text' : 'password'}
            onChange={(e) => { setPassword(e.target.value) }}
          />
          <div style={{ position: 'relative' }}>
            <span
              onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
              style={{
                zIndex: 10,
                position: 'absolute',
                top: '4px',
                right: '8px',
              }}
            >
              {isShowConfirmPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
          </div>
          <InputForm
            style={{ marginBottom: '10px' }}
            placeholder='confirm password'
            value={confirmPassword}
            type={isShowConfirmPassword ? 'text' : 'password'}
            onChange={(e) => { setConfirmPassword(e.target.value) }}
          />
          {data?.status === 'ERR' && <span style={{ color: 'red', marginTop: '5px' }}>{data?.message}</span>}
          <Loading isLoading={isPending}>
            <ButtonComponent
              disabled={!email.length || !password.length || !confirmPassword.length}
              onClick={handleSignUp}
              size={40}
              styleButton={{
                background: 'rgb(255, 66, 78)',
                borderRadius: '2px',
                border: 'none',
                width: '100%',
                height: '48px',
                margin: '20px 0 10px'
              }}
              textButton={'Đăng ký'}
              styleTextButton={{ color: '#fff' }}
            ></ButtonComponent>
          </Loading>
          <p>Bạn đã có tài khoản? <WrapperTextLight onClick={handleNavigateSignIn}> Đăng nhập</WrapperTextLight></p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image src={logoLogin} preview={false} alt='logo login' width={200} height={200} />
          <h4 style={{ color: 'rgb(10, 104, 255)' }}>Mua sắm tại LTP</h4>
        </WrapperContainerRight>
      </div>
    </div>
  )
}

export default SignUpPage