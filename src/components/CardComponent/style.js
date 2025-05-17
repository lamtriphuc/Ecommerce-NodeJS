import { Card } from "antd";
import styled from "styled-components";

export const WapperCardStyle = styled(Card)`
    width: 200px;
    & img {
        width: 200px;
        height: 220px;
    },
    position: relative;
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

export const WrapperPriceText = styled.div`
    font-size: 16px;
    font-weight: 500;
    color: rgb(255,66,78);
    margin: 8px 0;
`

export const WrapperDiscountText = styled.span`
    font-size: 14px;
    font-weight: 500;
    color: rgb(255,66,78);
`