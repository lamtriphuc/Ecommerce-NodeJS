import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form, Space } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import ModalComponent from '../ModalComponent/ModalComponent'
import Loading from '../LoadingComponent/Loading'
import InputComponent from '../InputComponent/InputComponent'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as message from '../Message/MessageComponent'
import * as UserService from '../../services/UserService'
import * as ProductService from '../../services/ProductService'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { getBase64 } from '../../utils'
import { updateUser } from '../../redux/slides/userSlide'


const AdminUser = () => {
    const [form] = Form.useForm()
    const user = useSelector((state) => state?.user)
    const dispatch = useDispatch()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const [stateUser, setStateUser] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
        address: '',
        avatar: ''
    })
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
        address: '',
        avatar: ''
    })

    useEffect(() => {
        form.setFieldsValue(stateUserDetails)
    }, [form, stateUserDetails])


    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id, token, ...rests } = data
            return UserService.updateUser(id, { ...rests }, token)
        }
    )

    const mutationDelete = useMutationHooks(
        (data) => {
            const { id, token } = data
            return UserService.deleteUser(id, token)
        }
    )

    const mutationDeleteMany = useMutationHooks(
        (data) => {
            const { token, ...ids } = data
            return UserService.deleteManyUser(ids, token)
        }
    )

    const handelDeleteManyUsers = (ids) => {
        mutationDeleteMany.mutate({ ids: ids, token: user?.access_token }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }


    const getAllUsers = async () => {
        const res = await UserService.getAllUser(user?.access_token)
        return res
    }

    const fetchGetDetailsUser = async (rowSelected) => {
        const res = await UserService.getDetailsUser(rowSelected, user?.access_token)
        if (res?.data) {
            setStateUserDetails({
                name: res?.data?.name,
                email: res?.data?.email,
                phone: res?.data?.phone,
                isAdmin: res?.data?.isAdmin,
                address: res?.data?.address,
                avatar: res?.data?.avatar
            })
        }
        setIsLoadingUpdate(false)
    }

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true)
            fetchGetDetailsUser(rowSelected)
        }
    }, [rowSelected, isOpenDrawer])

    const { data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const { data: dataDeleted, isPending: isPendingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete
    const { data: dataDeletedMany, isPending: isPendingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeleteMany

    const queryUser = useQuery({
        queryKey: ['users'],
        queryFn: getAllUsers,
        retry: 3,
        retryDelay: 1000
    })
    const { isLoading: isLoadingUsers, data: users } = queryUser

    const handleDetailsProduct = () => {
        setIsOpenDrawer(true)
    }

    const renderAction = () => {
        return (
            <div>
                <EditOutlined
                    style={{ color: 'orange', fontSize: '26px', cursor: 'pointer', marginRight: '20px ' }}
                    onClick={handleDetailsProduct}
                />
                <DeleteOutlined
                    style={{ color: 'red', fontSize: '26px', cursor: 'pointer' }}
                    onClick={() => setIsModalOpenDelete(true)}
                />
            </div>
        )
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        // setSearchText(selectedKeys[0]);
        // setSearchedColumn(dataIndex);
    };
    const handleReset = clearFilters => {
        clearFilters();
        // setSearchText('');
    };


    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
                <InputComponent
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => {
                        var _a;
                        return (_a = searchInput.current) === null || _a === void 0 ? void 0 : _a.select();
                    }, 100);
                }
            },
        },
        // render: text =>
        //     searchedColumn === dataIndex ? (
        //         <Highlighter
        //             highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        //             searchWords={[searchText]}
        //             autoEscape
        //             textToHighlight={text ? text.toString() : ''}
        //         />
        //     ) : (
        //         text
        //     ),
    });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name'),
            width: '240px'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: (a, b) => a.email.length - b.email.length,
            ...getColumnSearchProps('email')
        },
        {
            title: 'Admin',
            dataIndex: 'isAdmin',
            filters: [
                {
                    text: 'True',
                    value: true
                },
                {
                    text: 'False',
                    value: false
                }
            ],
            onFilter: (value, record) => record.isAdmin === value,
            render: (isAdmin) => (isAdmin ? 'Yes' : 'No'),
            width: '160px'
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: (a, b) => a.phone.length - b.phone.length,
            ...getColumnSearchProps('phone'),
            width: '160px'
        },
        {
            title: 'Address',
            dataIndex: 'address',
            sorter: (a, b) => a.address.length - b.address.length,
            ...getColumnSearchProps('address'),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction,
            width: '120px'
        },
    ];

    const dataTable = users?.data?.length && users?.data?.map((user) => {
        return { ...user, key: user._id }
    })


    useEffect(() => {
        if (isSuccessUpdated) {
            if (dataUpdated?.status === 'OK') {
                setIsOpenDrawer(false)
                message.success('Cập nhật user thành công')
            } else {
                message.error(`Lỗi khi cập nhật user. Chi tiết: ${dataUpdated?.message}`)
            }
        }
        if (isErrorUpdated) {
            message.error('Lỗi khi cập nhật user')
        }
    }, [isSuccessUpdated, isErrorUpdated])

    useEffect(() => {
        if (isSuccessDeleted) {
            if (dataDeleted?.status === 'OK') {
                handleCancelDelete()
                message.success('Xóa sản phẩm thành công')
            } else {
                message.error(`Lỗi khi xóa sản phẩm. Chi tiết: ${dataDeleted?.message}`)
            }
        }
        if (isErrorDeleted) {
            message.error('Lỗi khi cập nhật sản phẩm')
        }
    }, [isSuccessDeleted, isErrorDeleted])

    useEffect(() => {
        if (isSuccessDeletedMany) {
            if (dataDeletedMany?.status === 'OK') {
                message.success('Xóa sản phẩm thành công')
            } else {
                message.error(`Lỗi khi xóa sản phẩm. Chi tiết: ${dataDeletedMany?.message}`)
            }
        }
        if (isErrorDeletedMany) {
            message.error('Lỗi khi cập nhật sản phẩm')
        }
    }, [isSuccessDeletedMany, isErrorDeletedMany])

    const handleCancel = () => {
        setIsModalOpen(false)
        form.resetFields()
    }

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }

    const handleDeleteUser = () => {
        mutationDelete.mutate({ id: rowSelected, token: user?.access_token }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    const handleOnChageDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value
        })
    }

    // const handleOnChangeAvatar = async ({ fileList }) => {
    //     const file = fileList[0]
    //     if (!file.url && !file.preview) {
    //         file.preview = await getBase64(file.originFileObj);
    //     }
    //     const newAvatar = file.preview
    //     setStateUserDetails({
    //         ...stateUserDetails,
    //         avatar: newAvatar
    //     })

    //     dispatch(updateUser({ ...user, avatar: newAvatar }))
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
            const data = await res.json()

            if (data.secure_url) {
                setStateUserDetails({
                    ...stateUserDetails,
                    avatar: data.secure_url
                })
                dispatch(updateUser({ ...user, avatar: data.secure_url }))
            } else {
                console.error('Upload lỗi:', data);
            }
        } catch (err) {
            console.error('Lỗi upload Cloudinary:', err);
        }
    }

    const onUpdateUser = () => {
        mutationUpdate.mutate({
            id: rowSelected,
            token: user.access_token,
            ...stateUserDetails
        }, {
            onSettled: () => {
                queryUser.refetch()
            }
        })
    }

    return (
        <div>
            <WrapperHeader>Quản lý người dùng</WrapperHeader>
            <div style={{ marginTop: '16px' }}>
                <TableComponent
                    handelDeleteMany={handelDeleteManyUsers}
                    columns={columns}
                    data={dataTable}
                    isLoading={isLoadingUsers}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: (event) => {
                                setRowSelected(record._id)
                            }
                        };
                    }}
                />
            </div>

            <DrawerComponent title='Chi tiết người dùng' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width='50%'>
                <Loading isLoading={isLoadingUpdate || isPendingUpdated}>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        initialValues={{ remember: true }}
                        onFinish={onUpdateUser}
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
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Hãy nhập email!' }]}
                        >
                            <InputComponent
                                value={stateUserDetails.email}
                                onChange={handleOnChageDetails}
                                name='email'
                            />
                        </Form.Item>

                        <Form.Item
                            label="Admin"
                            name="isAdmin"
                            rules={[{ required: true, message: 'Hãy nhập quyền hạn!' }]}
                        >
                            <InputComponent
                                value={stateUserDetails.countInStock}
                                onChange={handleOnChageDetails}
                                name='isAdmin'
                            />
                        </Form.Item>
                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[{ message: 'Hãy nhập số điện thoại!' }]}
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
                            rules={[{ message: 'Hãy nhập địa chỉ!' }]}
                        >
                            <InputComponent
                                value={stateUserDetails.address}
                                onChange={handleOnChageDetails}
                                name='address'
                            />
                        </Form.Item>
                        <Form.Item
                            label="Avatar"
                            name="avatar"
                        >
                            <WrapperUploadFile style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onChange={handleOnChangeAvatar} maxCount={1} beforeUpload={() => false} >
                                <Button>Upload</Button>
                                {stateUserDetails?.avatar && (
                                    <img src={stateUserDetails?.avatar} alt='avatar' style={{
                                        height: '60px',
                                        width: '60px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        float: 'right'
                                    }} />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>
                        <Form.Item label={null}>
                            <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
                                Cập nhật
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>
            <ModalComponent forceRender
                title="Xóa người dùng"
                open={isModalOpenDelete}
                onCancel={handleCancelDelete}
                onOk={handleDeleteUser}
            >
                <Loading isLoading={isPendingDeleted}>
                    <div>Bạn có chắc muốn xóa tài khoản này không?</div>
                </Loading>
            </ModalComponent>
        </div >
    )
}

export default AdminUser