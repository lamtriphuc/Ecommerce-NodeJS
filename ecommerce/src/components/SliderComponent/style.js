import Slider from "react-slick";
import styled from "styled-components";

export const WrapperSliderStyle = styled(Slider)`
  width: 100%;
  .slick-slide {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .slick-slide img {
    max-height: 500px;
    object-fit: contain;
  }

  .slick-arrow.slick-prev {
    left: 12px;
    top: 50%;
    z-index: 10;
    &::before {
      font-size: 40px;
      color: #000; /* đổi từ trắng sang đen nếu nền ảnh sáng */
    }
  }

  .slick-arrow.slick-next {
    right: 28px;
    top: 50%;
    z-index: 10;
    &::before {
      font-size: 40px;
      color: #000;
    }
  }

  .slick-dots {
    bottom: -20px;
    li {
      button {
        &::before {
          font-size: 10px;
          color: rgba(233, 216, 216, 0.5); /* dot mờ */
        }
      }
    }
    li.slick-active button::before {
      color: #000; /* dot active */
    }
  }
`;
