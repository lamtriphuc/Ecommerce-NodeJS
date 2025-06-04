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
    const arr = ['TV', 'Tủ lạnh', 'Laptop']
    const refSearch = useRef()
    const [stateProducts, setStateProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const searchProduct = useSelector(state => state?.product?.search)
    const searchDebounce = useDebounce(searchProduct, 1000)

    const fetchProductAll = async (search) => {
        const res = await ProductService.getAllProduct(search)
        if (search?.length > 0 || refSearch.current) {
            setStateProducts(res?.data)
        } else {
            return res
        }
    }

    useEffect(() => {
        if (refSearch.current) {
            setIsLoading(true)
            fetchProductAll(searchDebounce)
        }
        refSearch.current = true
        setIsLoading(false)
    }, [searchDebounce])

    const { isPending, data: products } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProductAll,
        retry: 3,
        retryDelay: 1000,
        refetchOnWindowFocus: false
    })

    useEffect(() => {
        if (products?.data?.length > 0) {
            setStateProducts(products?.data)
        }
    }, [products])

    return (
        <Loading isLoading={isPending || isLoading}>
            <div style={{ width: '1270px', margin: '0 auto' }}>
                <WrapperTypeProduct>
                    {arr.map((item) => {
                        return (
                            <TypeProduct name={item} key={item} />
                        )
                    })}
                </WrapperTypeProduct>
            </div>
            <div className='body' style={{ backgroundColor: '#efefef', width: '100%' }}>
                <div id='container' style={{ width: '1270px', margin: '0 auto', height: '100%' }}>
                    <SliderComponent arrImages={[slider1, slider2, slider3, slider4]} />
                    <WrapperProducts>
                        {stateProducts?.map((product) => {
                            return (
                                <CardComponent
                                    key={product._id}
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
                        <WrapperButtonMore textButton='Xem thêm' type='outline' styleButton={{
                            border: '1px solid rgb(11, 116, 229)', color: 'rgb(11, 116, 229)',
                            width: '240px', height: '38px', borderRadius: '4px', marginBottom: '40px'
                        }} styleTextButton={{ fontWeight: '500' }} />
                    </div>
                </div>
            </div>
        </Loading>
    )
}

export default HomePage