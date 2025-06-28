import { Col, Image, InputNumber } from "antd";
import styled from "styled-components";

export const WrapperStyleImageSmall = styled(Image)`
    width: 100px;
    height: 100px;
`

export const WrapperStyleColSmall = styled(Col)`
    flex-basis: unset;
    cursor: pointer;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
`
export const WrapperStyleNameProduct = styled.h1`
    margin: 0px;
    padding-bottom: 10px;
    color: rgb(39, 39, 42);
    font-size: 20px;
    font-weight: 500;
    line-height: 150%;
    word-break: break-word;
    white-space: break-spaces;
`

export const WrapperStyleTextSell = styled.span`
    font-size: 14px;
    line-height: 24px;
    color: rgb(120, 120, 120);
`

export const WrapperPriceProduct = styled.div`
    background: rgb(250, 250, 250);
    border-radius: 4px;
    display: flex;
    gap: 12px;
    align-items: center;
`

export const WrapperPriceTextProduct = styled.h1`
    color: rgb(255, 66, 78);
    font-size: 32px;
    font-weight: 600;
`

export const WrapperDiscountText = styled.span`
    font-size: 20px;
    font-weight: 500;
    color: rgb(232, 120, 127);
`

export const WrapperAddressProduct = styled.div`
    span.address {
        text-decoration: underline;
        font-size: 15px;
        line-height: 24px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    };
    span.change-address {
        color: rgb(10, 104, 255);
        font-size: 15px;
        line-height: 24px;
        font-weight: 500;
    }, 
`

export const WrapperQuantityProduct = styled.div`
    display: flex;
    gap: 4px;
    align-items: center;
    width: fit-content;
    border: 1px solid rgb(235, 236, 240);
    border-radius: 1px;
`


export const WrapperInputNumber = styled(InputNumber)`
    width: 40px;
    border-top: none;
    border-bottom: none;
    border-radius: unset;
    .ant-input-number-handler-wrap {
        display: none !important;
    }
    .ant-input-number-input {
        text-align: center;
    }
`

export const WrapperComment = styled.div`
    margin-top: 10px;
    min-height: 50px;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 8px;
    background: #fff;

    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`