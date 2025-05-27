import { Row } from "antd";
import styled from "styled-components";

export const WapperHeader = styled(Row)`
    padding: 10px 0;
    background-color: rgb(26, 148, 255);
    align-items: center;    
    gap: 16px;
    flex-wrap: nowrap;
    width: 1270px;
`

export const WrapperTextHeader = styled.span`
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    text-align: left;
`

export const WrapperHeaderAccount = styled.div`
    display: flex;
    align-items: center;
    color: #fff;
    gap: 10px;
    font-size: 12px;
`

export const WrapperTextHeaderSmall = styled.span`
    color: #fff;
    font-size: 12px;
    white-space: nowrap;
`

export const WrapperContentPopup = styled.p`
    cursor: pointer;
    &:hover {
        background: rgb(26, 148, 255);
        color: #fff;
    }
`