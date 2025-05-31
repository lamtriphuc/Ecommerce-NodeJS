import React, { useEffect, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form, Modal } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { getBase64 } from '../../utils'
import * as ProducrService from '../../services/ProductService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../LoadingComponent/Loading'
import * as message from '../Message/MessageComponent'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'

const AdminProduct = () => {
    const [form] = Form.useForm()
    const queryClient = useQueryClient()
    const user = useSelector((state) => state?.user)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [stateProduct, setStateProduct] = useState({
        name: '',
        price: '',
        description: '',
        rating: '',
        type: '',
        countInStock: '',
        image: ''
    })
    const [stateProductDetails, setStateProductDetails] = useState({
        name: '',
        price: '',
        description: '',
        rating: '',
        type: '',
        countInStock: '',
        image: ''
    })

    useEffect(() => {
        form.setFieldsValue(stateProductDetails)
    }, [form, stateProductDetails])

    const mutation = useMutationHooks(
        (data) => {
            const {
                name,
                price,
                description,
                rating,
                type,
                countInStock,
                image
            } = data
            return ProducrService.createProduct({
                name,
                price,
                description,
                rating,
                type,
                countInStock,
                image
            })
        }
    )

    const mutationUpdate = useMutationHooks(
        (data) => {
            console.log('data', data)
            const { id, token, ...rests } = data
            return ProducrService.updateProduct(id, rests, token)
        }
    )

    const getAllProduct = async () => {
        const res = await ProducrService.getAllProduct()
        return res
    }

    const fetchGetDetailsProduct = async (rowSelected) => {
        const res = await ProducrService.getDetailsProduct(rowSelected)
        if (res?.data) {
            setStateProductDetails({
                name: res?.data?.name,
                price: res?.data?.price,
                description: res?.data?.description,
                rating: res?.data?.rating,
                type: res?.data?.type,
                countInStock: res?.data?.countInStock,
                image: res?.data?.image
            })
        }
        setIsLoadingUpdate(false)
    }

    useEffect(() => {
        if (rowSelected) {
            fetchGetDetailsProduct(rowSelected)
        }
    }, [rowSelected])

    const { data, isPending, isSuccess, isError } = mutation
    const { data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate

    const { isLoading: isLoadingProducts, data: products } = useQuery({
        queryKey: ['products'],
        queryFn: getAllProduct,
        retry: 3,
        retryDelay: 1000
    })

    const handleDetailsProduct = () => {
        if (rowSelected) {
            setIsLoadingUpdate(true)
        }
        setIsOpenDrawer(true)
    }

    const renderAction = () => {
        return (
            <div>
                <EditOutlined
                    style={{ color: 'orange', fontSize: '26px', cursor: 'pointer', marginRight: '20px ' }}
                    onClick={handleDetailsProduct}
                />
                <DeleteOutlined style={{ color: 'red', fontSize: '26px', cursor: 'pointer' }} />
            </div>
        )
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Price',
            dataIndex: 'price',

        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            width: '80px'
        },
        {
            title: 'Type',
            dataIndex: 'type',
            width: '200px'
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction,
            width: '120px'
        },
    ];

    const dataTable = products?.data?.length && products?.data?.map((product) => {
        return { ...product, key: product._id }
    })

    useEffect(() => {
        if (isSuccess) {
            if (data?.status === 'OK') {
                setIsModalOpen(false)
                form.resetFields()
                setStateProductDetails({
                    name: '',
                    price: '',
                    description: '',
                    rating: '',
                    type: '',
                    countInStock: '',
                    image: ''
                })
                message.success('Thêm sản phẩm mới thành công')
            } else {
                message.error(`Lỗi khi thêm mới sản phẩm. Chi tiết: ${data?.message}`)
            }
        }
        if (isError) {
            message.error('Lỗi khi thêm mới sản phẩm')
        }
    }, [isSuccess, isError])

    useEffect(() => {
        if (isSuccessUpdated) {
            if (dataUpdated?.status === 'OK') {
                setIsOpenDrawer(false)
                form.resetFields()
                setStateProduct({
                    name: '',
                    price: '',
                    description: '',
                    rating: '',
                    type: '',
                    countInStock: '',
                    image: ''
                })
                queryClient.invalidateQueries({ queryKey: ['products'] })
                message.success('Cập nhật sản phẩm thành công')
            } else {
                message.error(`Lỗi khi cập nhật sản phẩm. Chi tiết: ${dataUpdated?.message}`)
            }
        }
        if (isErrorUpdated) {
            message.error('Lỗi khi cập nhật sản phẩm')
        }
    }, [isSuccessUpdated, isErrorUpdated])

    const handleCancel = () => {
        setIsModalOpen(false)
        form.resetFields()
    }

    const onFinish = () => {
        mutation.mutate(stateProduct)
    }


    const handleOnChage = (e) => {
        setStateProduct({
            ...stateProduct,
            [e.target.name]: e.target.value
        })
    }

    const handleOnChageDetails = (e) => {
        setStateProductDetails({
            ...stateProductDetails,
            [e.target.name]: e.target.value
        })
    }

    const handleOnChangeImage = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProduct({
            ...stateProduct,
            image: file.preview
        })
    }

    const handleOnChangeImageDetails = async ({ fileList }) => {
        const file = fileList[0]
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setStateProductDetails({
            ...stateProductDetails,
            image: file.preview
        })
    }

    const onUpdateProduct = () => {
        mutationUpdate.mutate({
            id: rowSelected,
            token: user.access_token,
            ...stateProductDetails
        })
    }

    return (
        <div>
            <WrapperHeader>Quản lý người dùng</WrapperHeader>
            <div style={{ marginTop: '10px' }}>
                <Button
                    onClick={() => { setIsModalOpen(true) }}
                    style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '6px',
                        borderStyle: 'dashed'
                    }}>
                    <PlusOutlined style={{ fontSize: '40px' }} />
                </Button>
            </div>
            <div style={{ marginTop: '10px' }}>
                <TableComponent
                    columns={columns}
                    data={dataTable}
                    isLoading={isLoadingProducts} onRow={(record, rowIndex) => {
                        return {
                            onClick: (event) => {
                                setRowSelected(record._id)
                            }
                        };
                    }}
                />
            </div>
            <Modal
                className='modal-product'
                title="Tạo sản phẩm"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Loading isLoading={isPending}>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        style={{ maxWidth: 600 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Tên"
                            name="name"
                            rules={[{ required: true, message: 'Hãy nhập tên sản phẩm!' }]}
                        >
                            <InputComponent
                                name='name'
                                value={stateProduct.name}
                                onChange={handleOnChage}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Loại"
                            name="type"
                            rules={[{ required: true, message: 'Hãy nhập loại sản phẩm!' }]}
                        >
                            <InputComponent
                                value={stateProduct.type}
                                onChange={handleOnChage}
                                name='type'
                            />
                        </Form.Item>

                        <Form.Item
                            label="Tồn kho"
                            name="countInStock"
                            rules={[{ required: true, message: 'Hãy nhập số sản phẩm trong kho!' }]}
                        >
                            <InputComponent
                                value={stateProduct.countInStock}
                                onChange={handleOnChage}
                                name='countInStock'
                            />
                        </Form.Item>
                        <Form.Item
                            label="Giá"
                            name="price"
                            rules={[{ required: true, message: 'Hãy nhập giá sản phẩm!' }]}
                        >
                            <InputComponent
                                value={stateProduct.price}
                                onChange={handleOnChage}
                                name='price'
                            />
                        </Form.Item>
                        <Form.Item
                            label="Mô tả"
                            name="description"
                            rules={[{ required: true, message: 'Hãy nhập mô tả sản phẩm!' }]}
                        >
                            <InputComponent
                                value={stateProduct.description}
                                onChange={handleOnChage}
                                name='description'
                            />
                        </Form.Item>
                        <Form.Item
                            label="Đánh giá"
                            name="rating"
                            rules={[{ required: true, message: 'Hãy nhập đánh giá sản phẩm!' }]}
                        >
                            <InputComponent
                                value={stateProduct.rating}
                                onChange={handleOnChage}
                                name='rating'
                            />
                        </Form.Item>
                        <Form.Item
                            label="Ảnh"
                            name="image"
                            rules={[{ required: true, message: 'Hãy nhập ảnh sản phẩm!' }]}
                        >
                            <WrapperUploadFile onChange={handleOnChangeImage} maxCount={2} beforeUpload={() => false} >
                                <Button>Upload</Button>
                                {stateProduct?.image && (
                                    <img src={stateProduct?.image} alt='product-image' style={{
                                        height: '60px',
                                        width: '60px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        // marginLeft: '20px'
                                    }} />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>

                        <Form.Item label={null}>
                            <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </Modal>

            <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width='50%'>
                <Loading isLoading={isLoadingUpdate}>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        initialValues={{ remember: true }}
                        onFinish={onUpdateProduct}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Tên"
                            name="name"
                            rules={[{ required: true, message: 'Hãy nhập tên sản phẩm!' }]}
                        >
                            <InputComponent
                                name='name'
                                value={stateProductDetails.name}
                                onChange={handleOnChageDetails}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Loại"
                            name="type"
                            rules={[{ required: true, message: 'Hãy nhập loại sản phẩm!' }]}
                        >
                            <InputComponent
                                value={stateProductDetails.type}
                                onChange={handleOnChageDetails}
                                name='type'
                            />
                        </Form.Item>

                        <Form.Item
                            label="Tồn kho"
                            name="countInStock"
                            rules={[{ required: true, message: 'Hãy nhập số sản phẩm trong kho!' }]}
                        >
                            <InputComponent
                                value={stateProductDetails.countInStock}
                                onChange={handleOnChageDetails}
                                name='countInStock'
                            />
                        </Form.Item>
                        <Form.Item
                            label="Giá"
                            name="price"
                            rules={[{ required: true, message: 'Hãy nhập giá sản phẩm!' }]}
                        >
                            <InputComponent
                                value={stateProductDetails.price}
                                onChange={handleOnChageDetails}
                                name='price'
                            />
                        </Form.Item>
                        <Form.Item
                            label="Mô tả"
                            name="description"
                            rules={[{ required: true, message: 'Hãy nhập mô tả sản phẩm!' }]}
                        >
                            <InputComponent
                                value={stateProductDetails.description}
                                onChange={handleOnChageDetails}
                                name='description'
                            />
                        </Form.Item>
                        <Form.Item
                            label="Đánh giá"
                            name="rating"
                            rules={[{ required: true, message: 'Hãy nhập đánh giá sản phẩm!' }]}
                        >
                            <InputComponent
                                value={stateProductDetails.rating}
                                onChange={handleOnChageDetails}
                                name='rating'
                            />
                        </Form.Item>
                        <Form.Item
                            label="Ảnh"
                            name="image"
                            rules={[{ required: true, message: 'Hãy nhập ảnh sản phẩm!' }]}
                        >
                            <WrapperUploadFile style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onChange={handleOnChangeImageDetails} maxCount={2} beforeUpload={() => false} >
                                <Button>Upload</Button>
                                {stateProductDetails?.image && (
                                    <img src={stateProductDetails?.image} alt='product-image' style={{
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
        </div>
    )
}

export default AdminProduct