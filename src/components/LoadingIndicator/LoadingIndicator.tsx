import Wrapper from "components/Wrapper";
import { ReactComponent as LoadingAnimation } from "assets/icons/svg/loading.svg";

export default function LoadingIndicator() {
  return (
    <Wrapper
      width='100%'
      height='100%'
      direction='column'
      justifyContent='center'
      alignItems='center'
    >
      <LoadingAnimation width='100%' height='60px' />
    </Wrapper>
  );
};
