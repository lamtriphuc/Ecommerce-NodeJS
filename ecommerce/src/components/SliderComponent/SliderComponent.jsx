import { Image } from 'antd';
import React from 'react'
import { WrapperSliderStyle } from './style';

const SliderComponent = ({ arrImages, settings = {} }) => {
    var defaultSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1000
    }
    const mergedSettings = { ...defaultSettings, ...settings };
    return (
        <WrapperSliderStyle {...mergedSettings}>
            {arrImages.map((image) => {
                return (
                    < Image key={image} src={image} alt="slider" preview={false} width='100%' />
                )
            })}
        </WrapperSliderStyle>
    )
}

export default SliderComponent