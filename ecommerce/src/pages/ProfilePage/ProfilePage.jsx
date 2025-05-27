import React, { useEffect, useState } from 'react'
import { WapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useSelector } from 'react-redux'
import * as UserService from '../../services/UserService'
import Loading from '../../components/LoadingComponent/Loading'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as message from '../../components/Message/MessageComponent'

const ProfilePage = () => {
    const user = useSelector((state) => state.user)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [avatar, setAvatar] = useState('')

    const mutation = useMutationHooks(
        ({ id, data }) => UserService.updateUser(id, data)
    )

    const { id, data, isPending, isSuccess, isError } = mutation

    useEffect(() => {
        setEmail(user?.email)
        setName(user?.name)
        setPhone(user?.phone)
        setAddress(user?.address)
        setAvatar(user?.avatar)
    }, [user])

    const handelUpdate = () => {
        mutation.mutate(
            {
                id: user?._id,
                data: { email, name, phone, address, avatar }
            },
            {
                onSuccess: () => {
                    message.success('Cập nhật thông tin thành công!')
                },
                onError: () => {
                    message.error('Cập nhật thông tin thất bại!')
                }
            }
        )
    }

    return (
        <div style={{ width: '1270px', margin: '0 auto' }}>
            <WrapperHeader>Thông tin người dùng</WrapperHeader>
            <Loading isLoading={isPending}>
                <WapperContentProfile>
                    <WrapperInput>
                        <WrapperLabel htmlFor='name' >Name</WrapperLabel>
                        <InputForm
                            id='name'
                            style={{ width: '300px' }}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <ButtonComponent
                            onClick={handelUpdate}
                            size={40}
                            styleButton={{
                                borderRadius: '2px',
                                border: '2px solid rgb(26,148,255)',
                                width: 'fit-content',
                                height: '34px',
                                padding: '4px 6px'
                            }}
                            textButton={'Cập nhật'}
                            styleTextButton={{ color: 'rgb(26,148,255)', fontWeight: '600' }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor='email' >Email</WrapperLabel>
                        <InputForm
                            id='email'
                            style={{ width: '300px' }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <ButtonComponent
                            onClick={handelUpdate}
                            size={40}
                            styleButton={{
                                borderRadius: '2px',
                                border: '2px solid rgb(26,148,255)',
                                width: 'fit-content',
                                height: '34px',
                                padding: '4px 6px'
                            }}
                            textButton={'Cập nhật'}
                            styleTextButton={{ color: 'rgb(26,148,255)', fontWeight: '600' }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor='phone' >Phone</WrapperLabel>
                        <InputForm
                            id='phone'
                            style={{ width: '300px' }}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        <ButtonComponent
                            onClick={handelUpdate}
                            size={40}
                            styleButton={{
                                borderRadius: '2px',
                                border: '2px solid rgb(26,148,255)',
                                width: 'fit-content',
                                height: '34px',
                                padding: '4px 6px'
                            }}
                            textButton={'Cập nhật'}
                            styleTextButton={{ color: 'rgb(26,148,255)', fontWeight: '600' }}
                        ></ButtonComponent>
                    </WrapperInput>
                    <WrapperInput>
                        <WrapperLabel htmlFor='address' >Address</WrapperLabel>
                        <InputForm
                            id='address'
                            style={{ width: '300px' }}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <ButtonComponent
                            onClick={handelUpdate}
                            size={40}
                            styleButton={{
                                borderRadius: '2px',
                                border: '2px solid rgb(26,148,255)',
                                width: 'fit-content',
                                height: '34px',
                                padding: '4px 6px'
                            }}
                            textButton={'Cập nhật'}
                            styleTextButton={{ color: 'rgb(26,148,255)', fontWeight: '600' }}
                        ></ButtonComponent>
                    </WrapperInput>
                </WapperContentProfile>
            </Loading>
        </div>
    )
}

export default ProfilePage