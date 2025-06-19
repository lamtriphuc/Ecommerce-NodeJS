import { Card } from "antd";
import styled from "styled-components";

export const WapperCardStyle = styled(Card)`
    width: 200px !important;
    position: relative;
    border-radius: 0;
    border-radius: 8px;
    .ant-card-body {
        width: 200px !important;
        padding: 20px; 
    }
    background-color: ${props => props.disabled ? '#ccc' : '#fff'};
    cursor: ${props => props.disabled ? 'not-allowed' : 'poiter'};
    .product-image {
        width: 200px !important;
        height: 200px;
        object-fit: cover;
        display: block;
    }
`

export const StyleNameProduct = styled.div`
    font-weight: 400;
    font-size: 16px;
    line-height: 16px;
    color: rgb(56,56,61);
`

export const WrapperReportText = styled.div`
    font-size: 14px;
    display: flex;
    align-items: center;
    color: rgb(128,128,137);
    margin: 6px 0 0;
`

export const WrapperStyleTextSell = styled.span`
    font-size: 14px;
    line-height: 24px;
    color: rgb(120, 120, 120);
`

export const WrapperPriceText = styled.div`
    font-size: 16px;
    font-weight: 500;
    color: rgb(255,66,78);
    margin: 8px 0;
`

export const WrapperDiscountText = styled.span`
    font-size: 12px;
    font-weight: 500;
    color: rgb(232, 120, 127);
`