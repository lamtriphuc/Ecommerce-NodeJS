import React from 'react'
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent'
import { useParams, useNavigate } from 'react-router-dom'

const ProductDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div style={{ padding: '0 120px', background: '#efefef', height: '1000px' }}>
      <p style={{ margin: '0', padding: '10px 0', fontSize: '14px' }}>
        <span
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer', fontWeight: 'bold' }}
        >Trang chủ </span>
        - Chi tiết sản phẩm
      </p>
      <ProductDetailsComponent productId={id} />
    </div>
  )
}

export default ProductDetailsPage