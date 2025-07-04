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

export const WrapperLeft = styled.div`
    width: 910px;
`

export const WrapperListOrder = styled.div`
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

export const WrapperTotal = styled.div`
   display: flex;
   justify-content: space-between;
   padding: 17px 20px;
   background: #fff;
   border-bottom-right-radius: 6px;
   border-bottom-left-radius: 6px;
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
// export const WrapperRadio = styled.div`
//     .ant-radio-group.ant-radio-group-outline{
//         display: flex;
//         flex-direction: column;
//         padding: 20px 0;
//         gap: 10px;
//     }
// `

export const WrapperRadio = styled(Radio.Group)`
    display: flex;
    flex-direction: column;
    gap: 20px; 
    padding: 20px;
    margin-top: 10px;
    background-color: #F0F6FF;
    border-radius: 4px;
`;