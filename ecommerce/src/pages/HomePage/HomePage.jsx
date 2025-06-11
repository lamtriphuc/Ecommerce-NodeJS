import React, { useEffect, useRef, useState } from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import { WrapperButtonMore, WrapperProducts, WrapperTypeProduct } from './style'
import slider1 from '../../assets/images/slider1.png'
import slider2 from '../../assets/images/slider2.png'
import slider3 from '../../assets/images/slider3.png'
import slider4 from '../../assets/images/slider4.png'
import CardComponent from '../../components/CardComponent/CardComponent'
import * as ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import Loading from '../../components/LoadingComponent/Loading'
import { useDebounce } from '../../hooks/useDebounce'

const HomePage = () => {
    const [limit, setLimit] = useState(6)
    const [isLoading, setIsLoading] = useState(false)
    const [typeProducts, setTypeProducts] = useState([])
    const searchProduct = useSelector(state => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 500)

    const fetchProductAll = async ({ queryKey }) => {
        const [, limit, search] = queryKey
        const res = await ProductService.getAllProduct(search, limit)
        return res
    }

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        if (res?.status === 'OK') {
            setTypeProducts(res?.data)
        }
    }

    const { isPending, data: products, isPreviousData } = useQuery({
        queryKey: ['products', limit, searchDebounce],
        queryFn: fetchProductAll,
        refetchOnWindowFocus: false,
        keepPreviousData: true,
    })

    const currentPage = Math.ceil(limit / 6)
    const isLoadMoreDisabled = currentPage >= products?.totalPage

    useEffect(() => {
        fetchAllTypeProduct()
    }, [])

    return (
        <>
            <div style={{ width: '1270px', margin: '0 auto' }}>
                <WrapperTypeProduct>
                    {typeProducts.map((item) => {
                        return (
                            <TypeProduct name={item} key={item} />
                        )
                    })}
                </WrapperTypeProduct>
            </div>
            <div className='body' style={{ backgroundColor: '#efefef', width: '100%' }}>
                <div id='container' style={{ width: '1270px', margin: '0 auto', height: '100%' }}>
                    <SliderComponent arrImages={[slider1, slider2, slider3, slider4]} />
                    <Loading isLoading={isPending || isLoading}>
                        <WrapperProducts>
                            {products?.data?.map((product) => {
                                return (
                                    <CardComponent
                                        key={product._id}
                                        id={product._id}
                                        countInStock={product.countInStock}
                                        description={product.description}
                                        image={product.image}
                                        name={product.name}
                                        price={product.price}
                                        rating={product.rating}
                                        type={product.type}
                                        discount={product.discount}
                                        sold={product.sold}
                                    />
                                )
                            })}
                        </WrapperProducts>
                        <div style={{ width: '100%', display: 'flex', marginTop: '10px', justifyContent: 'center' }}>
                            <WrapperButtonMore
                                textButton={isPreviousData ? 'Đang tải thêm...' : 'Xem thêm'}
                                type='outline'
                                styleButton={{
                                    border: '1px solid rgb(11, 116, 229)', color: isLoadMoreDisabled ? '#ccc' : 'rgb(11, 116, 229)',
                                    width: '240px', height: '38px', borderRadius: '4px', marginBottom: '40px'
                                }}
                                disabled={isLoadMoreDisabled}
                                styleTextButton={{ fontWeight: '500', color: products?.total === products?.data?.length && '#fff' }}
                                onClick={() => {
                                    if (!isLoadMoreDisabled) {
                                        setLimit(prev => prev + 6);
                                    }
                                }}
                            />
                        </div>
                    </Loading>
                </div>
            </div >
        </>
    )
}

export default HomePage