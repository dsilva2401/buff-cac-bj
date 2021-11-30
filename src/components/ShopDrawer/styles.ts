import styled from "styled-components";
import Slider from "react-slick";

export const StyledSlider = styled(Slider)`
  width: 95%;

  .slick-list {
    .slick-track {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }
  }
`;
