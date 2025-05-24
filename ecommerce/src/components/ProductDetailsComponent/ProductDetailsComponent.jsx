import { Image } from 'antd'
import React from 'react'
import { Col, Row } from 'antd'
import productImage from '../../assets/images/test.webp'
import productImageSmall from '../../assets/images/imagesmall.webp'
import { WrapperAddressProduct, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQuantityProduct, WrapperStyleColSmall, WrapperStyleImageSmall, WrapperStyleNameProduct, WrapperStyleTextSell } from './style'
import { StarFilled, PlusOutlined, MinusOutlined } from '@ant-design/icons'
import ButtonComponent from '../ButtonComponent/ButtonComponent'

const ProductDetailsComponent = () => {
    const onChange = (value) => {
    };
    return (
        <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px' }} >
            <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
                <Image src={productImage} alt='Product Image' preview={false} />
                <Row style={{ paddingTop: '10px', justifyContent: 'space-between' }}>
                    <WrapperStyleColSmall span={4}>
                        <WrapperStyleImageSmall src={productImageSmall} alt='Product Image' preview={false} />
                    </WrapperStyleColSmall>
                    <WrapperStyleColSmall span={4}>
                        <WrapperStyleImageSmall src={productImageSmall} alt='Product Image' preview={false} />
                    </WrapperStyleColSmall>
                    <WrapperStyleColSmall span={4}>
                        <WrapperStyleImageSmall src={productImageSmall} alt='Product Image' preview={false} />
                    </WrapperStyleColSmall>
                    <WrapperStyleColSmall span={4}>
                        <WrapperStyleImageSmall src={productImageSmall} alt='Product Image' preview={false} />
                    </WrapperStyleColSmall>
                    <WrapperStyleColSmall span={4}>
                        <WrapperStyleImageSmall src={productImageSmall} alt='Product Image' preview={false} />
                    </WrapperStyleColSmall>
                    <WrapperStyleColSmall span={4}>
                        <WrapperStyleImageSmall src={productImageSmall} alt='Product Image' preview={false} />
                    </WrapperStyleColSmall>
                </Row>
            </Col>
            <Col span={14} style={{ paddingLeft: '10px' }}>
                <WrapperStyleNameProduct>10 Vạn Câu Hỏi Vì Sao - Khám Phá Thế Giới Động Vật - Động Vật Thời Tiền Sử (Tái Bản)</WrapperStyleNameProduct>
                <div>
                    <StarFilled style={{ fontSize: '14px', color: 'rgb(255, 196, 0)' }} />
                    <StarFilled style={{ fontSize: '14px', color: 'rgb(255, 196, 0)' }} />
                    <StarFilled style={{ fontSize: '14px', color: 'rgb(255, 196, 0)' }} />
                    <WrapperStyleTextSell> | Đã bán 1000+</WrapperStyleTextSell>
                </div>
                <WrapperPriceProduct>
                    <WrapperPriceTextProduct>100.000đ</WrapperPriceTextProduct>
                </WrapperPriceProduct>
                <WrapperAddressProduct>
                    <span>Giao đến</span>
                    <span className='address'> Q. 1, P. Bến Nghé, Hồ Chí Minh</span>
                    <span className='change-address'> Đổi địa chỉ</span>
                </WrapperAddressProduct>
                <div style={{ margin: '10px 0 20px', padding: '10px 0', borderBottom: '1px solid #e5e5e5', borderTop: '1px solid #e5e5e5' }}>
                    <div style={{ marginBottom: '6px' }}>Số lượng</div>
                    <WrapperQuantityProduct>
                        <button style={{ border: 'none', background: 'transparent' }}>
                            <MinusOutlined style={{ color: '#000', fontSize: '16px' }} />
                        </button>
                        <WrapperInputNumber min={1} defaultValue={1} onChange={onChange} size='small' />
                        <button style={{ border: 'none', background: 'transparent' }}>
                            <PlusOutlined style={{ color: '#000', fontSize: '16px' }} />
                        </button>
                    </WrapperQuantityProduct>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center' }}>
                    <ButtonComponent
                        size={40}
                        styleButton={{
                            backgroundColor: 'rgb(255, 66, 78)',
                            borderRadius: '2px',
                            border: 'none',
                            width: '220px',
                            height: '48px',
                        }}
                        textButton={'Mua ngay'}
                        styleTextButton={{ color: '#fff' }}
                    ></ButtonComponent>
                    <ButtonComponent
                        size={40}
                        styleButton={{
                            backgroundColor: '#fff',
                            borderRadius: '2px',
                            border: '1px solid rgb(10, 104, 255)',
                            width: '220px',
                            height: '48px',
                        }}
                        textButton={'Mua ngay'}
                        styleTextButton={{ color: 'rgb(10, 104, 255)' }}
                    ></ButtonComponent>
                </div>
            </Col>
        </Row >
    )
}

export default ProductDetailsComponent