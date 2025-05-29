import React from 'react'
import { WrapperHeader } from './style'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'

const AdminProduct = () => {
    return (
        <div>
            <WrapperHeader>Quản lý người dùng</WrapperHeader>
            <div style={{ marginTop: '10px' }}>
                <Button
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
        </div>
    )
}

export default AdminProduct