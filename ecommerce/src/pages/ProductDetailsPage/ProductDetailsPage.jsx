import React from 'react'
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent'
import { useParams, useNavigate } from 'react-router-dom'

const ProductDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div style={{ width: '100%', background: '#f5f5fa', height: '100%' }}>
      <div style={{ width: '1270px', height: '100%', margin: '0 auto', background: '#fff' }}>
        <p style={{ margin: '0', padding: '10px 0', fontSize: '14px' }}>
          <span
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer', fontWeight: 'bold' }}
          >Trang chủ </span>
          - Chi tiết sản phẩm
        </p>
        <ProductDetailsComponent productId={id} />
      </div>
    </div>
  )
}

export default ProductDetailsPage