import styled from 'styled-components';

type ModalProps = {
  isOpen: boolean;
};

export const Modal = styled.div<ModalProps>`
  width: 101%;
  height: 101%;
  position: absolute;
  padding: 1.5rem;
  top: 1000px;
  left: -1px;
  border-radius: 26px 26px 0px 0px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  background-color: #fff;
  z-index: 4;
  transition: transform 0.3s ease;
  transform: ${(props) => (props.isOpen ? 'translateY(-1001px)' : 'none')};

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: #fff;
    left: 0;
    bottom: -100%;
  }
`;
