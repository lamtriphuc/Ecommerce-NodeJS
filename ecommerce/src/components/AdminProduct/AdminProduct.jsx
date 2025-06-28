import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form, Modal, Select, Space } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, FileImageTwoTone } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { convertPrice, getBase64, renderOptions } from '../../utils'
import * as ProductService from '../../services/ProductService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import Loading from '../LoadingComponent/Loading'
import * as message from '../Message/MessageComponent'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'
import TextArea from 'antd/es/input/TextArea'

const AdminProduct = () => {
    const [formCreate] = Form.useForm();  // Dùng cho Modal thêm
    const [formUpdate] = Form.useForm();
    const user = useSelector((state) => state?.user)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [rowSelected, setRowSelected] = useState('')
    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const [typeSelect, setTypeSelect] = useState('')
    const [isLoadingUploadImage, setIsLoadingUploadImage] = useState(false)

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null)
    const [fileList, setFileList] = useState([]);

    const [stateProduct, setStateProduct] = useState({
        name: '',
        price: '',
        description: '',
        type: '',
        countInStock: '',
        image: '',
        newType: '',
        discount: ''
    })
    const [stateProductDetails, setStateProductDetails] = useState({
        name: '',
        price: '',
        description: '',
        type: '',
        countInStock: '',
        image: '',
        discount: ''
    })

    useEffect(() => {
        formUpdate.setFieldsValue(stateProductDetails)
    }, [formUpdate, stateProductDetails])

    const mutation = useMutationHooks(
        (data) => {
            const {
                name,
                price,
                description,
                type,
                countInStock,
                image,
                discount
            } = data
            return ProductService.createProduct({
                name,
                price,
                description,
                type,
                countInStock,
                image,
                discount
            })
        }
    )

    const mutationUpdate = useMutationHooks(
        (data) => {
            const { id, token, ...rests } = data
            return ProductService.updateProduct(id, { ...rests }, token)
        }
    )

    const mutationDelete = useMutationHooks(
        (data) => {
            const { id, token } = data
            return ProductService.deleteProduct(id, token)
        }
    )

    const mutationDeleteMany = useMutationHooks(
        (data) => {
            const { token, ...ids } = data
            return ProductService.deleteManyProduct(ids, token)
        }
    )

    const handelDeleteManyProducts = (ids) => {
        mutationDeleteMany.mutate({ ids: ids, token: user?.access_token }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const getAllProduct = async () => {
        const res = await ProductService.getAllProduct()
        return res
    }

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        return res
    }

    const fetchGetDetailsProduct = async (rowSelected) => {
        const res = await ProductService.getDetailsProduct(rowSelected)
        if (res?.data) {
            setStateProductDetails({
                name: res?.data?.name,
                price: res?.data?.price,
                description: res?.data?.description,
                type: res?.data?.type,
                countInStock: res?.data?.countInStock,
                image: res?.data?.image,
                discount: res?.data?.discount
            })
        }
        setIsLoadingUpdate(false)
    }

    useEffect(() => {
        if (rowSelected && isOpenDrawer) {
            setIsLoadingUpdate(true)
            fetchGetDetailsProduct(rowSelected)
        }
    }, [rowSelected, isOpenDrawer])

    const { data, isPending, isSuccess, isError } = mutation // -> tao
    const { data: dataUpdated, isPending: isPendingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
    const { data: dataDeleted, isPending: isPendingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete
    const { data: dataDeletedMany, isPending: isPendingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeleteMany

    const queryProduct = useQuery({
        queryKey: ['products'],
        queryFn: getAllProduct
    })
    const typeProduct = useQuery({
        queryKey: ['type-product'],
        queryFn: fetchAllTypeProduct
    })
    const { isLoading: isLoadingProducts, data: products } = queryProduct

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
    });

    const columns = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name')
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
            width: '200px',
            filters: [
                {
                    text: '>= 50',
                    value: '>=',
                },
                {
                    text: '<= 50',
                    value: '<='
                }
            ],
            onFilter: (value, record) => {
                if (value === '>=') {
                    return record.price >= 50
                }
                return record.price <= 50
            }
        },
        {
            title: 'Tồn kho',
            dataIndex: 'countInStock',
            width: '200px',
            filters: [
                {
                    text: '= 0',
                    value: '==',
                },
                {
                    text: '> 0',
                    value: '>'
                }
            ],
            onFilter: (value, record) => {
                if (value === '==') {
                    return record.countInStock == 0
                }
                return record.countInStock > 0
            }
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            sorter: (a, b) => a.rating - b.rating,
            filters: [
                {
                    text: '>= 4',
                    value: '>=',
                },
                {
                    text: '<= 4',
                    value: '<='
                }
            ],
            onFilter: (value, record) => {
                if (value === '>=') {
                    return record.rating >= 4
                }
                return record.rating <= 4
            },
            width: '80px'
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            width: '200px'
        },
        {
            title: 'Thao tác',
            dataIndex: 'action',
            render: renderAction,
            width: '120px'
        },
    ];

    const dataTable = products?.data?.length && products?.data?.map((product) => {
        return {
            ...product,
            key: product._id,
            price: convertPrice(product.price)
        }
    })

    useEffect(() => {
        if (isSuccess) {
            if (data?.status === 'OK') {
                setIsModalOpen(false)
                formCreate.resetFields()
                setStateProduct({
                    name: '',
                    price: '',
                    description: '',
                    type: '',
                    countInStock: '',
                    image: '',
                    discount: ''
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
                formUpdate.resetFields()
                setStateProductDetails({
                    name: '',
                    price: '',
                    description: '',
                    type: '',
                    countInStock: '',
                    image: '',
                    discount: ''
                })
                message.success('Cập nhật sản phẩm thành công')
            } else {
                message.error(`Lỗi khi cập nhật sản phẩm. Chi tiết: ${dataUpdated?.message}`)
            }
        }
        if (isErrorUpdated) {
            message.error('Lỗi khi cập nhật sản phẩm')
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
        setFileList([])
        formCreate.resetFields()
    }

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }

    const handleDeleteProduct = () => {
        mutationDelete.mutate({ id: rowSelected, token: user?.access_token }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const onFinish = async () => {
        setIsLoadingUploadImage(true)
        const urls = await uploadImagesToCloudinary({ fileList });
        setIsLoadingUploadImage(false)
        const params = {
            name: stateProduct.name,
            price: stateProduct.price,
            description: stateProduct.description,
            type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
            countInStock: stateProduct.countInStock,
            image: urls,
            discount: stateProduct.discount
        }
        mutation.mutate(params, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
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

    // const handleOnChangeImage = async ({ fileList }) => {
    //     const file = fileList[0]
    //     if (!file.url && !file.preview) {
    //         file.preview = await getBase64(file.originFileObj);
    //     }
    //     setStateProduct({
    //         ...stateProduct,
    //         image: file.preview
    //     })
    // }

    const uploadImagesToCloudinary = async ({ fileList }) => {
        const validFiles = fileList
            .map(file => file.originFileObj)
            .filter(Boolean);

        const urls = [];

        for (const file of validFiles) {
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
                    urls.push(data.secure_url);
                } else {
                    console.error('Upload lỗi:', data);
                }
            } catch (err) {
                console.error('Lỗi upload Cloudinary:', err);
            }
        }


        return urls.join(',')
    }

    // const handleOnChangeImageDetails = async ({ fileList }) => {
    //     const file = fileList[0]?.originFileObj;
    //     if (!file) return;

    //     const formData = new FormData();
    //     formData.append('file', file);
    //     formData.append('upload_preset', 'upload-image');

    //     try {
    //         const res = await fetch('https://api.cloudinary.com/v1_1/ddpy7dxxa/image/upload', {
    //             method: 'POST',
    //             body: formData
    //         });
    //         const data = await res.json();

    //         if (data.secure_url) {
    //             setStateProductDetails({
    //                 ...stateProductDetails,
    //                 image: data.secure_url
    //             });
    //         } else {
    //             console.error('Upload lỗi:', data);
    //         }
    //     } catch (err) {
    //         console.error('Lỗi upload Cloudinary:', err);
    //     }
    // }

    const onUpdateProduct = async () => {
        setIsLoadingUploadImage(true)
        const urls = await uploadImagesToCloudinary({ fileList });
        setIsLoadingUploadImage(false)

        const updatedData = {
            ...stateProductDetails,
            image: urls
        }
        mutationUpdate.mutate({
            id: rowSelected,
            token: user.access_token,
            ...updatedData
        }, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleOnChageSelect = (value) => {
        setStateProduct({
            ...stateProduct,
            type: value
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
                    handelDeleteMany={handelDeleteManyProducts}
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
            <ModalComponent
                forceRender
                title="Thêm sản phẩm"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Loading isLoading={isPending || isLoadingUploadImage}>
                    <Form
                        form={formCreate}
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
                            <Select
                                name='type'
                                value={stateProduct.type}
                                onChange={handleOnChageSelect}
                                options={renderOptions(typeProduct?.data?.data)}
                            />
                        </Form.Item>
                        {stateProduct.type === 'add_type' && (
                            <Form.Item
                                label="Loại mới"
                                name="newType"
                                rules={[{ required: true, message: 'Hãy nhập loại sản phẩm!' }]}
                            >
                                <InputComponent
                                    name='newType'
                                    value={stateProduct.newType}
                                    onChange={handleOnChage}
                                />
                            </Form.Item>
                        )}

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
                            <TextArea
                                name="description"
                                rows={4}
                                placeholder='Nhập mô tả sản phẩm'
                                value={stateProduct.description}
                                onChange={handleOnChage}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Giảm giá"
                            name="discount"
                            rules={[{ required: true, message: 'Hãy nhập giảm giá cho sản phẩm!' }]}
                        >
                            <InputComponent
                                value={stateProduct.discount}
                                onChange={handleOnChage}
                                name='discount'
                            />
                        </Form.Item>
                        <Form.Item
                            label="Ảnh"
                            name="image"
                            rules={[
                                {
                                    validator: (_, value) => {
                                        if (!fileList || fileList.length < 2) {
                                            return Promise.reject(new Error('Vui lòng chọn ít nhất 2 ảnh'));
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <WrapperUploadFile style={{ marginBottom: '10px' }}
                                onChange={({ fileList }) => { setFileList(fileList) }}
                                maxCount={4}
                                multiple
                                beforeUpload={() => false}
                            >
                                <Button>Upload</Button>
                            </WrapperUploadFile>
                            {fileList.map((fileName, index) => {
                                return (
                                    <div><FileImageTwoTone />{fileName.name}</div>
                                )
                            })}
                        </Form.Item>

                        <Form.Item label={null}>
                            <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </ModalComponent>

            <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width='50%'>
                <Loading isLoading={isLoadingUpdate || isPendingUpdated || isLoadingUploadImage}>
                    <Form
                        form={formUpdate}
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
                            <TextArea
                                name='description'
                                rows={4}
                                placeholder='Nhập mô tả sản phẩm'
                                value={stateProductDetails.description}
                                onChange={handleOnChageDetails}
                            />
                        </Form.Item>
                        {/* <Form.Item
                            label="Đánh giá"
                            name="rating"
                            rules={[{ required: true, message: 'Hãy nhập đánh giá sản phẩm!' }]}
                        >
                            <InputComponent
                                value={stateProductDetails.rating}
                                onChange={handleOnChageDetails}
                                name='rating'
                            />
                        </Form.Item> */}
                        <Form.Item
                            label="Giảm giá"
                            name="discount"
                            rules={[{ required: true, message: 'Hãy nhập giảm giá của sản phẩm!' }]}
                        >
                            <InputComponent
                                value={stateProductDetails.discount}
                                onChange={handleOnChageDetails}
                                name='discount'
                            />
                        </Form.Item>
                        <Form.Item
                            label="Ảnh"
                            name="image"
                            rules={[
                                {
                                    validator: (_, value) => {
                                        if (!fileList || fileList.length < 2) {
                                            return Promise.reject(new Error('Vui lòng chọn ít nhất 2 ảnh'));
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <WrapperUploadFile style={{ marginBottom: '10px' }}
                                onChange={({ fileList }) => { setFileList(fileList) }}
                                maxCount={4}
                                multiple
                                beforeUpload={() => false}
                            >
                                <Button>Upload</Button>
                            </WrapperUploadFile>
                            {fileList.map((fileName, index) => {
                                return (
                                    <div><FileImageTwoTone />{fileName.name}</div>
                                )
                            })}
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
                title="Xóa sản phẩm"
                open={isModalOpenDelete}
                onCancel={handleCancelDelete}
                onOk={handleDeleteProduct}
            >
                <Loading isLoading={isPendingDeleted}>
                    <div>Bạn có chắc muốn xóa sản phẩm này không?</div>
                </Loading>
            </ModalComponent>
        </div>
    )
}

export default AdminProduct