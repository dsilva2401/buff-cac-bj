import classNames from 'classnames';
import Wrapper from 'components/Wrapper';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from "react-router";

type PathParamsType = {
  param1: string,
}

type PageProps = RouteComponentProps<PathParamsType> & {
  children: any;
  location: any;
}

const Page: React.FC<PageProps> = (props) => {
  const cx = classNames({
    page: true,
    'page--prev': props.location.state && props.location.state.prev,
  });
  return (
    <div className={cx} style={{ padding: 0, margin: 0 }}>
      <Wrapper position='relative' width='100%' height='100%'>
        {props.children}
      </Wrapper>
    </div>
  );
}

export default withRouter(Page);
