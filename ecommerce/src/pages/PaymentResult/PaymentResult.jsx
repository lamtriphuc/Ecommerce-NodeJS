import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, message, Result } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { removeAllOrderProduct } from '../../redux/slides/orderSlide';
import Loading from '../../components/LoadingComponent/Loading'
import * as OrderService from '../../services/OrderService'
import { useMutationHooks } from '../../hooks/useMutationHook';
import { useMutation } from '@tanstack/react-query';

const PaymentResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [orderInfo, setOrderInfo] = useState(null);
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
    const isOrderCreated = useRef(false);

    const mutationCreateOrder = useMutationHooks(
        data => {
            const { token, ...rests } = data
            return OrderService.createOrder({ ...rests }, token)
        }
    )
    const { isPending, data, isSuccess, isError } = mutationCreateOrder

    useEffect(() => {
        if (!isPending && isSuccess && data?.status === 'OK') {
            localStorage.removeItem('orderInfo');
            dispatch(removeAllOrderProduct({
                checkedList: orderInfo.orderItems.map(item => item.product)
            }));
            message.success('Thanh toán thành công!');
            setTimeout(() => {
                navigate('/order-success', {
                    state: {
                        delivery: orderInfo.shippingMethod,
                        payment: 'vnpay',
                        orders: orderInfo.orderItems,
                        totalPrice: orderInfo.itemsPrice
                    }
                });
            }, 2000);
        } else if (mutationCreateOrder.isError) {
            message.error('Lỗi khi tạo đơn hàng!');
        }
    }, [isPending, data]);


    useEffect(() => {
        const checkPaymentResult = async () => {
            const raw = localStorage.getItem('orderInfo');
            if (!raw) {
                message.error('Không tìm thấy thông tin đơn hàng.');
                navigate('/order');
                return;
            }

            const parsed = JSON.parse(raw);
            setOrderInfo(parsed);

            try {
                setIsLoading(true);
                const res = await axios.get(`/api/payment/vnpay-return${location.search}`);

                const isSuccess = res.data.code === '00';

                if (isSuccess && !isOrderCreated.current) {
                    isOrderCreated.current = true;
                    parsed.isPaid = true;
                    setIsPaymentSuccess(true);
                    mutationCreateOrder.mutate(parsed);
                }

                if (!isSuccess) {
                    message.error('Thanh toán thất bại result 1!');
                    localStorage.removeItem('orderInfo');
                    navigate('/order');
                }
            } catch (err) {
                console.error('Xác minh lỗi:', err);
                setIsLoading(false);
                message.error('Lỗi xác minh thanh toán!');
                localStorage.removeItem('orderInfo');
                navigate('/order');
            } finally {
                setIsLoading(false);
            }
        };

        checkPaymentResult();
    }, [location.search]);

    return (
        <Loading isLoading={isLoading}>
            <Result
                status={isPaymentSuccess ? "success" : 'error'}
                title={isPaymentSuccess ? "Thanh toán thành công" : 'Thanh toán thất bại'}
                // subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
                extra={[

                ]}
            />
        </Loading>)
};

export default PaymentResult;
