import React, { useEffect, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { getBase64 } from '../../utils'
import * as ProducrService from '../../services/ProductService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../LoadingComponent/Loading'
import * as message from '../Message/MessageComponent'

const AdminProduct = () => {
    const [form] = Form.useForm()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [stateProduct, setStateProduct] = useState({
        name: '',
        price: '',
        description: '',
        rating: '',
        type: '',
        countInStock: '',
        image: ''
    })

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

    const { data, isPending, isSuccess, isError } = mutation

    useEffect(() => {
        if (isSuccess) {
            if (data?.status === 'OK') {
                setIsModalOpen(false)
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
                message.success('Thêm sản phẩm mới thành công')
            } else {
                message.error(`Lỗi khi thêm mới sản phẩm. Chi tiết: ${data?.message}`)
            }
        }
        if (isError) {
            message.error('Lỗi khi thêm mới sản phẩm')
        }
    }, [isSuccess, isError])

    const handleCancel = () => {
        setIsModalOpen(false)
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
                <TableComponent />
            </div>
            <Modal
                className='modal-product'
                title="Tạo sản phẩm"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onCancel={handleCancel}
            >
                <Loading isLoading={isPending}>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
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
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </Modal>
        </div>
    )
}

export default AdminProduct