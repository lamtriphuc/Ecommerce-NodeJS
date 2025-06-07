import { Table } from 'antd';
import React, { useMemo, useState } from 'react'
import Loading from '../LoadingComponent/Loading';
import { Excel } from "antd-table-saveas-excel";

const TableComponent = (props) => {
    const { selectionType = 'checkbox', data: dataSource = [], isLoading = false, columns = [], handelDeleteMany } = props
    const [rowSelectedKeys, setRowSelectedKeys] = useState([])

    const newColumnExport = useMemo(() => {
        return columns
            .filter(col => col.dataIndex && col.dataIndex !== 'action')
            .map(col => ({
                title: col.title,
                dataIndex: col.dataIndex,
            }));
    }, [columns]);

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelectedKeys(selectedRowKeys)
        }
    };

    const handelDeleteAll = () => {
        handelDeleteMany(rowSelectedKeys)
    }

    const exportExcel = () => {
        const excel = new Excel();
        excel
            .addSheet("test")
            .addColumns(newColumnExport)
            .addDataSource(dataSource, {
                str2Percent: true
            })
            .saveAs("Excel.xlsx");
    };

    return (
        <div>
            <Loading isLoading={isLoading}>
                {rowSelectedKeys.length > 0 && (
                    <div
                        style={{
                            background: '#1d1ddd',
                            color: '#fff',
                            fontWeight: 'bold',
                            padding: '10px',
                            cursor: 'pointer',
                            width: 'fit-content',
                            borderRadius: '4px',
                            marginBottom: '10px'
                        }}
                        onClick={handelDeleteAll}
                    >
                        Xóa tất cả
                    </div>
                )}
                <button onClick={exportExcel}>Export Excel</button>
                <Table
                    id='table-xls'
                    rowSelection={{
                        type: selectionType,
                        ...rowSelection,
                    }}
                    columns={columns}
                    dataSource={dataSource}
                    {...props}
                />
            </Loading>
        </div>
    )
}

export default TableComponent