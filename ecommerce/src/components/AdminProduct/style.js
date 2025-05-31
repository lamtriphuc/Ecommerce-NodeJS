import styled from "styled-components";
import { Upload } from "antd";

export const WrapperHeader = styled.h1`
    color: #000;
    font-size: 16px;
`

export const WrapperUploadFile = styled(Upload)`
    .ant-upload-list-item-container{
        display: none !important;
    }
`