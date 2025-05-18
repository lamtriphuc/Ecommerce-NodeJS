import React, { useState } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { Image } from 'antd'
import logoLogin from '../../assets/images/logo-login.png'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'

const SignUpPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false)
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#ccc' }}>
      <div style={{ display: 'flex', width: '800px', height: '460px', borderRadius: '6px', background: '#fff' }}>
        <WrapperContainerLeft>
          <h1 style={{ margin: '0' }}>Tạo tài khoản</h1>
          <p>Vui lòng nhập các thông tin bên dưới</p>
          <InputForm style={{ marginBottom: '10px' }} placeholder='abc@gmail.com' />
          <div style={{ position: 'relative' }}>
            <span
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
          <InputForm style={{ marginBottom: '10px' }} placeholder='password' type={isShowPassword ? 'text' : 'password'} />
          <div style={{ position: 'relative' }}>
            <span
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
          <InputForm placeholder='confirm password' type={isShowPassword ? 'text' : 'password'} />
          <ButtonComponent
            size={40}
            styleButton={{
              backgroundColor: 'rgb(255, 66, 78)',
              borderRadius: '2px',
              border: 'none',
              width: '100%',
              height: '48px',
              margin: '26px 0 10px'
            }}
            textButton={'Đăng nhập'}
            styleTextButton={{ color: '#fff' }}
          ></ButtonComponent>
          <p>Bạn đã có tài khoản? <WrapperTextLight> Đăng nhập</WrapperTextLight></p>
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