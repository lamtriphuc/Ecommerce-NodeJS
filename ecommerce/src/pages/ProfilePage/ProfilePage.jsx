import React, { useEffect, useState } from 'react'
import { WapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel, WrapperUploadFile } from './style'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { useDispatch, useSelector } from 'react-redux'
import * as UserService from '../../services/UserService'
import Loading from '../../components/LoadingComponent/Loading'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as message from '../../components/Message/MessageComponent'
import { updateUser } from '../../redux/slides/userSlide'
import { UploadOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { getBase64 } from '../../utils'

const ProfilePage = () => {
    const dispatch = useDispatch()

    const user = useSelector((state) => state.user)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [avatar, setAvatar] = useState('')

    const mutation = useMutationHooks(
        ({ id, data, access_token }) => UserService.updateUser(id, data, access_token)
    )

    const { id, data, isPending } = mutation

    useEffect(() => {
        setEmail(user?.email)
        setName(user?.name)
        setPhone(user?.phone)
        setAddress(user?.address)
        setAvatar(user?.avatar)
    }, [user])

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token)
        dispatch(updateUser({ ...res?.data, access_token: token }))
    }

    // const handleOnChangeAvatar = async ({ fileList }) => {
    //     const file = fileList[0]
    //     if (!file.url && !file.preview) {
    //         file.preview = await getBase64(file.originFileObj);
    //     }
    //     setAvatar(file.preview)
    // }
    const handleOnChangeAvatar = async ({ fileList }) => {
        const file = fileList[0]?.originFileObj;
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'upload-image');

        try {
            const res = await fetch('https://api.cloudinary.com/v1_1/ddpy7dxxa/image/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.secure_url) {
                setAvatar(data.secure_url)
            } else {
                console.error('Upload lỗi:', data);
            }
        } catch (err) {
            console.error('Lỗi upload Cloudinary:', err);
        }
    }

    const handelUpdate = () => {
        mutation.mutate(
            {
                id: user?._id,
                data: { email, name, phone, address, avatar },
                access_token: user?.access_token
            },
            {
                onSuccess: () => {
                    handleGetDetailsUser(user?._id, user?.access_token)
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
                    <WrapperInput style={{ display: 'flex' }}>
                        <WrapperLabel htmlFor='avatar' >Avatar</WrapperLabel>
                        <WrapperUploadFile onChange={handleOnChangeAvatar} beforeUpload={() => false} >
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </WrapperUploadFile>
                        {avatar && (
                            <img src={avatar} alt='avatar' style={{
                                height: '60px',
                                width: '60px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }} />
                        )}
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