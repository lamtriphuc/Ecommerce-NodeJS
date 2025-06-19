import { Row } from "antd";
import styled from "styled-components";

export const WapperHeader = styled(Row)`
    padding: 10px 0;
    background-color: rgb(26, 148, 255);
    align-items: center;
    flex-wrap: nowrap;
    width: 1270px;
`

export const WrapperTextHeader = styled.span`
    color: #fff;
    font-size: 18px;
    font-weight: bold;
    text-align: left;
    cursor: pointer;
`

export const WrapperHeaderAccount = styled.div`
    display: flex;
    align-items: center;
    color: #fff;
    gap: 10px;
    font-size: 12px;
    cursor: pointer; 
    &:hover {
        background-color: rgb(16, 118, 210)
    }
    padding: 6px;
    border-radius: 6px;
`

export const WrapperHeaderCart = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px;
    border-radius: 6px;

    &:hover {
    background-color: rgb(16, 118, 210);
    }
`

// Màu hover sáng: 	rgb(66, 174, 255), tối: rgb(16, 118, 210)
export const WrapperHeaderHome = styled.div`
    width: fit-content;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: #fff;
    gap: 10px;
    font-size: 12px;
    cursor: pointer; 
    &:hover {
        background-color: rgb(16, 118, 210)
    }
    padding: 9px 6px;
    border-radius: 6px;
`

export const WrapperTextHeaderSmall = styled.span`
    color: #fff;
    font-size: 12px;
    white-space: nowrap;
`

export const WrapperContentPopup = styled.p`
    cursor: pointer;
    &:hover {
        color: rgb(26, 148, 255);
    }
`