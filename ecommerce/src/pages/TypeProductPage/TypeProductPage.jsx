import React from 'react'
import NavBarComponent from '../../components/NavBarComponent/NavBarComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import { Col, Pagination, Row } from 'antd'
import { WrapperNavBar, WrapperProducts } from './style'

const TypeProductPage = () => {
    const onChange = () => { }
    return (
        <div style={{ background: '#efefef', height: '100%' }}>
            <div style={{ width: '1270px', margin: '0 auto' }}>
                <Row style={{ flexWrap: 'nowrap', paddingTop: '10px' }}>
                    <WrapperNavBar span={4} >
                        <NavBarComponent />
                    </WrapperNavBar>
                    <Col span={20}>
                        <WrapperProducts>
                            <CardComponent />
                            <CardComponent />
                            <CardComponent />
                            <CardComponent />
                            <CardComponent />
                            <CardComponent />
                        </WrapperProducts>
                        <Pagination
                            showQuickJumper
                            defaultCurrent={2} total={500}
                            onChange={onChange}
                            style={{ justifyContent: 'center', marginTop: '20px' }}
                        />
                    </Col>
                </Row>
            </div >
        </div>
    )
}

export default TypeProductPage