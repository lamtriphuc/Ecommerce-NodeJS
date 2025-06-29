import { InputNumber, Radio } from "antd";
import styled from "styled-components";

export const WrapperStyleHeader = styled.div`
    background: rgb(255,255,255);
    padding: 9px 16px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    span {
        color: rgb(36,36,36);
        font-weight: 400;
        font-size: 14px;
    }
`

export const WrapperContainer = styled.div`
    width: 100%;
`

export const WrapperValue = styled.div`
    background: rgb(240, 248, 255);
    border: 1px solid rgb(  194, 225, 255);
    padding: 20px;
    width: fit-content;
    border-radius: 6px;
    margin-top: 10px;
`
export const WrapperItemOrder = styled.div`
    display: flex;
    align-items: center;
    padding: 9px 16px;
    background: #fff;
    margin-top: 12px;
`

export const WrapperPriceDiscount = styled.span`
    color: #999;
    font-size: 12px;
    text-decoration: line-through;
    margin-left: 4px;
`

export const WrapperCountOrder = styled.div`
    display: flex;
    align-items: center;
    width: 86px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 60px;
`

export const WrapperRight = styled.div`
    width: 320px;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
`

export const WrapperInfo = styled.div`
   padding: 17px 20px;
   border: 1px solid #f5f5f5;
   background: #fff;
   border-top-right-radius: 6px;
   border-top-left-radius: 6px;
`

export const WrapperItemOrderInfo = styled.div`
   padding: 17px 20px;
   border: 1px solid #f5f5f5;
   background: #fff;
   border-top-right-radius: 6px;
   border-top-left-radius: 6px;
   display: flex;
    flex-direction: column;
    align-items: center;
`